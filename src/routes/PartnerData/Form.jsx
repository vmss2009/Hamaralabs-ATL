import React from "react";
import {Bars} from "react-loader-spinner";

import {addPartner, db} from "../../firebase/firestore";
import Popup from "../../components/Popup";
import Sidebar from "../../components/Sidebar";
import {getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";
import fbApp from "../../firebase/app";
import {collection, onSnapshot, query} from "firebase/firestore";

const storage = getStorage(fbApp)

function PartnerForm() {
    const [partnerType, setPartnerType] = React.useState("");
    const [partnerName, setPartnerName] = React.useState("");
    const [addressLine1, setAddressLine1] = React.useState("");
    const [city, setCity] = React.useState("");
    const [state, setState] = React.useState("");
    const [country, setCountry] = React.useState("");
    const [pincode, setPincode] = React.useState("");
    const [dmFirstName, setDMFirstName] = React.useState("");
    const [dmLastName, setDMLastName] = React.useState("");
    const [dmEmail, setDMEmail] = React.useState("");
    const [dmPhone, setDMPhone] = React.useState("");
    const [cpFirstName, setCPFirstName] = React.useState("");
    const [cpLastName, setCPLastName] = React.useState("");
    const [cpEmail, setCPEmail] = React.useState("");
    const [cpPhone, setCPPhone] = React.useState("");
    const [proposedActivities, setProposedActivities] = React.useState([]);
    const [proposedActivitiesCount, setProposedActivitiesCount] = React.useState(0);
    const [contactPersons, setContactPersons] = React.useState([]);
    const [cpCount, setCPCount] = React.useState(0);
    const [projectsValue, setProjectsValue] = React.useState([]);
    const [projects, setProjects] = React.useState([]);
    const [projectsCount, setProjectsCount] = React.useState(0);
    const [cpDesignation, setCPDesignation] = React.useState("");

    const [file, setFile] = React.useState(null);
    const [loadingTrigger, setLoadingTrigger] = React.useState(false);

    // function clearForm() {
    //     setTAID("");
    //     setTAName("");
    //     setIntro([]);
    //     setGoals([]);
    //     setMaterials([]);
    //     setInstructions([]);
    //     setTips([]);
    //     setAssessment([]);
    //     setExtensions([]);
    //     setResources([]);
    //     setGoalsCount(0);
    //     setMaterialsCount(0);
    //     setInstructionsCount(0);
    //     setTipsCount(0);
    //     setAssesmentCount(0);
    //     setExtensionsCount(0);
    //     setResourcesCount(0);
    // }

    function hasDuplicates(array) {
        var valuesSoFar = Object.create(null);
        for (var i = 0; i < array.length; ++i) {
            var value = array[i];
            if (value in valuesSoFar) {
                return true;
            }
            valuesSoFar[value] = true;
        }
        return false;
    }

    function handleChange(event) {
        if(event.target.name === "partnerType") {
            setPartnerType(event.target.value);
        } else if(event.target.name === "partnerName") {
            setPartnerName(event.target.value);
        } else if(event.target.name === "addressLine1") {
            setAddressLine1(event.target.value);
        } else if(event.target.name === "city") {
            setCity(event.target.value);
        } else if(event.target.name === "state") {
            setState(event.target.value);
        } else if(event.target.name === "country") {
            setCountry(event.target.value);
        } else if(event.target.name === "pincode") {
            setPincode(event.target.value);
        } else if(event.target.name === "dmFirstName") {
            setDMFirstName(event.target.value);
        } else if(event.target.name === "dmLastName") {
            setDMLastName(event.target.value);
        } else if(event.target.name === "dmEmail") {
            setDMEmail(event.target.value);
        } else if(event.target.name === "dmPhone") {
            setDMPhone(event.target.value);
        } else if(event.target.name === "cpFirstName") {
            setCPFirstName(event.target.value);
        } else if(event.target.name === "cpLastName") {
            setCPLastName(event.target.value);
        } else if(event.target.name === "cpEmail") {
            setCPEmail(event.target.value);
        } else if(event.target.name === "cpPhone") {
            setCPPhone(event.target.value);
        } else if (event.target.name === "cpDesignation") {
            setCPDesignation(event.target.value);
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if(hasDuplicates(proposedActivities)) {
            alert("Data has duplicate values!");
        } else {
            if(file === null) {
                console.log(partnerType)
                await addPartner(partnerType, partnerName, addressLine1, city, state, country, pincode, dmFirstName,
                    dmLastName, dmEmail, dmPhone, contactPersons, proposedActivities, projectsValue)
                    .then(() => {
                        alert("Added successfully!!");
                        window.location.href = "/partner-data/view";
                    })
                    .catch(() => {
                        alert("Adding data failed! Please try again.");
                    });
            } else {
                const dURL = await uploadFile();
                await addPartner(partnerType, partnerName, addressLine1, city, state, country, pincode, dmFirstName,
                    dmLastName, dmEmail, dmPhone, contactPersons, proposedActivities, projectsValue, dURL)
                    .then(() => {
                        alert("Added successfully!!");
                        window.location.href = "/partner-data/view";
                    })
                    .catch(() => {
                        alert("Adding data failed! Please try again.");
                    });
            }
        }
    }

    function handleClick(event) {
        if(event.target.type === "reset") {
            // clearForm();
        }
    }

    function createArray(maxCount) {
        const arr = [];
        for (let i = 0; i < maxCount; i++) {
            arr.push(i);
        }
        return arr;
    }

    function increaseField(event) {
        event.preventDefault();
        const classes = event.target.className.split(" ");
        if(classes.includes("resourcesAdd")) {
            setProposedActivitiesCount(proposedActivitiesCount+1);
        } else if(classes.includes("cpAdd")) {
            const temp = [...contactPersons];
            temp.push({firstName: "", lastName: "", email: "", phone: ""});
            setContactPersons(temp);
            setCPCount(cpCount+1);
        } else if(classes.includes("projectsAdd")) {
            const temp = [...projectsValue];
            temp.push({projectId: "", projectName: ""});
            setProjectsValue(temp);
            setProjectsCount(projectsCount+1);
        }
    }

    function decreaseField(event) {
        event.preventDefault();
        const classes = event.target.className.split(" ");
        if(classes.includes("resourcesRemove")) {
            if(proposedActivitiesCount !== 0) {
                const temp = [...proposedActivities];
                temp.pop();
                setProposedActivities(temp);
                setProposedActivitiesCount(proposedActivitiesCount-1);
            }
        } else if(classes.includes("cpRemove")) {
            if(cpCount !== 0) {
                const temp = [...contactPersons];
                temp.pop();
                setContactPersons(temp);
                setCPCount(cpCount-1);
            }
        } else if(classes.includes("projectsRemove")) {
            if(projectsCount !== 0) {
                const temp = [...projectsValue];
                temp.pop();
                setProjectsValue(temp);
                setProjectsCount(projectsCount-1);
            }
        }
    }

    function mfHandleChangeProposedActivities(event) {
        const index = Number(event.target.getAttribute("id").replace("proposedActivities", ""));
        const temp = [...proposedActivities];
        temp[index] = event.target.value;
        setProposedActivities(temp);
    }

    async function uploadFile() {
        const filesFolderRef = ref(storage, `partnerFiles/${partnerName}/${file.name}`);
        await uploadBytes(filesFolderRef, file);
        const temp = await getDownloadURL(filesFolderRef);
        return temp;
    }

    function onFileSelect(event) {
        setFile(event.target.files[0]);
        console.log(event.target.files[0]);
    }

    function mfHandleChangeCPFname(event) {
        const index = event.target.name.replace("cpFirstName", "");
        const temp = [...contactPersons];
        temp[index].firstName = event.target.value;
        setContactPersons(temp);
    }

    function mfHandleChangeCPLname(event) {
        const index = event.target.name.replace("cpLastName", "");
        const temp = [...contactPersons];
        temp[index].lastName = event.target.value;
        setContactPersons(temp);
    }

    function mfHandleChangeCPEmail(event) {
        const index = event.target.name.replace("cpEmail", "");
        const temp = [...contactPersons];
        temp[index].email = event.target.value;
        setContactPersons(temp);
    }

    function mfHandleChangeCPPhone(event) {
        const index = event.target.name.replace("cpPhone", "");
        const temp = [...contactPersons];
        temp[index].phone = event.target.value;
        setContactPersons(temp);
    }
    function mfHandleChangeCPDesignation(event) {
        const index = event.target.name.replace("cpDesignation", "");
        const temp = [...contactPersons];
        temp[index].designation = event.target.value;
        setContactPersons(temp);
    }
    async function mfHandleChangeProjects(event) {
        const index = Number(event.target.getAttribute("id").replace("projects", ""));
        const temp = [...projectsValue];
        temp[index].projectId = event.target.value.split("___")[0];
        temp[index].projectName = event.target.value.split("___")[1];
        await setProjectsValue(temp);
        console.log(projectsValue);
    }

    React.useEffect(() => {
        const q = query(collection(db, "projectsData"));
        onSnapshot(q, (snaps) => {
            const temp = [];
            snaps.forEach((doc) => {
                temp.push(doc.data());
            });
            setProjects(temp);
        });
    }, []);

    let decodedAuth = atob(localStorage.auth);

    let split = decodedAuth.split("-");

    window.uid = split[0];
    window.email = split[1];
    window.role = split[2];

    document.title = "Partner Data Form | Digital ATL";

    return (
        <div className="container" id="mobilescreen">
            <Sidebar />
            <link rel="stylesheet" href="/CSS/school.css" />
            <link rel="stylesheet" href="/CSS/report.css"/>
            <Popup trigger={loadingTrigger} setPopupEnabled={setLoadingTrigger} closeAllowed={false}>
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
            </Popup>
            <form>
                <div className="school-title">Partner Data Form | Digital ATL</div>
                <hr />
                <div className="formContainer">
                <div className="row">
                        <div className="column">
                    <label htmlFor=""><strong>Kind of Partner:</strong> </label><br />
                    <select name="partnerType" id="partnerType" value={partnerType} placeholder="Enter the kind of partner" className="form-inp" onChange={handleChange}>
                        <option value="" disabled={true}>SELECT</option>
                        <option value="Educational">Educational</option>
                        <option value="Corporate">Corporate</option>
                        <option value="Non-Profit">Non-Profit</option>
                    </select>
                </div>
                <div className="column">
                    <label htmlFor="partnerName"><strong>Name of Partner:</strong> </label>
                    <input type="text" name="partnerName" id="partnerName" placeholder="Enter the partnerName" className="form-inp" value={partnerName} onChange={handleChange}/>
                </div>
                </div>
                </div>
                <div className="formContainer">
                    <label htmlFor="address"><strong>Address:</strong> </label>
                    <div className="subContainer" style={{marginLeft: "3rem"}}>
                        <div className="formContainer">
                        <div className="row">
                        <div className="column">
                            <label htmlFor="addressLine1"><strong>Address Line 1:</strong> </label>
                            <input type="text" name="addressLine1" id="addressLine1" placeholder="Enter the address line" className="form-inp" value={addressLine1} onChange={handleChange}/>
                        </div>
                        <div className="column">
                            <label htmlFor="city"><strong>City / Province:</strong> </label>
                            <input type="text" name="city" id="city" className="form-inp" placeholder="Enter the city/province" value={city} onChange={handleChange} />
                        </div>
                        </div>
                        </div>
                        <div className="formContainer">
                        <div className="row">
                        <div className="column">
                            <label htmlFor="state"><strong>State:</strong> </label>
                            <input type="text" name="state" id="state" className="form-inp" placeholder="Enter the state " value={state} onChange={handleChange} />
                        </div>
                        <div className="column">
                            <label htmlFor="country"><strong>Country:</strong> </label>
                            <input type="text" name="country" id="country" className="form-inp" placeholder="Enter the country" value={country} onChange={handleChange} />
                        </div>
                        </div>
                        </div>
                        <div className="formContainer">
                            <label htmlFor="pincode"><strong>Pincode:</strong> </label>
                            <input type="number" name="pincode" id="pincode" className="form-inp" placeholder="Enter the pincode " value={pincode} onChange={handleChange} />
                        </div>
                    </div>
                </div>
                <div className="formContainer">
                    <label style={{fontWeight: "600"}}><strong>Decision Maker Details:</strong> </label>
                    <div className="subContainer">
                        <div className="formContainer">
                        <div className="row">
                        <div className="column">
                            <label htmlFor="dmFirstName"><strong>First Name:</strong> </label>
                            <input type="text" name="dmFirstName" id="dmFirstName" placeholder="Enter the firstname" className="form-inp" value={dmFirstName} onChange={handleChange}/>
                        </div>
                        <div className="column">
                            <label htmlFor="dmLastName"><strong>Last Name:</strong> </label>
                            <input type="text" name="dmLastName" id="dmLastName" placeholder="Enter the lastname" className="form-inp" value={dmLastName} onChange={handleChange}/>
                        </div>
                        </div>
                        </div>
                        <div className="formContainer">
                        <div className="row">
                        <div className="column">
                            <label htmlFor="dmEmail"><strong>Email:</strong> </label>
                            <input type="text" name="dmEmail" id="dmEmail" className="form-inp" placeholder="Enter the email" value={dmEmail} onChange={handleChange}/>
                        </div>
                        <div className="column">
                            <label htmlFor="dmPhone"><strong>Phone Number:</strong> </label>
                            <input type="number" name="dmPhone" id="dmPhone" placeholder="Enter the phone number" className="form-inp" value={dmPhone} onChange={handleChange}/>
                        </div>
                    </div>
                </div>
                </div>
                </div>

                <div className="formContainer">
                    <label style={{fontWeight: "600"}}><strong>Contact Persons Details:</strong> </label>
                    {
                        createArray(cpCount).map((_, index) => {
                            return <div className="box">
                                <div className="boxContainer">
                                <div className="row">
                        <div className="column">
                                    <label htmlFor={"cpFirstName"+index}><strong>First Name:</strong> </label>
                                    <input type="text" name={"cpFirstName"+index} id={"cpFirstName"+index}  placeholder="Enter the firstname" className="form-inp" value={contactPersons[index].firstName} onChange={mfHandleChangeCPFname}/>
                                </div>
                                <div className="column">
                                    <label htmlFor={"cpLastName"+index}><strong>Last Name:</strong> </label>
                                    <input type="text" name={"cpLastName"+index} id={"cpLastName"+index} className="form-inp" placeholder="Enter the lastname" value={contactPersons[index].lastName} onChange={mfHandleChangeCPLname}/>
                                </div>
                                </div>
                                </div>
                                <br/>
                                <div className="boxContainer">
                                <div className="row">
                        <div className="column">
                                    <label htmlFor={"cpEmail"+index}><strong>Email:</strong> </label>
                                    <input type="email" name={"cpEmail"+index} id={"cpEmail"+index} placeholder="Enter your email" className="form-inp" value={contactPersons[index].email} onChange={mfHandleChangeCPEmail}/>
                                </div>
                                <div className="column">
                                    <label htmlFor={"cpPhone"+index}><strong>Phone:</strong> </label>
                                    <input type="number" name={"cpPhone"+index} id={"cpPhone"+index} className="form-inp" placeholder="Enter the phone" value={contactPersons[index].phone} onChange={mfHandleChangeCPPhone}/>
                                </div>
                                </div>
                                </div>
                                <br />
                                <div className="boxContainer">
                                <div className="row">
                                    <label htmlFor={"cpDesignation" + index}><strong>Designation:</strong> </label>
                                    <input type="text" name={"cpDesignation" + index} id={"cpDesignation" + index} placeholder="Enter the designation" className="form-inp" value={contactPersons[index].designation} onChange={mfHandleChangeCPDesignation} />
                                </div>
                            </div>
                            </div>
                            
                           
                        })
                    }
                    <br/>
                    <button className="submitbutton cpAdd" onClick={increaseField}>+</button>
                    <button className="resetbutton cpRemove" onClick={decreaseField}>-</button>
                </div>
                <div className="formContainer">
                    <label><strong>Proposed Activities:</strong> </label>
                    <div className="multiForm">
                        {
                            createArray(proposedActivitiesCount).map((_, index) => {
                                return <div key={index}>
                                    <textarea name={"proposedActivities"+index} className="form-inp" id={"proposedActivities"+index} cols="20" rows="3" placeholder="Enter the proposed activites" onChange={mfHandleChangeProposedActivities} style={{marginTop: "1rem"}}/>
                                    <br/>
                                </div>
                            })
                        }
                    </div>
                    <button className="submitbutton resourcesAdd" onClick={increaseField}>+</button>
                    <button className="resetbutton resourcesRemove" onClick={decreaseField}>-</button>
                </div>
                <div className="formContainer">
                    <label><strong>Projects:</strong> </label>
                    <div className="multiForm">
                        {
                            createArray(projectsCount).map((_, index) => {
                                return <div key={index}>
                                    <select name={"projects"+index} className="form-inp" id={"projects"+index} placeholder="Enter the projects" value={projectsValue[index].projectId+"___"+projectsValue[index].projectName} onChange={mfHandleChangeProjects}>
                                        <option value="___" disabled={true}>SELECT</option>
                                        {
                                            projects.map((project, index2) => {
                                                return <option key={index2} value={project.projectId+"___"+project.projectName}>{project.projectId}</option>
                                            })
                                        }
                                    </select>
                                    <span style={{fontSize: "1.2rem", marginLeft: "1rem"}}>{
                                        projectsValue[index].projectName === ""? "" : "Project Name: "+projectsValue[index].projectName
                                    }</span>
                                    <br/><br/>
                                </div>
                            })
                        }
                    </div>
                    <button className="submitbutton projectsAdd" onClick={increaseField}>+</button>
                    <button className="resetbutton projectsRemove" onClick={decreaseField}>-</button>
                </div>
                <div className="formContainer">
                    <label><strong>Upload MOU:</strong> </label>
                    <label htmlFor="uploadMou" className="resetbutton">
                        <i className="fa-solid fa-upload"></i>
                    </label>
                    <input type="file" name="uploadMou" id="uploadMou"  onChange={onFileSelect} style={{display: "none"}}/>
                    {
                        file !== null ?
                            "File Selected: " + file.name : ""
                    }
                </div>
                <div className="formContainer">
                    <button type="submit" className="submitbutton" onClick={handleSubmit}>Add</button>
                    <button type="reset" className="resetbutton" onClick={handleClick}>Reset</button>
                </div>
            </form>
        </div>
    );
}

export default PartnerForm;
