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
    if (!washrooms_title[doc.id]) {
      washrooms_title[doc.id] = {};
    }

    washrooms_title[doc.id].title = doc.data().title;
    washrooms_title[doc.id].location = doc.data().location;
    washrooms_title[doc.id].safety_rating = doc.data().safety_rating;
    washrooms_title[doc.id].cleanliness_rating = doc.data().cleanliness_rating;
    washrooms_title[doc.id].amenities = doc.data().amenities;
    washrooms_title[doc.id].overall_rating = doc.data().overall_rating;
    washrooms_title[doc.id].user_photo = doc.data().user_photos[0];
  });
});

// Search function for title search
searchInput.addEventListener('input', () => {
  const searchTerms = searchInput.value;
  // if searchTerms is empty, remove all search results
  if (searchTerms === '') {
    while (searchResults.firstChild) {
      searchResults.removeChild(searchResults.firstChild);
    }
    searchInput.innerHTML = '';
    return;
  }

  while (searchResults.firstChild) {
    searchResults.removeChild(searchResults.firstChild);
  }
  searchInput.innerHTML = '';
  const searchTerm = searchTerms.toLowerCase();

  // Perform a search
  const results = performSearch(searchTerm);
  console.log(results);
  // Display the results
  results.forEach((result) => {
    const div = document.createElement('div');
    const safety = result.safety_rating > 4 ? "Safe" : "Not Safe";
    const safetyclass = result.safety_rating > 4 ? "safe" : "not-safe";
    const cleanliness = result.cleanliness_rating > 3.5 ? "Clean" : "Not Clean";
    const cleanlinessclass = result.cleanliness_rating > 3.5 ? "clean" : "not-clean";
    const overall_rating = result.overall_rating;
    div.innerHTML = `
      <div class="search-result decoration__data result-card">
      <img src="img/public.jpg" alt="user photo" class="result-card__image"> 
      <div class="result-card__rating"> <div> <i class="fa-regular fa-star"></i> ${overall_rating.toFixed(1)}</div> </div>
        <h1 class="decoration__title">${result.title}</h1>
        <div class="tabs">
          <div class="tab safety ${safetyclass}"> ${safety} </div>
          <div class="tab cleaniless ${cleanlinessclass}"> ${cleanliness}</div>
        </div>
        <div class="amenities"><div>Amenities</div><div class="amenities-icons">
        </div></div>
      </div>`;
    searchResults.appendChild(div);
    

    // add tooltip to icons

    // for amenities add icons related to amenties if amenity is true
    const amenitiesdiv = div.querySelector('.amenities-icons');
    if (result.amenities['accessible']) {

      amenitiesdiv.innerHTML += ` <i class="fa-solid fa-wheelchair fa-lg" title="Accessibility"></i>`;
    }
    if (result.amenities['baby_changing_facilities']) {
      amenitiesdiv.innerHTML += `<i class="fa-solid fa-baby fa-lg" title="Baby Changing"></i>`;
    }
    // if(result.amenities['hand_dryer']) {
    //   amenitiesdiv.innerHTML += `<i class="fa-solid fa-heat"></i>`;
    // }
    if(result.amenities['paper_towels']) {
      amenitiesdiv.innerHTML += `<i class="fa-solid fa-box-tissue fa-lg" title="Paper Towels"></i>`;
    }
    if(result.amenities['soap']) {
      amenitiesdiv.innerHTML += `<i class="fa-solid fa-soap fa-lg" title="Soap></i>`;
    }
    if(result.amenities['sanitary_napkin_disposal']) {
      amenitiesdiv.innerHTML += `<i class="fa-solid fa-link-simple fa-lg" title="Sanitary Napkin></i>`;
    }
    if(result.amenities['sanitizer']) {
      amenitiesdiv.innerHTML += `<i class="fa-solid fa-pump-medical fa-lg" title="Sanitizer"></i>`;
    }
    if(result.amenities['toilet_paper']) {
      amenitiesdiv.innerHTML += `<i class="fa-solid fa-toilet-paper fa-lg" title="Toilet Paper"></i>`;
    }
    if(result.amenities['eco_friendly']) {
      // add leaf in front of title
      const title = div.querySelector('.decoration__title');
      title.innerHTML = `<i class="fa-solid fa-leaf"></i> ${title.innerHTML}`;
    }

    // add event listener to each result card
    div.addEventListener('click', () => {
      // add washroom details to local storage
      localStorage.setItem('washroom', JSON.stringify(result));
      
      // redirect to washroom page
      window.location.href = 'singleWashroom.html';
    });

  })
});





