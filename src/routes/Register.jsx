import React from "react";

import { addSchool } from "../firebase/firestore";
import Sidebar from "../components/Sidebar";
import {createAuthAccount, createAuthAccountAndChangePassword} from "../firebase/auth";

function SchoolForm() {
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

    //const [loader, setLoader] = React.useState(false);
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
        }   else if(event.target.name === "paidSubscription") {
            setPaidSubscription(event.target.checked);
        }   else if(event.target.name === "socialMediaLink") {
            setSocialMediaLink(event.target.value);
        }
    }

    const handleSameAsPrincipalChange = (event) => {
        setSameAsPrincipal(event.target.checked);
    };

    const handleSyllabusChange = (e) => {
        const { name, checked } = e.target;
        setSyllabus(prevState => ({
            ...prevState,
            [name]: checked
        }));
    };
    async function handleSubmit(event) {
        event.preventDefault();
        if(name === "" || state=== "") {
            alert("Please fill name and state fields!")
            window.location.href = "/school-data/view";
        } else {
            event.preventDefault();
            await addSchool(name, isATL,address,city, state,pincode, inchargeFName, inchargeLName,inchargeEmail,inchargeWhatsappNumber,principalFName, principalLName,principalEmail, principalWhatsappNumber,correspondentfName,correspondentlName,correspondentEmail,correspondentWhatsappNumber,sameAsPrincipal,syllabus,webSite, paidSubscription, socialMediaLink)
                .then(async () => {
                    await createAuthAccountAndChangePassword(inchargeEmail, "digital-atl@123", `${inchargeFName} ${inchargeLName}`, "atlIncharge");
                    alert("Registered Successfully! Please go to the incharge mail and change the password.");
                    window.location.href = "/student-data/add";
                })
                .catch((error) => {
                    console.log(error);
                    alert("Couldn't add the data. Please try again!");
                });
        }
    }

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

    document.title = "School Registration Form | Digital ATL";

    return (
        <div className="container">
            <link rel="stylesheet" href="/CSS/form.css"/>
            <form>
                <div className="title"> School Registration Form </div>
                <p>Want to Login? <a href="/">Click Here</a></p>
                <hr />
                <div className="formContainer">
                    <label htmlFor="Name">School Name: </label>
                    <input type="text" name="name" className="form-inp" value={name} id="firstName" autoComplete="off" onChange={handleChange} required />
                </div>
                <div className="formContainer">
                    <label>Is ATL School</label>
                    <input type="checkbox" id="isATL" name="isATL" onChange={handleChange} className="form-inp"/>
                </div>
                <div className="formContainer">
                    <label><strong>School Address</strong></label><br/><br/>
                    <label htmlFor="Name">Address line:</label>
                    <input type ="text" name="address" className="form-inp" value={address} id="fname" autoComplete="off"
                           onChange={handleChange} required/>
                </div>
                <div className="formContainer">
                    <label htmlFor="fname">City/District:</label>
                    <input type ="text" name="city" className="form-inp" value={city} id="city" autoComplete="off"
                           onChange={handleChange} required />
                </div>
                <div className="formContainer">
                    <label htmlFor="fname">State/province:</label>
                    <select id="state" name="state" onChange={handleChange}>
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
                <div className="formContainer">
                    <label htmlFor="fname">pincode:</label>
                    <input  type ="text" name="pincode" className="form-inp" value={pincode} id="pincode" autoComplete="off"
                            onChange= {handleChange} required/>
                </div>
                <div className="formContainer">
                    <label><strong>Incharge Details</strong></label><br/><br/>
                    <label htmlFor="name">First Name:</label>
                    <input  type ="text" name="inchargefname" className="form-inp" value={inchargeFName} id="inchargefname" autoComplete="off" onChange={handleChange} required />
                </div>
                <div className="formContainer">
                    <label htmlFor="name">Last Name:</label>
                    <input  type ="text" name="inchargelname" className="form-inp" value={inchargeLName} id="inchargelname" autoComplete="off"
                            onChange={handleChange} required/>
                </div>
                <div className="formContainer">
                    <label htmlFor="fname">Email:</label>
                    <input  type ="text" name="inchargeemail"  className="form-inp" value={inchargeEmail} id="inchargeemail"autoComplete="off"
                            onChange={handleChange} required />
                </div>
                <div className="formContainer">
                    <label htmlFor="fname">WhatsApp Contact:</label>
                    <input  type ="text" name="inchargewht" className="form-inp" value={inchargeWhatsappNumber} id="inchargewht" autoComplete="off"
                            onChange={handleChange} required />
                </div>
                <div className="formContainer">
                    <label><strong>Principal Details</strong></label><br/><br/>
                    <label htmlFor="fname">First Name:</label>
                    <input  type ="text" name="principalfname" className="form-inp" value={principalFName} id="principalfname" autoComplete="off"
                            onChange={handleChange} required/>
                </div>
                <div className="formContainer">
                    <label htmlFor="fname">Last Name:</label>
                    <input  type ="text" name="principallname" className="form-inp" value={principalLName} id="principallname" autoComplete="off"
                            onChange={handleChange} required />
                    <br/>
                </div>
                <div className="formContainer">
                    <label htmlFor="fname">Email:</label>
                    <input  type ="text" name="principalemail" className="form-inp" value={principalEmail} id="principalemail" autoComplete="off"
                            onChange={handleChange} required />
                </div>
                <div className="formContainer">
                    <label  htmlFor ="fname">WhatsApp Contact:</label>
                    <input  type ="text" name="principalwht" className="form-inp" value={principalWhatsappNumber} id="principalwht" autoComplete="off"
                            onChange={handleChange} required />
                </div>
                <div className="formContainer">
                    <label htmlFor="sameAsPrincipal">Same As Principal</label>
                    <input type="checkbox" name="sameAsPrincipal" id="sameAsPrincipal" className="form-inp" checked={sameAsPrincipal} onChange={handleSameAsPrincipalChange}/><br/><br/>
                </div>
                <div className="formContainer">
                    <label htmlFor="Correspondent"><strong>Correspondent Details: </strong></label><br/><br/>
                    <label htmlFor="fname">First Name:  </label>
                    <input type="text" name="correspondentfname" id="correspondentfname" className="form-inp" value={correspondentfName} autoComplete="off" onChange={handleChange}/>
                </div>
                <div className="formContainer">
                    <label htmlFor="lname">Last Name: </label>
                    <input type="text" name="correspondentlname" id="correspondentlname" className="form-inp" value={correspondentlName} autoComplete="off" onChange={handleChange}/>
                </div>
                <div className="formContainer">
                    <label htmlFor="fname">Email:  </label>
                    <input type="text" name="correspondentemail" id="correspondentemail" className="form-inp" value={correspondentEmail} autoComplete="off" onChange={handleChange}/>
                </div>
                <div className="formContainer">
                    <label htmlFor="lname">WhatsApp Contact: </label>
                    <input type="text" name="correspondentwht" id="correspondentwht" className="form-inp" value={correspondentWhatsappNumber} autoComplete="off" onChange={handleChange}/>
                </div>
                <div className="formContainer">
                    <label>Syllabus:</label><br/><br/>
                    <label htmlFor="cbse">CBSE: </label>
                    <input type="checkbox" name="cbse" checked={syllabus.cbse} onChange={handleSyllabusChange}/>&nbsp;&nbsp;&nbsp;
                    <label htmlFor="state"> State:  </label> &nbsp;&nbsp;
                    <input type="checkbox" name="state" checked={syllabus.state} onChange={handleSyllabusChange}/>&nbsp;&nbsp;&nbsp;
                    <label htmlFor="icse"> ICSE: </label>&nbsp;&nbsp;
                    <input type="checkbox" name="icse" checked={syllabus.icse} onChange={handleSyllabusChange}/>&nbsp;&nbsp;&nbsp;
                    <label htmlFor="igcse"> IGCSE: </label>&nbsp;&nbsp;
                    <input type="checkbox" name="igcse" checked={syllabus.igcse} onChange={handleSyllabusChange}/>&nbsp;&nbsp;&nbsp;
                    <label htmlFor="ib"> IB:  </label>&nbsp;&nbsp;
                    <input type="checkbox" name="ib" checked={syllabus.ib} onChange={handleSyllabusChange}/>&nbsp;&nbsp;&nbsp;
                </div>
                <div className="formContainer">
                    <label  htmlFor ="website">Website URL:</label>
                    <input  type ="text" name="website" className="form-inp" value={webSite} id="website" onChange={handleChange} />
                </div>
                <div className="formContainer">
                    <label htmlFor="paidSubscription"> Paid Subscription:</label>
                    <input type="checkbox" name="paidSubscription" id="paidSubscription" checked={paidSubscription} onChange={handleChange}/>
                </div>
                <div className="formContainer">
                    <label htmlFor="socialMediaLink">Social Media Links: </label><br/><br/>
                    {createArray(count).map((_, index) => {
                        return <><input key={index} index={index} name="socialMediaLink" id="socialMediaLink"
                                        class="b form-inp" value={socialMediaLink[index] || ""}
                                        onChange={(event) => handleServiceChange(event, index)}/><br/><br/></>
                    }) }
                    <div className="buttonsContainer">
                        <button className="submitbutton" onClick={increaseField}> + </button>
                        <button className="resetbutton" onClick={decreaseField}> - </button>
                    </div>
                </div>
                <hr/>
                <div className="buttonsContainer formContainer">
                    <button type="submit" className="submitbutton" onClick={handleSubmit}>Register</button>
                    <button type="reset" className="resetbutton" onClick={handleClick}>Reset</button>
                </div>
            </form>
        </div>
    );
}

export default  SchoolForm;
