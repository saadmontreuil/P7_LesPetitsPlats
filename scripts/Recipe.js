import { recipes } from "../data/recipes.js";


let recipeArray = [];
let recipeHTML = "";
const recipesContainer = document.getElementById("recipes");
const searchPanel = document.querySelector('#search-panel')
const recipess = document.getElementsByClassName("recipes");
let searchValue = ''

//fonction Affichage des recettes sur la page
const getRecipes=(recipes)=> {
  

  recipeArray = recipes.map((recipe) => {
    return {
      recipe: recipe,
      ingredients: recipe.ingredients.map(itemIngridient),
      html: `
      <div class="recipe">
      <img class="recipeImg" src="https://picsum.photos/380/178?grayscale&blur" alt="recipe">
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
  recipess.innerHTML = "";
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

const search = () => {
  const searchbarFilter = recipes.filter(({name,ingredients,description}) => JSON.stringify({name,ingredients,description}).toLowerCase().includes(searchValue));
  console.log(searchbarFilter);
  
   getRecipes(searchbarFilter)
}

searchPanel.addEventListener('submit', (event) => {
  event.preventDefault()
  searchValue = Object.fromEntries(new FormData(event.target)).search.trim().toLowerCase()
  console.log(searchValue);
  if (searchValue.length > 2) {
      search(searchValue)
  }
})