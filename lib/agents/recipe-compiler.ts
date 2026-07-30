import type { AgentContext, AgentExecutionLog, Recipe } from '@/lib/types';
import { safeQuantity } from '@/lib/services/price-units';
import {
  fetchRecipesFromMealDb,
  matchInventoryToRecipes,
  searchMealsByName,
} from '@/lib/services/themealdb';
import { applyPantryToRecipes, pantryCoverage } from '@/lib/services/pantry-match';
import { fetchRecipesFromGoogle } from '@/lib/services/recipe-web-search';
import { geminiJson } from '@/lib/services/gemini';
import {
  buildSandwichRoutineRecipe,
  detectSandwichFillingVariant,
  extractRoutineDays,
  isMealRoutinePlanRequest,
  isRoutineComparisonFollowUp,
} from '@/lib/orchestrator/meal-routine';
import {
  extractFamilySize,
  extractNamedDishes,
  isDecidedCookIntent,
  isExoticRecipe,
  isPantryMealSuggestionIntent,
  isPreparedFoodOrderIntent,
  mentionsHomeInventory,
  recipeMatchesNamedDish,
  recipeMatchesUserPrompt,
} from '@/lib/orchestrator/meal-intent';
import {
  assignCook,
  buildFriedRiceFromPantry,
  buildHoppersFromPantry,
  buildLocalPantrySuggestions,
  buildStringHoppersFromPantry,
  fallbackRecipe,
} from '@/lib/agents/local-recipes';
import {
  buyReadyComponents,
  cookComponents,
  describeMealComponentPlan,
  parseMealComponents,
} from '@/lib/orchestrator/meal-components';

