// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyB9u1zSS3_c6ZRbFW88WRQIfyLIwErM4ZM",
  authDomain: "hamaralabs-dev.firebaseapp.com",
  projectId: "hamaralabs-dev",
  storageBucket: "hamaralabs-dev.appspot.com",
  messagingSenderId: "448380008541",
  appId: "1:448380008541:web:54db6579359284eceb35b4",
  measurementId: "G-G3XN01TVJR"
  };

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});