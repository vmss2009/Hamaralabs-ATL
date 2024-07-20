import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import {db} from "../../firebase/firestore";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {Bars} from "react-loader-spinner";

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [displayOption, setDisplayOption] = useState("TA Completed");
    const [loading, setLoading] = useState(false);
    const sections = ["TA Completed", "New Message"];
    const values = ["TA Completed", "Chats"];

    let encodedAuth = localStorage.getItem("auth");
    let decodedAuth = atob(encodedAuth);
    let split = decodedAuth.split("-");
    const uid = split[0];
    useEffect(() => {
        (async () => {
            const userDoc = doc(db, "atlUsers", uid);
            const notificationsDoc = await getDoc(userDoc);
            const notificationsData = notificationsDoc.data().notifications;
            const notificationsArray = [];
            console.log(notificationsDoc.data());
            if (displayOption !== "") {
                notificationsData.forEach((notification, index) => {
                    if (notification.title === displayOption) {
                        notificationsArray.push(notification);
                    }
                });
                setNotifications(notificationsArray);
            }
        })();
    }, [displayOption]);

    const closeNotification = async (index) => {
        setLoading(true);
        const userDoc = doc(db, "atlUsers", uid);
        const notifcationsDoc = await getDoc(userDoc);
        const notificationsData =  notifcationsDoc.data().notifications;
        const newNotifications = notificationsData.filter((_, i) => i !== index);
        await setDoc(userDoc, {notifications: newNotifications}, {merge: true});
        setNotifications(notifications.filter((_, i) => i !== index));
        setLoading(false);
    };

    if (loading) {
        return (
            <div style={{height: "85%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                {<Bars
                    height="80"
                    width="80"
                    radius="9"
                    color="black"
                    ariaLabel="loading"
                    wrapperStyle
                    wrapperClass
                />}
            </div>
        );
    }

    return (
        <div style={{display: 'flex'}}>
            <Sidebar/>
            <div style={{padding: '20px', fontFamily: 'Arial, sans-serif', marginLeft: '20px', width: "95%"}}>
                <h1 style={{color: '#444'}}>Notifications</h1>
                <select value={displayOption} onChange={(e) => setDisplayOption(e.target.value)}>
                    <option value="" disabled={true}>Select</option>
                    {values.map((section, index) => (
                        <option key={index} value={sections[index]}>{section}</option>
                    ))
                    }
                </select>
                {notifications.map((notification, index) => (
                    <div key={index} style={{
                        margin: '20px 0', 
                        padding: '30px',
                        border: '1px solid #ddd',
                        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                        borderRadius: '5px'
                    }}>
                        <button onClick={async () => await closeNotification(index)} style={{float: 'right'}}><i class="fa-solid fa-xmark"></i></button>
                        <p style={{margin: '0', color: '#666', fontSize: '1.2em'}}>{notification.body}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Notifications;