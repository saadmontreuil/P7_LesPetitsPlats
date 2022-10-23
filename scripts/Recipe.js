import { recipes } from "../data/recipes.js";



let recipeArray = [];
let badges = [];
let recipeHTML = "";
const recipesContainer = document.getElementById("recipes");
const searchPanel = document.querySelector('#search-panel')
const recipess = document.getElementsByClassName("recipes");
const DOMFilterIngredients = document.querySelector('#filter_ingredients')
const DOMFilterAppliance = document.querySelector('#filter_appliances')
const DOMFilterUtensils = document.querySelector('#filter_utensils')
const filtersInputValue = {ingredients: '', appliances: '', utensils: ''}
let searchValue = ''
const DOMBadges = document.querySelector('#badges')

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
  recipess.textContent = '';
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

const search = () => {
  const searchbarFilter = recipes.filter(({name,ingredients,description}) => JSON.stringify({name,ingredients,description}).toLowerCase().includes(searchValue));
   display(searchbarFilter)
}

searchPanel.addEventListener('submit', (event) => {
  event.preventDefault()
  searchValue = Object.fromEntries(new FormData(event.target)).search.trim().toLowerCase()
  console.log(searchValue);
  if (searchValue.length > 2) {
      search(searchValue)
  }
})

function getFilter({list, type}) {
  return list.map((ingredient, id) =>
      `<span class="filter_option-wrap"><span class="filter_option" data-id="${ingredient}" data-type="${type}">${ingredient}</span></span>`)
      .join('')
}

const display =(recipesList )=> {
  getRecipes(recipesList);
  const uniqueValueWithFiltersValue = getUniqueValues(recipesList, filtersInputValue)
  uniqueValueWithFiltersValue.forEach(element => {
      if (element.type === 'ingredients') DOMFilterIngredients.innerHTML = getFilter(element)
      else if (element.type === 'appliances') DOMFilterAppliance.innerHTML = getFilter(element)
      else if (element.type === 'utensils') DOMFilterUtensils.innerHTML = getFilter(element)
  })
}


display(recipes);

function getUniqueValues(arr,obj) {
      const listIngredients = arr.map(({ingredients}) => ingredients.map(({ingredient}) => ingredient.toLowerCase())).flat()
      const listAppliance = arr.map(({appliance}) => appliance.toLowerCase())
      const listUtensils = arr.map(({ustensils}) => ustensils.map(utensil => utensil.toLowerCase())).flat()
      const uniqueValue =  [
          {list: [...new Set(listIngredients)],type: 'ingredients'},
          {list: [...new Set(listAppliance)],type: 'appliances' },
          {list: [...new Set(listUtensils)],type: 'utensils'}
      ]
      console.log(uniqueValue);
      return Object.entries(obj).map(([filterType, filterValue]) => {
          for (const {list, type} of uniqueValue) {
              if (filterType === type) {
                
                  return {list: list.filter(e => e.includes(filterValue.toLowerCase())), type}
              }
          }
      }).map(({list,type})=>({list:list.map(capitalizeElement),type}))
  }

  function capitalizeElement(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}

document.addEventListener('click', ({target}) => {
  const badgeCloseBtn = target.closest('.badge')
  const filterOption = target.closest('.filter_option')
  

  if (target.classList.contains('fa-chevron-down')) {
    openFilter(target)
  }
  if (filterOption) {
    // clearInputAndRemoveAttr(filterOption.dataset.type)
    const badgeExist = badges.some(({name}) => name === target.innerText)
    console.log(badges);
    if (!badgeExist) {
        badges.push({type: target.dataset.type, name: target.innerText})
    } else {
        badges = badges.filter(({name}) => name !== target.innerText)
    }
    DOMBadges.innerHTML = getBadgesTemplate(badges)
}
if (badgeCloseBtn) {
    badges = badges.filter(({name}) => name !== badgeCloseBtn.dataset.id)
    DOMBadges.innerHTML = getBadgesTemplate(badges)
}

})
const openFilter =(btn)=> {
  const filters = document.querySelectorAll('.filter')
  filters.forEach(filter => {
      if (filter !== btn.parentElement) {
          filter.classList.remove('open')
      } else {
          filter.classList.toggle('open')
      }
  })
}

function getBadgesTemplate(badges) {
  return badges.map(({name,type}) => {
      let color = ''
      if (type === 'ingredients') {
          color = 'blue'
      }else if (type === 'appliances') {
          color = 'green'
      }else if (type === 'utensils') {
          color = 'tomato'
      }
      return ` 
      <span class="btn btn-sm badge-${color}">
          ${name} <span class="badge" data-id="${name}"><i class="fa-regular fa-circle-xmark"></i></span>
      </span>
  `}).join('')
}

function addActiveClass(badgesList) {
  badgesList.forEach(({type, name}) => {
      document.querySelector(`[data-type="${type}"][data-id="${name}"]`)?.classList.add('active')
  })
}
