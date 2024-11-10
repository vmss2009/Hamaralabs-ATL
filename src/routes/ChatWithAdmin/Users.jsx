import React from "react";
import { query, doc, onSnapshot, setDoc } from "firebase/firestore";

import { db } from "../../firebase/firestore";
import MessageComp from "./MessageComp";
import Sidebar from "../../components/Sidebar";

function Users() {
    const [message, setMessage] = React.useState("");
    const [data, setData] = React.useState([]);

    function handleChange(event) {
        if(event.target.name === "messageValue") {
            setMessage(event.target.value);
        }
    }

    let uid;

    if (localStorage.auth != null) {
        let decodedAuth = atob(localStorage.auth);

        let split = decodedAuth.split("-");

        uid = split[0];
    }

    React.useEffect(() => {
        const q = query(doc(db, "chatWithAdmin", uid));

        onSnapshot(q, snapshot => {
            if(snapshot.exists()) {
                const dataArray = [];
                snapshot.data().messages.forEach(message => {
                    dataArray.push(message);
                    setData(dataArray);
                    const docRef = doc(db, "atlUsers", "H3tJ9gLVCWX20MGDNmzpRTcXVtu1");
                    console.log(docRef.path === message.senderRef.path);
                });
            }
        });
    }, [uid]);

    async function handleSend() {
        if(message !== "") {
            const dataArray = data;
            dataArray.push({
                senderUID: uid,
                content: message
            });
            setMessage("");
            await setDoc(doc(db, "chatWithAdmin", uid), {
                messages: dataArray
            });
            setData(dataArray);
        } else {
            alert("Please type a message");
        }
    }

    function handleKeyPress(event) {
        if(event.key === "Enter") {
            document.querySelector(".sendBtn").click();
        }
    }

    document.title = "Chat with Admin | Digital ATL";

    return (
        <div className="container">
            <Sidebar />
            <link rel="stylesheet" href="/CSS/form.css"/>
            <div style={{height: "10vh"}}>
                <h1 className="title">Chat With Admin | Digital ATL</h1>
                <hr/>
            </div>
            <div className="messagesContainer" style={{ height: "73vh", overflow: "auto"}}>
                {
                    data.map((message, index) => {
                        return <MessageComp id={index} key={index} senderUID={message.senderUID} content={message.content} />
                    })
                }
            </div>
            <div className="messageInputsContainer" style={{
                width: "93%",
                display: "flex"
            }}>
                <input type="text" name="messageValue" id="messageValue" placeholder="Type your message" onKeyPress={handleKeyPress} onChange={handleChange} value={message} style={{
                    padding: "0.3rem",
                    fontSize: "1.2rem",
                    width: "95%",
                    border: "3px solid rgb(94, 94, 94)",
                    borderRadius: "10px",
                    outline: "none",
                    textAlign: "left",
                    transition: "0.3s",
                    margin: "0.5rem",
                }} />
                <button className="submitbutton sendBtn" onClick={handleSend} style={{
                    position: "relative",
                    bottom: "0.5rem",
                    display: "flex",
                }}><i className="fa-solid fa-paper-plane" style={{marginRight: "10px"}}></i> Send</button>
            </div>
        </div>
    );
}

export default Users;
