import { recipes } from "../data/recipes.js";


let recipeArray = [];
let recipeHTML = "";
const recipesContainer = document.getElementById("recipes");

//fonction Affichage des recettes sur la page
const getRecipes=(recipes)=> {
  recipeArray = recipes.map((recipe) => {
    return {
      recipe: recipe,
      ingredients: recipe.ingredients.map(itemIngridient),
      html: `
      <div class="recipe">
      <img class="recipeImg" src="https://picsum.photos/380/178" alt="recipe">
      <div class="recipeWrap">
          <div class="recipeHeader">
              <h2 class="recipeTitle">${recipe.name}</h2>
              <div class="recipeDuration">
                  <img src="images/Clock.svg" alt="Duration">
                  ${recipe.time}
              </div>
          </div>
          <div class="recipeContent">
              <ul class="listIngredients list-group">
              ${recipe.ingredients
                .map(getIngredients)
                .join(" ")}
              </ul>
              <p class="recipeDescription">
              ${recipe.description}
              </p>
          </div>
      </div>
  </div>
        `,
    };
  });
  recipeArray.forEach((element) => {
    recipeHTML += element.html; 
  });
  recipesContainer.innerHTML = recipeHTML;

}

const  itemIngridient =(item)=> {
  return `${item.ingredient}`;
}

const getIngredients=(item)=>  {
  return `<li class="item">${item.ingredient}: ${
    item.quantity || ""
  } ${item.unit || ""} <br>`;
}
//Affichage des recettes sur la page
getRecipes(recipes);