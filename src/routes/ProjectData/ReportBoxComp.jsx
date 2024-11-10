import React from "react";
import {doc, getDoc, setDoc} from "firebase/firestore";
import db from "../../firebase/firestore";
import SubTask from "./SubTask";

const Popup = React.lazy(() => import("../../components/Popup"));

function ReportBox(props) {
    const [tasksOpen, setTasksOpen] = React.useState(false);
    const [subTasksOpen, setSubTasksOpen] = React.useState([]);

    const role = atob(localStorage.auth).split("-")[2];
    console.log(role);
    const [displayValue, setDisplayValue] = React.useState("none");

    function handleMouseOver(event) {
        setDisplayValue("block");
    }

    function handleMouseOut(event) {
        setDisplayValue("none");
    }

    async function handleDelete(event) {
        console.log(props.docId);
        if(window.confirm("You are about to delete an activity")) {
            await props.deleteProject(props.docId)
                .then(() => {
                    alert("Activity has been deleted.");
                })
                .catch(err => {
                    alert("An error has occurred please try again later.");
                })
        }
    }

    function handleEditClick() {
        window.location.href="/project-data/edit/"+props.docId;
    }

    return (
        <div className="box" id={props.id} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
            <div className="name" onMouseOver={handleMouseOver} style={{fontSize: "1.5rem"}}>{props.projectName}</div>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>Project ID:</span> {props.projectID}</div>
            <br/>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>Project Description:</span> {props.projectDescription}</div>
            <br/>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>Expected Start Date:</span> {props.expectedStartDate}</div>
            <br/>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>Expected End Date:</span> {props.expectedEndDate}</div>
            <br/>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>External Team Members:</span> {
                props.externalTeamMembers.map((member, index) => {
                    return <div key={index}>{member}</div>
                })
            }</div>
            <br/>
            <div className="boxContainer">
                <span style={{ fontWeight: "600" }}>Tasks: </span>
                <button className="resetbutton" style={{ display: "inline-block" }} onClick={() => { setTasksOpen(!tasksOpen) }}>
                    {(tasksOpen) ? <i className="fa-solid fa-caret-up"></i> : <i className="fa-solid fa-caret-down"></i>}
                </button>
                <br /><br />
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    {tasksOpen && props.tasks.map((task, index) => (
                        <div key={index} style={{ margin: "1rem 0", width: "100%" }}>
                            <div style={{ display: "flex", alignItems: "baseline" }}>
                                <span style={{ fontWeight: "600", marginRight: "0.5rem" }}>Task Name:</span>
                                <span>{task.taskName}</span>
                            </div>
                            <div style={{ marginLeft: "1.5rem", wordBreak: "break-word" }}>
                                <span> <strong> Description:</strong></span> {task.taskDescription}
                            </div>
                            <br />
                            <div className="boxContainer"><span style={{ fontWeight: "600", marginLeft: "rem"}}>SubTasks: </span></div>
                            {task.subTasks.length > 0 ? (
                                task.subTasks.map((subTask, subIndex) => (
                                    <div key={subIndex} style={{ marginLeft: "1.5rem" }}>
                                        <SubTask index={subIndex} subTask={subTask} />
                                    </div>
                                ))
                            ) : (
                                <div style={{ marginLeft: "1.5rem" }}>
                                    None
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <br/>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>Tags:</span> {
                props.tags.map((tag, index) => {
                    return <div key={index}>{tag}</div>
                })
            }</div>
            <div className="buttonsContainer" id={"btnContainer"+props.id} style={{display: displayValue}}>
                <button className="editBtn resetbutton" onClick={handleEditClick}><i className="fa-solid fa-pencil"></i></button>
                <button className="submitbutton deleteBtn" onClick={handleDelete}><i className="fa-solid fa-trash-can"></i></button>
            </div>
        </div>
    );
}

export default ReportBox;
