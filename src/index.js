import { filterRecipes } from './algo_fonctionnel.js';
import {recipes} from '../data/recipes.js';
sessionStorage.clear();
sessionStorage.setItem('tags', JSON.stringify({
    ingredientsTags: [],
    appareilsTags: [],
    ustensilesTags: []
}));

//----------------------------------------------------------- AFFICHER LES RECETTES A PARTIR DU TABLEAU LES CONTENANT ------------------------------------------//
function displayRecipes(recipesToDisplay) {
    const recipesSection = document.querySelector('#recipes_section');
    recipesSection.innerHTML = "";
    const template = document.querySelector('#recipe');
    const template2 = document.querySelector('#ingredient');
    if (recipesToDisplay.length >= 1) {
        recipesToDisplay.forEach(function(recipe) {
            const clone = document.importNode(template.content, true);
            clone.querySelector('.name').textContent = recipe.name;
            clone.querySelector('.time').textContent = recipe.time + " min";
            clone.querySelector('.descriptiondiv').textContent = recipe.description;
            recipe.ingredients.forEach(function(ingredient) {
                const clone2 = document.importNode(template2.content, true);
                    if (ingredient.unit) {
                        clone2.querySelector('.ingredient').textContent = ingredient.ingredient + ": ";
                        if (ingredient.unit.length > 4) {
                            clone2.querySelector('.quantity').textContent = ingredient.quantity + " " + ingredient.unit;
                        } else {
                            clone2.querySelector('.quantity').textContent = ingredient.quantity + ingredient.unit;
                        }                    
                    } else if (!ingredient.unit && ingredient.quantity) {
                        clone2.querySelector('.ingredient').textContent = ingredient.ingredient + ": ";
                        clone2.querySelector('.quantity').textContent = ingredient.quantity;
                    } else {
                        clone2.querySelector('.ingredient').textContent = ingredient.ingredient;
                    }
                clone.querySelector('.ingredientsdiv').appendChild(clone2);
            })
            recipesSection.appendChild(clone);
        })
    } else {
        const errorMsg = document.createElement('h1');
        errorMsg.classList.add("errormessage");
        errorMsg.classList.add("roboto");
        errorMsg.innerHTML = "Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.";
        recipesSection.appendChild(errorMsg);
    }
}
//-----------------------------------------------------------------------------------------------------------------------------------------------------------//




//----------------------------------------------------------- LIRE L'INPUT GLOBAL POUR CHERCHER DES RECETTES ------------------------------------------//
const globalInput = document.querySelector("#globalResearch");
globalInput.addEventListener("input", (event) => {
    const tags = sessionStorage.getItem('tags');
    if (event.target.value.length >= 3) {
        const filteredRecipes = filterRecipes(recipes, event.target.value, JSON.parse(tags));
        displayRecipes(filteredRecipes);
    } else {
        const filteredRecipes = filterRecipes(recipes, "", JSON.parse(tags));
        displayRecipes(filteredRecipes);
    }
});
//-----------------------------------------------------------------------------------------------------------------------------------------------------//


//-------------------------------------------------------------- LIRE L'INPUT TAGS POUR CHERCHER DES TAGS ---------------------------------------------//
const tagsInputArray = document.querySelectorAll(".tagresearch")
tagsInputArray.forEach((input) => {
    input.addEventListener("input", (event) => {
        const data = input.getAttribute("data-for");
        if (event.target.value.length >= 3) {
            tagsResearch(event.target.value, data)
        } else {
            const tags = takeTags(recipes);
            displayIngredients(tags);
            displayAppareils(tags);
            displayUstensiles(tags);
        }
    })
})
//-----------------------------------------------------------------------------------------------------------------------------------------------------//

//-------------------------------------------------------------- FONCTION POUR CHERCHER DES TAGS ------------------------------------------------------//
async function tagsResearch(research, data) {
    const tags = await takeTags(recipes);
    const ingredients = [];
    const appareils = [];
    const ustensiles = [];
    if (data === "ingredients") {
        tags.ingredients.forEach((ingredient) => {
            const ingredientName = ingredient.toLowerCase();
            const researchValue = research.toLowerCase();
            var index = ingredientName.indexOf(researchValue);
            if (index !== -1) {
                ingredients.push(ingredient);
            }
        })
        const result = {
            ingredients: ingredients
        }
        displayIngredients(result)
    } else if (data === "appareils") {
        tags.appareils.forEach((appareil) => {
            const appareilName = appareil.toLowerCase();
            const researchValue = research.toLowerCase();
            var index = appareilName.indexOf(researchValue);
            if (index !== -1) {
                appareils.push(appareil);
            }
        })
        const result = {
            appareils: appareils
        }
        displayAppareils(result)
    } else if (data === "ustensiles") {
        tags.ustensiles.forEach((ustensile) => {
            const ustensileName = ustensile.toLowerCase();
            const researchValue = research.toLowerCase();
            var index = ustensileName.indexOf(researchValue);
            if (index !== -1) {
                ustensiles.push(ustensile);
            }
        })
        const result = {
            ustensiles: ustensiles
        }
        displayUstensiles(result)
    }
}
//-----------------------------------------------------------------------------------------------------------------------------------------------------//

