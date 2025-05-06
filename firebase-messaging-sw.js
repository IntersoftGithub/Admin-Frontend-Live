importScripts(
  "https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js"
);

// Initialize Firebase app
firebase.initializeApp({
  apiKey: "AIzaSyCe7sdnzeTLhqfs9m661Ny9bmT2jTTau8g",
  authDomain: "tappppfcm.firebaseapp.com",
  projectId: "tappppfcm",
  storageBucket: "tappppfcm.firebasestorage.app",
  messagingSenderId: "956124354371",
  appId: "1:956124354371:web:a150734724c6f2075bc1f6",
});

// const playLoginSound = () => {
//   const audio = new Audio('/sounds/notify.mp3'); // Ensure sound.mp3 is in the public folder
//   audio.play().catch(err => console.error("Error playing audio:", err));
// };

const messaging = firebase.messaging();

// Store dynamic storeId
self.storeId = null;

// Listen for postMessage to set storeId
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SET_STORE_ID") {
    self.storeId = event.data.storeId;
    console.log("📦 Service worker received storeId:", self.storeId);
  }
});

messaging.onBackgroundMessage((payload) => {
  console.log("🔔 Background message received:", payload);
  const targetStoreId = payload.data?.storeId;

  if (targetStoreId && self.storeId && targetStoreId === self.storeId) {
    const notificationTitle = payload.data.title || "New Notification";
    const notificationOptions = {
      body: payload.data.body || "Background Notification Body",
      icon: "/logo.png",
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
    // playLoginSound()

  } else {
    console.log(
      `❌ Store ID mismatch or not set: expected ${self.storeId}, got ${targetStoreId}`
    );
  }
});
