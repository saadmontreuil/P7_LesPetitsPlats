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
const filterInput = Array.from(document.querySelectorAll('.filter_input'))



// display function is for displaying the recipes and the filters
const display =(recipesList, badges = [])=> {
    noResult(recipesList.length);
    recipesContainer.innerHTML = getRecipes(recipesList);
  const uniqueValueWithFiltersValue = getUniqueValues(recipesList, filtersInputValue)

for (let i=0; i < uniqueValueWithFiltersValue.length ; i++){
    if (uniqueValueWithFiltersValue[i].type === 'ingredients') IngredientsContainer.innerHTML = getFilter(uniqueValueWithFiltersValue[i])
    if (uniqueValueWithFiltersValue[i].type === 'appliances') ApplianceContainer.innerHTML = getFilter(uniqueValueWithFiltersValue[i])
    if (uniqueValueWithFiltersValue[i].type === 'utensils') UtensilsContainer.innerHTML = getFilter(uniqueValueWithFiltersValue[i])
}
  BadgesContainer.innerHTML = getBadges(badges)
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
                // list.filter(e => e.includes(filterValue.toLowerCase()))
                for(let i = 0; i < list.length; i++){
                    if(!list[i].includes(filterValue.toLowerCase())){
                        list.splice(i, 1);
                        i--;
                        console.log(test);
                    }
                }
                
                  return {list: list, type}
              }
          }
      }).map(({list,type})=>({list:list.map(capitalizeElement),type}))
}


// search function with loops to get recipes that match the search value
const search = (badges) => {
    const searchbarFilter = []
    const filterRecipes = []
    let badge = false
    for (let i = 0; i < recipes.length; i++) {
        const regex = new RegExp(searchValue, "g");
        const {name,ingredients,description} = recipes[i]
        if (JSON.stringify({name,ingredients,description}).toLowerCase().match(regex)) {
            searchbarFilter.push(recipes[i])
        }
    }
    if (badges.length){
        for (let i = 0; i < badges.length; i++) {
            const {name, type} = badges[i]
            for (let k = 0; k < searchbarFilter.length; k++) {
                badge = someValues(name, type, searchbarFilter[k])
                if (badge) {
                    filterRecipes.push(searchbarFilter[k])
                }
            }
        }
    }else {
        filterRecipes.push(...searchbarFilter)
    }
    if (badges.length < 2) {
        display(filterRecipes, badges)
    } else {
        console.log("deplucate")
        display(noDuplication(filterRecipes), badges)
    }
}
const noDuplication=(arr)=> {
    const recipes = []
    // debugger
    for (let i = 0; i <= arr.length; i++) {
        for (let k = 0; k <= arr.length; k++) {
            if (i !== k && arr[i] === arr[k] && recipes.indexOf(arr[i]) === -1) {
                recipes.push(arr[i]);
                break;
            }
        }
    }
    return recipes
}

const someValues=(name, type, element)=> {
    let badge = false
    const {ingredients, appliance, ustensils} = element
    if (type === 'ingredients') {
        for (let i = 0; i < ingredients.length; i++) {
            let condition = ingredients[i].ingredient.toLowerCase() === name.toLowerCase()
            if (condition) {
                badge = true
                break
            }
        }
    }
    if (type === 'appliances') {
        if (appliance === name) {
            badge = true
        }
    }
    if (type === 'utensils') {
        for (let i = 0; i < ustensils.length; i++) {
            let condition = ustensils[i].toLowerCase() === name.toLowerCase()
            if (condition) {
                badge = true
                break
            }
        }
    }
    console.log(badge)
    return badge
}

  //at the event of submit use the value of the input in search function
  searchPanel.addEventListener('submit', (event) => {
    // debugger;
      
    event.preventDefault()
    searchValue = Object.fromEntries(new FormData(event.target)).search.trim().toLowerCase()
    if (searchValue.length > 2) {
        search(badges)
    }
    if (searchValue.length === 0) {
        display(recipes);
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
    if (!badgeExist) {
        badges.push({type: target.dataset.type, name: target.innerText})
    } else {
        // badges = badges.filter(({name}) => name !== target.innerText)
        for(let i = 0; i < badges.length; i++){
            if(badges[i].name === target.innerText){
                badges.splice(i, 1);

            }
        }
    }
    search(badges)
}
if (badgeCloseBtn) {

    // badges = badges.filter(({name}) => name !== badgeCloseBtn.dataset.id)
    for(let i = 0; i < badges.length; i++){
        if(badges[i].name === badgeCloseBtn.dataset.id){
            badges.splice(i, 1)
        }
    }

    search(badges)
}

})
const openFilter =(btn)=> {
  const filters = document.querySelectorAll('.filter')

for(let i=0; i<filters.length; i++){
    if (filters[i] !== btn.parentElement) {
        filters[i].classList.remove('open')
    } else {
        filters[i].classList.toggle('open')
    }
}
}
document.addEventListener('click', ({target}) => {
    if (target.classList.contains('fa-chevron-down')) {
      openFilter(target)
    }  
  })


for(let i=0; i<filterInput.length; i++){
    filterInput[i].addEventListener('input', ({target}) => {
        const filterList = document.querySelector(`#filter_ingredients`)
        filtersInputValue[target.name] = target.value
        search(badges)
    })
}
function noResult(condition) {
    const noResult = document.querySelector('.none')
    if (condition) {
        noResult.style.display = 'none'
    } else {
        noResult.style.display = 'block'
    }
}