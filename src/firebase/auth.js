import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, AuthErrorCodes } from "firebase/auth";

import fbApp from "./app";
import {doc, setDoc} from "firebase/firestore";
import db from "./firestore";

const fbAuth = getAuth(fbApp);

async function signIn(email, password, setEmail, setPassword) {
    let authStatus = await signInWithEmailAndPassword(fbAuth, email, password)
        .catch((err) => {
            console.log(err.code);
            document.getElementById("loading-overlay").classList.remove("active");
            if(err.code === AuthErrorCodes.INVALID_EMAIL || err.code === "auth/user-not-found") {
                alert("Invalid Email");
                setEmail("");
            } else if(err.code === AuthErrorCodes.INVALID_PASSWORD) {
                alert("Invalid Password");
                setPassword("");
            } else if(err.code === AuthErrorCodes.USER_DISABLED) {
                alert("Your account has been disabled by Admin");
                setEmail("");
                setPassword("");
            }
        });

    return authStatus;
}

async function sendResetEmail(email) {
    return await sendPasswordResetEmail(fbAuth, email);
}

async function createAuthAccount(email, password, name, role) {
    const userCredential = await createUserWithEmailAndPassword(fbAuth, email, password);
    const userDocRef = doc(db, "atlUsers", userCredential.user.uid);

    await setDoc(userDocRef, {
        email: email,
        name: name,
        role: role,
        uid: userCredential.user.uid
    });
}

async function createAuthAccountAndChangePassword(email, password, name, role) {
    const userCredential = await createUserWithEmailAndPassword(fbAuth, email, password);
    const userDocRef = doc(db, "atlUsers", userCredential.user.uid);

    await setDoc(userDocRef, {
        email: email,
        name: name,
        role: role,
        uid: userCredential.user.uid
    });

    await sendPasswordResetEmail(fbAuth, email);
}

export default fbAuth;

export { signIn, sendResetEmail, createAuthAccount, createAuthAccountAndChangePassword };
