import React from "react";
import Popup from "../../components/Popup";
import {getDoc, doc, setDoc} from "firebase/firestore";
import db, {deleteAssignedCompetition} from "../../firebase/firestore";

function ReportBox(props) {
    const [displayValue, setDisplayValue] = React.useState("none");

    const [status, setStatus] = React.useState(props.status[props.status.length-1]);
    const [popupOpen, setPopupOpen] = React.useState(false);

    async function modifyStatus(event) {
        const docRef = doc(db, "studentData", props.studentId, "competitionData", props.docId);
        const docSnap = await getDoc(docRef);
        const d = new Date();
        const currentDate = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
        const statusData = [...docSnap.data().status, {status: status, modifiedAt: currentDate}]
        await setDoc(docRef, {
            status: statusData
        }, {merge: true});
        alert("Modified");
        setPopupOpen(false);
    }

       function handleMouseOver(event) {
        setDisplayValue("block");
    }

    function handleMouseOut(event) {
        setDisplayValue("none");
    }

    async function handleDelete(event) {
        console.log(props.docId);
        if(window.confirm("You are about to delete a student's assigned Competition")) {
            await deleteAssignedCompetition(props.studentId, props.docId)
                .then(() => {
                    alert("Student's Competition has been deleted.");
                })
                .catch(err => {
                    console.log(err)
                    alert("An error has occurred please try again later.");
                });
        }
    }

    function handleEdit() {
        window.location.href = "/student-data/snapshot/" + props.studentId + "/competition/edit/" + props.docId;
    }

    function formatDate(dateString) {
      if (!dateString) {
          return ""; 
      }


      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
  }

    const role = atob(localStorage.getItem("auth")).split("-")[2];

    return (
      <div className="box" id={props.id} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
            <link rel="stylesheet" href="/CSS/form.css"/>
            {
                popupOpen ?
                    <Popup trigger={popupOpen} setPopupEnabled={setPopupOpen} closeAllowed={true}>
                        <h1 className="title">Modify Status</h1>
                        <div className="formContainer">
                            <label htmlFor="status">Status: </label>
                            <select name="status" id="status" onChange={e => setStatus(e.target.value)} value={status}>
                                {
                                    props.status[props.status.length-1] !== "On Hold" ? <option value="On Hold">On Hold</option> : ""
                                }
                                {
                                    props.status[props.status.length-1] !== "Mentor Needed"? <option value="Mentor Needed">Mentor Needed</option> : ""
                                }
                                {
                                    props.status[props.status.length-1] !== "Started Completing"? <option value="Started Completing">Started Completing</option> : ""
                                }
                                {
                                    props.status[props.status.length-1] !== "Ongoing" ? <option value="Ongoing">Ongoing</option> : ""
                                }
                                {
                                    props.status[props.status.length-1] !== "Nearly Completed" ? <option value="Nearly Completed">Nearly Completed</option> : ""
                                }
                                {
                                    props.status[props.status.length-1] !== "In Review" ? <option value="In Review">In Review</option> : ""
                                }
                                {
                                    props.status[props.status.length-1] !== "Review Completed"? <option value="Review Completed">Review Completed</option> : ""
                                }
                                {
                                    props.status[props.status.length-1] !== "Competition Completed" ? <option value="Competition Completed">Competition Completed</option> : ""
                                }
                            </select>
                            <br/>
                            <button className="submitbutton" onClick={modifyStatus}>Modify</button>
                        </div>
                    </Popup> : ""
            }
            
      <div className="name" style={{fontSize: "1.5rem"}}>{props.competName}</div>

      <div className="boxContainer"><span style={{fontWeight: "600"}}>Description:</span> {props.description}</div>
      <br/>
      <div className="boxContainer"><span style={{fontWeight: "600"}}>OrganizedBy:</span> {props.organizedBy}</div>
      <br/>
      <div className="boxContainer"><span style={{ fontWeight: "600" }}>Application Start Date:</span>{formatDate(props.applStartDate)}</div>
      <br />
      <div className="boxContainer"><span style={{ fontWeight: "600" }}>Application End Date: </span> {formatDate(props.applEndDate)}</div>
      <br />
      <div className="boxContainer"><span style={{ fontWeight: "600" }}>Competition Start Date:</span>{formatDate(props.compStartDate)}</div>
      <br />
      <div className="boxContainer"><span style={{ fontWeight: "600" }}>Competition End Date: </span> {formatDate(props.compEndDate)}</div>
      <br />
      <div className="boxContainer"><span style={{ fontWeight: "600" }}>Eligibility: </span> </div>
      <br />
      <div className="boxContainer"><span style={{ fontWeight: "600" }}>Classes From: </span>{props.classesFrom}</div>
      <br />
      <div className="boxContainer"><span style={{ fontWeight: "600" }}>Classes To: </span>{props.classesTo}</div>
      <br />
      <div className="boxContainer"><span style={{ fontWeight: "600" }}>ATL Schools: </span>{props.atlSchools ? "Yes" : "No"}</div>
      <br />
      <div className="boxContainer"><span style={{ fontWeight: "600" }}>Non ATL Schools: </span>{props.nonAtlSchools ? "Yes" : "No"}</div>
      <br />
      <div className="boxContainer"><span style={{ fontWeight: "600" }}>Individual: </span>{props.individual ? "Yes" : "No"}</div>{" "}
      <br />
      <div className="boxContainer"><span style={{ fontWeight: "600" }}>Team: </span> {props.team ? "Yes" : "No"}</div>
      <br />
      <div className="boxContainer"><span style={{ fontWeight: "600" }}>Reference Link: </span><a href={props.refLink} target="_blank">{props.refLink}</a></div>
      <br />
      <div className="boxContainer"><span style={{ fontWeight: "600" }}>Fee Details: </span>
                                    {props.paymentDetails && props.paymentDetails.type === "free"
                                      ? "Free of cost"
                                      : props.paymentDetails && props.paymentDetails.type === "paid"
                                      ? "₹ " + props.paymentDetails.fee
                                      : " "}
      </div>
      <br />
      <div className="boxContainer"><span style={{ fontWeight: "600" }}>Requirements: </span> <br />
                                    {props.requirements.map((requirement, index) => {
                                      return (
                                        <span key={index}>
                                          {index + 1}. {requirement} <br />{" "}
                                        </span>
                                      );
                                    })}
      </div>
      <br />
          {props.fileURL?<div className="boxContainer"><span style={{fontWeight: "600"}}>Upload File: </span><a href={props.fileURL} target="_blank" rel="noreferrer">Click here to open</a></div>:<div className="boxContainer"><span style={{fontWeight: "600"}}>Upload File: </span>None</div>}
            <br/>           
            <div className="boxContainer"><span style={{ fontWeight: "600" }}>Comments: </span>{props.comments}</div>
            <br/>
           {props.studentSubmission ?<div className="boxContainer"><span style={{fontWeight: "600"}}>Student Submission: </span><a href={props.studentSubmission} target="_blank" rel="noreferrer">Click here to open</a></div>:<div className="boxContainer"><span style={{fontWeight: "600"}}>Student Submission: </span>None</div>}
            <br/>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>Status Tracking:</span> <br/> {
                props.status.map((eachStatus, index) => {
                    return <span key={index}>{index+1}. {eachStatus.status} - <span> {eachStatus.modifiedAt} </span> <br/></span>
                })
            }</div>
            <br/>
            <div className="boxContainer">
                <span style={{fontWeight: "600"}}>Current Status:</span> {props.status[props.status.length-1].status} - <span>{props.status[props.status.length-1].modifiedAt} </span>
            </div>
            {
                props.status[props.status.length-1] !== "Competition Completed" || role === "admin" || role === "atlIncharge" ?
        <div className="buttonsContainer" id={"btnContainer"+props.id} style={{display: displayValue}}>
        <button className="resetbutton editBtn" onClick={handleEdit}><i className="fa-solid fa-pencil"></i></button>
        <button className="submitbutton deleteBtn" onClick={handleDelete}><i className="fa-solid fa-trash-can"></i></button>
        <button className="submitbutton" onClick={() => {setPopupOpen(true)}}>Modify Status</button>
        </div>: ""
    }
    </div>
    );
}

export default ReportBox;