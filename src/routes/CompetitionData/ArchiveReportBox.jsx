import React from "react";
import db, { deleteComReg } from "../../firebase/firestore";
import { arrayUnion, doc, setDoc, getDoc } from "firebase/firestore";
import Popup from "../../components/Popup";
import ArchiveReportBox from "./ArchiveReportBox"

function ReportBox(props) {
    const [displayValue, setDisplayValue] = React.useState("none");
    const students = props.students;
    const schools = props.schools;
    const [student, setStudent] = React.useState("");
    const [school, setSchool] = React.useState("");
    const [displayStudents, setDisplayStudents] = React.useState([]);
   

    function handleMouseOver(event) {
        setDisplayValue("block");
    }

    function handleMouseOut(event) {
        setDisplayValue("none");
    }

    /*async function handleDelete() {
        if (window.confirm("You are about to delete a competition")) {
            await props.deleteCompetition(props.docId)
                .then(() => {
                    alert("Deleted successfully");
                })
                .catch(() => {
                    alert("An error occurred please try again later");
                })
        }
    }

    function handleEditClick() {
        window.location.href = "/competition-data/edit/" + props.docId;
    }*/
    /*sucharitha6.5*/
    function formatDate(dateString) {
        if (!dateString) {
            return ""; // Return an empty string for empty date values
        }


        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }
    /*sucharitha 6.5*/

        React.useEffect(() => {
        const temp = [];
        students.forEach(student => {
            if (student.school === school) {
                temp.push(student);
            }
        });
        setDisplayStudents(temp);
    }, [school])

    return (
        <div className="box" id={props.id} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
           {/* {
                assignToOpen ?
                    <Popup trigger={assignToOpen} setPopupEnabled={setAssignToOpen} closeAllowed={true}>
                        <div className="container" style={{ fontSize: "1.2rem" }}>
                            Assign to:- School: <select name="schoolSelect" onChange={e => setSchool(e.target.value)} value={school}>
                                <option value="" disabled={true}>SELECT</option>
                                {schools.map((school, index) => {
                                    return <option key={index} value={school.name}>{school.name}</option>
                                })}
                            </select> Student: <select name="studentsAssignSelect" onChange={e => setStudent(e.target.value)} value={student}>
                                <option value="" disabled={true}>SELECT</option>
                                {displayStudents.map((student, index) => {
                                    return <option key={index} value={student.docId}>{`${student.name.firstName} ${student.name.lastName}`}</option>
                                })}
                            </select>
                            <br />
                            <button className="submitbutton" onClick={handleAssignTo}>Assign</button>
                        </div>
                    </Popup>
                    : ""
            }*/}
            <div className="name" onMouseOver={handleMouseOver}>{props.competName}</div>
            <div className="boxContainer"> Description: {props.description}</div><br />
            <div className="boxContainer"> Organized By: {props.organizedBy}</div><br />
            {/*sucharitha 6.5*/}
            <div className="boxContainer"> Application Start Date: {formatDate(props.applStartDate)}</div><br />
            <div className="boxContainer"> Application End Date: {formatDate(props.applEndDate)}</div><br />
            <div className="boxContainer"> Competition Start Date: {formatDate(props.compStartDate)}</div><br />
            <div className="boxContainer"> Competition End Date: {formatDate(props.compEndDate)}</div><br />

            { /*sucharitha 6.5*/}

            <div className="boxContainer"> Classes from: {props.classesFrom}</div><br />
            <div className="boxContainer"> Classes to: {props.classesTo}</div><br />
            <div className="boxContainer"> ATL Schools: {(props.atlSchools) ? "Yes" : "No"}</div><br />
            <div className="boxContainer"> Non ATL Schools: {(props.nonAtlSchools) ? "Yes" : "No"}</div><br />
            <div className="boxContainer"> Individual: {(props.individual) ? "Yes" : "No"}</div><br />
            <div className="boxContainer"> Team: {(props.team) ? "Yes" : "No"}</div><br />
            <div className="boxContainer"> Reference Links: <a href={props.refLink} target="_blank">{props.refLink}</a></div><br />
            <div className="boxContainer"> Fee Details: {props.paymentDetails.type === "free" ? "Free of cost" : "Paid for "} {props.paymentDetails.type === "paid" ? "₹ " + props.paymentDetails.fee : ""}</div><br />
            {
                props.fileURL !== undefined ?
                    <><div className="boxContainer"> Uploaded file: <a href={props.fileURL} target="_blank" rel="noreferrer">Click here to open</a></div><br /></>
                    : ""
            }
            <div className="boxContainer">Requirements:
                <br />
                {props.requirements.map((requirement, index) => {
                    return <>&nbsp;&nbsp;&nbsp;<span key={index}>{index + 1}. {requirement} </span><br /></>
                })
                }</div>
            {/*<div className="buttonsContainer" id={"btnContainer" + props.id} style={{ display: displayValue }}>
                <button className="submitbutton deleteBtn" onClick={() => setAssignToOpen(true)}>Assign To</button>
                {
                    atob(localStorage.auth).split("-")[2] === "admin" ?
                        <>
                            <button className="editBtn resetbutton" onClick={handleEditClick}><i className="fa-solid fa-pencil"></i></button>
                            <button className="submitbutton deleteBtn" onClick={handleDelete}><i className="fa-solid fa-trash-can"></i></button>
                        </> : ""
                }
            </div>*/}
        </div>
    );
}

export default ReportBox;