import type { InventoryItem, Recipe } from '@/lib/types';
import { embedText, cosineSimilarity } from '@/lib/services/embeddings';

const STOP_WORDS = new Set([
  'fresh',
  'farm',
  'plain',
  'large',
  'small',
  'medium',
  'chopped',
  'sliced',
  'beaten',
  'fine',
  'ground',
  'dried',
  'whole',
  'red',
  'white',
  'green',
  'black',
  'the',
  'and',
  'for',
  'with',
  'from',
  'home',
  'pantry',
  'item',
  'grocery',
  'ingredient',
  'portion',
  'tablespoon',
  'teaspoon',
  'cup',
  'cups',
  'tbsp',
  'tsp',
  'ml',
  'pcs',
]);

/** Protein families that must not cross-match (chicken ≠ fish). */
const PROTEIN_GROUPS: string[][] = [
  ['chicken', 'poultry'],
  ['fish', 'seafood', 'salmon', 'tuna', 'prawn', 'shrimp'],
  ['beef', 'mutton', 'lamb'],
  ['pork'],
  ['egg', 'eggs'],
  ['dhal', 'dal', 'lentil', 'parippu', 'mysoor'],
];

function foodTokens(name: string): string[] {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .map((t) => t.replace(/s$/, ''))
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t) && !STOP_WORDS.has(t + 's'));
}

function proteinGroup(tokens: string[]): number {
  for (let i = 0; i < PROTEIN_GROUPS.length; i++) {
    if (tokens.some((t) => PROTEIN_GROUPS[i].some((p) => t === p || t.includes(p) || p.includes(t)))) {
      return i;
    }
  }
  return -1;
}

/** Form words that must agree when both sides have one (coconut milk ≠ coconut oil). */
const FORM_WORDS = new Set([
  'milk',
  'oil',
  'flour',
  'powder',
  'sauce',
  'stock',
  'broth',
  'breast',
  'thigh',
  'yolk',
  'white',
  'paste',
  'cream',
]);

/** True when ingredient and pantry item share a real food stem (not just "oil"/"fresh"). */
export function tokensCompatible(ingredientName: string, pantryItem: string): boolean {
  const a = foodTokens(ingredientName);
  const b = foodTokens(pantryItem);
  if (!a.length || !b.length) return false;

  const pa = proteinGroup(a);
  const pb = proteinGroup(b);
  if (pa >= 0 && pb >= 0 && pa !== pb) return false;

  const shared = a.filter((t) =>
    b.some((u) => t === u || (t.length >= 4 && u.length >= 4 && (u.startsWith(t) || t.startsWith(u))))
  );
  if (!shared.length) return false;

  const aForm = a.find((t) => FORM_WORDS.has(t));
  const bForm = b.find((t) => FORM_WORDS.has(t));
  if (aForm && bForm && aForm !== bForm) return false;

  return true;
}

function lexicalOverlap(a: string, b: string): number {
  const at = foodTokens(a);
  const bt = foodTokens(b);
  if (!at.length || !bt.length) return 0;
  let hits = 0;
  for (const t of at) {
    if (bt.some((w) => w === t || (t.length >= 4 && (w.startsWith(t) || t.startsWith(w))))) hits += 1;
  }
  return hits / at.length;
}

/**
 * Strict pantry match: require compatible food tokens, then lexical or strong vector score.
 * Prevents "chicken breast" → any pantry item via loose embedding similarity.
 */
