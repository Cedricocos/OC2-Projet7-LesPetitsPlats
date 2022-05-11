export function filterRecipes(recipes, research, tags) {
    function isResearchValid(research, recipe) {
        const recipeName = recipe.name.toLowerCase()
        const researchValue = research.toLowerCase()
        var index = recipeName.indexOf(researchValue);
        return index !== -1;
    }
    function isIngredientValid(ingredientsTags, recipe) {
        if (ingredientsTags) {
            const areAllIngredientsInRecipe = ingredientsTags.every((ingTag) => {
                return recipe.ingredients.map(i => i.ingredient).includes(ingTag);
            })
            return areAllIngredientsInRecipe;
        } else {
            return true
        }
    }
    function isAppliancesValid(appareilsTags, recipe) {
        if (appareilsTags) {
            const areAllAppareilsInRecipe = appareilsTags.every((appTag) => {
                return recipe.appliance === appTag;
            })
            return areAllAppareilsInRecipe
        } else {
            return true
        }
    }
    function isUstensilsValid(ustensilesTags, recipe) {
        if (ustensilesTags) {
            const areAllUstensilesInRecipe = ustensilesTags.every((ustTag) => {
                return recipe.ustensils.includes(ustTag);
            })
            return areAllUstensilesInRecipe
        } else {
            return true
        }
    }
    function isRecipeValid(recipe, research, tags) {
        return isResearchValid(research, recipe) &&
        isIngredientValid(tags?.ingredientsTags, recipe) &&
        isAppliancesValid(tags?.appareilsTags, recipe) &&
        isUstensilsValid(tags?.ustensilesTags, recipe);
    }
    return recipes.filter((recipe) => isRecipeValid(recipe, research, tags));
}
