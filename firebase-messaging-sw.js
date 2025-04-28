// Import Firebase libraries
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

// Initialize Firebase messaging
const messaging = firebase.messaging();

// Utility function to get storeId from IndexedDB safely
async function getStoreId() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("localforage"); // Default localforage DB name

    request.onsuccess = function (event) {
      const db = event.target.result;

      // Check if the expected object store exists
      if (!db.objectStoreNames.contains("keyvaluepairs")) {
        console.warn("⚠️ Object store 'keyvaluepairs' not found in IndexedDB.");
        resolve(null); // Resolve with null so it doesn't crash
        return;
      }

      const tx = db.transaction("keyvaluepairs", "readonly");
      const store = tx.objectStore("keyvaluepairs");
      const getRequest = store.get("storeId"); // Get the 'storeId' key

      getRequest.onsuccess = function (e) {
        resolve(e.target.result); // Found storeId
      };
      getRequest.onerror = function (e) {
        console.error("❌ Error fetching storeId from IndexedDB:", e);
        reject(e); // Some error happened
      };
    };

    request.onerror = function (event) {
      console.error("❌ Error opening IndexedDB:", event);
      reject(event);
    };
  });
}

// Listen for background messages
messaging.onBackgroundMessage(async (payload) => {
  console.log("🔔 Background message received:", payload);

  try {
    const targetStoreId = payload.data?.storeId;
    const currentStoreId = await getStoreId(); // Get storeId dynamically

    if (!currentStoreId) {
      console.warn("⚠️ No currentStoreId found, skipping notification.");
      return;
    }

    if (targetStoreId === currentStoreId) {
      const notificationTitle =
        payload.data.title || "Background Notification Title";
      const notificationOptions = {
        body: payload.data.body || "Background Notification Body",
        icon: "/logo.png", // Icon for notification
      };

      // Show the notification
      self.registration.showNotification(notificationTitle, notificationOptions);
    } else {
      console.log(
        `❌ Store ID mismatch: expected ${currentStoreId}, got ${targetStoreId}`
      );
    }
  } catch (error) {
    console.error("❌ Error handling background message:", error);
  }
});