export async function bestInventoryMatchForIngredient(
  ingredientName: string,
  inventory: InventoryItem[],
  inventoryEmbeddings?: Map<string, number[]>
): Promise<{ item: InventoryItem; score: number } | null> {
  if (!inventory.length || !ingredientName.trim()) return null;

  const candidates = inventory.filter((inv) => tokensCompatible(ingredientName, inv.item));
  if (!candidates.length) return null;

  // Embed bare names only — shared prefixes inflated every score before
  const queryEmb = await embedText(ingredientName.trim().toLowerCase());
  let best: { item: InventoryItem; score: number } | null = null;

  for (const inv of candidates) {
    let emb = inventoryEmbeddings?.get(inv.id);
    if (!emb) {
      emb = (await embedText(inv.item.trim().toLowerCase())) || undefined;
      if (emb && inventoryEmbeddings) inventoryEmbeddings.set(inv.id, emb);
    }

    const lex = lexicalOverlap(ingredientName, inv.item);
    const vec = queryEmb && emb ? cosineSimilarity(queryEmb, emb) : 0;
    // Lexical is authoritative for stems; vector only helps synonyms within token gate
    const score = lex >= 0.34 ? Math.max(lex, vec * 0.85) : vec;

    if (!best || score > best.score) best = { item: inv, score };
  }

  // High bar: clear stem overlap or strong synonym vector
  if (!best || best.score < 0.5) return null;
  return best;
}

export async function inventoryMatchesIngredientAsync(
  inv: InventoryItem,
  ingredientName: string
): Promise<boolean> {
  const match = await bestInventoryMatchForIngredient(ingredientName, [inv]);
  return Boolean(match && match.score >= 0.5);
}

/** Sync strict lexical match (token gate). Prefer async vector path when possible. */
export function inventoryMatchesIngredient(inv: InventoryItem, ingredientName: string): boolean {
  if (!tokensCompatible(ingredientName, inv.item)) return false;
  return lexicalOverlap(ingredientName, inv.item) >= 0.4;
}

export async function applyPantryToRecipes(
  recipes: Recipe[],
  inventory: InventoryItem[]
): Promise<Recipe[]> {
  if (!recipes.length) return recipes;
  if (!inventory.length) {
    return recipes.map((recipe) => ({
      ...recipe,
      ingredients: recipe.ingredients.map((ing) => ({ ...ing, source: 'shopping' as const })),
    }));
  }

  const embCache = new Map<string, number[]>();
  await Promise.all(
    inventory.map(async (inv) => {
      const emb = await embedText(inv.item.trim().toLowerCase());
      if (emb) embCache.set(inv.id, emb);
    })
  );

  return Promise.all(
    recipes.map(async (recipe) => {
      const ingredients = await Promise.all(
        recipe.ingredients.map(async (ing) => {
          const match = await bestInventoryMatchForIngredient(ing.name, inventory, embCache);
          return match
            ? { ...ing, source: 'inventory' as const }
            : { ...ing, source: 'shopping' as const };
        })
      );
      const homeCount = ingredients.filter((i) => i.source === 'inventory').length;
      const shopCount = ingredients.length - homeCount;
      return {
        ...recipe,
        ingredients,
        reasonForSelection:
          homeCount > 0
            ? `${recipe.reasonForSelection.replace(/\s*Uses \d+ item\(s\) from home inventory\.?/gi, '').trim()} Uses ${homeCount} pantry item(s); ${shopCount} to buy.`
            : `${recipe.reasonForSelection.replace(/\s*Uses \d+ item\(s\) from home inventory\.?/gi, '').trim()} Need to buy all ingredients.`,
      };
    })
  );
}

export function pantryCoverage(recipe: Recipe): { home: number; shop: number; ratio: number } {
  const home = recipe.ingredients.filter((i) => i.source === 'inventory').length;
  const shop = recipe.ingredients.filter((i) => i.source === 'shopping').length;
  const total = home + shop || 1;
  return { home, shop, ratio: home / total };
}

/**
 * Rank pantry for a prompt using vector embeddings over bare item names.
 */
export async function rankInventoryForPrompt(
  prompt: string,
  inventory: InventoryItem[]
): Promise<InventoryItem[]> {
  if (!inventory.length) return [];

  const queryEmb = await embedText(prompt.trim().toLowerCase());
  if (!queryEmb) return inventory;

  const scored = await Promise.all(
    inventory.map(async (item) => {
      const emb = await embedText(item.item.trim().toLowerCase());
      const vec = emb ? cosineSimilarity(queryEmb, emb) : 0;
      const perishBoost = item.expiryDays <= 7 ? 0.08 : 0;
      return { item, score: vec + perishBoost };
    })
  );

  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.item);
}
