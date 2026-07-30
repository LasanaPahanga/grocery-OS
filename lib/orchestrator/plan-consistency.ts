/**
 * Orchestrator guard: ensure recipes / shopping list match the user query + real pantry.
 */

import type { InventoryItem, Recipe } from '@/lib/types';
import { applyPantryToRecipes, pantryCoverage, tokensCompatible } from '@/lib/services/pantry-match';
import { buildLocalPantrySuggestions } from '@/lib/agents/local-recipes';
import {
  extractNamedDishes,
  isDecidedCookIntent,
  recipeMatchesUserPrompt,
} from '@/lib/orchestrator/meal-intent';
import { planLog, planWarn } from '@/lib/plan-logger';
import type { AgentContext } from '@/lib/types';

export interface PlanConsistencyResult {
  recipes: Recipe[];
  issues: string[];
  repaired: boolean;
}

function pantryHasProtein(inventory: InventoryItem[], kind: 'chicken' | 'fish' | 'egg' | 'dhal'): boolean {
  return inventory.some((i) => {
    const t = i.item.toLowerCase();
    if (kind === 'chicken') return /chicken|poultry/.test(t);
    if (kind === 'fish') return /fish|seafood|tuna|salmon|prawn/.test(t);
    if (kind === 'egg') return /\beggs?\b|farm egg/.test(t);
    return /dhal|dal|lentil|mysoor|parippu/.test(t);
  });
}

function recipeNeedsMissingProtein(recipe: Recipe, inventory: InventoryItem[]): boolean {
  const text = `${recipe.name} ${recipe.ingredients.map((i) => i.name).join(' ')}`.toLowerCase();
  if (/chicken|katsu/.test(text) && !pantryHasProtein(inventory, 'chicken')) return true;
  if (/\bbeef\b|\bmutton\b/.test(text) && !inventory.some((i) => /beef|mutton|lamb/i.test(i.item))) return true;
  return false;
}

function recipeFitsPantryMode(recipe: Recipe, inventory: InventoryItem[]): boolean {
  if (recipeNeedsMissingProtein(recipe, inventory)) return false;
  const { home, shop, ratio } = pantryCoverage(recipe);
  // Pantry meal: keep if majority from home OR at least 2 real pantry hits and shop isn't huge
  if (home >= 2 && ratio >= 0.35) return true;
  if (home >= 3 && shop <= 6) return true;
  return false;
}

/**
 * Re-tag pantry strictly, drop impossible MealDB picks for pantry mode,
 * fall back to local stock-based recipes, and ensure gaps stay as shopping.
 */
export async function enforcePlanConsistency(input: {
  prompt: string;
  mealMode?: 'cook_pantry' | 'cook_shop' | 'order' | 'eat_out';
  inventory: InventoryItem[];
  recipes: Recipe[];
  ctx: AgentContext;
}): Promise<PlanConsistencyResult> {
  const issues: string[] = [];
  let recipes = await applyPantryToRecipes(input.recipes, input.inventory);
  let repaired = false;

  const pantryFirst =
    input.mealMode === 'cook_pantry' ||
    /\b(pantry|what i have|from home|use inventory)\b/i.test(input.prompt);

  const decided = isDecidedCookIntent(input.prompt);
  const named = extractNamedDishes(input.prompt);

  // Decided dish must appear in results
  if (decided && named.length && recipes.length) {
    const matched = recipes.filter((r) =>
      named.some((d) => recipeMatchesUserPrompt(r, d) || recipeMatchesUserPrompt(r, input.prompt))
    );
    if (!matched.length) {
      issues.push(`Recipes did not match decided dish (${named.join(', ')}) — rebuilding`);
      recipes = [];
      repaired = true;
    } else if (matched.length < recipes.length) {
      recipes = matched;
      repaired = true;
      issues.push('Dropped recipes that did not match your requested dish');
    }
  }

  if (pantryFirst && recipes.length) {
    const fitting = recipes.filter((r) => recipeFitsPantryMode(r, input.inventory));
    if (!fitting.length) {
      issues.push(
        'TheMealDB picks needed ingredients you do not have (e.g. chicken) — switching to pantry-based local recipes'
      );
      recipes = [];
      repaired = true;
    } else if (fitting.length < recipes.length) {
      recipes = fitting;
      repaired = true;
      issues.push('Dropped recipes that ignore your actual pantry stock');
    }
  }

  // False "everything at home" — if shop list empty but ingredients aren't in pantry, retag already done;
  // verify no inventory tag without token compatibility
  for (const r of recipes) {
    for (const ing of r.ingredients) {
      if (ing.source !== 'inventory') continue;
      const ok = input.inventory.some((inv) => tokensCompatible(ing.name, inv.item));
      if (!ok) {
        ing.source = 'shopping';
        repaired = true;
        issues.push(`Corrected false pantry hit: ${ing.name}`);
      }
    }
  }

  if (!recipes.length && (pantryFirst || !named.length)) {
    const local = buildLocalPantrySuggestions(input.ctx, input.prompt);
    if (local.length) {
      recipes = await applyPantryToRecipes(local, input.inventory);
      repaired = true;
      issues.push(`Built ${recipes.length} recipe(s) from your real pantry stock`);
    }
  }

  // Pantry mode with decided empty + local still empty
  if (!recipes.length) {
    issues.push('No consistent recipes after validation');
  }

  // Prefer recipes that use expiring items when pantry-first
  if (pantryFirst && recipes.length > 1) {
    const perishable = input.inventory.filter((i) => i.expiryDays <= 7).map((i) => i.item.toLowerCase());
    if (perishable.length) {
      recipes = [...recipes].sort((a, b) => {
        const score = (r: Recipe) =>
          r.ingredients.filter(
            (ing) =>
              ing.source === 'inventory' &&
              perishable.some((p) => tokensCompatible(ing.name, p) || ing.name.toLowerCase().includes(p.split(' ').pop() || ''))
          ).length;
        return score(b) - score(a);
      });
    }
  }

  if (issues.length) {
    planWarn('plan-consistency', `Repaired plan vs query/pantry`, { issues, recipeNames: recipes.map((r) => r.name) });
  } else {
    planLog('plan-consistency', 'Plan matches query + pantry', {
      recipes: recipes.map((r) => {
        const c = pantryCoverage(r);
        return `${r.name} (home ${c.home}/shop ${c.shop})`;
      }),
    });
  }

  return { recipes, issues, repaired };
}
