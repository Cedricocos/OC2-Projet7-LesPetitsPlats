export function filterRecipes(recipes, research, tags) {
    const validRecipes = []

    for(const recipe of recipes) {
        if (validRecipe(recipe, research, tags)) {
                    validRecipes.push(recipe)
        }
    }

    function validRecipe(recipe, research, tags) {
        const recipeName = recipe.name.toLowerCase()
        const researchValue = research.toLowerCase()
        var index = recipeName.indexOf(researchValue);
        // console.log(index, recipeName, researchValue)
        if (index === -1) {
            return false;
            // validRecipes.push(recipe)
        }
        if (tags?.ingredientsTags) {
            for(const ingTag of tags.ingredientsTags) {
                // const recipeTags = recipe.ingredients.map(i => i.ingredient) ---- en fonctionnel
                const recipeIngredients = [];
                // console.log(ingTag)
                for(const ingredientObject of recipe.ingredients) {
                    recipeIngredients.push(ingredientObject.ingredient);
                }
                if (!recipeIngredients.includes(ingTag)) {
                //    console.log(ingTag, recipeIngredients)
                    return false;
                }
            }
        }
        if (tags?.appareilsTags) {
            for(const appTag of tags.appareilsTags) {
                const recipeAppareils = [];
                // console.log(appTag)
                if (recipe.appliance === appTag) {
                    recipeAppareils.push(appTag);
                }
                console.log(recipeAppareils)
                if (!recipeAppareils.includes(appTag)) {
                    return false;
                }
            }
        }
        if (tags?.ustensilesTags) {
            for(const ustTag of tags.ustensilesTags) {
                const recipeUstensiles = [];
                // console.log(ustTag)
                for(const ustensile of recipe.ustensils) {
                    recipeUstensiles.push(ustensile);
                }
                if (!recipeUstensiles.includes(ustTag)) {
                    return false;
                }
            }
        }


        return true
    }

    return validRecipes
}
