import { recipes } from "../data/recipes.js";
import { getRecipes } from "./template.js";
import { getFilter } from "./template.js";
import { getBadges } from "./template.js";


let badges = [];
const searchPanel = document.querySelector('#search-panel')
const IngredientsContainer = document.querySelector('#filter_ingredients')
const ApplianceContainer = document.querySelector('#filter_appliances')
const UtensilsContainer = document.querySelector('#filter_utensils')
const filtersInputValue = {ingredients: '', appliances: '', utensils: ''}
let searchValue = ''
const recipesContainer = document.getElementById("recipes");
const BadgesContainer = document.querySelector('#badges')
const filterIngredients = Array.from(document.querySelectorAll('.filter_input'))



// display function is for displaying the recipes and the filters
const display =(recipesList)=> {
    noResult(recipesList.length);
    recipesContainer.innerHTML = getRecipes(recipesList);
  const uniqueValueWithFiltersValue = getUniqueValues(recipesList, filtersInputValue)
  uniqueValueWithFiltersValue.forEach(element => {
      if (element.type === 'ingredients') IngredientsContainer.innerHTML = getFilter(element)
      else if (element.type === 'appliances') ApplianceContainer.innerHTML = getFilter(element)
      else if (element.type === 'utensils') UtensilsContainer.innerHTML = getFilter(element)
  })
}
 display(recipes);


// filter function is for getting unique ingredients and appliances and utensils in the recipes
function getUniqueValues(arr,obj) {
      const listIngredients = arr.map(({ingredients}) => ingredients.map(({ingredient}) => ingredient.toLowerCase())).flat()
      const listAppliance = arr.map(({appliance}) => appliance.toLowerCase())
      const listUtensils = arr.map(({ustensils}) => ustensils.map(utensil => utensil.toLowerCase())).flat()
      const uniqueValue =  [
          {list: [...new Set(listIngredients)],type: 'ingredients'},
          {list: [...new Set(listAppliance)],type: 'appliances' },
          {list: [...new Set(listUtensils)],type: 'utensils'}
      ]
      return Object.entries(obj).map(([filterType, filterValue]) => {
          for (const {list, type} of uniqueValue) {
              if (filterType === type) {
                
                  return {list: list.filter(e => e.includes(filterValue.toLowerCase())), type}
              }
          }
      }).map(({list,type})=>({list:list.map(capitalizeElement),type}))
}


// search function is for getting recipes that match the search value
const search = () => {
    const searchbarFilter = recipes.filter(({name,ingredients,description}) => JSON.stringify({name,ingredients,description}).toLowerCase().includes(searchValue));
    console.log(searchbarFilter)
     display(searchbarFilter)
  }

  
  //at the event of submit use the value of the input in search function
  searchPanel.addEventListener('submit', (event) => {
    // debugger;
      console.log('submit')
    event.preventDefault()
    searchValue = Object.fromEntries(new FormData(event.target)).search.trim().toLowerCase()
    console.log(searchValue);
    if (searchValue.length > 2) {
        search(searchValue)
    }
  })

// function for capitalizing the first letter of each item
function capitalizeElement(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}
// at the event of click on the items add them to the badges
document.addEventListener('click', ({target}) => {
  const badgeCloseBtn = target.closest('.badge')
  const filterOption = target.closest('.filter_option')
  
  if (filterOption) {
    const badgeExist = badges.some(({name}) => name === target.innerText)
    console.log(badges);
    if (!badgeExist) {
        badges.push({type: target.dataset.type, name: target.innerText})
    } else {
        badges = badges.filter(({name}) => name !== target.innerText)
    }
    BadgesContainer.innerHTML = getBadges(badges)
}
if (badgeCloseBtn) {
    badges = badges.filter(({name}) => name !== badgeCloseBtn.dataset.id)
    BadgesContainer.innerHTML = getBadges(badges)
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
document.addEventListener('click', ({target}) => {
    if (target.classList.contains('fa-chevron-down')) {
      openFilter(target)
    }  
  })

  filterIngredients.forEach(input => {
    input.addEventListener('input', ({target}) => {
        const filterList = document.querySelector(`#filter_ingredients`)
        console.log(filterList);
        filtersInputValue[target.name] = target.value
        const uniqueValueWithFiltersValue = getUniqueValues(recipes, filtersInputValue)
        uniqueValueWithFiltersValue.forEach(element => {
            if (element.type === 'ingredients') IngredientsContainer.innerHTML = getFilter(element)
        })
    })
});
function noResult(condition) {
    const noResult = document.querySelector('.none')
    if (condition) {
        noResult.style.display = 'none'
    } else {
        noResult.style.display = 'block'
    }
}