//------------------------------------------------------ OUVRIR LES SELECTEURS DE TAGS ------------------------------------------------------------------//
const showIngredientsArrow = document.querySelector(".blue .arrow");
const showAppareilsArrow = document.querySelector(".green .arrow");
const showUstensilesArrow = document.querySelector(".red .arrow");
const ingdiv = document.querySelector(".blue");
const appdiv = document.querySelector(".green");
const ustdiv = document.querySelector(".red");
let ingclicked = false;
let appclicked = false;
let ustclicked = false;
showIngredientsArrow.addEventListener("click", () => {    
    if (ingclicked === true) {
        ingdiv.classList.remove('uncollapsed');
        ingclicked = false;
    } else if (ingclicked === false) {
        ingdiv.classList.add('uncollapsed')
        appdiv.classList.remove('uncollapsed')
        ustdiv.classList.remove('uncollapsed')
        ingclicked = true;
        appclicked = false;
        ustclicked = false;
    }
})
showAppareilsArrow.addEventListener("click", () => {
    if (appclicked === true) {
        appdiv.classList.remove('uncollapsed');
        appclicked = false;
    } else if (appclicked === false) {
        ingdiv.classList.remove('uncollapsed')
        appdiv.classList.add('uncollapsed')
        ustdiv.classList.remove('uncollapsed')
        ingclicked = false;
        appclicked = true;
        ustclicked = false;
    }
})
showUstensilesArrow.addEventListener("click", () => {
    if (ustclicked === true) {
        ustdiv.classList.remove('uncollapsed');
        ustclicked = false;
    } else if (ustclicked === false) {
        ingdiv.classList.remove('uncollapsed')
        appdiv.classList.remove('uncollapsed')
        ustdiv.classList.add('uncollapsed')
        ingclicked = true;
        appclicked = false;
        ustclicked = true;
    }
})
//-----------------------------------------------------------------------------------------------------------------------------------------------------//

//--------------------------------------------------------- RÉCUPERER TOUT LES TAGS ------------------------------------------------------------------//
function takeTags(recipes) {
    const ingredients = [];
    const appareils = [];
    const ustensiles = [];
    recipes.forEach(function(recipe) {
        recipe.ingredients.forEach(function(ingredient) {
            ingredients.push(ingredient.ingredient)
        });
        appareils.push(recipe.appliance)
        recipe.ustensils.forEach(function(ustensile) {
            ustensiles.push(ustensile)
        });
    });
    const filteredIngredients = arrayFilter(ingredients);
    const filteredAppareils = arrayFilter(appareils);
    const filteredUstensiles = arrayFilter(ustensiles);
    return {
        ingredients: filteredIngredients,
        appareils: filteredAppareils,
        ustensiles: filteredUstensiles
    }
}
//-----------------------------------------------------------------------------------------------------------------------------------------------------//

