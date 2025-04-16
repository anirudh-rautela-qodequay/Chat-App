importScripts("https://www.gstatic.com/firebasejs/8.10/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10/firebase-messaging.js");
// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUTpYHABfVQ7o5fW_EBcqD4zT7yALuytY",
  authDomain: "blog-6f332.firebaseapp.com",
  projectId: "blog-6f332",
  storageBucket: "blog-6f332.firebasestorage.app",
  messagingSenderId: "270195121086",
  appId: "1:270195121086:web:9b9c69d6d75a7b7623f7ef",
  measurementId: "G-1ELH75S07J",
  vapidKey:
    "BHSEhcxzloCVRByzjomPXk77qAG7bGWEcZBNag28y8hRps0cFMTmbe37ObNpxm41Pzlb2KSPgLFfiXWT4Dd0MOo",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message:",
    payload
  );
  const notificationTitle = payload.notification?.title;
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