export async function runRecipeCompiler(ctx: AgentContext): Promise<{ log: AgentExecutionLog; recipes: Recipe[] }> {
  const log: AgentExecutionLog = {
    agentId: 'recipe-compiler',
    agentName: 'Agent 2: Recipe Compiler',
    status: 'active',
    message: 'Fetching recipes from TheMealDB…',
  };

  const userPrompt = ctx.userPrompt || ctx.prompt;
  const comparison = isRoutineComparisonFollowUp(userPrompt, {
    isFollowUp: ctx.isFollowUp,
    previousRecipes: ctx.previousRecipes,
    hadMealRoutine: Boolean(ctx.previousMealPlan?.mealRoutineMeta),
  });

  if (isMealRoutinePlanRequest(userPrompt) || comparison) {
    const days = extractRoutineDays(userPrompt, ctx.previousMealPlan?.mealRoutineMeta?.daysPlanned ?? 7);
    const variant = detectSandwichFillingVariant(userPrompt);
    const recipes = [buildSandwichRoutineRecipe(ctx, days, variant)];
    log.status = 'success';
    log.message = comparison
      ? `Built ${days}-day ${variant} comparison plan (${recipes[0].ingredients.filter((i) => i.source === 'shopping').length} items to buy).`
      : `Built ${days}-day sandwich breakfast routine (${recipes[0].ingredients.filter((i) => i.source === 'shopping').length} items to buy).`;
    log.details = { recipeNames: recipes.map((r) => r.name), daysPlanned: days, variant };
    return { log, recipes };
  }

  if (isPreparedFoodOrderIntent(userPrompt)) {
    log.status = 'skipped';
    log.message = 'Dine-out intent — recipe compiler skipped.';
    return { log, recipes: [] };
  }

  const mealComponents = ctx.mealComponents?.length
    ? ctx.mealComponents
    : parseMealComponents(userPrompt);
  const cookDishes = cookComponents(mealComponents);
  const buyReady = buyReadyComponents(mealComponents);
  const componentPlan = describeMealComponentPlan(mealComponents);

  const pantryFirst =
    ctx.mealMode === 'cook_pantry' ||
    isPantryMealSuggestionIntent(userPrompt) ||
    mentionsHomeInventory(userPrompt);
  const decidedCook = isDecidedCookIntent(userPrompt) || cookDishes.length > 0;
  const namedDishes =
    cookDishes.length > 0 ? cookDishes.map((c) => c.name) : extractNamedDishes(userPrompt);
  const servings = extractFamilySize(userPrompt) ?? 4;
  const pantryForPrompt =
    ctx.relevantPantry?.length ? ctx.relevantPantry : ctx.inventory.slice(0, 10);
  const maxRecipes = pantryFirst || ctx.cookEffort === 'quick' ? 2 : 3;

  // When the user named cook dishes, never fan out TheMealDB via pantry (Corba-for-hoppers bug)
  const lockToNamedDishes = namedDishes.length > 0 && decidedCook;

  // Search TheMealDB for COOK dishes only — never for bread/yoghurt/etc.
  const searchPrompt =
    namedDishes.length > 0
      ? namedDishes.join(' ')
      : userPrompt.replace(/\b(bread|loaf|buns?|yoghurt|yogurt|curd|butter|jam|papadam)\b/gi, ' ').trim() ||
        userPrompt;

  let recipes = await fetchRecipesFromMealDb({
    prompt: searchPrompt,
    inventory: lockToNamedDishes ? [] : ctx.inventory,
    limit: 8,
    nameOnly: lockToNamedDishes,
  });

  for (const dish of namedDishes.slice(0, 2)) {
    const extra = await searchMealsByName(dish, 2);
    recipes = [...extra, ...recipes];
  }

  const seen = new Set<string>();
  recipes = recipes.filter((r) => {
    if (seen.has(r.id) || isExoticRecipe(r)) return false;
    // Never pick a "bread loaf bake" style recipe when bread is buy-ready
    if (buyReady.some((b) => /bread/i.test(b.name)) && /\bbread\b/i.test(r.name) && !/curry|dhal|dal/i.test(r.name)) {
      return false;
    }
    seen.add(r.id);
    return true;
  });

  // Drop TheMealDB hits that don't match the named cook dishes
  if (lockToNamedDishes && recipes.length) {
    const matched = recipes.filter((r) =>
      namedDishes.some((d) => recipeMatchesNamedDish(r, d) || recipeMatchesUserPrompt(r, userPrompt))
    );
    if (matched.length) {
      recipes = matched;
    } else {
      log.message = `TheMealDB had no match for "${namedDishes.join(', ')}" — using local Sri Lankan templates.`;
      recipes = [];
    }
  }

  log.message =
    recipes.length > 0
      ? `TheMealDB returned ${recipes.length} meal(s)${componentPlan ? ` (${componentPlan})` : ''}. Matching to pantry…`
      : log.message ||
        `TheMealDB had no hits${componentPlan ? ` — ${componentPlan}` : ''} — trying local pantry fallback…`;

  if (recipes.length && !lockToNamedDishes) {
    const catalog = recipes.slice(0, 6).map((r) => ({
      id: r.id,
      name: r.name,
      imageUrl: r.imageUrl,
      area: r.dietaryTags.find((t) => t !== 'TheMealDB'),
      ingredients: r.ingredients.map((i) => i.name),
    }));

    const aiPick = await geminiJson<{ selectedIds: string[]; notes?: string }>(
      `User wants: "${userPrompt}"
Meal mode: ${ctx.mealMode || 'unspecified'}${pantryFirst ? ' (MUST cook mainly from pantry)' : ''}
Meal roles: ${componentPlan || 'none'}
COOK only these dishes (do not bake/make buy-ready items): ${namedDishes.join(', ') || 'best match'}
Buy ready (shopping list only, NOT recipes): ${buyReady.map((b) => b.name).join(', ') || 'none'}
Previously liked dishes (prefer if they fit): ${JSON.stringify(ctx.likedDishes ?? [])}
Budget: LKR ${ctx.budgetLkr}
ACTUAL pantry stock (only these count as "at home"): ${JSON.stringify(ctx.inventory.map((i) => i.item))}
Prioritized pantry: ${JSON.stringify(pantryForPrompt.map((i) => i.item))}
TheMealDB candidates (MUST pick from these ids only):
${JSON.stringify(catalog)}
Serve ~${servings} people.
${
  pantryFirst
    ? 'CRITICAL: Do NOT pick chicken/beef recipes unless chicken/beef is in the pantry list. Prefer fish/dhal/egg/rice meals that match stock. Gaps become a shopping list — never pretend missing items are at home.'
    : ''
}${ctx.cookEffort === 'quick' ? ' Prefer quicker meals.' : ''}`,
      `Return JSON { selectedIds: string[] } with up to ${maxRecipes} TheMealDB meal ids. Prefer South Asian / Sri Lankan home cooking. Reject candidates whose main protein is missing from pantry when meal mode is pantry-first.`
    );

    if (aiPick?.selectedIds?.length) {
      const byId = new Map(recipes.map((r) => [r.id, r]));
      const picked = aiPick.selectedIds
        .map((id) => byId.get(id))
        .filter((r): r is Recipe => Boolean(r))
        .slice(0, maxRecipes);
      if (picked.length) recipes = picked;
    } else {
      recipes = recipes.slice(0, maxRecipes);
    }
  } else if (recipes.length && lockToNamedDishes) {
    // Keep only matching MealDB recipes — do not let Gemini swap to pantry-similar meals
    recipes = recipes.slice(0, maxRecipes);
  }

  if (!recipes.length) {
    // Google web fallback before hardcoded local templates (hoppers, idiyappam, etc.)
    const googleDishes =
      namedDishes.length > 0
        ? namedDishes
        : extractNamedDishes(userPrompt).length
          ? extractNamedDishes(userPrompt)
          : [searchPrompt].filter(Boolean);
    const fromGoogle = await fetchRecipesFromGoogle(googleDishes, {
      servings,
      prompt: userPrompt,
    });
    if (fromGoogle.length) {
      recipes = fromGoogle.slice(0, maxRecipes);
      log.message = `Google recipe fallback — ${recipes.map((r) => r.name).join(', ')}.`;
    }
  }

  if (!recipes.length) {
    recipes = buildLocalForNamedDishes(ctx, namedDishes, userPrompt);
    if (!recipes.length && cookDishes.length) {
      recipes = buildLocalPantrySuggestions(ctx, namedDishes.join(' ') || userPrompt);
    }
    if (!recipes.length && /fried\s*rice/i.test(userPrompt)) {
      recipes = [buildFriedRiceFromPantry(ctx)];
    }
    if (!recipes.length && !cookDishes.length && buyReady.length) {
      log.status = 'success';
      log.message = `No cook dishes — shopping for ready items only: ${buyReady.map((b) => b.name).join(', ')}.`;
      log.details = { buyReady: buyReady.map((b) => b.name), mealComponents };
      return { log, recipes: [] };
    }
    if (!recipes.length) {
      recipes = buildLocalPantrySuggestions(ctx, userPrompt);
      if (!recipes.length) recipes = [fallbackRecipe(ctx)];
    }
    log.message = `Used local Sri Lankan templates for ${namedDishes.join(', ') || 'meal'}. ${recipes.length} recipe(s).`;
  }

  // Attach buy-ready staples as shopping ingredients on the main recipe (or a side holder)
  if (buyReady.length) {
    const buyIngs = buyReady.map((b) => ({
      name: b.name,
      amount: b.buyQty ?? 1,
      unit: b.buyUnit ?? 'pcs',
      source: 'shopping' as const,
    }));
    if (recipes.length) {
      recipes = recipes.map((r, i) =>
        i === 0
          ? {
              ...r,
              ingredients: [...r.ingredients, ...buyIngs],
              reasonForSelection: `${r.reasonForSelection} Plus buy ready: ${buyReady.map((b) => b.name).join(', ')}.`,
            }
          : r
      );
    } else {
      recipes = [
        {
          id: 'buy_ready_sides',
          name: `Buy: ${buyReady.map((b) => b.name).join(' + ')}`,
          ingredients: buyIngs,
          instructions: buyReady.map((b) => `Buy ${b.name} from the shop — ${b.reason}`),
          prepTimeMin: 0,
          cookTimeMin: 0,
          assignedCook: 'Shop run',
          reasonForSelection: componentPlan || 'Ready-made sides only.',
          dietaryTags: ['Buy ready'],
          nutritionalInfo: { calories: 0, protein: '—', sugar: '—', fat: '—' },
        },
      ];
    }
  }

  recipes = (await applyPantryToRecipes(matchInventoryToRecipes(recipes, ctx.inventory), ctx.inventory))
    .map(normalizeRecipe)
    .filter((r) => !isExoticRecipe(r) || r.id === 'buy_ready_sides' || r.id.startsWith('google_') || r.id.startsWith('local_'))
    .slice(0, Math.max(maxRecipes, buyReady.length ? 1 : maxRecipes));

  // Pantry-first: drop MealDB picks that barely use real stock; rebuild from local templates
  if (pantryFirst && recipes.length) {
    const viable = recipes.filter((r) => {
      const c = pantryCoverage(r);
      const needsChicken = /chicken|katsu/i.test(r.name + r.ingredients.map((i) => i.name).join(' '));
      const hasChicken = ctx.inventory.some((i) => /chicken/i.test(i.item));
      if (needsChicken && !hasChicken) return false;
      return c.home >= 2 && c.ratio >= 0.3;
    });
    if (!viable.length) {
      const local = buildLocalPantrySuggestions(ctx, userPrompt);
      recipes = local.length
        ? (await applyPantryToRecipes(local, ctx.inventory)).map(normalizeRecipe).slice(0, maxRecipes)
        : recipes;
      log.message = `Pantry-first rebuild — ${recipes.map((r) => r.name).join(', ') || 'none'} (MealDB picks needed missing ingredients).`;
    } else {
      recipes = viable.slice(0, maxRecipes);
    }
  }

  const cook = assignCook(ctx);
  recipes = recipes.map((r) => ({
    ...r,
    assignedCook: r.assignedCook === 'Family cook' ? cook : r.assignedCook,
  }));

  const fromMealDb = recipes.filter((r) => /^\d+$/.test(r.id)).length;
  const fromGoogle = recipes.filter((r) => r.id.startsWith('google_')).length;
  const withImages = recipes.filter((r) => Boolean(r.imageUrl)).length;

  log.status = 'success';
  log.message = `Compiled ${recipes.length} recipe(s) — ${fromMealDb} TheMealDB, ${fromGoogle} Google${withImages ? `, ${withImages} with photos` : ''}${
    buyReady.length ? `; buy ready: ${buyReady.map((b) => b.name).join(', ')}` : ''
  }. ${recipes.filter((r) => r.ingredients.some((i) => i.source === 'inventory')).length} use home inventory.`;
  log.details = {
    recipeNames: recipes.map((r) => r.name),
    imageUrls: recipes.map((r) => r.imageUrl).filter(Boolean),
    sourceUrls: recipes.map((r) => r.sourceUrl).filter(Boolean),
    sources: recipes.map((r) =>
      /^\d+$/.test(r.id) ? 'TheMealDB' : r.id.startsWith('google_') ? 'Google' : 'local'
    ),
    mealComponents,
    componentPlan,
    relevantPantry: (ctx.relevantPantry ?? []).slice(0, 8).map((i) => i.item),
    fullInventoryCount: ctx.inventory.length,
  };

  return { log, recipes };
}

