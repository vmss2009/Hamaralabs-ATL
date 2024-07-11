import React from "react";

import {db, updateCompetition} from "../../firebase/firestore";
import Sidebar from "../../components/Sidebar";
import {getDownloadURL, getStorage, ref, uploadBytes, listAll} from "firebase/storage";
import fbApp from "../../firebase/app";
import {doc, onSnapshot, query} from "firebase/firestore";
import {useParams} from "react-router-dom";

const storage = getStorage(fbApp);

function CompRegForm() {
    const {competitionId} = useParams();

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
    const [paymentDetails, setPaymentDetails] = React.useState({type: ""});
    const [fileURL, setFileURL] = React.useState("");
    const [fileChanged, setFileChanged] = React.useState(false);
    const [file, setFile] = React.useState(null);
    const [existingFiles, setExistingFiles] = React.useState([]); // Store existing file names
  const [removedFiles, setRemovedFiles] = React.useState([]); // Store files to be removed

    function clearForm() {
        setCompetName("");
        setDescription("");
        setOrganizedby("");
        setApplstartdate("");
        setApplenddate("");
        setCompStartDate("");
        setCompEndDate("");
        setclassesFrom("");
        setclassesTo("");
        setAtlschools("");
        setNonatlschools("");
        setIndividual("");
        setTeam("");
        setrefLink([]);
        setRequirements([]);
        setrefLinkCount(0);
        setRequirementsCount(0);
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
        if(event.target.name === "competName") {
            setCompetName(event.target.value);
        } else if(event.target.name === "description") {
            setDescription(event.target.value);
        } else if(event.target.name === "organizedBy") {
            setOrganizedby(event.target.value);
        } else if(event.target.name === "applStartDate") {
            setApplstartdate(event.target.value);
        } else if(event.target.name === "applEndDate") {
            setApplenddate(event.target.value);
        } else if(event.target.name === "classesFrom") {
            setclassesFrom(event.target.value);
        } else if(event.target.name === "classesTo") {
            setclassesTo(event.target.value);
        } else if(event.target.name === "atlSchools") {
            setAtlschools(event.target.checked);
        } else if(event.target.name === "nonAtlSchools") {
            setNonatlschools(event.target.checked);
        } else if(event.target.name === "individual") {
            setIndividual(event.target.checked);
        } else if(event.target.name === "team") {
            setTeam(event.target.checked);
        } else if(event.target.name === "payment") {
            const temp = {...paymentDetails};
            if(event.target.value === "free") {
                temp.fee = "0";
            }
            temp.type = event.target.value;
            setPaymentDetails(temp);
        } else if(event.target.name === "fee") {
            if(event.target.value > 0) {
                const temp = {...paymentDetails};
                temp.fee = event.target.value;
                setPaymentDetails(temp);
            }
        } else if(event.target.name==="compStartDate") {
            setCompStartDate(event.target.value);
        } else if(event.target.name==="compEndDate") {
            setCompEndDate(event.target.value);
        }
    }

    console.log(paymentDetails)

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (requirements.length !== 0) {
            if (!competName.trim()) {
                alert("Competition Name is mandatory!");
            } if (hasDuplicates(requirements)) {
                alert("Data has duplicate values!");
            } else {
                if(file === null) {
                    try {
                        await updateCompetition(competitionId, competName, description, organizedBy, applStartDate, applEndDate, classesFrom, classesTo,  atlSchools, nonAtlSchools, individual, team, refLink, requirements, paymentDetails, compStartDate, compEndDate)
                            .then(() => {
                                alert("Updated Successfully!");
                                clearForm();
                                window.location.href = "/competition-data/view";
                            })
                    } catch (error) {
                        console.error("Error updating competition: ", error);
                        alert("Couldn't add the data. Please try again!");
                    }
                } else {
                    try {
                        const url = await uploadFile();
                        await updateCompetition(competitionId, competName, description, organizedBy, applStartDate, applEndDate, classesFrom, classesTo,  atlSchools, nonAtlSchools, individual, team, refLink, requirements, paymentDetails, compStartDate, compEndDate, url)
                            .then(() => {
                                alert("Updated Successfully!");
                                clearForm();
                                window.location.href = "/competition-data/view";
                            })
                    } catch (error) {
                        console.error("Error adding competition: ", error);
                        alert("Couldn't update the data. Please try again!");
                    }
                }
            }
        } else {
            alert("Please enter the requirements!");
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
        if(classes.includes("requirementsAdd")) {
            setRequirementsCount(requirementsCount+1);
        } else if(classes.includes("refLinkAdd")) {
            setrefLinkCount(refLinkCount +1);
        }
    }
    
    function decreaseField(event) {
        event.preventDefault();
        const classes = event.target.className.split(" ");
        if (classes.includes("requirementsRemove")) {
            if (requirementsCount !== 0) {
                const updatedRequirements = [...requirements];
                updatedRequirements.pop(); // Remove the last element
                setRequirements(updatedRequirements);
                setRequirementsCount(requirementsCount - 1);
            }
        } else if (classes.includes("refLinkRemove")) {
            if (refLinkCount !== 0) {
                const updatedRefLink = [...refLink];
                updatedRefLink.pop(); // Remove the last element
                setrefLink(updatedRefLink);
                setrefLinkCount(refLinkCount - 1);
            }
        }
    }
    
    
    function mfHandleChangeRequirements(event) {
        const index = Number(event.target.getAttribute("id").replace("requirements", ""));
        const temp = [...requirements];
        temp[index] = event.target.value;
        setRequirements(temp);
    }

    function mfHandleChangeRefLink(event, index) {
        const value = event.target.value;
        setrefLink((prevRefLink) => {
          const updatedRefLink = [...prevRefLink];
          updatedRefLink[index] = value;
          return updatedRefLink;
        });
      }
    
    async function uploadFile() {
        const filesFolderRef = ref(storage, `competitionFiles/${competName}/${file.name}`);
        await uploadBytes(filesFolderRef, file);
        const url = await getDownloadURL(filesFolderRef);
        return url;
    }

    function onFileSelect(event) {
        setFile(event.target.files[0]);
        console.log(event.target.files[0]);
    }

    React.useEffect(() => {
        const q = query(doc(db, "competitionData", competitionId));
        onSnapshot(q, (snap) => {
            setCompetName(snap.data().name);
            setDescription(snap.data().description);
            setOrganizedby(snap.data().organizedBy);
            setApplstartdate(snap.data().applicationStartDate);
            setApplenddate(snap.data().applicationEndDate);
            setCompStartDate(snap.data().competitionStartDate);
            setCompEndDate(snap.data().competitionEndDate);
            setclassesFrom(snap.data().eligibility.classesFrom);
            setclassesTo(snap.data().eligibility.classesTo);
            if(snap.data().eligibility.atlSchools) {
                document.getElementById("atlSchools").checked = true;
            }

            if(snap.data().eligibility.nonAtlSchools) {
                document.getElementById("nonAtlSchools").checked = true;
            }

            if(snap.data().eligibility.individual) {
                document.getElementById("individual").checked = true;
            }

            if(snap.data().eligibility.team) {
                document.getElementById("team").checked = true;
            }
            setAtlschools(snap.data().eligibility.atlSchools);
            setNonatlschools(snap.data().eligibility.nonAtlSchools);
            setIndividual(snap.data().eligibility.individual);
            setTeam(snap.data().eligibility.team);
            setrefLink(snap.data().refLink); // Set refLink to the array directly
            setrefLinkCount(snap.data().refLink.length);
            setRequirements(snap.data().requirements);
            setRequirementsCount(snap.data().requirements.length);
            setPaymentDetails(snap.data().paymentDetails);
            if (snap.data().fileURL !== undefined) {
                setFileURL(snap.data().fileURL);
            }
    
            if (snap.data().individual) {
                document.querySelector("#individual").checked = true;
            } else if (snap.data().atlSchools) {
                document.querySelector("#atlSchools").checked = true;
            } else if (snap.data().nonAtlSchools) {
                document.querySelector("#nonAtlSchools1").checked = true;
            } else if (snap.data().team) {
                document.querySelector("#team").checked = true;
            }
        });
    }, []);

    
    React.useEffect(() => {
        const fetchExistingFiles = async () => {
          try {
            const storageRef = ref(storage, `competitionFiles/${competName}`);
            const files = await listAll(storageRef);
            const fileNames = files.items.map((file) => file.name);
            setExistingFiles(fileNames);
          } catch (error) {
            console.error("Error fetching existing files: ", error);
          }
        };
    
        if (competName) {
          fetchExistingFiles();
        }
      }, [competName]);
      
    // Handle file removal
    const handleFileRemove = (fileName) => {
        setRemovedFiles([...removedFiles, fileName]);
      };
    
      // Handle file selection
      const handleFileSelect = (event) => {
        const selectedFiles = event.target.files;
        setFile(selectedFiles[0]);
        console.log(selectedFiles[0]);
      }; 
      
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
                    <input type="text" name="competName" id="competName" placeholder="Enter the Competition Name" className="form-inp" value={competName} onChange={handleChange} required/>
                </div>
                </div>
                </div>
                <div className="formContainer">
                <div className="row">
                <div className="column">
                    <label htmlFor="description"><strong>Description:</strong> </label>
                    <br/>
                    <textarea id="description" name="description"  cols="18" rows="4" placeholder="Enter the Description" className="form-inp" onChange={handleChange} value={description} />
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
                    <input type="date" name="applStartDate" value={applStartDate} className="form-inp" onChange={handleChange}/>&nbsp;&nbsp;&nbsp;&nbsp;
                    </div>
                    <div className="column">
                    <label htmlFor="applEndDate"><strong>End Date:</strong> </label>
                    <input type="date" name="applEndDate" value={applEndDate} className="form-inp" onChange={handleChange}/>
                </div>
                </div>
                </div>
                <div className="formContainer">
                <div className="row">
                <div className="column">
                    <label htmlFor="compStartDate"><strong>Competition Start Date:</strong> </label>
                    <input type="date" name="compStartDate" value={compStartDate} className="form-inp" onChange={handleChange}/>&nbsp;&nbsp;&nbsp;&nbsp;
                    </div>
                    <div className="column">
                    <label htmlFor="compEndDate"><strong>End Date:</strong> </label>
                    <input type="date" name="compEndDate" value={compEndDate} className="form-inp" onChange={handleChange}/>
                </div>
                </div>
                </div>
                <div className="formContainer">
                <div className="row">
                <div className="column">
                    <label><b>Eligibility: </b> </label>
                    </div>
                    </div>
                    <div className="formContainer">
                    <div className="row">
                <div className="column">
                        <label htmlFor="classesFrom"><strong> Class From: </strong>  </label>
                        <select name="classesFrom" id="classesFrom" onChange={handleChange} className="form-inp" value={classesFrom} >
                            <option value="" disabled={true}>Select... </option>
                            <option value="1st">1st</option><option value="2nd">2nd</option>
                                <option value="3rd">3rd</option><option value="4th">4th</option>
                                <option value="5th">5th</option><option value="6th">6th</option>
                                <option value="7th">7th</option><option value="8th">8th</option>
                                <option value="9th">9th</option><option value="10th">10th</option>
                                <option value="11th">11th</option><option value="12th">12th</option>             
                               </select>
                               </div>
                               <div className="column">
                        <label htmlFor="classesTo"><strong>To:</strong></label>
                        <select name="classesTo" id="classesTo" onChange={handleChange} className="form-inp" value={classesTo}>
                            <option value="" disabled={true}>Select... </option>
                            <option value="1st">1st</option><option value="2nd">2nd</option>
                                <option value="3rd">3rd</option><option value="4th">4th</option>
                                <option value="5th">5th</option><option value="6th">6th</option>
                                <option value="7th">7th</option><option value="8th">8th</option>
                                <option value="9th">9th</option><option value="10th">10th</option>
                                <option value="11th">11th</option><option value="12th">12th</option>
                        </select>
                    </div>
                </div>
                </div>
                </div>
                <div className="formContainer">
                <div className="row">
                <div className="column">
                    <label className='a'><strong> ATL Schools: </strong></label> &nbsp;&nbsp;
                    <input type="checkbox"  name="atlSchools" id="atlSchools" value={atlSchools} onChange={handleChange} /> &nbsp;&nbsp;
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
                    <label className='a'><strong > Individual: </strong></label>  &nbsp;&nbsp;
                    <input type="checkbox"  name="individual" id="individual" value= {individual} onChange={handleChange} /> &nbsp;&nbsp;
                    </div>
                    <div className="column">
                    <label><strong> Team:</strong> </label> &nbsp;&nbsp;
                    <input type="checkbox"  name="team" id="team" value={team} onChange={handleChange} />
                </div>
                </div>
                </div>
                <div className="formContainer">
                <div className="row">
                    <label><strong>Reference Links:</strong> </label>
                    <div className="multiForm">
                    {createArray(refLinkCount).map((index) => (
                        <div key={index}>
                        <input
                            name={"refLink" + index}
                            id={"refLink" + index}
                            className="form-inp"
                            value={refLink[index] || ""}
                            onChange={(event) => mfHandleChangeRefLink(event, index)}
                            style={{ marginTop: "1rem" }}
                            placeholder="Enter the Reference Links"
                        />
                        <br />
                        </div>
                    ))}
                    </div>
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
                                    <textarea name={"requirements"+index} id={"requirements"+index} className="form-inp" placeholder="Enter the Requirements" value={requirements[index]} onChange={mfHandleChangeRequirements} />
                                    <br/>
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
                            <><span style={{marginLeft: "0.5rem", fontSize: "1.2rem"}}>₹</span><input style={{width: "4rem"}} type="number" name="fee" id="fee" className="form-inp" placeholder="Fee" value={paymentDetails.fee} onChange={handleChange} /></> : ""
                    }
                </div>
                </div>
                </div>
                <div className="formContainer">
                <label><strong>Uploaded Files:</strong> </label>
                {existingFiles.map((fileName) => (
                    <div key={fileName}>
                    <a href={`your-download-url/${fileName}`} target="_blank" rel="noreferrer">
                        {fileName}
                    </a>
                    </div>
                ))}
                </div>
                <div className="formContainer">
                <label><strong>Upload new File</strong> (Competition Related): </label>
                <label htmlFor="uploadMou" className="resetbutton">
                    <i className="fa-solid fa-upload"></i>
                </label>
                <input type="file" name="uploadMou" id="uploadMou" onChange={handleFileSelect} multiple style={{ display: "none" }} />
                <br />
                {fileURL !== "" ? (
                    <>
                    <span>Uploaded File: <a href={fileURL} target="_blank" rel="noreferrer">Click here to open</a></span>
                    <br />
                    </>
                ) : (
                    ""
                )}
                {file !== null ? "New File Selected: " + file.name : ""}
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