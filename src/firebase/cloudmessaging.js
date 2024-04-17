import { getMessaging, getToken, onMessage } from "firebase/messaging";
import fbApp from "./app";
import { doc, getDoc, setDoc, query, collection, onSnapshot, where, getDocs } from "firebase/firestore";
import { db } from "./firestore";
import axios from "axios";

const messaging = getMessaging(fbApp);

const checkForTokens = (tokensList, currentToken) => {
  console.log(tokensList, currentToken);
  if (tokensList !== undefined && currentToken !== "" ) {
    for (let i = 0; i <= tokensList.length; i++) {
      if (tokensList[i] === currentToken) {
        return true;
      } else {
        console.log("Hello");
        return false;
      }
    }
  } else {
    console.log("Not working");
  }
}

export const getFCMToken = async () => {
  const split = atob(localStorage.getItem("auth")).split("-");
  const uid = split[0];
  const currentUserRef = doc(db, "atlUsers", uid);
  const currentUserData = await getDoc(currentUserRef);
  console.log(currentUserData.data());
  const currentUserFCMToken = currentUserData.data().notificationFCMToken;

  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      return getToken(messaging, {
        vapidKey:
          "BOnaJqnwQB7TRle8WAOvLCVSuMuGXGcSWJ3hFTMSiAgH7VNDNm0uOQKnbh8fZMXe9EXIjLpKj5uB4ubN_n4AFx4",
      })
        .then((currentToken) => {
          console.log("current token for client: ", currentToken);
          if (currentToken) {
            if (checkForTokens(currentUserFCMToken, currentToken) === true) {
              console.log("current token for client: ", currentToken);
            } else if (checkForTokens(currentUserFCMToken, currentToken) === false) {
              // if the current device's FCM token is not equal to the stored one
              const temp = currentUserFCMToken;

              temp.push(currentToken);
              setDoc(
                  currentUserRef,
                  { notificationFCMToken: temp },
                  { merge: true });
              
            } else {
              // if the FCM token is not stored
              setDoc(
                currentUserRef,
                { notificationFCMToken: [currentToken] },
                { merge: true }
              );
            }
          } else {
            console.log(
              "No registration token available. Request permission to generate one."
            );
          }
        })
        .catch((err) => {
          console.log("An error occurred while retrieving token. ", err);
        });
      }
  });
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export const sendMessage = async (FCMToken, title, body) => {
  console.log(FCMToken);
  await axios
    .post("https://us-central1-hamaralabs-dev.cloudfunctions.net/cloudmessaging/submit", {
      FCMToken: FCMToken,
      title: title,
      body: body,
    })
};

export const notificationsToAdmins = async (title, body) => {
  const q = query(collection(db, "atlUsers"), where("role", "==", "admin"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async (docSnap) => {
    const snapData = docSnap.data();
      if (snapData.notificationFCMToken !== undefined) {
        // console.log(snapData.notificationFCMToken, snapData.name);
        await sendMessage(snapData.notificationFCMToken, title, body);
        setTimeout(1000);
      }
      let notifications = [];

      if (snapData.notifications !== undefined) {
          notifications = snapData.notifications;
      }

      notifications.push({
          title: title,
          body: body
      });

      setDoc(doc(db, "atlUsers", docSnap.id), { notifications: notifications }, { merge: true });
  });
}

export const notificationsToUser = async (userRef, title, body) => {
  const userDoc = await getDoc(userRef);
  const user = userDoc.data();
  let notifications = [];

  if (user.notifications !== undefined) {
    notifications = user.notifications;
  }

  notifications.push({
    title: title,
    body: body
  });

  if (user.notificationFCMToken !== undefined) {
    await sendMessage(user.notificationFCMToken, title, body);
  }

  setDoc(userRef, { notifications: notifications }, { merge: true });
}