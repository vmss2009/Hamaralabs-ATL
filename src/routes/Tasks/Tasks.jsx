import React from "react";
import {db, task} from "../../firebase/firestore";
import {doc, onSnapshot, query} from "firebase/firestore";
import Sidebar from "../../components/Sidebar";
import ReportBox from "./ReportBox";
import Popup from "../../components/Popup";

function Tasks(){
    const [userData, setUserData] = React.useState({});
    const [popupOpen, setPopupOpen] = React.useState(false);
    const [assignToOpen, setAssignToOpen] = React.useState(false);
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [dueDate, setDueDate] = React.useState("");
    const [showWhat, setShowWhat] = React.useState("tasksNotDone");
    const [comments, setComments] = React.useState("");

    let encodedAuth = localStorage.getItem("auth");
    let uid;
    let email;

    if (encodedAuth != null) {
        let decodedAuth = atob(encodedAuth);

        let split = decodedAuth.split("-");

        uid = split[0];
        email = split[1];
    }

    React.useEffect(() => {
        const q = query(doc(db, "atlUsers", uid));
        onSnapshot(q, (snap) => {
            const tempData = snap.data();
            tempData.uid = snap.id;
            tempData.tasks = tempData.tasks.sort((a, b) => {
                return new Date(a.taskDueDate) - new Date(b.taskDueDate);
            });
            setUserData(tempData);
        });
    }, [uid]);

    async function submit() {
        await task(name, description, dueDate, false, comments);
        setPopupOpen(false);
        setName("");
        setDescription("");
        setDueDate("");
        setComments("");
    }

    window.setPopUpOpen = setPopupOpen;

    document.title = "Tasks | Digital ATL";

    return(
        <div className="container">
            <Sidebar />
            <Popup trigger={popupOpen} closeAllowed={true} setPopupEnabled={setPopupOpen}>
                <div className="container" style={{fontSize: "1.2rem"}}>
                    <div className="formContainer">Name: <input type="text" className="form-inp" name="taskName" id="taskName" value={name} onChange={(e) => {setName(e.target.value)}} autoComplete="off"/></div>
                    <div className="formContainer">Description: <br/><br/><textarea name="taskDueDate" id="taskDueDate" value={description} onChange={(e) => {setDescription(e.target.value)}}/></div>
                    <div className="formContainer">Comments: <br/><br/><textarea name="taskComments" id="taskComments" value={comments} onChange={(e) => {setComments(e.target.value)}}/></div>
                    <div className="formContainer">Due Date: <input type="date" className="form-inp" name="taskDueDate" id="taskDueDate" value={dueDate} onChange={(e) => {setDueDate(e.target.value)}}/></div>
                    <button className="submitbutton" onClick={submit}>Add Task</button>
                </div>
            </Popup>
            <link rel="stylesheet" href="/CSS/form.css"/>
            <link rel="stylesheet" href="/CSS/report.css"/>
            <div style={{height: "10vh"}}>
                <h1 className="title">Tasks | Digital ATL</h1>
                <hr/>
                <button className="submitbutton" style={{position: "fixed", top: "0", right: "1.5rem"}} onClick={() => {setPopupOpen(true)}} ><i className="fa-solid fa-plus"></i> Add task</button>
            </div>
            <label htmlFor="showWhat">Showing</label>
            <select name="showWhat" id="showWhat" onChange={(e) => {setShowWhat(e.target.value)}}>
                <option value="tasksNotDone">ongoing tasks</option>
                <option value="tasksDone">completed tasks</option>
            </select>
            <hr/>
            <div className="subContainer">
                <h2>{(showWhat === "tasksDone")?"Completed Tasks":"Ongoing Tasks"}</h2>
                {userData.tasks === undefined || userData.tasks.length === 0 ?
                    <button className="submitbutton" onClick={() => {setPopupOpen(true)}}><i className="fa-solid fa-plus"></i> Create new task</button>
                    : (
                        userData.tasks.map((task, index) => {
                            return <ReportBox key={index} task={task} done={(showWhat === "tasksDone")} assignToOpen={setAssignToOpen} />
                        })
                    )}
            </div>
        </div>
    );
}

export default Tasks;