// IMPORTANT: Replace with your own Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyAg91kmj2wI_Jw0k-D64uXaB-9fe8XltSo",
    authDomain: "iman-expense-tracker.firebaseapp.com",
    projectId: "iman-expense-tracker",
    storageBucket: "iman-expense-tracker.firebasestorage.app",
    messagingSenderId: "1026441603962",
    appId: "1:1026441603962:web:e0156e94708f8c2625c4c3"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const googleProvider = new firebase.auth.GoogleAuthProvider(); 