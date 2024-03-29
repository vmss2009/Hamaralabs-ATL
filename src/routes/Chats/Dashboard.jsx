import React from "react";
import {doc, query, onSnapshot, addDoc, collection, setDoc} from "firebase/firestore";

import {db} from "../../firebase/firestore";
import Sidebar from "../../components/Sidebar";

function Dashboard() {
    const [userData, setUserData] = React.useState({});

    let encodedAuth = localStorage.getItem("auth");

    let uid;

    if (encodedAuth != null) {
        let decodedAuth = atob(encodedAuth);

        let split = decodedAuth.split("-");

        uid = split[0];
    }

    async function createNewGroup(event) {
        let groupName = "";
        while(groupName === "") {
            groupName = prompt("Enter Group Name: ");
        }
        if(groupName !== null) {
            const docRef = collection(db, "chats");
            const docSnap = await addDoc(docRef, {
                users: [
                    doc(db, "atlUsers", uid)
                ],
                groupName: groupName
            });
            const userDocRef = doc(db, "atlUsers", uid);
            if(userData.chats === undefined) {
                await setDoc(userDocRef, {
                    chats: [{groupName: groupName, ref: doc(db, "chats", docSnap.id)}]
                }, {merge: true});
                alert("Created your new chat group!");
            } else {
                await setDoc(userDocRef, {
                    chats: [...userData.chats, {groupName: groupName, ref: doc(db, "chats", docSnap.id)}]
                }, {merge: true});
                alert("Created your new chat group!");
            }
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
