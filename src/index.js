import { filterRecipes } from './algo_imperatif.js';
import {recipes} from '../data/recipes.js';
sessionStorage.clear();

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
//-------------------------------------------------------------------------------------------------//
//-----------------------------------------------------------------------------------------------------------------------------------------------------//


//-------------------------------------------------------------- LIRE L'INPUT TAGS POUR CHERCHER DES TAGS ---------------------------------------------//
const tagsInputArray = document.querySelectorAll("#tagResearch")
tagsInputArray.forEach((input) => {
    input.addEventListener("input", (event) => {
        const data = input.getAttribute("data-for");
        if (event.target.value.length >= 3) {
            tagsResearch(event.target.value, data)
        } else {
            const tags = takeTags(recipes);
            displayTags(tags);
        }
    })
})

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
    } else if (data === "appareils") {
        tags.appareils.forEach((appareil) => {
            const appareilName = appareil.toLowerCase();
            const researchValue = research.toLowerCase();
            var index = appareilName.indexOf(researchValue);
            if (index !== -1) {
                appareils.push(appareil);
            }
        })
    } else if (data === "ustensiles") {
        tags.ustensiles.forEach((ustensile) => {
            const ustensileName = ustensile.toLowerCase();
            const researchValue = research.toLowerCase();
            var index = ustensileName.indexOf(researchValue);
            if (index !== -1) {
                ustensiles.push(ustensile);
            }
        })
    }
    const result = {
        ingredients: ingredients,
        appareils: appareils,
        ustensiles: ustensiles
    }
    displayTags(result)
}
//-----------------------------------------------------------------------------------------------------------------------------------------------------//


// POUR LES TAGS
// au clic sur le bouton, ouvrir un input et recuperer liste ingredients
// Lorsqu'on clique sur un ingredient (donc c'est des btns) : 
// - on vient récuperer la data du btn
// - l'ajouter à un tableau Tags avec une entrée par rapport à la catégorie (ingrédient, appareil ou ustensile)
// - le mettre dans la section contenant les tags (ajouter la couleur en fonction du tag)
// - Mettre une petite croix qui vient retirer le tag en html, puis qui va chercher le tag dans le tableau et le supprimer avec un filter

const showIngredientsArrow = document.querySelector(".blue .arrow");
const showAppareilsArrow = document.querySelector(".green .arrow");
const showUstensilesArrow = document.querySelector(".red .arrow");
const ingdiv = document.querySelector(".blue");
const appdiv = document.querySelector(".green");
const ustdiv = document.querySelector(".red");
let ingclicked = false;
let appclicked = false;
let ustclicked = false;

showIngredientsArrow.addEventListener("click", function (event) {    
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

showAppareilsArrow.addEventListener("click", function () {
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

showUstensilesArrow.addEventListener("click", function () {
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
};

function arrayFilter(sourceArray) {
    return sourceArray.filter((item, index) => {
        const arrayLowerCased = sourceArray.map(item => item.toLowerCase())
        return arrayLowerCased.indexOf(item.toLowerCase()) == index;
    });
}

// Separer en displayIngredients, displayAppareils... etc
function displayTags(tags) {
    const tagsArray = {
        ingredientsTags: [],
        appareilsTags: [],
        ustensilesTags: []
    }
    const ingredientsSection = document.querySelector("#ingredientsList");
    const appareilsSection = document.querySelector("#appareilsList");
    const ustensilesSection = document.querySelector("#ustensilesList");
    ingredientsSection.innerHTML = "";
    appareilsSection.innerHTML = "";
    ustensilesSection.innerHTML = "";
    tags.ingredients.forEach((ingredient) => {
        addTagInTagList(ingredient, ingredientsSection, tagsArray.ingredientsTags, tagsArray);
    })
    tags.appareils.forEach((appareil) => {
        addTagInTagList(appareil, appareilsSection, tagsArray.appareilsTags, tagsArray);
    })
    tags.ustensiles.forEach((ustensile) => {
        addTagInTagList(ustensile, ustensilesSection, tagsArray.ustensilesTags, tagsArray);
    })
}

function addTagInTagList(tag, section, array, object) {
    const btn = document.createElement("button");
    btn.classList.add("decotag");
    btn.classList.add("lato");
    btn.innerHTML = tag;
    btn.setAttribute("data-name", tag);
    section.appendChild(btn)
    btn.addEventListener("click", function () {
        const name = btn.getAttribute("data-name")
        let present = false;
        for (let i = 0; i < array.length; i++) {
            if (name === array[i]) {
                present = true;
            }
        }
        if (present === true) {
            present = false;
        } else {
            array.push(name)
            sessionStorage.setItem('tags', JSON.stringify(object));
            const inputValue = document.querySelector("#globalResearch").value
            console.log(object)
            const recipesToDisplay = filterRecipes(recipes, inputValue, object)
            displayRecipes(recipesToDisplay)
            displayTagsInTagsSection(object);
        }
        // console.log(array)
    })
}

function displayTagsInTagsSection(array) {
    const ingdiv = document.querySelector(".ingredientstagdisplaydiv");
    const appdiv = document.querySelector(".appareilstagdisplaydiv");
    const ustdiv = document.querySelector(".ustensilestagdisplaydiv");
    ingdiv.innerHTML = "";
    appdiv.innerHTML = "";
    ustdiv.innerHTML = "";
    // console.log(array)

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

    // console.log(array);
}

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
        console.log(arrayToModify);
        console.log('couic')
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

async function init() {
    displayRecipes(recipes);
    const tags = await takeTags(recipes);
    displayTags(tags);
}

init();