// Importing the necessary properties and methods
import {db, collectionRef} from "./firebase.js"
import { getDocs, query, where } from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js'

// Capturing DOM elements in variables 
const searchInput = document.getElementById('search-input-title');
const searchResults = document.getElementById('search-results-title');
const searchInputLocation = document.getElementById('search-input-location');
const searchResultsLocation = document.getElementById('search-results-location');

//Array for storing all washrooms by title
let washrooms_title = {};
//Array for storing all washrooms within 10km radius
let washrooms_location_title = [];

// Querying through the entire collection to add washroom IDs by title in the search
getDocs(collectionRef).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data().title);
      if (!washrooms_title[doc.id]) {
        washrooms_title[doc.id] = [];
      }
      washrooms_title[doc.id].push(doc.data().title);
    });
});

// Search function for title search
searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.toLowerCase();
  searchResults.innerHTML = '';

  // Perform a search
  const results = performSearch(searchTerm);

  // Display the results
  results.forEach(result => {
    const li = document.createElement('li');
    li.textContent = result;
    searchResults.appendChild(li);
  });
});

function performSearch(searchTerm) {
  let data = [];
  const washroomNames = [];

for (const key in washrooms_title) {
  if (Object.hasOwnProperty.call(washrooms_title, key)) {
    const value = washrooms_title[key];
    washroomNames.push(value[0]);
  }
}

data = washroomNames;
return data.filter(item => item.toLowerCase().includes(searchTerm));

}


// Search by Location
let currentLatitude;
let currentLongitude;

function searchByLocation(){
    
    return washrooms_location_title;
}


// Search function for title search
searchInputLocation.addEventListener('click', () => {
    console.log("Enter event listener" + Date.now());
    navigator.geolocation.getCurrentPosition(position => {
        currentLatitude = position.coords['latitude'];
        currentLongitude = position.coords['longitude'];
        
        console.log(currentLatitude);
        console.log(Date.now());
    
        // Query all documents with a geopoint location within 10 kilometers of the user's location
        const radiusInKm = 10;
        
        getDocs(collectionRef).then((querySnapshot) => {
            console.log("Enter get docs"+Date.now());
          querySnapshot.forEach((doc) => {
            const doc_latitude = doc.data().location['_lat'];
            const doc_longitude = doc.data().location['_long'];
            
            //console.log(`The current latitude is ${currentLatitude} and the current longitude is ${currentLongitude}. The longitude of the destination is ${doc_longitude} and the latitude of the destination is ${doc_latitude}. What is the distance between them according to this piece of code?`)
    
            const distanceInKm = calculateDistance(currentLatitude,currentLongitude,doc_latitude,doc_longitude);
            console.log(`${distanceInKm} km`);
            
            if(distanceInKm<=radiusInKm){
                console.log("yes");
                //washrooms_location_title.push(doc.data().title);
                // Display the results
                const li = document.createElement('li');
                li.textContent = doc.data().title;
                searchResultsLocation.appendChild(li);
            }
          });
        });
    
    
      });
    function calculateDistance(currentLatitude, currentLongitude, docLatitude, docLongitude) {
        console.log("enter calc dis"+Date.now());
    
        const earthRadiusKm = 6371;
      
        const dLat = toRadians(docLatitude - currentLatitude);
        const dLon = toRadians(docLongitude - currentLongitude);
      
        const lat1 = toRadians(currentLatitude);
        const lat2 = toRadians(docLatitude);
      
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      
        return earthRadiusKm * c;
    }
      
    function toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

});