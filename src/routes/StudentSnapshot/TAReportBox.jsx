import React from "react";
import Popup from "../../components/Popup";
import {getDoc, doc, setDoc} from "firebase/firestore";
import db, {deleteAssignedTA} from "../../firebase/firestore";
import { notificationsToAdmins } from "../../firebase/cloudmessaging";
import { Link } from "react-router-dom";

function ReportBox(props) {
    const [displayValue, setDisplayValue] = React.useState("none");

    const [status, setStatus] = React.useState("");
    const [popupOpen, setPopupOpen] = React.useState(false);
    const files = props.uploadFile;

    function isValidUrl(string) {
        try {
          new URL(string);
          return true;
        } catch (err) {
          return false;
        }
    }

    function getFileNameFromUrl(url, operation) {
        const urlObj = new URL(url);
        const pathSegments = urlObj.pathname.split('/');
        const encodedFileName = pathSegments[pathSegments.length - 1];
        let fileName = decodeURIComponent(encodedFileName);
        console.log(fileName);
        fileName = fileName.replace(`tAFiles/${operation}/`, '');
        return fileName;
    }

    async function modifyStatus(event) {
        if (status !== "") {
            const docRef = doc(db, "studentData", props.studentId, "taData", props.taID);
            const docSnap = await getDoc(docRef);
            const d = new Date();
            const currentDate = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
            const statusData = [...docSnap.data().status, {status: status, modifiedAt: currentDate}];
            await setDoc(docRef, {
                status: statusData
            }, {merge: true});
            setStatus("");
            const userDocRef = doc(db, "studentData", props.studentId);
            const userData = await getDoc(userDocRef);
            await notificationsToAdmins("TA Status Update", `${userData.data().name.firstName} ${userData.data().name.lastName} from ${userData.data().school} changed status of ${props.taName} to ${status}`);
            alert("Modified");
            setPopupOpen(false);
        } else {
            alert("Please select a status");
        }
    }

    function handleMouseOver(event) {
        setDisplayValue("block");
    }

    function handleMouseOut(event) {
        setDisplayValue("none");
    }

    async function handleDelete(event) {
        console.log(props.docId);
        if(window.confirm("You are about to delete a student's assigned Activity")) {
            await deleteAssignedTA(props.studentId, props.docId)
                .then(() => {
                    alert("Student's TA has been deleted.");
                })
                .catch(err => {
                    console.log(err)
                    alert("An error has occurred please try again later.");
                });
        }
    }

    function handleEdit() {
        window.location.href = "/student-data/snapshot/"+props.studentId+"/ta/edit/"+props.taID;
    }



    const role = atob(localStorage.getItem("auth")).split("-")[2];

    return (
        <div className="box" id={props.id} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} style={{backgroundColor: props.status[props.status.length-1].status === "TA Completed" && "#ccffcc"}}>
            <link rel="stylesheet" href="/CSS/form.css"/>
            {
                popupOpen ?
                    <Popup trigger={popupOpen} setPopupEnabled={setPopupOpen} closeAllowed={true}>
                        <h1 className="title">Modify Status</h1>
                        <div className="formContainer">
                            <label htmlFor="status">Status: </label>
                            <select name="status" id="status" onChange={e => setStatus(e.target.value)} value={status}>
                                <option value="" >Select</option>
                                {
                                    props.status[props.status.length-1].status !== "On Hold" ? <option value="On Hold">On Hold</option> : ""
                                }
                                {
                                    props.status[props.status.length-1].status !== "Mentor Needed"? <option value="Mentor Needed">Mentor Needed</option> : ""
                                }
                                {
                                    props.status[props.status.length-1].status !== "Started Completing"? <option value="Started Completing">Started Completing</option> : ""
                                }
                                {
                                    props.status[props.status.length-1].status !== "Ongoing" ? <option value="Ongoing">Ongoing</option> : ""
                                }
                                {
                                    props.status[props.status.length-1].status !== "Nearly Completed" ? <option value="Nearly Completed">Nearly Completed</option> : ""
                                }
                                {
                                    props.status[props.status.length-1].status !== "In Review" ? <option value="In Review">In Review</option> : ""
                                }
                                {
                                    props.status[props.status.length-1].status !== "Review Completed"? <option value="Review Completed">Review Completed</option> : ""
                                }
                                {
                                    props.status[props.status.length-1].status !== "TA Completed" ? <option value="TA Completed">TA Completed</option> : ""
                                }
                            </select>
                            <br/>
                            <button className="submitbutton" onClick={modifyStatus}>Modify</button>
                        </div>
                    </Popup> : ""
            }
            <div className="name" style={{fontSize: "1.5rem"}}>{props.taName}</div>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>TA ID:</span> {props.taID}</div>
            <br/>

            { role === "admin" || props.paymentInfo === undefined || props.paymentRequired === false || (props.paymentInfo.status === "paid" && props.paymentRequired) ?
                <>
                <div className="boxContainer"><span style={{fontWeight: "600"}}>Introduction:</span> {props.intro}</div>
                <br/>
                <div className="boxContainer"><span style={{fontWeight: "600"}}>Goals:</span> <br/> {
                    props.goals.map((goal, index) => {
                        return <span key={index}>{index+1}. {goal} <br/></span>
                    })
                }
                </div>
                <br/>
                <div className="boxContainer"><span style={{fontWeight: "600"}}>Materials:</span> <br/> {
                    props.materials.map((material, index) => {
                        return <span key={index}>{index+1}. {material} <br/></span>
                    })
                }
                </div>
                <br/>
                <div className="boxContainer"><span style={{fontWeight: "600"}}>Instructions:</span> <br/> {
                    props.instructions.map((instruction, index) => {
                        return <span key={index}>{index+1}. {instruction} <br/></span>
                    })
                }
                </div>
                <br/>
                <div className="boxContainer"><span style={{fontWeight: "600"}}>Observation:</span> <br/> {
                    props.assessment.map((assessment, index) => {
                        return <span key={index}>{index+1}. {assessment} <br/></span>
                    })
                }
                </div>
                <br/>
                <div className="boxContainer"><span style={{fontWeight: "600"}}>Tips:</span> <br/> {
                    props.tips.map((tip, index) => {
                        return <span key={index}>{index+1}. {tip} <br/></span>
                    })
                }
                </div>
                <br/>
                <div className="boxContainer"><span style={{fontWeight: "600"}}>Extensions:</span> <br/> {
                    props.extensions.map((extension, index) => {
                        return <span key={index}>{index+1}. {extension} <br/></span>
                    })
                }
                </div>
                <br/>
                <div className="boxContainer"><span style={{fontWeight: "600"}}>Resources:</span> <br/> {
                    props.resources.map((resource, index) => {
                        return <span key={index}>{index+1}. {isValidUrl(resource) ? resource.startsWith("https://firebasestorage.googleapis.com/v0/b/") ? <a href={resource} target="_blank" rel="noreferrer">{getFileNameFromUrl(resource, props.taName)}</a> : <a href={resource} target="_blank" rel="noreferrer">{resource}</a> : resource} <br/></span>
                    })
                }
                </div>
                <br/>
                <div className="boxContainer"><span style={{fontWeight: "600"}}>Comments:  </span>{props.comment}</div>
                <br/>
                {/* {props.uploadFile?<div className="boxContainer"><span style={{fontWeight: "600"}}>Upload File: </span><a href={props.uploadFile} target="_blank" rel="noreferrer">Click here to open</a></div>:<div className="boxContainer"><span style={{fontWeight: "600"}}>Upload File: </span>None</div>} */}
                {
                    files !== undefined && files.length > 0 ?
                    <div className="boxContainer"><span style={{fontWeight: "600"}}>Files:</span> <br/> {
                        files.map((file, index) => {
                            return <span key={index}>{index+1}. <a href={file} target="_blank" rel="noreferrer">{getFileNameFromUrl(file, props.taName)}</a> <br/></span>
                        })
                    }
                    </div>
                    : ""
                }
                <br/>
                <div className="boxContainer"><span style={{fontWeight: "600"}}>Status Tracking:</span> <br/> {
                    props.status.map((eachStatus, index) => {
                        return <span key={index}>{index+1}. {eachStatus.status} - <span> {eachStatus.modifiedAt} </span> <br/></span>
                    })
                }</div>
                <br/>
                <div className="boxContainer">
                    <span style={{fontWeight: "600"}}>Current Status:</span> {props.status[props.status.length-1].status} - <span> {props.status[props.status.length-1].modifiedAt} </span>
                </div>
                {
                    props.status[props.status.length-1] !== "TA Completed" || role === "admin" || role === "atlIncharge" ?
                        <div className="buttonsContainer" id={"btnContainer"+props.id} style={{display: displayValue}}>
                            <button className="resetbutton editBtn" onClick={handleEdit}><i className="fa-solid fa-pencil"></i></button>
                            <button className="submitbutton deleteBtn" onClick={handleDelete}><i className="fa-solid fa-trash-can"></i></button>
                            <button className="submitbutton" onClick={() => {setPopupOpen(true)}}>Modify Status</button>
                        </div>: ""
                }
                </> : <><h3>Please pay the required amount to access this tinkering activity <Link to="/payments"><li className="nav-item last-li">Payments</li></Link></h3><br/></>
            }
        </div>
    );
}

export default ReportBox;