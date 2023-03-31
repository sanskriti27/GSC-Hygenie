// Importing the necessary properties and methods
import { db, collectionRef } from "./firebase.js"
import { getDocs, query, where } from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js'
import { getFirestore, collection , updateDoc} from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js'

// get title from local storage where object is washroom
const washroom = JSON.parse(localStorage.getItem('washroom'));
const washroomTitle = washroom.title;
//add washroomTitle inside washroom-title
const washroomTitleElement = document.querySelector('.washroom__title')
washroomTitleElement.innerHTML = washroomTitle;

const washroomrating = document.querySelector('.result__rating');
// add  <div> <i class="fa-regular fa-star"></i> ${washroom.overall_rating} </div> inside washroom-rating
const newDiv = document.createElement('div');
newDiv.innerHTML = `<i class="fa-regular fa-star"></i> ${washroom.overall_rating}`;
washroomrating.appendChild(newDiv) 


// Add information of current washroom to the page from local storage
const washroomLocation = document.getElementById('washroom-location');

// getting amenities from local storage and adding icons if they exist
const washroomAmenities = document.querySelector('.washroom-amenities-icons');
const amenities = washroom.amenities;

washroomAmenities.innerHTML = `<div class="amenities"><h4>Amenities</h4><div class="amenities-ico"></div></div>`;
const amenitiesdiv = document.querySelector('.amenities-ico');

    if (amenities.accessible) {

      amenitiesdiv.innerHTML += ` <i class="fa-solid fa-wheelchair fa-lg" title="Accessibility"></i>`;
    }
    if (amenities.baby_changing_facilities ) {
      amenitiesdiv.innerHTML += `<i class="fa-solid fa-baby fa-lg" title="Baby Changing"></i>`;
    }
    // if(amenities['hand_dryer']) {
    //   amenitiesdiv.innerHTML += `<i class="fa-solid fa-heat"></i>`;
    // }
    if(amenities.paper_towels) {
      amenitiesdiv.innerHTML += `<i class="fa-solid fa-box-tissue fa-lg" title="Paper Towels"></i>`;
    }
    if(amenities.soap) {
      amenitiesdiv.innerHTML += `<i class="fa-solid fa-soap fa-lg" title="Soap"></i>`;
    }
    if(amenities.sanitary_napkin_disposal) {
      amenitiesdiv.innerHTML += `<i class="fa-solid fa-link-simple fa-lg" title="Sanitary Napkin></i>`;
    }
    if(amenities.sanitizer) {
      amenitiesdiv.innerHTML += `<i class="fa-solid fa-pump-medical fa-lg" title="Sanitizer"></i>`;
    }
    if(amenities.toilet_paper) {
      amenitiesdiv.innerHTML += `<i class="fa-solid fa-toilet-paper fa-lg" title="Toilet Paper"></i>`;
    }

const getDirections = document.querySelector('.get-washroom-directions');
getDirections.addEventListener('click', () => {
  window.open(`https://www.google.com/maps/search/?api=1&query=${washroomTitle}`);
});

// redirect to report.html on clicking button with id get-report-option
const getReportOption = document.querySelector('.get-report-option');
getReportOption.addEventListener('click', () => {
  window.location.href = 'report.html';
});

// if overall rating is changed in firebase, update the rating on the page
function changeRating() {
  const overallRating = document.querySelector('.result__rating');
  const ratingRef = collection(db, "washrooms_hygenie");
  const q = query(ratingRef, where('title', '==', washroomTitle));
  getDocs(q).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      overallRating.innerHTML = `<div><i class="fa-regular fa-star"></i> ${parseFloat(doc.data().overall_rating).toFixed(1)}</div>`;
      // update in local storage
      washroom.overall_rating = parseFloat(doc.data().overall_rating).toFixed(1);
      localStorage.setItem('washroom', JSON.stringify(washroom));
    });
  });
}


// select the span that is clicked on and add the class selected to it and the previous siblings
const stars = document.querySelectorAll('.star');
// filter the star that is clicked on with data-rating
stars.forEach(star => {
  star.addEventListener('click', async () => {
    const rating = star.getAttribute('data-rating');
    // remove all the selected classes from the stars and add the class selected to the star that is clicked on and the previous siblings
    for (let i = 0; i < stars.length; i++) {
      stars[i].classList.remove('selected');
    }
    
    // add the class selected to the star that is clicked on and the previous siblings
    star.classList.add('selected');
    for (let i = 0; i < rating; i++) {
      stars[i].classList.add('selected');
    };

    const addRating = document.querySelector('.rating');
    addRating.innerHTML = parseFloat(rating).toFixed(1);

    // add the rating to the database const collectionRef = collection(db, "washrooms_hygenie");
    const washroomRef = collection(db, "washrooms_hygenie");
    // get the current overall rating from firebase using washroomRef and the title of the washroom
    const q = query(washroomRef, where('title', '==', washroomTitle));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const numberOfRatings = doc.data().number_of_ratings;
      const overallRating = numberOfRatings === 0 ? 0 : doc.data().overall_rating;
      const newNumberOfRatings = numberOfRatings + 1;
      const newSum = (overallRating * numberOfRatings)+parseFloat(rating);
      const newOverallRating =  newSum/newNumberOfRatings;
      
      // update the overall rating and number of ratings in firebase
      updateDoc(doc.ref, {
        overall_rating: newOverallRating,
        number_of_ratings: newNumberOfRatings
      });
    });

    changeRating();

  });
});

// Search function for title search
function searchByTitle(searchTerm) {
  // Query the collection for documents that match the search term
  return collectionRef.where('title', '==', searchTerm).get()
    .then(querySnapshot => {
      const results = [];
      querySnapshot.forEach(doc => {
        results.push({ id: doc.id, data: doc.data() });
      });
      return results;
    })
    .catch(error => {
      console.log('Error getting documents: ', error);
    });
}



// get washroom-map-title and add the title of the washroom to it
const washroomMapTitle = document.querySelector('.washroom-map-title');
washroomMapTitle.innerHTML = washroomTitle;



// call emergency number on click
const emergencyNumber = document.querySelector('.get-emergency-assistance');
emergencyNumber.addEventListener('click', () => {
  window.open(`tel:${102}`);
});