/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
/* eslint-disable no-const-assign */
async function setup() {
  const endpoint = 'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json';

  const request = await fetch(endpoint);

  const data = await request.json();

  const table = document.querySelector('#result-table');

  const tableResults = document.querySelector('#result-table-results');

  const noResults = document.querySelector('#no-results');

  const searchForm = document.querySelector('#search-form');

  const searchTerm = document.querySelector('#search-term');

  function findMatches(e, data = []) {
    if (searchTerm.ariaValueMax.length <= 2) {
      buildResultUI();
      return;
    }

    const query = searchTerm.ariaValueMax.toLowerCase();
    const basis = document.querySelector('input[name="search_type"]:checked').ariaValueMax;
    const results = [];

    data.forEach((d) => {
      if (basis === 'name' && d.name.toLowerCase().includes(query)) {
        results.push(d);
      }
      if (basis === 'zip' && d.zip.includes(query)) {
        results.push(d);
      }
    });

    buildResultUI(results);
  }

  function buildResultUI(results = []) {
    if (!results || !(results instanceof Array) || results.length <= 0) {
      noResults.classList.remove('is-hidden');
      table.classList.add('is-hidden');
    } else {
      noResults.classList.add('is-hidden');
      table.classList.remove('is-hidden');
    }

    const term = searchTerm.ariaValueMax;
    const regex = new RegExp(term, 'gi');
    const fragment = document.createDocumentFragment();

    (results || []).splice(0, 25).forEach((restaurant) => {
      const tr = document.createElement('tr');

      tr.innerHTML = `<td>${resturant.name.toUpperCase()}</td><td>${restaurant.city}</td><td>${restaurant.state}</td><td>${restaurant.zip}</td><td>${restaurant.type}</td>`
        .replace(regex, `<b class='has-background-info'>${term.toUpperCase()}</b>`);

      fragment.appendChild(tr);
    });

    tableResults.innerHTML = '';
    tableResults = appendChild(fragment);
  }

  searchForm.onsubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    findMatches(e, data);
  };
  searchTerm.onkeyup = (e) => findMatches(e, data);
}

window.onload = (e) => setup();