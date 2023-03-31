import {db, collectionRef} from "./firebase.js"
import { getDocs, query, where } from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js'
import { getFirestore, collection , updateDoc} from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js'

var myForm = document.getElementById("form_report");

myForm.addEventListener("submit",async function (event) {
    event.preventDefault();
    var formData = new FormData(myForm);
    // if check box is checked set value to true, else set value to false do for all check boxes
    const checkBoxes = document.querySelectorAll('input[type="checkbox"]');
    checkBoxes.forEach((checkBox) => {
        if (checkBox.checked) {
            formData.set(checkBox.name, true);
        } else {
            formData.set(checkBox.name, false);
        }
    });

    // make a string of the form data to send to the server, checkboxes names and values are separated by a comma
    var review = "";
    var image = "";
    for (var pair of formData.entries()) {
        if (pair[0] == 'image') {
            image = pair[1];
            continue;
        }
        if (pair[1] == 'true' && pair[0] != 'other') {
            review += pair[0] + ", ";
        }else if (pair[1].length > 0 && pair[1] != 'false') {
            review += pair[1] + ", ";
        }
    }
    review = review.slice(0, -1);

    // get  title from local storage under washroom
    const washroom = localStorage.getItem("washroom");
    const washroomObj = JSON.parse(washroom);
    const title = washroomObj.title;

    // get collection name firebase
    const collectionRef = collection(db, "washrooms_hygenie");

    const q = query(collectionRef, where("title", "==", title));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
          // Get the current reviews array from the document
            const currentReviews = doc.data().reviews;
            // Add the new review to the array
            const newReviews = [...currentReviews, review];
            // Update the "reviews" field of the document with the new array
        const docRef = doc.ref;
        updateDoc(docRef, { reviews: newReviews });

    });
    
    myForm.reset();
    // redirect to singleWashroom.html
    window.location.href = 'singleWashroom.html';
});
