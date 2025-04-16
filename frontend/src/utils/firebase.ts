// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
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
const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);
// ✅ Request FCM token function
export const requestFCMToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: firebaseConfig.vapidKey,
      });
      console.log("FCM Token:", token);
      return token;
    } else {
      throw new Error("Notification permission not granted");
    }
  } catch (err) {
    console.error("Error fetching FCM token:", err);
    throw err;
  }
};

// ✅ Handle foreground notifications
onMessage(messaging, (payload) => {
  console.log("Received foreground message:", payload);
});