//--------------------------------------------------------- FILTRER TOUT LES TAGS POUR RETIRER LES DOUBLES ------------------------------------------------------------------//
function arrayFilter(sourceArray) {
    return sourceArray.filter((item, index) => {
        const arrayLowerCased = sourceArray.map(item => item.toLowerCase())
        return arrayLowerCased.indexOf(item.toLowerCase()) == index;
    });
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

//--------------------------------------------------------- AFFICHER LES TAGS DANS LEUR SELECTOR ------------------------------------------------------------------//
function displayIngredients(tags) {
    const ingredientsSection = document.querySelector("#ingredientsList");
    ingredientsSection.innerHTML = "";
    tags.ingredients.forEach((ingredient) => {
        addTagInTagList(ingredient, ingredientsSection, "ing");
    })
} 
function displayAppareils(tags) {
    const appareilsSection = document.querySelector("#appareilsList");
    appareilsSection.innerHTML = "";
    tags.appareils.forEach((appareil) => {
        addTagInTagList(appareil, appareilsSection, "app");
    })
}
function displayUstensiles(tags) {
    const ustensilesSection = document.querySelector("#ustensilesList");
    ustensilesSection.innerHTML = "";
    tags.ustensiles.forEach((ustensile) => {
        addTagInTagList(ustensile, ustensilesSection, "ust");
    })
}
function addTagInTagList(tag, section, which) {
    const btn = document.createElement("button");
    btn.classList.add("decotag");
    btn.classList.add("lato");
    btn.innerHTML = tag;
    btn.setAttribute("data-name", tag);
    section.appendChild(btn)
    btn.addEventListener("click", function () {
        const tagsInputsArray = document.querySelectorAll(".tagresearch");
        for (const tagsInput of tagsInputsArray) {
            tagsInput.value = ""
        }
        tagsResearch("", "ingredients");
        tagsResearch("", "appareils");
        tagsResearch("", "ustensiles");


        let array;
        if (which === "ing") {
            array = JSON.parse(sessionStorage.getItem('tags')).ingredientsTags;
        } else if (which === "app") {
            array = JSON.parse(sessionStorage.getItem('tags')).appareilsTags;
        } else if (which === "ust") {
            array = JSON.parse(sessionStorage.getItem('tags')).ustensilesTags;
        }
        const name = btn.getAttribute("data-name")
        let present = false;
        for (let i = 0; i < array.length; i++) {
            if (name === array[i]) {
                present = true;
            }
        }
        console.log(array)
        console.log(present)
        console.log(which)
        if (present === true) {
            present = false;
        } else {
            const object = JSON.parse(sessionStorage.getItem('tags'));
            if (which === "ing") {
                object.ingredientsTags.push(tag)
            } else if (which === "app") {
                object.appareilsTags.push(tag)
            } else if (which === "ust") {
                object.ustensilesTags.push(tag)
            }
            sessionStorage.setItem('tags', JSON.stringify(object));
            const inputValue = document.querySelector("#globalResearch").value
            const recipesToDisplay = filterRecipes(recipes, inputValue, object)
            displayRecipes(recipesToDisplay)
            displayTagsInTagsSection(object);
        }
    })
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

//--------------------------------------------------------- AFFICHER LES TAGS ACTIFS DANS LEUR SECTION ------------------------------------------------------------------//
function displayTagsInTagsSection(array) {
    const ingdiv = document.querySelector(".ingredientstagdisplaydiv");
    const appdiv = document.querySelector(".appareilstagdisplaydiv");
    const ustdiv = document.querySelector(".ustensilestagdisplaydiv");
    ingdiv.innerHTML = "";
    appdiv.innerHTML = "";
    ustdiv.innerHTML = "";
    if (array?.ingredientsTags) {
        array.ingredientsTags.forEach((ingredientTag) => {
            const divbutton = document.createElement("div");
            divbutton.classList.add("tagbutton");
            divbutton.classList.add("blue");
            const name = document.createElement("p");
            name.innerHTML = ingredientTag;
            divbutton.appendChild(name);
            const close = document.createElement("img");
            close.setAttribute('src', '../media/close.svg');
            close.setAttribute('data-category', 'ingredient');
            close.setAttribute('data-for', ingredientTag);
            close.classList.add('closetag');
            close.addEventListener('click', () => {
                deleteTag(array, "ing", ingredientTag);
            })
            divbutton.appendChild(close);
            ingdiv.appendChild(divbutton);
        });
    }
    if (array?.appareilsTags) {
        array.appareilsTags.forEach((appareilTag) => {
            const divbutton = document.createElement("div");
            divbutton.classList.add("tagbutton");
            divbutton.classList.add("green");
            const name = document.createElement("p");
            name.innerHTML = appareilTag;
            divbutton.appendChild(name);
            const close = document.createElement("img");
            close.setAttribute('src', '../media/close.svg');
            close.setAttribute('data-category', 'appareil');
            close.setAttribute('data-for', appareilTag);
            close.classList.add('closetag');
            close.addEventListener('click', () => {
                deleteTag(array, "app", appareilTag);
            })
            divbutton.appendChild(close);
            appdiv.appendChild(divbutton);
        });
    }
    if (array?.ustensilesTags) {
        array.ustensilesTags.forEach((ustensileTag) => {
            const divbutton = document.createElement("div");
            divbutton.classList.add("tagbutton");
            divbutton.classList.add("red");
            const name = document.createElement("p");
            name.innerHTML = ustensileTag;
            divbutton.appendChild(name);
            const close = document.createElement("img");
            close.setAttribute('src', '../media/close.svg');
            close.setAttribute('data-category', 'ustensile');
            close.setAttribute('data-for', ustensileTag);
            close.classList.add('closetag');
            close.addEventListener('click', () => {
                deleteTag(array, "ust", ustensileTag);
            })
            divbutton.appendChild(close);
            ustdiv.appendChild(divbutton);
        });
    }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

//--------------------------------------------------------- SUPPRIMER LES TAGS ACTIFS DANS LEUR SECTION ------------------------------------------------------------------//
function deleteTag(array, category, tag) {
    let arrayToModify;
    if (category === "ing") {
        arrayToModify = array.ingredientsTags;
    } else if (category === "app") {
        arrayToModify = array.appareilsTags;
    } else if (category === "ust") {
        arrayToModify = array.ustensilesTags;
    }
    let index = arrayToModify.indexOf(tag);
    if (index !== -1) {
        arrayToModify.splice(index, 1)
    }
    if (category === "ing") {
        array.ingredientsTags = arrayToModify;
    } else if (category === "app") {
        array.appareilsTags = arrayToModify;
    } else if (category === "ust") {
        array.ustensilesTags = arrayToModify;
    }
    sessionStorage.setItem('tags', JSON.stringify(array))
    const inputValue = document.querySelector("#globalResearch").value
    const recipesToDisplay = filterRecipes(recipes, inputValue, array)
    displayRecipes(recipesToDisplay)
    displayTagsInTagsSection(array)
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

async function init() {
    displayRecipes(recipes);
    const tags = await takeTags(recipes);
    displayIngredients(tags);
    displayAppareils(tags);
    displayUstensiles(tags);
}

init();