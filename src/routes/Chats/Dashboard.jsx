import React, { useEffect } from "react";
import {doc, query, onSnapshot, addDoc, collection, setDoc, where, getDocs, getDoc} from "firebase/firestore";

import {db} from "../../firebase/firestore";
import Sidebar from "../../components/Sidebar";

function Dashboard() {
    const [userData, setUserData] = React.useState({});

    let encodedAuth = localStorage.getItem("auth");

    let uid;
    let email;

    if (encodedAuth != null) {
        let decodedAuth = atob(encodedAuth);

        let split = decodedAuth.split("-");

        uid = split[0];
        email = split[1];
    }
    
    async function getInchargeUIDs() {
        const dataArray = [];
        const studentQuery = query(collection(db, "studentData"), where("email", "==", email)); 
        const querySnapshot = await getDocs(studentQuery);
        
        for (const doc of querySnapshot.docs) {
          const schoolQuery = query(collection(db, "schoolData"), where("name", "==", doc.data().school));
          const schoolQuerySnapshot = await getDocs(schoolQuery);
          
          for (const schoolDoc of schoolQuerySnapshot.docs) {
            const q = query(collection(db, "atlUsers"), where("email", "==", schoolDoc.data().atlIncharge.email));
            const userQuerySnapshot = await getDocs(q);
            
            for (const val of userQuerySnapshot.docs) {
              console.log(val.data().uid);
              dataArray.push(val.data().uid);
            }
          }
        }
        return dataArray;
    }

    async function createNewGroup(event) {
        let groupName = "";
        while(groupName === "") {
            groupName = prompt("Enter Group Name: ");
        }
        if(groupName !== null) {
            const docRef = collection(db, "chats");
            
            const inchargeUIDs = await getInchargeUIDs();

            const uids = [...new Set(inchargeUIDs)];

            const data = {
                users: [
                    doc(db, "atlUsers", uid),
                    ...uids.map((val) => doc(db, "atlUsers", val))
                ],
                groupName: groupName
            }

            const docSnap = await addDoc(docRef, data);
            for (const user of data.users) {
                const userDocRef = user;
                const docData = await getDoc(userDocRef);
                if (docData.data().chats === undefined) {
                    await setDoc(userDocRef, {
                        chats: [{groupName: groupName, ref: doc(db, "chats", docSnap.id)}]
                    }, {merge: true});
                } else {
                    await setDoc(userDocRef, {
                        chats: [...docData.data().chats, {groupName: groupName, ref: doc(db, "chats", docSnap.id)}]
                    }, {merge: true});
                }
            }
            alert("Created your new chat group!");
        }
    }

    React.useEffect(() => {
        const q = query(doc(db, "atlUsers", uid));
        onSnapshot(q, (snap) => {
            const tempData = snap.data();
            tempData.uid = snap.id;
            setUserData(tempData);
            console.log(tempData.chats);
        });
    }, [uid]);

    document.title =  "Chats Dashboard | Digital ATL";

    return (
        <div className="container">
            <Sidebar />
            <link rel="stylesheet" href="/CSS/report.css"/>
            <link rel="stylesheet" href="/CSS/form.css"/>
            <h1 className="title">Chats Dashboard</h1>
            <button className="submitbutton createButton" title="Create new Group" onClick={createNewGroup} style={{float: "right"}}><i className="fa-solid fa-plus"></i></button>
            <hr/>
            <div className="subContainer">
                {userData.chats === undefined || userData.chats.length === 0 ?
                    <button className="submitbutton" onClick={createNewGroup}><i className="fa-solid fa-plus"></i> Create new Group</button>
                : (
                    userData.chats.map((chatGroup, index) => {

                        return <a href={"/chats/"+chatGroup.ref.path.replace("chats/", "")}>
                            <div className="box">
                                <div className="name">{chatGroup.groupName}</div>
                            </div>
                        </a>
                    })
                )}
            </div>
        </div>
    );
}

export default Dashboard;