function performSearch(searchTerm) {
  const washrooms = [];

  // Loop through all washrooms
  for (let washroom in washrooms_title) {
    // Check if the washroom title contains the search term
    if (washrooms_title[washroom].title.toLowerCase().includes(searchTerm)) {
      washrooms.push(washrooms_title[washroom]);
    }
  }
  
  // Sort the washrooms by title
  washrooms.sort((a, b) => {
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
    return 0;
  });

  // Return the first 10 washrooms
  console.log(washrooms);
  return washrooms.slice(0, 10);
}


// Search by Location
let currentLatitude;
let currentLongitude;

function searchByLocation(){
    
    return washrooms_location_title;
}



const errorCallback = (error) => {
  console.log(error);
};

// Search function for location search
searchInputLocation.addEventListener('click', () => {
  // get current location
  searchResultsLocation.innerHTML = '';
  
  navigator.geolocation.getCurrentPosition(position => {
        currentLatitude = position.coords['latitude'];
        currentLongitude = position.coords['longitude'];
        
        console.log(currentLatitude);
        console.log(Date.now());
    
        // Query all documents with a geopoint location within 1 kilometers of the user's location
        const radiusInKm = 10;
        
        getDocs(collectionRef).then((querySnapshot) => {
            console.log("Enter get docs"+Date.now());
          querySnapshot.forEach((doc) => {
            const doc_latitude = doc.data().location['_lat'];
            const doc_longitude = doc.data().location['_long'];
            
    
            const distanceInKm = calculateDistance(currentLatitude,currentLongitude,doc_latitude,doc_longitude);
            console.log(`${distanceInKm} km`);
            
            if (distanceInKm <= radiusInKm) {
              const safety = doc.data().safety_rating > 4 ? 'Safe' : 'Not Safe';
              const safeclassName = doc.data().safety_rating > 4 ? 'safe' : '';
              const cleanliness = doc.data().cleanliness_rating > 3.5 ? 'Clean' : 'Not Clean';
              const cleanclassName = doc.data().cleanliness_rating > 3.5 ? 'clean' : '';
              const overall_rating = doc.data().overall_rating
              const title = doc.data().title;
                // add card to search results
              const div = document.createElement('div');
              div.classList.add('decoration');
              div.innerHTML = `
                <div class="search-result decoration__data result-card">
                <img src="img/public.jpg" alt="user photo" class="result-card__image"> 
                <div class="result-card__rating"> <div> <i class="fa-regular fa-star"></i> ${overall_rating.toFixed(1)}</div> </div>
                  <h1 class="decoration__title">${title}</h1>
                  <div class="tabs">
                    <div class="tab safety ${safeclassName}  "> ${safety} </div>
                    <div class="tab cleaninless ${cleanclassName}"> ${cleanliness}</div>
                  </div>
                  <div class="amenities"><div>Amenities</div><div class="amenities-icons">
                  ${doc.data().amenities['accessible'] ? `<i class="fa-solid fa-wheelchair fa-lg" title="Accessible"></i>` : ''}
                  ${doc.data().amenities['baby_changing_facilities'] ? `<i class="fa-solid fa-baby fa-lg" title="Baby Changing Facilities"></i>` : ''}
                  ${doc.data().amenities['soap'] ? `<i class="fa-solid fa-soap fa-lg" title="Soap"></i>` : ''}
                  ${doc.data().amenities['sanitary_napkin_disposal'] ? `<i class="fa-solid fa-link-simple fa-lg" title="Sanitary Napkin"></i>` : ''}
                  ${doc.data().amenities['sanitizer'] ? `<i class="fa-solid fa-pump-medical fa-lg" title="Sanitizer"></i>` : ''}
                  ${doc.data().amenities['toilet_paper'] ? `<i class="fa-solid fa-toilet-paper fa-lg" title="Toilet Paper"></i>` : ''}
                  </div></div>
                </div>`;
              
              searchResultsLocation.appendChild(div);
            

              // add event listener to each result card
              div.addEventListener('click', () => {
                // add washroom details to local storage
                localStorage.setItem('washroom', JSON.stringify(doc.data()));
                
                // redirect to washroom page
                window.location.href = 'singleWashroom.html';
              }
              );
            }
          });
        });
    
    
  });
  
  function addTabDetails(safety, cleanliness){
    const safetydiv = document.querySelector('.safety');
    const cleandiv = document.querySelector('.clean');
    
    if (safety > 4) {
      // add style to safety div red if safety rating is less than 4 otherwise green
      safetydiv.classList.add('safe');
    } else {
      safetydiv.classList.add('not-safe');
    }

    if (cleanliness> 3.5) {
      // add style to clean div red if cleanliness rating is less than 3.5 otherwise green
      cleandiv.classList.add('clean');
    } else {
      cleandiv.classList.add('not-clean');
    }

  }
    
    
    
    
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