importScripts(
  "https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCe7sdnzeTLhqfs9m661Ny9bmT2jTTau8g",
  authDomain: "tappppfcm.firebaseapp.com",
  projectId: "tappppfcm",
  storageBucket: "tappppfcm.firebasestorage.app",
  messagingSenderId: "956124354371",
  appId: "1:956124354371:web:a150734724c6f2075bc1f6",
});

const messaging = firebase.messaging();

// Utility function to get storeId from IndexedDB
async function getStoreId() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("localforage"); // localforage default db name if you used it (otherwise your DB name)
    request.onsuccess = function (event) {
      const db = event.target.result;
      const tx = db.transaction("keyvaluepairs", "readonly"); // localforage default object store
      const store = tx.objectStore("keyvaluepairs");
      const getRequest = store.get("storeId"); // Key you saved
      getRequest.onsuccess = function (e) {
        resolve(e.target.result);
      };
      getRequest.onerror = function (e) {
        reject(e);
      };
    };
    request.onerror = function (event) {
      reject(event);
    };
  });
}

messaging.onBackgroundMessage(async (payload) => {
  console.log("🔔 Background message received:", payload);

  const targetStoreId = payload.data?.storeId;
  const currentStoreId = await getStoreId(); // 💥 get storeId dynamically

  if (targetStoreId === currentStoreId) {
    const notificationTitle =
      payload.data.title || "Background Notification Title";
    const notificationOptions = {
      body: payload.data.body || "Background Notification Body",
      icon: "/logo.png",
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  } else {
    console.log(
      `❌ Store ID mismatch: expected ${currentStoreId}, got ${targetStoreId}`
    );
  }
});
