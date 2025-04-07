
  // public/sw.js

  self.addEventListener("install", (event) => {
    console.log("[ServiceWorker] Installed");
  });
  
  self.addEventListener("activate", (event) => {
    console.log("[ServiceWorker] Activated");
  });
  
  self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(clients.matchAll({ type: "window" }).then((clientList) => {
      if (clients.openWindow) {
        return clients.openWindow("/");
      }
    }));
  });
  



self.addEventListener("push", (event) => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || "New Notification";
    const options = {
      body: data.body || "You have a new update!",
      icon: "/icon.png", // Add an icon for notifications
    };
  
    event.waitUntil(self.registration.showNotification(title, options));
  });
  

  