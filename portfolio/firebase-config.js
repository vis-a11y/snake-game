/* ==========================================================================
   FIREBASE CONFIGURATION
   ========================================================================== */

// Paste your Firebase Web App configuration here. 
// You can obtain these keys by creating a free project in the Firebase Console:
// https://console.firebase.google.com/
//
// 1. Create a project.
// 2. Add a "Web App".
// 3. Enable "Cloud Firestore" database in test mode.
// 4. Paste the generated configuration object below.

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Check if Firebase has been configured by the developer
function isFirebaseConfigured() {
    return firebaseConfig && 
           firebaseConfig.projectId && 
           firebaseConfig.projectId !== "YOUR_PROJECT_ID" && 
           firebaseConfig.apiKey !== "YOUR_API_KEY";
}
