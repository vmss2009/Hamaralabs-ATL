import React from "react";
import {query, onSnapshot, doc, setDoc, collection, getDoc, where, getDocs} from "firebase/firestore";
import {db, deleteTask, getTasksById, task, taskAssign} from "../../firebase/firestore.js";
import Popup from "../../components/Popup";

function ReportBox(props) {
    const [data, setData] = React.useState({});
    const [displayValue, setDisplayValue] = React.useState("none");
    const [teamMems, setTeamMems] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [assignToOpen, setAssignToOpen] = React.useState(false);
    const [assignedTo, setAssignedTo] = React.useState("");
    const [commentWords, setCommentWords] = React.useState([]);
    const [descriptionWords, setDescriptionWords] = React.useState([]);

    let email = atob(localStorage.auth).split("-")[1];
    let role = atob(localStorage.auth).split("-")[2];

    const [selectedRole, setSelectedRole] = React.useState("ATL-Incharge"); // Default selection

    React.useEffect(() =>{
        const q = query(doc(db, "tasksData", props.task.ref.path.replace("tasksData/", "")));
        onSnapshot(q, (docSnap) => {
            const tempData = docSnap.data();
            tempData.id = docSnap.id;
            setData(tempData);
            setCommentWords(tempData.taskComments.split(" "));
            setDescriptionWords(tempData.taskDescription.split(" "));

            if(docSnap.data().assignedTo !== null && docSnap.data().assignedTo !== undefined) {
                const q2 = query(docSnap.data().assignedTo);
                onSnapshot(q2, (snap) => {
                    setAssignedTo(snap.data().name);
                });
            }
        });
    }, [])

    function handleMouseOver(event) {
        setDisplayValue("block");
    }

    function handleMouseOut(event) {
        setDisplayValue("none");
    }

    async function handleDelete(event) {
        if(window.confirm("You are about to delete a task")) {
            await deleteTask(data.id)
                .then(() => {
                    alert("Task has been deleted.");
                    window.location.reload();
                })
                .catch(err => {
                    alert("An error has occurred please try again later.");
                })
        }
    }

    async function markComplete() {
        const docId = props.task.ref.path.replace("tasksData/", "");
        const docRef = doc(db, "tasksData", docId);
        await setDoc(docRef, {taskDone: true}, {merge: true});
    }

    function handleEditClick() {
        window.location.href = "/tasks/edit/"+data.id;
    }

    function handleAssignToClick() {
        setAssignToOpen(true);
    }

    async function assign() {
        const member = document.querySelector(`select[name="teamAssignSelect"]`).value;
        const ref = collection(db, "atlUsers");
        const docs = await getDocs(ref);
        docs.forEach(async (doc) => {
            if(doc.data().email === member) {
                await taskAssign(data.id, doc.id);
                alert("Assigned!!");
                setAssignToOpen(false);
            }
        })
    }

    React.useEffect(() => {
        if(role === "admin") {
            const q = query(collection(db, "atlUsers"));
            onSnapshot(q, (snaps) => {
                const data = [];
                snaps.forEach(snap => {
                    const temp = snap.data();
                    //if(temp.role === "atlIncharge") {//nageswar
                        temp.name = `${temp.name}`
                        temp.docId = snap.id;
                        data.push(temp);
                   // } //nageswar
                });
                setTeamMems(data);
            });
        }
    }, []);

    //Nageswar
      // Filter teamMems based on selected role
  const filteredTeamMems = teamMems.filter((teamMem) => {
    if (selectedRole === "ATL-Incharge" && teamMem.role === "atlIncharge") {
      return true;
    }
    if (selectedRole === "Mentor" && teamMem.role === "mentor") {
      return true;
    }
    return false;
  });
//nageswar

    async function handleMarkNotCompleted() {
        await setDoc(doc(db, "tasksData", data.id), {
            taskDone: false
        }, {merge: true});
    }

    const URL_REGEX =
        /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;

    if(props.done === true && data.taskDone) {
        return (
            <div className="box" style={{paddingTop: "0"}} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                <div className="name" style={{display: "inline-block", fontSize: "1.2rem"}}>{data.taskName}</div>
                <br/>
                <div className="boxContainer" onMouseOver={handleMouseOver}>Description:- <span style={{fontWeight: 1000}}>{data.taskDescription}</span></div><br />
                <div className="boxContainer" onMouseOver={handleMouseOver}>Due Date:- <span style={{fontWeight: 1000}}>{data.taskDueDate}</span></div><br />
                {(data.assignedTo !== null && data.assignedTo !== undefined) ? <div className="boxContainer" onMouseOver={handleMouseOver}>Assigned To: <b>{assignedTo}</b></div> : ""}
                <div className="buttonsContainer" id={"btnContainer"+data.id} style={{display: displayValue}}>
                    {
                        (!data.taskDone)?
                            <><button className="resetbutton" onClick={markComplete}><i className="fa-solid fa-check"></i></button><button className="resetbutton" onClick={handleEditClick}><i className="fa-solid fa-pencil"></i></button></>
                            :""
                    }
                    {
                        (data.taskDone)?<button className="resetbutton" onClick={handleMarkNotCompleted}><i className="fa-solid fa-xmark"></i></button>:""
                    }
                    <button className="submitbutton deleteBtn" onClick={handleDelete}><i className="fa-solid fa-trash-can"></i></button>
                </div>
            </div>

        );
    } else if(props.done === false && !data.taskDone) {
        return (
            <div className="box" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                <Popup trigger={assignToOpen} closeAllowed={true} setPopupEnabled={setAssignToOpen}>
                    <div className="container" style={{fontSize: "1.2rem"}}>
                        Assign to:-      <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                            <option value="">--Select--</option>
                            <option value="ATL-Incharge">ATL-Incharge</option>
                            <option value="Mentor">Mentor</option>
                        </select>

                        {/* Conditional rendering of the second dropdown based on selectedRole */}
                            {selectedRole === "ATL-Incharge" && (
                                <select name="teamAssignSelect">
                                <option value="">-Select Incharge-</option>
                                {filteredTeamMems.map((teamMem, index) => {
                                    return (
                                    <option key={index} value={teamMem.email}>
                                        {teamMem.name}
                                    </option>
                                    );
                                })}
                                </select>
                            )}

                            {selectedRole === "Mentor" && (
                                <select name="teamAssignSelect">
                                <option value="">--Select Mentor--</option>
                                {filteredTeamMems.map((teamMem, index) => {
                                    return (
                                    <option key={index} value={teamMem.email}>
                                        {teamMem.name}
                                    </option>
                                    );
                                })}
                                </select>
                            )}
                    <br/>
                        <button className="submitbutton" onClick={assign}>Assign</button>
                    </div>
                </Popup>
                <div className="name" style={{display: "inline-block", fontSize: "1.2rem"}}>{data.taskName}</div>
                <br/>
                <div className="boxContainer" onMouseOver={handleMouseOver}>Description:- <span style={{fontWeight: 1000}}>{
                    descriptionWords.map((word, index) => {
                        return word.match(URL_REGEX) ? <span key={index}><a href={word} target="_blank" rel="noreferrer">{word}</a> </span> : <span key={index}>{word} </span>
                    })
                }</span></div><br />
                <div className="boxContainer" onMouseOver={handleMouseOver}>Due Date:- <span style={{fontWeight: 1000}}>{data.taskDueDate}</span></div><br />
                <div className="boxContainer" onMouseOver={handleMouseOver}>Comments:- <span style={{fontWeight: 1000}}>{
                    commentWords.map((word, index) => {
                        return word.match(URL_REGEX) ? <span key={index}><a href={word} target="_blank" rel="noreferrer">{word}</a> </span> : <span key={index}>{word} </span>
                    })
                }</span></div><br />
                {(data.assignedTo !== null && data.assignedTo !== undefined) ? <div className="boxContainer" onMouseOver={handleMouseOver}>Assigned To: <b>{assignedTo}</b></div> : ""}
                <div className="buttonsContainer" id={"btnContainer"+data.id} style={{display: displayValue}}>
                    {
                        (!data.taskDone)?<><button className="submitbutton deleteBtn" onClick={handleAssignToClick}>Assign To</button><button className="resetbutton" onClick={markComplete}><i className="fa-solid fa-check"></i></button><button className="resetbutton" onClick={handleEditClick}><i className="fa-solid fa-pencil"></i></button></>:""
                    }
                    <button className="submitbutton deleteBtn" onClick={handleDelete}><i className="fa-solid fa-trash-can"></i></button>
                </div>
            </div>
        );
    } else {
        return ""
    }
}

export default ReportBox;