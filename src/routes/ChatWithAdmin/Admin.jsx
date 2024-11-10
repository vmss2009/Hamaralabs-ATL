import React from "react";
import {collection, doc, query, onSnapshot} from "firebase/firestore";

import {db} from "../../firebase/firestore";
import {Bars} from "react-loader-spinner";
import Sidebar from "../../components/Sidebar";

function AdminChat() {
    const [chatsList, setChatsList] = React.useState([]);
    const [loaderEnable, setLoaderEnable] = React.useState(true);
    const [users, setUsers] = React.useState([]);

    React.useEffect(() => {
        const q = query(collection(db, "chatWithAdmin"));
        onSnapshot(q, (snaps) => {
            snaps.forEach(snap => {
                const dataArray = [];
                const q2 = query(doc(db, "atlUsers", snap.id));
                onSnapshot(q2, (snap2) => {
                    const tempData = snap2.data();
                    tempData.docId = snap2.id;
                    dataArray.push(tempData);
                    setChatsList(dataArray);
                });
            });
            setLoaderEnable(false);
        });

        const q2 = query(collection(db, "atlUsers"));
        const temp = [];
        onSnapshot(q2, (snaps) => {
            snaps.forEach(snap => {
                temp.push({id: snap.id, name: snap.data().name, role: snap.data().role});
            });
            setUsers(temp);
        });
    }, []);

    document.title = "Admin Chat | Digital ATL";

    return (
        <div className="container">
            <Sidebar />
            <link rel="stylesheet" href="/CSS/form.css"/>
            <link rel="stylesheet" href="/CSS/report.css"/>
            <div>
                <h1 className="title">Admin Chat | Digital ATL</h1>
                <hr/>
            </div>
            <span style={{fontSize: "1.2rem"}}>
                Start new chat with
            </span>
            <select onChange={e => {window.location.href = "/chat-with-admin/"+e.target.value}}>
            {
                users.map(user => {
                    return <option value={user.id}>{user.name} ({user.role})</option>
                })
            }
            </select>
            <hr/>
            <div className="chats">
                {(loaderEnable)?(
                    <center>
                        <Bars
                            height="80"
                            width="80"
                            radius="9"
                            color="black"
                            ariaLabel="loading"
                            wrapperStyle
                            wrapperClass
                        />
                    </center>
                ):(console.log("Disabled loader"))}
                {
                    chatsList.map((chat, index) => {
                        return (
                            <a href={"/chat-with-admin/"+chat.docId} style={{color: "#000"}}>
                                <div key={index} className="box">
                                    <div className="name">{chat.name}</div>
                                    <div className="boxContainer">UID: {chat.docId}</div>
                                </div>
                            </a>
                        );
                    })
                }
            </div>
        </div>
    )
}

export default AdminChat;
