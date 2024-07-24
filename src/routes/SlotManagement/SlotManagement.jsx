import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import DateAndTimePicker from "./DateAndTimePicker";
import { collection, query, onSnapshot, getDoc } from "firebase/firestore";
import { db, createSlot, updateSlot } from "../../firebase/firestore";

function SlotManagement () {
    const [school, setSchool] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState("");
    const [selectedSchoolIndex, setSelectedSchoolIndex] = useState(null);
    const [month, setMonth] = useState("");
    const [slotData, setSlotData] = useState([]);
    const [slotNumber, setSlotNumber] = useState(0);
    const [daysInMonth, setDaysInMonth] = React.useState(0);
    const [isSlotData, setIsSlotData] = useState(false);
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
            const tempData = [];
            snaps.forEach(snap => {
                const temp = snap.data();
                if(temp.atlIncharge.email === email && role === "atlIncharge") {
                    temp.docId = snap.id;
                    tempData.push(temp);
                } else if (role === "admin") {
                    temp.docId = snap.id;
                    tempData.push(temp);
                }
            });
            setSchool(tempData.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())));
        });
    }, []);

    useEffect(() => {
        if (selectedSchool !== "") {
            console.log(school[selectedSchoolIndex]);
            if (school[selectedSchoolIndex].slotManagement !== undefined) {
                const docRef = school[selectedSchoolIndex].slotManagement;
                (async () => {
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setSlotNumber(data.slotNumber);
                        setMonth(data.month);
                    }
                })();
                setIsSlotData(true);
            } else {
                setIsSlotData(false);
                setSlotNumber(0);
                setMonth("");
            }
        }
    }, [selectedSchool]);

    useEffect(() => {
        const selectedDate = new Date(Date.parse(month + " 1, 2023"));
        const monthNumber = selectedDate.getMonth() + 1;
        const selectedYear = selectedDate.getFullYear(); // Year from the selected month

        const days = getDaysInMonth(monthNumber, selectedYear);

        setDaysInMonth(days);
    }, [month]);

    const resetForm = async () => {
        const docRef = school[selectedSchoolIndex].slotManagement;
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        setSlotNumber(data.slotNumber);
        setMonth(data.month);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const allotedSlots = handleAllotedSlots(slotData);
        if (selectedSchool !== "" && month !== "") {
            if (isSlotData) {
                await updateSlot(school[selectedSchoolIndex].slotManagement, slotNumber, month, slotData, allotedSlots)
                .then(() => {
                    alert("Update Successfully!");
                    // clearForm();
                })
                .catch((error) => {
                    console.log(error);
                    alert("Couldn't add the data. Please try again!" + error);
                });
            } else {
                await createSlot(school[selectedSchoolIndex].docId, slotNumber, month, slotData, allotedSlots)
                .then(() => {
                    alert("Added Successfully!");
                    // clearForm();
                })
                .catch((error) => {
                    console.log(error);
                    alert("Couldn't add the data. Please try again!");
                });
            }
        } else {
            alert("Please fill all the fields!");
        }
    }

    function handleAllotedSlots (data) {
        const tempData = data;
        for (let i = 1; i <= Object.keys(data).length; i++) {
            for (let j = 1; j <= Object.keys(data[i]).length; j++) {
                if (data[i][j] === true) {
                    tempData[i][j] = [];
                }
            }
        }

        return tempData;
    }

    const handleChange = (event) => {
        if (event.target.name === "schoolName") {
            setSelectedSchool(event.target.value);
            setSelectedSchoolIndex(event.target.options.selectedIndex - 1);
        } else if (event.target.name === "slotNumber") {
            setSlotNumber(parseInt(event.target.value));
        } else if (event.target.name === "month") {
            setMonth(event.target.value);
        }
    }

    function getDaysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    document.title = "Slot Management | Digital ATL";

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0-11 where January is 0 and December is 11
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const sortedMonths = [
      ...months.slice(currentMonth),
      ...months.slice(0, currentMonth)
    ];

    return (
        <div className="containerSlot" id="mobilescreen">
            <Sidebar />
            <link rel="stylesheet" href="/CSS/school.css" />
            <form>
                <div className="school-title">Slot Management</div>
                <hr />
                <div className="formContainer">
                    <div className="row">
                        <div className="column">
                            <label htmlFor="schoolName"><strong>School:</strong> </label>
                            <select name="schoolName" id="schoolName"  placeholder="Enter your School" className="form-inp" value={selectedSchool} onChange={handleChange}>
                                <option value="" disabled>Select School</option>
                                {school.map((school, index) => (
                                    <option key={index} value={school.name}>{school.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="formContainer">
                    <div className="row">
                        <div className="column">
                            <label htmlFor="slotNumber"><strong>Number of seats per slot:</strong> </label>
                            <input type="number" id="slotNumber" name="slotNumber" min="1" className="form-inp" value={slotNumber} onChange={handleChange} />
                        </div>
                    </div>
                </div>
                <div className="formContainer">
                    <div className="row">
                        <div className="column">
                            <label htmlFor="month"><strong>Month:</strong> </label>
                            <select name="month" id="month"  placeholder="Enter the month" className="form-inp" value={month} onChange={handleChange} >
                                <option value="" disabled>Select</option>
                                {sortedMonths.map((month, index) => (
                                    <option key={index} value={month}>{month}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="formContainer">
                    <label htmlFor="teamLeader"><strong>Slot:</strong> </label>
                    <DateAndTimePicker days={daysInMonth === 0 ? 30 : daysInMonth} setSlotData={setSlotData} />
                </div>
                <div className="buttonsContainer formContainer">
                    <button type="submit" className="submitbutton" onClick={handleSubmit} >Add / Update</button>
                    <button type="reset" className="resetbutton" onClick={resetForm}>Reset</button>
                </div>
            </form>
        </div>
    );
}

export default SlotManagement;