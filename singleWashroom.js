// Importing the necessary properties and methods
import {db, collectionRef} from "./firebase.js"
import { getDocs, query, where } from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js'

// Adding Ratings
const stars = document.querySelectorAll('.star');
stars.forEach(star => {
  star.addEventListener('click', () => {
    const rating = star.getAttribute('data-rating');
    document.getElementById('rating').value = rating;
    star.classList.add('selected');
    star.previousElementSibling.classList.add('selected');
    star.previousElementSibling.previousElementSibling.classList.add('selected');
    star.previousElementSibling.previousElementSibling.previousElementSibling.classList.add('selected');
    star.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.classList.add('selected');
    const numStars = document.getElementById('rating').value;
    console.log(`Number of stars selected: ${numStars}`);
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





