import React, {useState, useEffect} from "react";
import Sidebar from "../../components/Sidebar";
import DateAndTimePicker from "./DateAndTimePickerReport";
import ReportBox from "./SlotReportBoxComp"
import { query, collection, doc, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firestore";

function SlotManagementReport () {
    const [allotedSlots, setAllotedSlots] = useState({});
    const [slotBookings, setSlotBookings] = useState([]);

    let encodedAuth = localStorage.getItem("auth");
    let uid;
    let email;
    let role;

    if (encodedAuth != null) {
        let decodedAuth = atob(encodedAuth);

        let split = decodedAuth.split("-");

        uid = split[0];
        email = split[1];
        role = split[2];
    }

    
    useEffect(() => {
        const q = query(collection(db, "schoolData"));
        onSnapshot(q, snaps => {
            snaps.forEach(snap => {
                const temp = snap.data();
                if(temp.atlIncharge.email === email && role === "atlIncharge") {
                    temp.docId = snap.id;
                }
                const docRef = temp.slotManagement;
                if(docRef !== undefined) {
                    (async () => {
                        const docSnap = await getDoc(docRef);
                        console.log(docSnap.data());
                        const allotedSlots = docSnap.data().allotedSlots;
                        setAllotedSlots(allotedSlots);
                    })()
                }
            });
        });
    }, []);

    document.title = "Slot Management Report | Digital ATL";

    return (
        <div className="container">
            <Sidebar />
            <link rel="stylesheet" href="/CSS/form.css"/>
            <link rel="stylesheet" href="/CSS/report.css"/>
            <div style={{height: "10vh"}}>
                <h1 className="title">Slot Management | Digital ATL</h1>
                <hr/>
            </div>
            <DateAndTimePicker initialData={allotedSlots} setSlotBookings={setSlotBookings}/>
            {slotBookings.map((slot, index) => (
                <ReportBox key={index} docPath={slot}/>
            ))}
        </div>
    );
}

export default SlotManagementReport;