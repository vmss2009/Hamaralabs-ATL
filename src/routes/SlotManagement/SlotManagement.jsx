import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import DateAndTimePicker from "./DateAndTimePicker";
import { collection, query, onSnapshot, getDoc } from "firebase/firestore";
import { db, createSlot, updateSlot } from "../../firebase/firestore";

function SlotManagement () {
    const [school, setSchool] = useState({});
    const [month, setMonth] = useState("");
    const [slotData, setSlotData] = useState([]);
    const [slotNumber, setSlotNumber] = useState(0);
    const [daysInMonth, setDaysInMonth] = React.useState(0);
    const [isSlotData, setIsSlotData] = useState(false);
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [pincode, setPincode] = useState("");

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
                    setSchool(temp);
                }
                const docRef = temp.slotManagement;
                if(docRef !== undefined) {
                    setIsSlotData(true);
                    (async () => {
                        const docSnap = await getDoc(docRef);
                        if (docSnap.exists()) {
                            const data = docSnap.data();
                            setSlotNumber(data.slotNumber);
                            setMonth(data.month);
                            setAddress(data.address.addressLine1);
                            setCity(data.address.city);
                            setState(data.address.state);
                            setPincode(data.address.pincode);
                        }
                    })()
                }
            });
        });
    }, []);

    useEffect(() => {
        const selectedDate = new Date(Date.parse(month + " 1, 2023"));
        const monthNumber = selectedDate.getMonth() + 1;
        const selectedYear = selectedDate.getFullYear(); // Year from the selected month

        const days = getDaysInMonth(monthNumber, selectedYear);

        setDaysInMonth(days);
    }, [month]);

    const resetForm = async () => {
        const docRef = school.slotManagement;
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        setSlotNumber(data.slotNumber);
        setMonth(data.month);
        setAddress(data.address.addressLine1);
        setCity(data.address.city);
        setState(data.address.state);
        setPincode(data.address.pincode);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const allotedSlots = handleAllotedSlots(slotData);
        if (month !== "" || address !== "" || city !== "" || state !== "" || pincode !== "") {
            if (isSlotData) {
                await updateSlot(school.slotManagement, slotNumber, month, slotData, allotedSlots, address, city, state, pincode)
                .then(() => {
                    alert("Update Successfully!");
                    // clearForm();
                })
                .catch((error) => {
                    console.log(error);
                    alert("Couldn't add the data. Please try again!" + error);
                });
            } else {
                await createSlot(school.docId, slotNumber, month, slotData, allotedSlots, address, city, state, pincode)
                .then(() => {
                    alert("Added Successfully!");
                    // clearForm();
                })
                .catch((error) => {
                    console.log(error);
                    alert("Couldn't add the data. Please try again!" + error);
                });
            }
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
        console.log(tempData);
        return tempData;
    }

    const handleChange = (event) => {
        if (event.target.name === "schoolName") {
            setSchool(event.target.value);
        } else if (event.target.name === "slotNumber") {
            setSlotNumber(parseInt(event.target.value));
        } else if (event.target.name === "month") {
            setMonth(event.target.value);
        } else if (event.target.name === "address") {
            setAddress(event.target.value);
        } else if (event.target.name === "city") {
            setCity(event.target.value);
        } else if (event.target.name === "state") {
            setState(event.target.value);
        } else if (event.target.name === "pincode") {
            setPincode(event.target.value);
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
        <div className="container" id="mobilescreen">
            <Sidebar />
            <link rel="stylesheet" href="/CSS/school.css" />
            <form>
                <div className="school-title">Slot Management</div>
                <hr />
                <div className="formContainer">
                    <div className="row">
                        <div className="column">
                            <label htmlFor="schoolName"><strong>School:</strong> </label>
                            <select name="schoolName" id="schoolName"  placeholder="Enter your School" className="form-inp" value={school} onChange={handleChange}>
                                <option value="" disabled>Select School</option>
                                <option selected value={school.name}>{school.name}</option>
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
                <div className="formContainer">
                    <label><strong>School Address: </strong></label>
                    <div className="row">
                        <div className="column">
                            <label htmlFor="Name">Address line:</label>
                            <input type ="text" name="address" className="form-inp" placeholder="Enter your address" value={address} id="fname" autoComplete="off"
                                onChange={handleChange} required/>
                        </div>
                        <div className="column">
                            <label htmlFor="fname">City/District:</label>
                            <input type ="text" name="city" className="form-inp" placeholder="Enter your city" value={city} id="city" autoComplete="off"
                            onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="row">
                        <div className="column">
                        <label htmlFor="state">State/province*</label>
                        <select id="state" name="state" className="form-inp" value={state} onChange={handleChange}>
                            <option value="" selected={true} disabled={true}>--Select a state/union territory--</option>
                            <option value="Andhra Pradesh">Andhra Pradesh</option>
                            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                            <option value="Assam">Assam</option>
                            <option value="Bihar">Bihar</option>
                            <option value="Chhattisgarh">Chhattisgarh</option>
                            <option value="Goa">Goa</option>
                            <option value="Gujarat">Gujarat</option>
                            <option value="Haryana">Haryana</option>
                            <option value="Himachal Pradesh">Himachal Pradesh</option>
                            <option value="Jharkhand">Jharkhand</option>
                            <option value="Karnataka">Karnataka</option>
                            <option value="Kerala">Kerala</option>
                            <option value="Madhya Pradesh">Madhya Pradesh</option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Manipur">Manipur</option>
                            <option value="Meghalaya">Meghalaya</option>
                            <option value="Mizoram">Mizoram</option>
                            <option value="Nagaland">Nagaland</option>
                            <option value="North Carolina">North Carolina</option>
                            <option value="Odisha">Odisha</option>
                            <option value="Punjab">Punjab</option>
                            <option value="Rajasthan">Rajasthan</option>
                            <option value="Sikkim">Sikkim</option>
                            <option value="Tamil Nadu">Tamil Nadu</option>
                            <option value="Telangana">Telangana</option>
                            <option value="Tripura">Tripura</option>
                            <option value="Uttar Pradesh">Uttar Pradesh</option>
                            <option value="Uttarakhand">Uttarakhand</option>
                            <option value="West Bengal">West Bengal</option>
                            <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                            <option value="Chandigarh">Chandigarh</option>
                            <option value="Daman and Diu">Daman and Diu</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                            <option value="Ladakh">Ladakh</option>
                            <option value="Lakshadweep">Lakshadweep</option>
                            <option value="Puducherry">Puducherry</option>
                        </select>
                    </div>
                    <div className="column">
                        <label htmlFor="fname">Pincode:</label>
                        <input  type ="text" name="pincode" className="form-inp" value={pincode} id="pincode" placeholder="Enter your pincode" autoComplete="off"
                                onChange= {handleChange} required/>
                        </div>
                    </div><br/>
                    <div className="buttonsContainer formContainer">
                        <button type="submit" className="submitbutton" onClick={handleSubmit} >Add / Update</button>
                        <button type="reset" className="resetbutton" onClick={resetForm}>Reset</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default SlotManagement;