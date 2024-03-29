import React from "react";

import { addCompetition } from "../../firebase/firestore";
import Sidebar from "../../components/Sidebar";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import fbApp from "../../firebase/app";

const storage = getStorage(fbApp);

function CompRegForm() {
    const [competName, setCompetName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [organizedBy, setOrganizedby] = React.useState("");
    const [applStartDate, setApplstartdate] = React.useState("");
    const [applEndDate, setApplenddate] = React.useState("");
    const [compStartDate, setCompStartDate] = React.useState("");
    const [compEndDate, setCompEndDate] = React.useState("");
    const [classesFrom, setclassesFrom] = React.useState("");
    const [classesTo, setclassesTo] = React.useState("");
    const [individual, setIndividual] = React.useState(false);
    const [team, setTeam] = React.useState(false);
    const [atlSchools, setAtlschools] = React.useState(false);
    const [nonAtlSchools, setNonatlschools] = React.useState(false);
    const [refLink, setrefLink] = React.useState([]);
    const [refLinkCount, setrefLinkCount] = React.useState(0);
    const [requirements, setRequirements] = React.useState([]);
    const [requirementsCount, setRequirementsCount] = React.useState(0);
    const [paymentDetails, setPaymentDetails] = React.useState({ type: "" });
    const [file, setFile] = React.useState(null);
    const [selectedFiles, setSelectedFiles] = React.useState([]);
    const [fileNames, setFileNames] = React.useState([]);

    function clearForm() {
        setCompetName("");
        setDescription("");
        setOrganizedby("");
        setApplstartdate("");
        setApplenddate("");
        setclassesFrom("");
        setclassesTo("");
        setAtlschools("");
        setNonatlschools("");
        setIndividual("");
        setTeam("");
        setrefLink([]);
        setrefLinkCount(0);
        setRequirementsCount(0);
        setRequirements([]);
        setCompStartDate("");
        setCompEndDate("");
    }

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
        if (event.target.name === "competName") {
            setCompetName(event.target.value);
        } else if (event.target.name === "description") {
            setDescription(event.target.value);
        } else if (event.target.name === "organizedBy") {
            setOrganizedby(event.target.value);
        } else if (event.target.name === "applStartDate") {
            setApplstartdate(event.target.value);
        } else if (event.target.name === "applEndDate") {
            setApplenddate(event.target.value);
        } else if (event.target.name === "classesFrom") {
            setclassesFrom(event.target.value);
        } else if (event.target.name === "classesTo") {
            setclassesTo(event.target.value);
        } else if (event.target.name === "atlSchools") {
            setAtlschools(event.target.checked);
        } else if (event.target.name === "nonAtlSchools") {
            setNonatlschools(event.target.checked);
        } else if (event.target.name === "individual") {
            setIndividual(event.target.checked);
        } else if (event.target.name === "team") {
            setTeam(event.target.checked);
        } else if (event.target.name === "payment") {
            const temp = { ...paymentDetails };
            if (event.target.value === "free") {
                temp.fee = "0";
            }
            temp.type = event.target.value;
            setPaymentDetails(temp);
        } else if (event.target.name === "fee") {
            if (event.target.value > 0) {
                const temp = { ...paymentDetails };
                temp.fee = event.target.value;
                setPaymentDetails(temp);
            }
        } else if (event.target.name === "compStartDate") {
            setCompStartDate(event.target.value);
        } else if (event.target.name === "compEndDate") {
            setCompEndDate(event.target.value);
        }
    }

    console.log(paymentDetails)

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!competName.trim()) {
            alert("Competition Name is mandatory!");
        } else if (hasDuplicates(requirements) || hasDuplicates(refLink)) {
            alert("Data has duplicate values!");
        } else {
            try {
                const fileUrls = await Promise.all(selectedFiles.map(uploadFile));
                await addCompetition(
                    competName,
                    description,
                    organizedBy,
                    applStartDate,
                    applEndDate,
                    classesFrom,
                    classesTo,
                    atlSchools,
                    nonAtlSchools,
                    individual,
                    team,
                    refLink,
                    requirements,
                    paymentDetails,
                    compStartDate,
                    compEndDate,
                    fileUrls
                );
                alert("Added Successfully!");
                clearForm();
                window.location.href = "/competition-data/view";
            } catch (error) {
                console.error("Error adding competition: ", error);
                alert("Adding data failed! Please try again.");
            }
        }
    }

    function handleClick(event) {
        if (event.target.type === "reset") {
            clearForm();
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
        if (classes.includes("requirementsAdd")) {
            setRequirementsCount(requirementsCount + 1);
        } else if (classes.includes("refLinkAdd")) {
            setrefLinkCount(refLinkCount + 1);
        }
    }

    function decreaseField(event) {
        event.preventDefault();
        const classes = event.target.className.split(" ");
        if (classes.includes("requirementsRemove")) {
            if (requirementsCount !== 0) {
                requirements.pop();
                setRequirementsCount(requirementsCount - 1);
            }
        } else if (classes.includes("refLinkRemove")) {
            if (refLinkCount !== 0) {
                refLink.pop();
                setrefLinkCount(refLinkCount - 1);
            }
        }
    }

    function mfHandleChangeRequirements(event) {
        const index = Number(event.target.getAttribute("id").replace("requirements", ""));
        requirements[index] = event.target.value;
    }

    function mfHandleChangeRefLink(event) {
        const index = Number(event.target.getAttribute("id").replace("refLink", ""));
        refLink[index] = event.target.value;
    }

    async function uploadFile(file) {
        try {
            const folderPath = `competitionFiles/${competName}/`;
            const fileRef = ref(storage, folderPath + file.name);
            await uploadBytes(fileRef, file);
            const url = await getDownloadURL(fileRef);
            return url;
        } catch (error) {
            console.error("Error uploading file: ", error);
            throw error; // Rethrow the error to be caught in the handleSubmit function
        }
    }

    function onFilesSelect(event) {
        const selectedFiles = Array.from(event.target.files);
        setSelectedFiles((prevSelectedFiles) => [...prevSelectedFiles, ...selectedFiles]);
        const names = selectedFiles.map((file) => file.name);
        setFileNames((prevFileNames) => [...prevFileNames, ...names]);
        console.log("previous files:", names, "new files:", selectedFiles);

    }

    function removeSelectedFile(index) {
        setSelectedFiles((prevSelectedFiles) => {
            const updatedSelectedFiles = [...prevSelectedFiles];
            updatedSelectedFiles.splice(index, 1);
            return updatedSelectedFiles;
        });

        setFileNames((prevFileNames) => {
            const updatedFileNames = [...prevFileNames];
            updatedFileNames.splice(index, 1);
            return updatedFileNames;
        });
    }
    document.title = "Competition Form | Digital ATL";

    return (
        <div className="container" id="mobilescreen">
            <Sidebar />
            <link rel="stylesheet" href="/CSS/school.css" />
            <form>
                <div className="school-title">Competition Registration Form</div>
                <hr />
                <div className="formContainer">
                    <div className="row">
                    <div className="column">
                            <label htmlFor="competName"><strong>Name:</strong> </label>
                            <input type="text" name="competName" id="competName" placeholder="Enter the Competition Name" className="form-inp" value={competName} onChange={handleChange} required />
                        </div>
                    </div>
                    </div>
                <div className="formContainer">
                <div className="row">
                        <div className="column">
                    <label htmlFor="description"><strong>Description:</strong> </label>
                    <br />
                    <textarea id="description" name="description" className="form-inp" placeholder="Enter the Description" cols="18" rows="4" onChange={handleChange} value={description} />
                </div>
                <div className="column">
                            <label htmlFor="organizedBy"><strong>Organized By:</strong> </label>
                            <select name="organizedBy" id="organizedBy" className="form-inp" onChange={handleChange} value={organizedBy}>
                                <option value="" disabled={true}>Please Select... </option>
                                <option value="AIM" >AIM </option>
                                <option value="Partnered with AIM">Partnered with AIM</option>
                                <option value="External">External</option>
                            </select>
                    </div>
                </div>
                </div>
                <div className="formContainer">
                    <div className="row">
                        <div className="column">
                            <label htmlFor="applStartDate"><strong>Application Start Date:</strong> </label>
                            <input type="date" name="applStartDate" value={applStartDate} className="form-inp" onChange={handleChange} />&nbsp;&nbsp;&nbsp;&nbsp;
                            </div>
                            <div className="column">
                                <label htmlFor="applEndDate"> <strong>End Date:</strong> </label>
                                <input type="date" name="applEndDate" value={applEndDate} className="form-inp" onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                <div className="formContainer">
                    <div className="row">
                        <div className="column">
                            <label htmlFor="compStartDate"><strong>Competition Start Date:</strong> </label>
                            <input type="date" name="compStartDate" value={compStartDate} className="form-inp" onChange={handleChange} />&nbsp;&nbsp;&nbsp;&nbsp;
                            </div>
                            <div className="column">
                                <label htmlFor="compEndDate"><strong>End Date:</strong> </label>
                                <input type="date" name="compEndDate" value={compEndDate} className="form-inp" onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                <div className="formContainer">
                    <label><b>Eligibility: </b> </label>
                    <div className="formContainer">
                        <div className="row">
                            <div className="column">
                                <label htmlFor="classesFrom"><strong> Class From:</strong></label>
                                <select name="classesFrom" id="classesFrom" onChange={handleChange}  value={classesFrom} className="form-inp">
                                    <option value="" disabled={true}>Select... </option>
                                    { /*sucharitha 6.3*/}
                                    <option value="1st">1st</option><option value="2nd">2nd</option>
                                    <option value="3rd">3rd</option><option value="4th">4th</option>
                                    <option value="5th">5th</option><option value="6th">6th</option>
                                    <option value="7th">7th</option><option value="8th">8th</option>
                                    <option value="9th">9th</option><option value="10th">10th</option>
                                    <option value="11th">11th</option><option value="12th">12th</option>

                                    { /*sucharitha 6.3*/}
                                </select>
                                </div>
                                <div className="column">
                                    <label htmlFor="classesTo"><strong>To:</strong></label>
                                    <select name="classesTo" id="classesTo" className="form-inp" onChange={handleChange} value={classesTo}>
                                        <option value="" disabled={true}>Select... </option>
                                        { /*sucharitha 6.3*/}
                                        <option value="1st">1st</option><option value="2nd">2nd</option>
                                        <option value="3rd">3rd</option><option value="4th">4th</option>
                                        <option value="5th">5th</option><option value="6th">6th</option>
                                        <option value="7th">7th</option><option value="8th">8th</option>
                                        <option value="9th">9th</option><option value="10th">10th</option>
                                        <option value="11th">11th</option><option value="12th">12th</option>
                                        { /*sucharitha 6.3*/}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                <div className="formContainer">
                <div className="row">
                            <div className="column">
                    <label className='a'><strong> ATL Schools:</strong> </label> &nbsp;&nbsp;
                    <input type="checkbox" name="atlSchools" id="atlSchools" value={atlSchools} onChange={handleChange} /> &nbsp;&nbsp;
                    </div>
                    <div className="column">
                    <label><strong>Non-ATL Schools :</strong> </label> &nbsp;&nbsp;
                    <input type="checkbox" name="nonAtlSchools" id="nonAtlSchools" value={nonAtlSchools} onChange={handleChange} />
                </div>
                </div>
                </div>
                <div className="formContainer">
                <div className="row">
                <div className="column">
                    <label className='a'> <strong> Individual:</strong> </label>  &nbsp;&nbsp;
                    <input type="checkbox" name="individual" id="individual" value={individual} onChange={handleChange} /> &nbsp;&nbsp;
                    </div>
                    <div className="column">
                    <label> <strong>Team:</strong> </label> &nbsp;&nbsp;
                    <input type="checkbox" name="team" id="team" value={team} onChange={handleChange} />
                </div>
                </div>
                </div>
                <div className="formContainer">
                    <label><strong>Reference Links:</strong> </label>
                    <div className="multiForm">
                        {
                            createArray(refLinkCount).map((_, index) => {
                                return <div key={index}>
                                    <input name={"refLink" + index} id={"refLink" + index} cols="10" rows="10" placeholder="Enter the Reference Links" className="form-inp" onChange={mfHandleChangeRefLink} style={{ marginTop: "1rem" }} />
                                    <br />
                                </div>
                            })
                        }
                    </div>
                    <button className="submitbutton refLinkAdd" onClick={increaseField}>+</button>
                    <button className="resetbutton refLinkRemove" onClick={decreaseField}>-</button>
                </div>
                <div className="formContainer">
                <div className="row">
                <div className="column">
                <label><strong>Requirements:</strong> </label>
                    <div className="multiForm">
                        {
                            createArray(requirementsCount).map((_, index) => {
                                return <div key={index}>
                                    <textarea name={"requirements" + index} id={"requirements" + index} placeholder="Enter the Requirements " className="form-inp" onChange={mfHandleChangeRequirements} />
                                    <br />
                                </div>
                            })
                        }
                    </div>
                    <button className="submitbutton requirementsAdd" onClick={increaseField}>+</button>
                    <button className="resetbutton requirementsRemove" onClick={decreaseField}>-</button>
                </div>
                <div className="column">
                    <label htmlFor="payment"><strong>Payment Type:</strong> </label>
                    <select name="payment" id="payment" value={paymentDetails.type} placeholder="Ener the payment type" className="form-inp" onChange={handleChange}>
                        <option value="" disabled={true}>SELECT</option>
                        <option value="free">Free</option>
                        <option value="paid">Paid</option>
                    </select>
                    {
                        paymentDetails.type === "paid" ?
                            <><span style={{ marginLeft: "0.5rem", fontSize: "1.2rem" }}>₹</span><input style={{ width: "4rem" }} type="number" name="fee" id="fee" className="form-inp" placeholder="Fee" value={paymentDetails.fee} onChange={handleChange} /></> : ""
                    }
                </div>
                </div>
                </div>
                <div className="formContainer">
                    <label><strong>Upload new File (Competition Related):</strong> </label>
                    <label htmlFor="uploadMou" className="resetbutton">
                        <i className="fa-solid fa-upload"></i>
                    </label>
                    <input type="file" name="uploadMou" id="uploadMou" onChange={onFilesSelect} multiple style={{ display: "none" }} />
                </div>
                <div className="file-list">
                    {selectedFiles.map((file, index) => (
                        <div key={index} className="file-item">
                            <span>{fileNames[index]}</span>
                            <button type="button" className="remove-file-button" onClick={() => removeSelectedFile(index)}>
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
                <div className="buttonsContainer formContainer">
                    <button type="submit" className="submitbutton" onClick={handleSubmit}> Submit </button>
                    <button type="reset" className="resetbutton" onClick={handleClick}> Reset </button>
                </div>
            </form>
        </div>
    );
}


export default CompRegForm;