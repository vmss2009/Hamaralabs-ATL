import React, { useState, useEffect } from "react";
import { Tabs, Tab, Box } from "@material-ui/core";
import Sidebar from "../../components/Sidebar";
import { db } from "../../firebase/firestore";
import { doc, onSnapshot, setDoc, getDoc } from "firebase/firestore";

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState(0);
    const [titles, setTitles] = useState([]);

    let encodedAuth = localStorage.getItem("auth");
    let decodedAuth = atob(encodedAuth);
    let split = decodedAuth.split("-");
    const uid = split[0];

    useEffect(() => {
        const userDoc = doc(db, "atlUsers", uid);
        const unsubscribe = onSnapshot(userDoc, (docSnapshot) => {
            const notificationsData = docSnapshot.data().notifications;
            const notificationsArray = [];
            const titlesMap = new Map();
            notificationsData.forEach((notification) => {
                notificationsArray.unshift(notification); // Add new notifications at the top
                if (titlesMap.has(notification.title)) {
                    titlesMap.set(notification.title, titlesMap.get(notification.title) + 1);
                } else {
                    titlesMap.set(notification.title, 1);
                }
            });
            setNotifications(notificationsArray);
            setTitles(Array.from(titlesMap.entries()));
            setLoading(false);
        });

        return () => unsubscribe();
    }, [uid]);

    const closeNotification = async (notificationToDelete) => {
        const userDoc = doc(db, "atlUsers", uid);
        const notifcationsDoc = await getDoc(userDoc);
        const notificationsData = notifcationsDoc.data().notifications;
        const newNotifications = notificationsData.filter(notification => notification.timestamp !== notificationToDelete.timestamp);
        await setDoc(userDoc, { notifications: newNotifications }, { merge: true });
    };

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ padding: '20px', marginLeft: '20px', width: '90%' }}>
                <h1>Notifications</h1>
                <Tabs value={selectedTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
                    {titles.map(([title, count], index) => (
                        <Tab key={index} label={`${title} (${count})`} />
                    ))}
                </Tabs>
                <Box p={3}>
                    {notifications
                        .filter(notification => notification.title === titles[selectedTab][0])
                        .map((notification, index) => (
                            <div key={index} style={styles.notificationCard}>
                                <div style={styles.notificationContent}>
                                    <h2 style={styles.notificationTitle}>{notification.title}</h2>
                                    <p style={styles.notificationBody}>{notification.body}</p>
                                    <p style={styles.notificationTimestamp}>{new Date(notification.timestamp).toLocaleString()}</p>
                                </div>
                                <button style={styles.closeButton} onClick={() => closeNotification(notification)}>X</button>
                            </div>
                        ))}
                </Box>
            </div>
        </div>
    );
}

const styles = {
    notificationCard: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        marginBottom: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    notificationContent: {
        flex: 1,
    },
    notificationTitle: {
        margin: 0,
        fontSize: '16px',
        fontWeight: 'bold',
    },
    notificationBody: {
        margin: '5px 0 0 0',
        fontSize: '14px',
    },
    notificationTimestamp: {
        margin: '5px 0 0 0',
        fontSize: '12px',
        color: '#888',
    },
    closeButton: {
        background: 'none',
        border: 'none',
        fontSize: '16px',
        cursor: 'pointer',
        color: '#888',
    },
};

export default Notifications;