/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
/* eslint-disable no-shadow */
/* eslint-disable import/extensions */

import { recipes } from '../data/recipes.js';
import { getRecipes, getFilter, getBadges } from './template.js';

// function for capitalizing the first letter of each item
function capitalizeElement(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

let badges = [];
const searchPanel = document.querySelector('#search-panel');
const IngredientsContainer = document.querySelector('#filter_ingredients');
const ApplianceContainer = document.querySelector('#filter_appliances');
const UtensilsContainer = document.querySelector('#filter_utensils');
const filtersInputValue = { ingredients: '', appliances: '', utensils: '' };
let searchValue = '';
const recipesContainer = document.getElementById('recipes');
const BadgesContainer = document.querySelector('#badges');
const filterInput = Array.from(document.querySelectorAll('.filter_input'));

// filter function is for getting unique ingredients and appliances and utensils in the recipes
function getUniqueValues(arr, obj) {
  const listIngredients = arr.map(({ ingredients }) => ingredients.map(({ ingredient }) => ingredient.toLowerCase())).flat().sort();
  const listAppliance = arr.map(({ appliance }) => appliance.toLowerCase()).sort();
  const listUtensils = arr.map(({ ustensils }) => ustensils.map((utensil) => utensil.toLowerCase())).flat().sort();
  const uniqueValue = [
    { list: [...new Set(listIngredients)], type: 'ingredients' },
    { list: [...new Set(listAppliance)], type: 'appliances' },
    { list: [...new Set(listUtensils)], type: 'utensils' },
  ];
  return Object.entries(obj).map(([filterType, filterValue]) => {
    for (const { list, type } of uniqueValue) {
      if (filterType === type) {
        return { list: list.filter((e) => e.includes(filterValue.toLowerCase())), type };
      }
    }
    return undefined;
  }).map(({ list, type }) => ({ list: list.map(capitalizeElement), type }));
}

function noResult(condition) {
  const noResult = document.querySelector('.none');
  if (condition) {
    noResult.style.display = 'none';
  } else {
    noResult.style.display = 'block';
  }
}

// display function is for displaying the recipes and the filters
const display = (recipesList, badges = []) => {
  noResult(recipesList.length);
  recipesContainer.innerHTML = getRecipes(recipesList);
  const uniqueValueWithFiltersValue = getUniqueValues(recipesList, filtersInputValue);
  uniqueValueWithFiltersValue.forEach((element) => {
    if (element.type === 'ingredients') IngredientsContainer.innerHTML = getFilter(element);
    else if (element.type === 'appliances') ApplianceContainer.innerHTML = getFilter(element);
    else if (element.type === 'utensils') UtensilsContainer.innerHTML = getFilter(element);
  });
  BadgesContainer.innerHTML = getBadges(badges);
};
display(recipes);

// search function is for getting recipes that match the search value
const search = (badges) => {
  const searchbarFilter = recipes.filter(({ name, ingredients, description }) => JSON.stringify({ name, ingredients, description }).toLowerCase().includes(searchValue));
  const filterRecipes = searchbarFilter.filter(({ ingredients, appliance, ustensils }) => {
    if (!badges.length) { return true; }
    return badges.every(({ name, type }) => {
      if (type === 'ingredients') { return ingredients.some(({ ingredient }) => ingredient.toLowerCase() === name.toLowerCase()); }
      if (type === 'appliances') { return appliance.toLowerCase() === name.toLowerCase(); }
      if (type === 'utensils') { return ustensils.some((utensil) => utensil.toLowerCase() === name.toLowerCase()); }
      return undefined;
    });
  });
  display(filterRecipes, badges);
};

// at the event of submit use the value of the input in search function
searchPanel.addEventListener('input', (event) => {
  // debugger;

  event.preventDefault();
  searchValue = event.target.value.trim().toLowerCase();
  if (searchValue.length > 2) {
    search(badges);
  }
  if (searchValue.length === 0) {
    search(badges);
  }
});

// at the event of click on the items add them to the badges
document.addEventListener('click', ({ target }) => {
  const badgeCloseBtn = target.closest('.badge');
  const filterOption = target.closest('.filter_option');

  if (filterOption) {
    const badgeExist = badges.some(({ name }) => name === target.innerText);
    if (!badgeExist) {
      badges.push({ type: target.dataset.type, name: target.innerText });
    } else {
      badges = badges.filter(({ name }) => name !== target.innerText);
    }
    search(badges);
  }
  if (badgeCloseBtn) {
    badges = badges.filter(({ name }) => name !== badgeCloseBtn.dataset.id);
    search(badges);
  }
});
const openFilter = (btn) => {
  const filters = document.querySelectorAll('.filter');
  filters.forEach((filter) => {
    if (filter !== btn.parentElement) {
      filter.classList.remove('open');
    } else {
      filter.classList.toggle('open');
    }
  });
};
document.addEventListener('click', ({ target }) => {
  if (target.classList.contains('fa-chevron-down')) {
    openFilter(target);
  }
});

filterInput.forEach((input) => {
  input.addEventListener('input', ({ target }) => {
    filtersInputValue[target.name] = target.value;
    search(badges);
  });
});
