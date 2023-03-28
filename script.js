  import { collectionRef } from "./firebase.js"
  //console.log(db);
  
  
  // Read the data from the collection

getDocs(collectionRef).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  });

