import React from "react";
import {doc, collection, onSnapshot, query} from "firebase/firestore";
import {db, updateStudentCompetition} from "../../firebase/firestore";
import Sidebar from "../../components/Sidebar";
import {getDownloadURL, getStorage, ref, uploadBytes, listAll, deleteObject} from "firebase/storage";
import fbApp from "../../firebase/app";
import {useParams} from "react-router-dom";

const storage = getStorage(fbApp);

function SnapshotCompEditForm() {
    const {studentId, competitionId} = useParams();

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
    const [refLink, setrefLink] = React.useState("");
    const [count, setCount] = React.useState(0);
    const [requirements, setRequirements] = React.useState([]);
    const [paymentDetails, setPaymentDetails] = React.useState({type: ""});
    const [fileURL, setFileURL] = React.useState("");
    const [fileChanged, setFileChanged] = React.useState(false);
    const [file, setFile] = React.useState(null);

    const [comments, setComments] = React.useState("");
    const [studentSubmission, setStudentSubmission] = React.useState("");
    const [studentFile, setStudentFile] = React.useState(null);


    function clearForm() {

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
        } else if(event.target.name === "refLink") {
            setrefLink(event.target.value);
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
        } else if(event.target.name  === "comments") {
            setComments(event.target.value);
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (requirements.length === 0) {
            alert("Please fill all the fields!");
        } else {
                if(fileChanged){
                    //const stRef = ref(storage, "competitionFiles/"+competName);
                    const studentRef = ref(storage, "StCompetitions/"+competName);
                    await listAll(/*stRef,*/ studentRef)
                    .then(res => {
                        res.items.forEach(async itemRef => {
                            await deleteObject(itemRef)
                        })
                    })
                        //const url = await uploadFile();
                        const stURL = await stUploadFile();
                        await updateStudentCompetition(competName, description, organizedBy, applStartDate, applEndDate, classesFrom, classesTo,  atlSchools, nonAtlSchools, individual, team, refLink, requirements, paymentDetails, compStartDate, compEndDate, "", comments, stURL, doc(db,"studentData",studentId, "competitionData", competitionId))
                            .then(() => {
                                console.log("studentSubmission", studentSubmission);
                            alert("Updated successfully!!");
                            
                            window.location.href = "/";
                        })
                        .catch(() => {
                            alert("Updating data failed! Please try again.");
                        });
                     } else {
                        await updateStudentCompetition(competName, description, organizedBy, applStartDate, applEndDate, classesFrom, classesTo,  atlSchools, nonAtlSchools, individual, team, refLink, requirements, paymentDetails, compStartDate, compEndDate,"", comments,"", doc(db,"studentData",studentId, "competitionData", competitionId))
                        .then(() => {
                            alert("Updated Successfully!");
                            clearForm();
                            window.location.href = "/";
                        })
                        .catch ((error) => {
                        console.error("Error updating competition:", error);
                        alert("Updating failed, please try again!");
                    });
            }
        }
    }

    function handleClick(event) {
        if (event.target.type === "reset") {
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
        const updatedRequirements = [...requirements];
        updatedRequirements[index] = value;
        setRequirements(updatedRequirements);
    }

    function increaseField(event) {
        event.preventDefault();
        setCount(count + 1);
    }

    function decreaseField(event) {
        event.preventDefault();
        if (count !== 0) {
            setCount(count - 1);
        }
    }

    async function uploadFile() {
        if (file) {
            const filesFolderRef = ref(storage, `competitionFiles/${competName}/${file.name}`);
            await uploadBytes(filesFolderRef, file);
            const url = await getDownloadURL(filesFolderRef);
            return url;
        } /*else {
            return ""; // Handle the case when file is not defined
        }*/
    }
    
    async function stUploadFile() {
        if (studentFile) {
            try {
                const filesFolderRef = ref(storage, `StCompetitions/${competName}/${studentFile.name}`);
                await uploadBytes(filesFolderRef, studentFile);
                const stURL = await getDownloadURL(filesFolderRef);
                return stURL;
            } catch (error) {
                console.error(error);
                return ""; // Handle the case when there's an error
            }
        } else {
            return ""; // Handle the case when studentFile is not defined
        }
    }
    
    function onFileSelect(event) {
        setFile(event.target.files[0]);
        setFileChanged(true);
        console.log(event.target.files[0]);
    }
    
    async function onStudentFileSelect(event) {
        event.preventDefault();
        const selectedFile = event.target.files[0];
        if(selectedFile) {
        setStudentFile(selectedFile);
        setFileChanged(true);
        console.log("Selected student file:", event.target.files[0]);
    }
}

    React.useEffect(() => {
        const q = query(doc(db, "studentData", studentId, "competitionData", competitionId));
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
            setrefLink(snap.data().refLink);
            setRequirements(snap.data().requirements);
            setCount(snap.data().requirements.length + 1);
            setPaymentDetails(snap.data().paymentDetails);
            if(snap.data().fileURL !== undefined) {
                setFileURL(snap.data().uploadFile);
            }
            setComments(snap.data().comments);
            console.log("studentSubmission", studentSubmission);
            setStudentSubmission(snap.data().studentUploadFile);
            if(snap.data().individual) {
                document.querySelector("#individual").checked = true;
            } else if(snap.data().atlSchools){
                document.querySelector("#atlSchools").checked = true;
            } else if(snap.data().nonAtlSchools){
                document.querySelector("#nonAtlSchools1").checked = true;
            } else if(snap.data().team){
                document.querySelector("#team").checked = true;
            }
        });
    }, []);

    document.title = "Competition Form | Digital ATL";
 return(
    <div className="container" id="mobilescreen">
            <Sidebar />
            <link rel="stylesheet" href="/CSS/school.css" />
            <form>
                <div className="school-title">Student Competitions Form</div>
                <hr />
                <div className="formContainer">
                <div className="row">
                <div className="column">
                    <label htmlFor="competName"><strong>Name:</strong> </label>
                    <input type="text" name="competName" id="competName" className="form-inp" value={competName} onChange={handleChange} disabled={true} />
                </div>
                </div>
                </div>
                <div className="formContainer">
                <div className="row">
                    <div className="column">
                    <label htmlFor="description"><strong>Description:</strong> </label>
                    <br/>
                    <textarea id="description" name="description"  cols="18" rows="4" className="form-inp" onChange={handleChange} value={description} disabled={true} />
                </div>
                <div className="column">
                    <label htmlFor="organizedBy"><strong>Organized By:</strong> </label>
                    <select name="organizedBy" id="organizedBy" onChange={handleChange} className="form-inp" value={organizedBy} disabled={true}>
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
                    <input type="date" name="applStartDate" value={applStartDate} className="form-inp" onChange={handleChange} disabled={true}/>&nbsp;&nbsp;&nbsp;&nbsp;
                    </div>
                    <div className="column">
                    <label htmlFor="applEndDate"><strong> End Date:</strong> </label>
                    <input type="date" name="applEndDate" value={applEndDate} className="form-inp" onChange={handleChange} disabled={true}/>
                </div>
                </div>
                </div>
                <div className="formContainer">
                <div className="row">
                    <div className="column">
                    <label htmlFor="compStartDate"><strong>Competition Start Date:</strong> </label>
                    <input type="date" name="compStartDate" value={compStartDate} className="form-inp" onChange={handleChange} disabled={true}/>&nbsp;&nbsp;&nbsp;&nbsp;
                    </div>
                    <div className="column">
                    <label htmlFor="compEndDate"><strong>End Date:</strong> </label>
                    <input type="date" name="compEndDate" value={compEndDate} className="form-inp" onChange={handleChange} disabled={true}/>
                </div>
                </div>
                </div>
                <div className="formContainer">
                    <label><b>Eligibility: </b> </label><br/>
                    </div>
                    <div className="formContainer">
                    <div className="row">
                    <div className="column">
                        <label htmlFor="classesFrom"><strong>Class From:</strong>   </label>
                        <select name="classesFrom" id="classesFrom" onChange={handleChange}  value={classesFrom} className="a form-inp" disabled={true}>
                            <option value="" disabled={true}>Select... </option>
                            <option value="6th">6th</option><option value="7th">7th</option>
                            <option value="8th">8th</option><option value="9th">9th</option>
                            <option value="10th">10th</option><option value="11th">11th</option>
                            <option value="12th">12th</option>
                        </select>
                        </div>
                        <div className="column">
                        <label htmlFor="classesTo"> <strong> To:</strong></label>
                        <select name="classesTo" id="classesTo" onChange={handleChange} className="form-inp" value={classesTo} disabled={true}>
                            <option value="" disabled={true}>Select... </option>
                            <option value="6th">6th</option><option value="7th">7th</option>
                            <option value="8th">8th</option><option value="9th">9th</option>
                            <option value="10th">10th</option><option value="11th">11th</option>
                            <option value="12th">12th</option>
                        </select>
                    </div>
                </div>
                </div>
                <div className="formContainer">
                <div className="row">
                    <div className="column">
                    <label className='a'><strong> ATL Schools:</strong> </label> &nbsp;&nbsp;
                    <input type="checkbox"  name="atlSchools" id="atlSchools" value={atlSchools} onChange={handleChange} disabled={true}/> &nbsp;&nbsp;
                    </div>
                    <div className="column">
                    <label> <strong>Non-ATL Schools :</strong> </label> &nbsp;&nbsp;
                    <input type="checkbox" name="nonAtlSchools" id="nonAtlSchools" value={nonAtlSchools} onChange={handleChange} disabled={true}/>
                </div>
                </div>
                </div>
                <div className="formContainer">
                <div className="row">
                    <div className="column">
                    <label className='a'> <strong> Individual:</strong> </label>  &nbsp;&nbsp;
                    <input type="checkbox"  name="individual" id="individual" value= {individual} onChange={handleChange} disabled={true}/> &nbsp;&nbsp;
                    </div>
                    <div className="column">
                    <label> <strong>Team:</strong> </label> &nbsp;&nbsp;
                    <input type="checkbox"  name="team" id="team" value={team} onChange={handleChange} disabled={true}/>
                </div>
                </div>
                </div>
                <div className="formContainer">
                <div className="row">
                    <label htmlFor="refLink"><strong>Reference link:</strong> </label>
                    <input type = "text" id="refLink" name="refLink" className="form-inp"  value={refLink} onChange={handleChange} disabled={true}/>
                </div>
                </div>
                <div className="formContainer">
                <div className="row">
                    <label htmlFor="payment"><strong>Payment Type:</strong> </label>
                    <select name="payment" id="payment" value={paymentDetails.type} className="form-inp" onChange={handleChange} disabled={true}>
                        <option value="" disabled={true}>SELECT</option>
                        <option value="free">Free</option>
                        <option value="paid">Paid</option>
                    </select>
                    {
                        paymentDetails.type === "paid" ?
                            <><span style={{marginLeft: "0.5rem", fontSize: "1.2rem"}}>₹</span><input style={{width: "4rem"}} type="number" name="fee" id="fee" className="form-inp" placeholder="Fee" value={paymentDetails.fee} onChange={handleChange} disabled={true} /></> : ""
                    }
                </div>
                </div>
                <div className="formContainer">
                    <label htmlFor="Requirements"><strong>Requirements:</strong> </label>
                    {createArray(count).map((_, index) => (
                        <><input key={index} id={index+" Requirements"} name="requirements" className="form-inp" value={requirements[index] || ""} onChange={(event) => handleServiceChange(event, index)} disabled={true}/><br/></>
                    ))}{" "}  &nbsp; &nbsp; 
                    <div className="buttonsContainer">
                        <button className="submitbutton" onClick={increaseField}> + </button>
                        <button className="resetbutton" onClick={decreaseField}> - </button>
                    </div>
                </div>
                <div className="formContainer">
                    <label><strong>Upload new File (Competition Related)</strong>: </label>
                     <label htmlFor="uploadMou" className="resetbutton">
                        <i className="fa-solid fa-upload"></i>
                    </label>
                    <br/>
                    <input type="file" name="uploadMou" id="uploadMou" onChange={onFileSelect} style={{ display: "none" }} disabled={true}/>

                    {
                        file !== null ?
                            <div>File Selected: {file.name}</div> : ""
                    }
                    <div>Current File: {fileURL === "" ? "None" : <a href={fileURL} target="_blank" rel="noreferrer">Click here to open</a>}</div>
                </div><br/>
                <div className="formContainer">
                <div className="row">
                    <label htmlFor="comments"><strong>Comments:</strong> </label>
                    <br/>
                    <textarea id="comments" name="comments" className="form-inp" onChange={handleChange} value={comments} />
                </div>
                </div>
                <div className="formContainer">
                <label><strong>Student Submission:</strong> </label>
                    <label htmlFor="studentSubmission" className="resetbutton">
                        <i className="fa-solid fa-upload"></i>
                    </label>
                    <br/>
                    <input type="file" name="studentSubmission" id="studentSubmission" onChange={onStudentFileSelect} style={{ display: "none" }} />

                    {
                        studentFile !== null ?
                            <div>File Selected: {studentFile.name}</div> : ""
                    }
                    <div>Current File: {studentSubmission === "" ? "None" : <a href={studentSubmission} target="_blank" rel="noreferrer">Click here to open</a>}</div>
                </div>
                <div className="buttonsContainer formContainer">
                    <button type="submit" className="submitbutton" onClick={handleSubmit}> Update </button>
                    <button type="reset" className="resetbutton" onClick={handleClick}> Reset </button>
                </div>
            </form>
        </div>
 );
}

export default SnapshotCompEditForm;