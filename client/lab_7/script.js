/* eslint-disable indent */
/* eslint-disable max-len */
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
    const coords = [];

    (results || []).splice(0, 25).forEach((restaurant) => {
      const tr = document.createElement('tr');

      tr.innerHTML = `<td>${resturant.name.toUpperCase()}</td><td>${restaurant.city}</td><td>${restaurant.state}</td><td>${restaurant.zip}</td><td>${restaurant.type}</td>`
        .replace(regex, `<b class='has-background-info'>${term.toUpperCase()}</b>`);

      fragment.appendChild(tr);
      coords.push([restaurant.name.toUpperCase(), restaurant.geocoded_column_1.coordinates]);
    });

    tableResults.innerHTML = '';
    tableResults = appendChild(fragment);

    buildMarkers(coords);
  }

  function buildMarkers(locations = []) {
    markers.forEach((m) => map.removeLayer(m));
    markers = [];
    if (!locations || locations.length <= 0) {
      map.setView([38.83986, -76.941642], 5);
      return;
    }
    locations.forEach((loc) => {
      markers.push(new L.Marker([loc[1][1], loc[1][0]], {draggable: false}).bindPopup(loc[0]).openPopup());
    });
    markers.forEach((m) => map.addLayer(m));
    map.setView([locations[0][1][1], locations[0][1][0]], 12);

    searchForm.onsubmit = (e) => {
      e.preventDefault();
      e.stopPropagation();
      findMatches(e, data);
    };
    searchTerm.onsubmit = (e) => {
      e.preventDefault();
      e.stopPropagation();
      findMatches(e, data);
    };
    searchTerm.onkeyup = (e) => findMatches(e, data);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: '',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoiYW1hdHR1IiwiYSI6ImNrdWw1eGxheTNldGUydXFsbjBpcm52M28ifQ.vm917QE5p4Dk7wvHRRLwUw'
    }).addTo(map);
    map.setView([38.83986, -76.941642], 5);
  }

  window.onload = (e) => setup();
 }