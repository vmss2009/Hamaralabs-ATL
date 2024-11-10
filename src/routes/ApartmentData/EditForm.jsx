import React from "react";
import {query, onSnapshot, doc} from "firebase/firestore";

import {  updateApartment,  db } from "../../firebase/firestore";
import {useParams} from "react-router-dom";
import Sidebar from "../../components/Sidebar";

function ApartmentEditForm() {
    const {apartmentId} = useParams();

    const [name, setName] = React.useState("");
    const [isATL, setIsATL] = React.useState(false);
    const [address,setAddress] = React.useState("");
    const [city,setCity] = React.useState("");
    const [state,setState] = React.useState("");
    const [pincode,setPincode] = React.useState("");
    const [inchargeFName,setInchargeFName] = React.useState("");
    const [inchargeLName,setInchargeLName] = React.useState("");
    const [inchargeEmail,setInchargeEmail] = React.useState("");
    const [inchargeWhatsappNumber,setInchargeWhatsappNumber] = React.useState("");
    const [principalFName,setPrincipalFName] = React.useState("");
    const [principalLName,setPrincipalLName] = React.useState("");
    const [principalEmail,setPrincipalEmail] = React.useState("");
    const [principalWhatsappNumber,setPrincipalWhatsappNumber] = React.useState("");
    const [correspondentfName,setCorrespondentfName] = React.useState("");
    const [correspondentlName,setCorrespondentlName] = React.useState("");
    const [correspondentEmail,setCorrespondentEmail] = React.useState("");
    const [correspondentWhatsappNumber,setCorrespondentWhatsappNumber] = React.useState("");
    const [sameAsPrincipal,setSameAsPrincipal] = React.useState(false);
    const [syllabus,setSyllabus] = React.useState({
        cbse: false,
        state: false,
        icse: false,
        igcse: false,
        ib: false,
    });
    const [webSite, setWebSite] = React.useState("");
    const [paidSubscription, setPaidSubscription] = React.useState(false);
    const [count, setCount] = React.useState(0);
    const [socialMediaLink, setSocialMediaLink] = React.useState([]);
    function clearForm() {
        setName("");
        setAddress("");
        setCity("");
        setState("");
        setPincode("");
        setInchargeFName("");
        setInchargeLName("");
        setInchargeEmail("");
        setInchargeWhatsappNumber("");
    }

    function handleChange(event) {
        if(event.target.name === "name") {
            setName(event.target.value);
        }else if(event.target.name === "address") {
            setAddress(event.target.value);
        }else if(event.target.name === "city") {
            setCity(event.target.value);
        }else if(event.target.name === "state") {
            setState(event.target.value);
        }else if(event.target.name === "pincode") {
            setPincode(event.target.value);
        }else if(event.target.name === "inchargefname") {
            setInchargeFName(event.target.value);
        }else if(event.target.name === "inchargelname") {
            setInchargeLName(event.target.value);
        }else if(event.target.name === "inchargeemail") {
            setInchargeEmail(event.target.value);
        }else if(event.target.name === "inchargewht") {
            setInchargeWhatsappNumber(event.target.value);
        }
    }
    async function handleSubmit(event) {
        event.preventDefault();
        if(name === "" || state=== "") {
            alert("Please fill name and state fields!")
        } else {
            event.preventDefault();
            await updateApartment(apartmentId, name, address,city, state,pincode, inchargeFName, inchargeLName,inchargeEmail,inchargeWhatsappNumber)
                .then(() => {
                    alert("Updated Successfully!");
                    window.location.href = "/apartment-data/view";
                })
                .catch((error) => {
                    console.error(error);
                    alert("Couldn't Update the data. Please try again!");
                });
        }
    }

    React.useEffect(() => {
        const q = query(doc(db, "apartmentData", apartmentId));
        onSnapshot(q, (snap) => {
            setName(snap.data().name);
            setAddress(snap.data().address.addressLine1);
            setCity(snap.data().address.city);
            setState(snap.data().address.state);
            setPincode(snap.data().address.pincode);
            setInchargeFName(snap.data().incharge.firstName);
            setInchargeLName(snap.data().incharge.lastName);
            setInchargeEmail(snap.data().incharge.email);
            setInchargeWhatsappNumber(snap.data().incharge.whatsappNumber);
        });
    }, [apartmentId]);

    function handleClick(event) {
        if(event.target.type === "reset") {
            clearForm();
        }
    }

    document.title = "Apartment Data Form | Digital ATL";
    return (
        <div className="container">
            <link rel="stylesheet" href="/CSS/school.css"/>
            <Sidebar />
            <form>
                <div className="school-title"> Apart Registraion Form </div>
                <div className="formContainer">
                <div className="row">
                <div className="column">
                    <label htmlFor="Name"><strong>Name*</strong></label>
                    <input type="text" name="name" className="form-inp" placeholder="Enter your apartment Name" value={name} id="firstName" autoComplete="off" onChange={handleChange} required />
                </div>
                </div><br/>
                <label><strong>Apartment Address: </strong></label>
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
                    <label htmlFor="fname">pincode:</label>
                    <input  type ="text" name="pincode" className="form-inp" value={pincode} id="pincode" placeholder="Enter your pincode" autoComplete="off"
                            onChange= {handleChange} required/>
                  </div>
                </div><br/>
                <label><strong>Incharge Details: </strong></label>
                <div className="row">
                    <div className="column">
                        <label htmlFor="name">First Name:</label>
                        <input  type ="text" name="inchargefname" className="form-inp" placeholder="firstname" value={inchargeFName} id="inchargefname" autoComplete="off" onChange={handleChange} required />
                    </div>
                    <div className="column">
                        <label htmlFor="name">Last Name:</label>
                        <input  type ="text" name="inchargelname" className="form-inp" placeholder="lastname" value={inchargeLName} id="inchargelname" autoComplete="off"
                        onChange={handleChange} required/>
                    </div>
                </div>
                <div className="row">
                        <div className="column">
                            <label htmlFor="fname">Email Id:</label>
                            <input  type ="text" name="inchargeemail"  className="form-inp" placeholder="enter email" value={inchargeEmail} id="inchargeemail"autoComplete="off"
                            onChange={handleChange} required />
                        </div>
                        <div className="column">
                            <label htmlFor="fname">WhatsApp Contact:</label>
                            <input  type ="text" name="inchargewht" className="form-inp" placeholder="contact number" value={inchargeWhatsappNumber} id="inchargewht" autoComplete="off"
                            onChange={handleChange} required />
                        </div>
                </div><br/>
                <div className="row">
                    <div className="column">
                        <button type="submit" className="submitbutton" onClick={handleSubmit}>Update</button>
                        <button type="reset" className="resetbutton" onClick={handleClick}>Reset</button>
                    </div>
                </div>
                </div>
            </form>
        </div>
    );
}

export default  ApartmentEditForm;
