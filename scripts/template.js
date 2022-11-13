// fonction Affichage des recettes sur la page
export const getRecipes = (recipes) => {
  let recipeHTML = '';
  let recipeArray = [];

  recipeArray = recipes.map((recipe) => ({
    recipe,
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
      .join(' ')}
                </ul>
                <p class="recipeDescription">
                ${recipe.description}
                </p>
            </div>
        </div>
    </div>
          `,
  }));

  recipeArray.forEach((element) => {
    recipeHTML += element.html;
  });
  return recipeHTML;
};
const itemIngridient = (item) => `${item.ingredient}`;

const getIngredients = (item) => `<li class="item">${item.ingredient}: ${
  item.quantity || ''
} ${item.unit || ''} <br>`;

export const getFilter = ({ list, type }) => list.map((ingredient) => `<span class="filter_option-wrap"><span class="filter_option" data-id="${ingredient}" data-type="${type}">${ingredient}</span></span>`)
  .join('');

export const getBadges = (badges) => badges.map(({ name, type }) => {
  let color = '';
  if (type === 'ingredients') {
    color = 'blue';
  } else if (type === 'appliances') {
    color = 'green';
  } else if (type === 'utensils') {
    color = 'red';
  }
  return ` 
        <span class="btn btn-sm badge-${color}">
            ${name} <span class="badge" data-id="${name}"><i class="fa-regular fa-circle-xmark"></i></span>
        </span>
    `;
}).join('');