/** Prefer explicit local templates for SL dishes TheMealDB doesn't carry. */
function buildLocalForNamedDishes(
  ctx: import('@/lib/types').AgentContext,
  namedDishes: string[],
  userPrompt: string
): Recipe[] {
  const prompt = namedDishes.join(' ') || userPrompt;
  const lower = prompt.toLowerCase();
  const out: Recipe[] = [];
  const servings = extractFamilySize(userPrompt) ?? 4;

  if (/string\s*hopper|idiyappam/i.test(lower)) {
    out.push(buildStringHoppersFromPantry(ctx, servings));
  } else if (/hopper|appa/i.test(lower)) {
    out.push(buildHoppersFromPantry(ctx, servings));
  }

  if (out.length) return out;
  return buildLocalPantrySuggestions(ctx, prompt);
}

/** Tap water shouldn't become a shop line; salt pinches stay off the list. */
function isFreeStaple(name: string): boolean {
  const n = name.trim().toLowerCase();
  return n === 'water' || n === 'tap water' || n === 'salt' || n === 'sea salt';
}

function normalizeRecipe(recipe: Recipe): Recipe {
  const prep = Number(recipe.prepTimeMin);
  const cook = Number(recipe.cookTimeMin);
  return {
    ...recipe,
    imageUrl: recipe.imageUrl || undefined,
    prepTimeMin: Number.isFinite(prep) ? Math.min(120, Math.max(0, prep)) : 15,
    cookTimeMin: Number.isFinite(cook) ? Math.min(120, Math.max(0, cook)) : 20,
    ingredients: recipe.ingredients
      .filter((ing) => {
        // Drop pure water from shopping lists entirely
        if (/^water$/i.test(ing.name.trim()) && ing.source === 'shopping') return false;
        return true;
      })
      .map((ing) => ({
        ...ing,
        amount: safeQuantity(ing.amount, ing.unit),
        unit: ing.unit || 'pcs',
        source: isFreeStaple(ing.name) ? ('inventory' as const) : ing.source,
      })),
  };
}
