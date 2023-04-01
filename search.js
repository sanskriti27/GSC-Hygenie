// Importing the necessary properties and methods
import {db, collectionRef} from "./firebase.js"
import { getDocs, query, where, collection } from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js'

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
        
    
        // Query all documents with a geopoint location within 1 kilometers of the user's location
        const radiusInKm = 10;
        
        getDocs(collectionRef).then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const doc_latitude = doc.data().location['_lat'];
            const doc_longitude = doc.data().location['_long'];
            
    
            const distanceInKm = calculateDistance(currentLatitude,currentLongitude,doc_latitude,doc_longitude);
            
            if (distanceInKm <= radiusInKm) {
              var isSafe = 'true';
              var isClean = 'true';
              const reviews = doc.data().reviews.filter(review => review.length > 0);
              if (reviews.length === 0) {
                isSafe = 'true';
                isClean = 'true';
              } else {
                const sentimentAnalysis = localStorage.getItem(doc.data().title);
                const sentimentAnalysisData = JSON.parse(sentimentAnalysis);
                if(sentimentAnalysisData) {
                  isSafe = sentimentAnalysisData.isSafe;
                  isClean = sentimentAnalysisData.isClean;
                } else {
                  fetch(`https://toiletdescription.pythonanywhere.com/predict/${reviews}`)
                    .then(response => response.json())
                    .then(data => {
                      isSafe = data.isSafe;
                      isClean = data.isClean;
                      localStorage.setItem(doc.data().title, JSON.stringify(data));
                    });
                }
              }

              
              const clean = isClean=== 'true' ? 'Clean' : 'Not Clean';
              const safe = isSafe=== 'true' ? 'Safe' : 'Not Safe';
              const cleanclassName = isClean=== 'true' ? 'clean' : 'not-clean';
              const safeclassName = isSafe=== 'true' ? 'safe' : 'not-safe';
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
                    <div class="tab ${safeclassName}"> ${safe} </div>
                    <div class="tab ${cleanclassName}"> ${clean}</div>
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

// handle when a result is fetched but before that backspace is pressed
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Backspace') {
    searchResults.innerHTML = '';
  }
});

// Search function for name search as user types
searchInput.addEventListener('input', (e) => {
  // if backspace is pressed, clear search results
  searchResults.innerHTML = ''; 
  

  const searchValue = searchInput.value.toLowerCase();
  if (searchValue.length === 0) return;
    // get washroom data from firebase and filter by search input washrooms from firebase
  getDocs(collectionRef).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      if (doc.data().title.toLowerCase().includes(searchValue)) {
        // add card to search results display washrooms, safe and clean changes according to the sentiment analysis of the reviews of the washroom from python server
        displayWashrooms([doc.data()]);
      }
    });
  });


});


const displayWashrooms = (washrooms) => {
  // clear search results
  searchResults.innerHTML = '';

// match the washrooms with the search input get data from firebase and display washrooms, get safe and clean changes according to the sentiment analysis of the reviews from python server
  washrooms.forEach((washroom) => {
    // get sentiment analysis either from local storage or from python server
    let isSafe = 'true';
    let isClean = 'true';
    if (washroom.reviews) {
      const sentimentAnalysis = localStorage.getItem(washroom.title);
      const sentimentAnalysisData = JSON.parse(sentimentAnalysis);
      if (sentimentAnalysisData) {
        isSafe = sentimentAnalysisData.isSafe;
        isClean = sentimentAnalysisData.isClean;
      } else {
        fetch(`https://toiletdescription.pythonanywhere.com/predict/${washroom.reviews}`)
          .then((response) => response.json())
          .then((data) => {
            isSafe = data.isSafe;
            isClean = data.isClean;
            localStorage.setItem(washroom.title, JSON.stringify(data));
          });
      }
    } else {
      isSafe = 'false';
      isClean = 'false';
    }
    const cleanclassName = isClean === 'true' ? 'clean' : 'not-clean';
    const safeclassName = isSafe === 'true' ? 'safe' : 'not-safe';
    const safe = isSafe === 'true' ? 'Safe' : 'Not Safe';
    const clean = isClean === 'true' ? 'Clean' : 'Not Clean';
    const div = document.createElement('div');
    div.classList.add('decoration');
    div.innerHTML = `
      <div class="search-result decoration__data result-card">
        <img src="img/public.jpg" alt="user photo" class="result-card__image">
        <div class="result-card__rating"> <div> <i class="fa-regular fa-star"></i> ${washroom.overall_rating.toFixed(1)}</div> </div>
        <h1 class="decoration__title">${washroom.title}</h1>
        <div class="tabs">
          <div class="tab ${safeclassName}">${safe}</div>
          <div class="tab ${cleanclassName}">${clean}</div>
        </div>
        <div class="amenities"><div>Amenities</div><div class="amenities-icons">
          ${washroom.amenities['accessible'] ? `<i class="fa-solid fa-wheelchair fa-lg" title="Accessible"></i>` : ''}
          ${washroom.amenities['sanitary_napkin_disposal'] ? `<i class="fa-solid fa-link-simple fa-lg" title="Sanitary Napkin"></i>` : ''}
          ${washroom.amenities['baby_changing_facilities'] ? `<i class="fa-solid fa-baby fa-lg" title="Baby Changing Table"></i>` : ''}
          ${washroom.amenities['toilet_paper'] ? `<i class="fa-solid fa-toilet-paper fa-lg" title="Toilet Paper"></i>` : ''}
          ${washroom.amenities['hand_sanitizer'] ? `<i class="fa-solid fa-hand-sanitizer fa-lg" title="Hand Sanitizer"></i>` : ''}
          ${washroom.amenities['soap'] ? `<i class="fa-solid fa-soap fa-lg" title="Soap"></i>` : ''}
          ${washroom.amenities['tissue_paper'] ? `<i class="fa-solid fa-tissue fa-lg" title="Tissue Paper"></i>` : ''}
        </div>
        </div>
      </div>
    `;
    searchResults.appendChild(div);
    // add event listener to each result card
    div.addEventListener('click', () => {
      // add washroom details to local storage
      localStorage.setItem('washroom', JSON.stringify(washroom));
      // redirect to washroom page
      window.location.href = 'singleWashroom.html';
    }
    ); 
  });
};