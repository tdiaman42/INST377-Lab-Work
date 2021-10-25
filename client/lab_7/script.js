/* eslint-disable no-unused-vars */
const mymap = L.map('mapid').setView([38.980, -76.92799], 13);
const ACCESSTOKEN = 'pk.eyJ1IjoibWZmMjY2MiIsImEiOiJja3Y1OHB3MzIxODQ3Mm9sMGl2NjM1MXRkIn0.t4S8jq5OD9zZ4rFtsURuCQ';
const searchInput = document.querySelector('.search');
const suggestions = document.querySelector('.suggestions');

async function dataHandler() {
  const endpoint = 'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json';
  const request = await fetch(endpoint);
  const data = await request.json();
  console.log(data);

  // eslint-disable-next-line no-shadow
  function findMatches(wordToMatch, data) {
    return data.filter((place) => {
      const regex = new RegExp(wordToMatch, 'gi');
      return place.zip.match(regex);
    });
    // eslint-disable-next-line no-unreachable
    suggestions.innerHTML = '';
  }

  function fillterlist(event) {
    const matchArray = findMatches(event.target.value, data).slice(0, 5);
    return matchArray;
  }
  function displayMatches(event) {
    const matchArray = findMatches(event.target.value, data).slice(0, 5);
    if (matchArray) {
      const html = matchArray
        .map((place) => {
          const regexp = new RegExp(event.target.value, 'gi');
          return `
                  <ul>
                    <li><div class="name">${place.name}</div></li>
                    <div class="category">${place.category}</div>
                    <div class="address">${place.address_line_1}</div>
                    <div class="city">${place.city}</div>
                    <div class="zip">${place.zip}</div>
                  </ul>
                  <br></br>          
                    `;
        })
        .join('');
      suggestions.innerHTML = html;
    }
  }

  L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${ACCESSTOKEN}`, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    ACCESSTOKEN: 'pk.eyJ1IjoibWZmMjY2MiIsImEiOiJja3Y1OHB3MzIxODQ3Mm9sMGl2NjM1MXRkIn0.t4S8jq5OD9zZ4rFtsURuCQ'
  }).addTo(mymap);

  function mapInint(event) {
    const slicedArray = fillterlist(event);
    slicedArray.forEach((element) => {
      console.log(element.geocoded_column_1.coordinates);
      const point = element.geocoded_column_1;
      const latLong = point.coordinates;
      const marker = latLong.reverse();
      L.marker(marker).addTo(mymap);
    });
  }

  searchInput.addEventListener('input', (evt) => {
    if (searchInput.value === '' || searchInput.value === null) {
      suggestions.innerHTML = '';
    } else {
      fillterlist(evt);
      mapInint(evt);
      displayMatches(evt);
    }
  });
}

window.onload = dataHandler;