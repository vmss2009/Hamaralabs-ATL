import React from "react";
import { RouterProvider } from "react-router-dom";
import {query, onSnapshot, doc, collection, setDoc} from "firebase/firestore";

import {db} from "./firebase/firestore";


import Router from "./Router";
import HL_Logo from "./HL Sticker.png";
import LDSLoadingSpinner from "./components/LDSLoadingSpinner";
import { getFCMToken, onMessageListener } from "./firebase/cloudmessaging"; // Import the missing function
import 'reactjs-popup/dist/index.css'

let encodedAuth = localStorage.getItem("auth");

let email;
let uid;
let role;

if (encodedAuth != null) {
    let decodedAuth = atob(encodedAuth);

    let split = decodedAuth.split("-");

    uid = split[0];
    email = split[1];
    role = split[2];
    console.log(uid, email, role)

    if(email === null || uid === null || role === null || email === undefined || uid === undefined || role === undefined) {
        localStorage.clear();
        window.location.reload();
    }
}

function App() {
    const [showPopup, setShowPopup] = React.useState(true);

    onMessageListener().then(payload => {
        const title = payload.notification.title;
        const body = payload.notification.body;
        new Notification(title, {body});
        console.log(payload);
    }).catch(err => console.log('failed: ', err));

    React.useEffect(() => {
        if(localStorage.auth !== null && localStorage.auth !== undefined && localStorage.auth !== "") {
            const q = query(doc(db, "atlUsers", uid));
            onSnapshot(q, (snap) => {
                if(role !== snap.data().role) {
                    localStorage.setItem("auth", btoa(`${uid}-${email}-${snap.data().role}`));
                }
            });
        }

        // const q = query(collection(db, "schoolData"));
        // onSnapshot(q, (snaps) => {
        //     snaps.forEach(async snap => {
        //         if(snap.data().socialMediaLink === undefined) {
        //             let tempData = snap.data();
        //             tempData.socialMediaLink= [];
        //             // await setDoc(doc(db, "schoolData", snap.id), tempData);
        //         }
        //     })
        // })

        // const q = query(collection(db, "studentData"));
        // onSnapshot(q, (snaps) => {
        //     snaps.forEach(async snap => {
        //         let tempData = snap.data();
        //         tempData.class = Number(tempData.class);
        //         await setDoc(doc(db, "studentData", snap.id), tempData);
        //     })
        // });

        // const q = query(collection(db, "studentData"));
        // onSnapshot(q, async (snaps) => {
        //     snaps.forEach(async snap => {
        //         const snapData = {...snap.data()};
        //         const fNameSplit = snapData.name.firstName.split(" ");
        //         const lNameSplit = snapData.name.lastName.split(" ");
        //         let fName = "";
        //         let lName = "";
        //         fNameSplit.forEach(word => {
        //             if(fNameSplit.indexOf(word) === fNameSplit.length - 1) {
        //                 fName += lodash.upperFirst(lodash.lowerCase(word));
        //             } else {
        //                 fName += lodash.upperFirst(word) + " ";
        //             }
        //         });
        //
        //         lNameSplit.forEach(word => {
        //             if(lNameSplit.indexOf(word) === lNameSplit.length - 1) {
        //                 lName += lodash.upperFirst(lodash.lowerCase(word));
        //             } else {
        //                 lName += lodash.upperFirst(word) + " ";
        //             }
        //         });
        //
        //         snapData.name.firstName = fName;
        //         snapData.name.lastName = lName;
        //
        //         await setDoc(snap.ref, snapData);
        //     });
        // });
    }, []);
    
    console.log(Notification.permission); 

    if ((Notification.permission === "denied" || Notification.permission === "default") && showPopup === true && localStorage.getItem("auth") !== null) {
        return (
            <div 
                className="popup-container"
                style={showPopup ? {
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
                } : { display: 'none' }}>
                <div 
                className="popup" 
                style={{
                    backgroundColor: '#fff',
                    minWidth: '300px', // Set a minimum width
                    maxWidth: '500px', // Optional max width
                    padding: '30px',   // More padding
                    borderRadius: '8px',
                    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.3)' // Stronger shadow
                }}
                >
                <h3>Enable Notifications?</h3> {/* Example heading */}
                <p>Get updates on new features and important announcements.</p> 
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <button onClick={() => {setShowPopup(false)}}>Later</button> 
                    <button onClick={async () => {
                       await getFCMToken();
                        setShowPopup(false);
                    }}>Enable</button> 
                </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <React.Suspense fallback={<FallBack />}>
                <RouterProvider router={Router} />
            </React.Suspense>
        </div>
    );
}

function FallBack() {
    return <div style={{backgroundColor: "#a1e1ff", color: "#000"}}>
        <div style={{width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center"}}>
            <div style={{display: "block", fontSize: "1.2rem", width: "10%"}}>
                <div className="zoom-in-out-box" style={{position: "relative"}}>
                    <img src={HL_Logo} alt="HamaraLabs Sticker" height="60" draggable={false} onContextMenu={e => e.preventDefault()} />
                </div>
                <br/>
                <span style={{position: "relative", right: "0.8rem"}}>
                    Loading site...
                </span>
            </div>
        </div>
        <center style={{width: "100%", position: "absolute", bottom: "3rem", left: "-2.3%", color: "#000"}}>
            <LDSLoadingSpinner />
        </center>
    </div>;
}

export default App;
export {FallBack};
