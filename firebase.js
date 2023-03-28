
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-analytics.js";
  import { getAuth } from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js'
  import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js'

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

 const firebaseConfig = {
    apiKey: "AIzaSyD6x8hSeYMcn9--U8x99Jgo0Aag2p_7XTQ",
    authDomain: "hygenie-4baba.firebaseapp.com",
    databaseURL: "https://hygenie-4baba-default-rtdb.firebaseio.com",
    projectId: "hygenie-4baba",
    storageBucket: "hygenie-4baba.appspot.com",
    messagingSenderId: "134088174203",
    appId: "1:134088174203:web:e0ca7b3a4d4b84bd0f10de",
    measurementId: "G-G1BZETQP1Q"
  };

  const app = initializeApp(firebaseConfig);
  export const db = getFirestore(app);
  export var collectionRef = collection(db, "washrooms_hygenie");
