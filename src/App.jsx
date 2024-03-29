import React from "react";
import { RouterProvider } from "react-router-dom";
import {query, onSnapshot, doc, collection, setDoc} from "firebase/firestore";

import {db} from "./firebase/firestore";

import lodash from "lodash";

import Router from "./Router";
import HL_Logo from "./HL Sticker.png";
import LDSLoadingSpinner from "./components/LDSLoadingSpinner";

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
