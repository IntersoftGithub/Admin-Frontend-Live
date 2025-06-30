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


const messaging = firebase.messaging();

// Store dynamic storeId
self.storeId = null;
self.branchId = null;


self.addEventListener("message", (event) => {
  if (event.data?.type === "SET_STORE_ID") {
    self.storeId = event.data.storeId;
    console.log("📦 Received storeId:", self.storeId);
  }

  if (event.data?.type === "SET_USER_ID") {
    self.branchId = event.data.branchId;
    console.log("👤 Received branchId:", self.branchId);
  }
});

messaging.onBackgroundMessage((payload) => {
  console.log("🔔 Background message received:", payload);
  const targetStoreId = payload.data?.storeId;
  const targetUserId = payload.data?.branchId;

  
  if (targetStoreId === self.storeId && targetUserId === self.branchId) {
    const notificationTitle = payload.data.title || "New Notification";
    const notificationOptions = {
      body: payload.data.body || "Background Notification Body",
      icon: "/logo.png",
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
  } else {
    console.log(`❌ Mismatch: storeId or branchId`);
    console.log(`Expected: ${self.storeId} / ${self.branchId}`);
    console.log(`Received: ${targetStoreId} / ${targetUserId}`);
  }
});
