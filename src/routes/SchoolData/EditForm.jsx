import React from "react";
import {query, onSnapshot, doc} from "firebase/firestore";

import {  updateSchool,  db } from "../../firebase/firestore";
import {useParams} from "react-router-dom";
import Sidebar from "../../components/Sidebar";

function SchoolForm() {
    const {schoolId} = useParams();

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
        setIsATL(false);
        setAddress("");
        setCity("");
        setState("");
        setPincode("");
        setInchargeFName("");
        setInchargeLName("");
        setInchargeEmail("");
        setInchargeWhatsappNumber("");
        setPrincipalFName("");
        setPrincipalLName("");
        setPrincipalEmail("");
        setPrincipalWhatsappNumber("");
        setCorrespondentfName("");
        setCorrespondentlName("");
        setCorrespondentEmail("");
        setCorrespondentWhatsappNumber("");
        setSameAsPrincipal(false);
        setSyllabus({
            cbse: false,
            state: false,
            icse: false,
            igcse: false,
            ib: false
        });
        setWebSite("");
        setPaidSubscription(false);
        setSocialMediaLink([]);
        //setLoader("");
    }

    function handleChange(event) {
        if(event.target.name === "name") {
            setName(event.target.value);
        } else if(event.target.name === "isATL") {
            setIsATL(event.target.checked);
        } else if(event.target.name === "address") {
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
        }else if(event.target.name === "principalfname") {
            setPrincipalFName(event.target.value);
            if(sameAsPrincipal) {
                setCorrespondentfName(event.target.value);
            }
        }else if(event.target.name === "principallname") {
            setPrincipalLName(event.target.value);
            if(sameAsPrincipal) {
                setCorrespondentlName(event.target.value);
            }
        }else if(event.target.name === "principalemail") {
            setPrincipalEmail(event.target.value);
            if(sameAsPrincipal) {
                setCorrespondentEmail(event.target.value);
            }
        }else if(event.target.name === "principalwht") {
            setPrincipalWhatsappNumber(event.target.value);
            if(sameAsPrincipal) {
                setCorrespondentWhatsappNumber(event.target.value);
            }
        }else if(event.target.name === "correspondentfname") {
            setCorrespondentfName(event.target.value);
        }else if(event.target.name === "correspondentlname") {
            setCorrespondentlName(event.target.value);
        }else if(event.target.name === "correspondentemail") {
            setCorrespondentEmail(event.target.value);
        }else if(event.target.name === "correspondentwht") {
            setCorrespondentWhatsappNumber(event.target.value);
        }else if(event.target.name === "website") {
            setWebSite(event.target.value);
        }else if(event.target.name === "paidSubscription") {
            setPaidSubscription(event.target.checked);
        }else if(event.target.name === "socialMediaLink") {
            setSocialMediaLink(event.target.value);
        }
    }

    const handleSameAsPrincipalChange = (event) => {
        setSameAsPrincipal(event.target.checked);
    };

    const handleSyllabusChange = (e) => {
        const { name, checked } = e.target;
        const temp = {...syllabus};
        temp[name] = checked;
        setSyllabus(temp);
    };
    async function handleSubmit(event) {
        event.preventDefault();
        // if(name === "" || address === ""  || city  === "" ||   state=== "" ||  pincode === "" ||inchargeFName === "" || inchargeLName=== "" || inchargeEmail === "" ||  inchargeWhatsappNumber=== ""  ||principalFName=== "" || principalLName=== ""|| principalEmail === "" || principalWhatsappNumber=== "") {
        if(name === "" || state=== "") {
            alert("Please fill name and state fields!")
        } else {
            event.preventDefault();
            await updateSchool(schoolId, name, isATL,address,city, state,pincode, inchargeFName, inchargeLName,inchargeEmail,inchargeWhatsappNumber,principalFName, principalLName,principalEmail, principalWhatsappNumber,correspondentfName,correspondentlName,correspondentEmail,correspondentWhatsappNumber,sameAsPrincipal,syllabus,webSite, paidSubscription, socialMediaLink)
                .then(() => {
                    alert("Updated Successfully!");
                    window.location.href = "/school-data/view";
                })
                .catch((error) => {
                    console.error(error);
                    alert("Couldn't Update the data. Please try again!");
                });
        }
    }

    React.useEffect(() => {
        const q = query(doc(db, "schoolData", schoolId));
        onSnapshot(q, (snap) => {
            setAddress(snap.data().address.addressLine1);
            setCity(snap.data().address.city);
            setState(snap.data().address.state);
            setPincode(snap.data().address.pincode);
            setInchargeFName(snap.data().atlIncharge.firstName);
            setInchargeLName(snap.data().atlIncharge.lastName);
            setInchargeEmail(snap.data().atlIncharge.email);
            setInchargeWhatsappNumber(snap.data().atlIncharge.whatsappNumber);
            setIsATL(snap.data().isATL);
            setName(snap.data().name);
            setPrincipalFName(snap.data().principal.firstName);
            setPrincipalLName(snap.data().principal.lastName);
            setPrincipalEmail(snap.data().principal.email);
            setPrincipalWhatsappNumber(snap.data().principal.whatsappNumber);
            setCorrespondentfName(snap.data().correspondent.firstName);
            setCorrespondentlName(snap.data().correspondent.lastName);
            setCorrespondentEmail(snap.data().correspondent.email);
            setCorrespondentWhatsappNumber(snap.data().correspondent.whatsappNumber);
            setWebSite(snap.data().webSite);
            setSyllabus(snap.data().syllabus);
            setPaidSubscription(snap.data().paidSubscription);
            setSameAsPrincipal(snap.data().sameAsPrincipal);
            setSocialMediaLink(snap.data().socialMediaLink);
            if(snap.data().isATL) {
                document.querySelector("#isATL").checked = true;
            }
            if(snap.data().sameAsPrincipal) {
                document.querySelector("#sameAsPrincipal").checked = true;
            }
            if(snap.data().paidSubscription) {
                document.querySelector("#paidSubscription").checked = true;
            }
        });
    }, [schoolId]);

    function handleClick(event) {
        if(event.target.type === "reset") {
            clearForm();
        }
    }

    function createArray() {
        const arr = [];
        for (let i = 1; i < count; i++) {
            arr.push(i);
        }
        return arr;
    }

    function handleServiceChange(event, index) {
        const value = event.target.value;
        const updatedsocialMediaLink = [...socialMediaLink];
        updatedsocialMediaLink[index] = value;
        setSocialMediaLink(updatedsocialMediaLink);
    }

    function increaseField(event) {
        event.preventDefault();
        setCount( count + 1 ) ;
    }

    function decreaseField(event) {
        event.preventDefault();
        if (count !== 0) {
            setCount(count - 1);
        }
    }


    document.title = "School Data Form | Digital ATL";
    return (
        <div className="container">
            <link rel="stylesheet" href="/CSS/school.css"/>
            <Sidebar />
            <form>
                <div className="school-title"> School Registraion Form </div>
                <div className="formContainer">
                <div className="row">
                <div className="column">
                    <label htmlFor="Name"><strong>Name*</strong></label>
                    <input type="text" name="name" className="form-inp" placeholder="Enter your school Name" value={name} id="firstName" autoComplete="off" onChange={handleChange} required />
                </div>
                <div className="column">
                    <input type="checkbox" class="checkbox"  id="isATL" name="isATL" onChange={handleChange}/>
                    <label>Is ATL School</label>
                </div>
                </div><br/>
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
                <label><strong>Principal Details: </strong></label>
                <div className="row">
                        <div className="column">
                            <label htmlFor="fname">First Name:</label>
                            <input  type ="text" name="principalfname" className="form-inp" placeholder="First name" value={principalFName} id="principalfname" autoComplete="off"
                            onChange={handleChange} required/>
                        </div>
                        <div className="column">
                            <label htmlFor="fname">Last Name:</label>
                            <input  type ="text" name="principallname" className="form-inp" placeholder="last name" value={principalLName} id="principallname" autoComplete="off"
                            onChange={handleChange} required />
                        </div>
                </div>
                <div className="row">
                    <div className="column">
                        <label htmlFor="fname">Email:</label>
                        <input  type ="text" name="principalemail" className="form-inp" placeholder="Enter your email" value={principalEmail} id="principalemail" autoComplete="off"
                        onChange={handleChange} required />
                  </div>
                    <div className="column">
                        <label  htmlFor ="fname">WhatsApp Contact:</label>
                        <input  type ="text" name="principalwht" className="form-inp" placeholder="contact number" value={principalWhatsappNumber} id="principalwht" autoComplete="off"
                        onChange={handleChange} required />
                </div>
                </div><br/>
                <label htmlFor="Correspondent"><strong>Correspondent Details: </strong></label>
                <div className="row">
                    <div className="column">
                        <label htmlFor="sameAsPrincipal">Same As Principal</label>
                        <input type="checkbox" name="sameAsPrincipal"  id="sameAsPrincipal" checked={sameAsPrincipal} onChange={handleSameAsPrincipalChange}/>
                </div>
                </div>
                    <div className="row">
                            <div className="column">
                                <label htmlFor="fname">First Name:  </label>
                                <input type="text" name="correspondentfname" id="correspondentfname" placeholder="firstname" className="form-inp" value={correspondentfName} autoComplete="off" onChange={handleChange}/>
                            </div>
                            <div className="column">
                                <label htmlFor="lname">Last Name: </label>
                                <input type="text" name="correspondentlname" id="correspondentlname" placeholder="lastname" className="form-inp" value={correspondentlName} autoComplete="off" onChange={handleChange}/>
                            </div>
                    </div>
                    <div className="row">
                            <div className="column">
                                    <label htmlFor="fname">Email:  </label>
                                    <input type="text" name="correspondentemail" id="correspondentemail" placeholder="enter email" className="form-inp" value={correspondentEmail} autoComplete="off" onChange={handleChange}/>
                            </div>
                            <div className="column">
                                    <label htmlFor="lname">WhatsApp Contact: </label>
                                    <input type="text" name="correspondentwht" id="correspondentwht" className="form-inp" placeholder="contact number" value={correspondentWhatsappNumber} autoComplete="off" onChange={handleChange}/>
                            </div>
                </div><br/>
                <label><strong>Syllabus:</strong></label>
                <div className="row">
                    <div className="column">
                        <label htmlFor="cbse">CBSE</label>
                        <input type="checkbox" name="cbse" checked={syllabus.cbse} onChange={handleSyllabusChange}/>
                        <label htmlFor="state"> State</label>
                        <input type="checkbox" name="state" checked={syllabus.state} onChange={handleSyllabusChange}/>
                        <label htmlFor="icse"> ICSE</label>
                        <input type="checkbox" name="icse" checked={syllabus.icse} onChange={handleSyllabusChange}/>
                        <label htmlFor="igcse"> IGCSE</label>
                        <input type="checkbox" name="igcse" checked={syllabus.igcse} onChange={handleSyllabusChange}/>
                        <label htmlFor="ib"> IB</label>
                        <input type="checkbox" name="ib" checked={syllabus.ib} onChange={handleSyllabusChange}/>
                    </div>
                </div><br/>
                <div className="row">
                    <div className="column">
                    <label  htmlFor ="website"><strong>Website URL:</strong></label>
                    <input  type ="text" name="website" className="form-inp" value={webSite} placeholder="webesite link" id="website" onChange={handleChange} />
                    </div>
                </div><br/>
                <div className="row">
                    <div className="column">
                        <label htmlFor="paidSubscription"><strong> Paid Subscription:</strong></label>
                        <input type="checkbox" name="paidSubscription" id="paidSubscription" checked={paidSubscription} onChange={handleChange}/>
                    </div>
                </div>
                <div  className="row">
                <div className="column">
                    <label htmlFor="socialMediaLink"><strong>Social Media Links:</strong> </label>
                    {createArray(count).map((_, index) => {
                        return <><input key={index} index={index} name="socialMediaLink" id="socialMediaLink"
                                        class="b form-inp" placeholder="social media link" value={socialMediaLink[index] || ""}
                                        onChange={(event) => handleServiceChange(event, index)}/><br/><br/></>
                    }) }
                    <div>
                        <button className="submitbutton" onClick={increaseField}> + </button>
                        <button className="resetbutton" onClick={decreaseField}> - </button>
                    </div>
                </div>
                </div>
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

export default  SchoolForm;
