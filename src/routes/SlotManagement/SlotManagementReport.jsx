import React, {useState, useEffect} from "react";
import Sidebar from "../../components/Sidebar";
import DateAndTimePicker from "./DateAndTimePickerReport";
import ReportBox from "./SlotReportBoxComp"
import { query, collection, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firestore";

function SlotManagementReport () {
    const [schools, setSchools] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState("");
    const [slotData, setSlotData] = useState({});
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
            const tempSchools = [];
            snaps.forEach(snap => {
                const temp = snap.data();
                if(temp.atlIncharge.email === email && role === "atlIncharge") {
                    temp.docId = snap.id;
                    const docRef = temp.slotManagement;
                    if(docRef !== undefined) {
                        (async () => {
                            const docSnap = await getDoc(docRef);
                            const temp = docSnap.data();
                            temp.id = docSnap.id;
                            setSlotData(temp);
                        })()
                    }
                } else if (role === "admin") {
                    temp.docId = snap.id;
                    tempSchools.push(temp);
                }
            });
            setSchools(tempSchools.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())));
        });
    }, []);

    useEffect(() => {
        if(selectedSchool !== "") {
            const q = query(collection(db, "schoolData"));
            onSnapshot(q, snaps => {
                snaps.forEach(snap => {
                    const temp = snap.data();
                    if(temp.name === selectedSchool) {
                        const docRef = temp.slotManagement;
                        if(docRef !== undefined) {
                            (async () => {
                                const docSnap = await getDoc(docRef);
                                const temp = docSnap.data();
                                temp.id = docSnap.id;
                                setSlotData(temp);
                            })()
                        }
                    } else {
                        setSlotData({});
                    }
                });
            });
        }
    }, [selectedSchool]);

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
            {role === "admin" ? 
                <div style={{paddingLeft: "25px", paddingTop: "5px"}}>
                    <label htmlFor="schoolName"><strong>School:</strong> </label>
                    <select name="schoolName" id="schoolName"  placeholder="Enter your School" className="form-inp" value={selectedSchool} onChange={(event) => {setSelectedSchool(event.target.value)}}>
                        <option value="" disabled>Select School</option>
                        {schools.map((school, index) => (
                            <option key={index} value={school.name}>{school.name}</option>
                        ))}
                    </select>
                </div> : null
            }
            <DateAndTimePicker initialData={slotData.allotedSlots !== undefined ? slotData.allotedSlots : {}} setSlotBookings={setSlotBookings} slotNumber={slotData.slotNumber} month={slotData.month}/>
            {slotBookings.map((slot, index) => (
                <ReportBox key={index} docPath={slot}/>
            ))}
        </div>
    );
}

export default SlotManagementReport;