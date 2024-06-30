import React from "react";
import {db, task} from "../../firebase/firestore";
import {collection, doc, getDoc, onSnapshot, query, where} from "firebase/firestore";
import Sidebar from "../../components/Sidebar";
import ReportBox from "./ReportBox";
import Popup from "../../components/Popup";
import { set } from "lodash";

function Tasks(){
    let encodedAuth = localStorage.getItem("auth");
    let tempUid;
    let email;
    let tempRole;

    if (encodedAuth != null) {
        let decodedAuth = atob(encodedAuth);

        let split = decodedAuth.split("-");

        tempUid = split[0];
        email = split[1];
        tempRole = split[2];
    }

    const [userData, setUserData] = React.useState({});
    const [popupOpen, setPopupOpen] = React.useState(false);
    const [uid, setUID] = React.useState(tempUid);
    const [role, setRole] = React.useState("");
    const [mentorData, setMentorData] = React.useState([]);
    const [inchargeData, setInchargeData] = React.useState([]);
    const [schoolData, setSchoolData] = React.useState([]);
    const [mentorSelect, setMentorSelect] = React.useState("");
    const [inchargeSelect, setInchargeSelect] = React.useState("");
    const [selectedSchool, setSelectedSchool] = React.useState("");
    const [studentData, setStudentData] = React.useState([]);
    const [selectedStudent, setSelectedStudent] = React.useState("");
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [dueDate, setDueDate] = React.useState("");
    const [showWhat, setShowWhat] = React.useState("tasksNotDone");
    const [comments, setComments] = React.useState("");

    React.useEffect(() => {
        const q = query(collection(db, "atlUsers"));
        onSnapshot(q, (snap) => {
            const dataArrayIncharge = [];
            const dataArrayMentor = [];
            snap.forEach((doc) => {
                const temp = doc.data();
                temp.id = doc.id;
                if (temp.role === "atlIncharge") {
                    dataArrayIncharge.push(temp);
                } else if (temp.role === "mentor") {
                    dataArrayMentor.push(temp);
                }
            });
            setInchargeData(dataArrayIncharge);
            setMentorData(dataArrayMentor);
        });

        const qSchool = query(collection(db, "schoolData"));
        onSnapshot(qSchool, (snap) => {
            const dataArray = [];
            snap.forEach((doc) => {
                const temp = doc.data();
                temp.id = doc.id;
                dataArray.push(temp);
            });
            setSchoolData(dataArray);
            console.log(dataArray);
        });
    }, []);

    React.useEffect(() => {
        const q = query(collection(db, "studentData"), where("school", "==", selectedSchool));
        onSnapshot(q, (snap) => {
            const dataArray = [];
            snap.forEach((doc) => {
                const temp = doc.data();
                temp.id = doc.id;
                dataArray.push(temp);
            });
            setStudentData(dataArray);
        });
    }, [selectedSchool]);

    React.useEffect(() => {
        if (selectedStudent !== "") {
            (async () => {
                const studentDoc = doc(db, "studentData", selectedStudent);
                const docData = await getDoc(studentDoc);
                console.log(docData.data());
                const studentEmail = docData.data().email;
                console.log(studentEmail);
                const q = query(collection(db, "atlUsers"), where("email", "==", studentEmail));
                onSnapshot(q, (snap) => {
                    snap.forEach((doc) => {
                        setUID(doc.id);
                    });
                });
            })();
        }
    }, [selectedStudent]);

    React.useEffect(() => {
        const q = query(doc(db, "atlUsers", uid));
        onSnapshot(q, (snap) => {
            const tempData = snap.data();
            tempData.uid = snap.id;
            if (tempData.tasks !== undefined) {
                tempData.tasks = tempData.tasks.sort((a, b) => {
                    return new Date(a.taskDueDate) - new Date(b.taskDueDate);
                });
            } else {
                tempData.tasks = [];
            }
            console.log(tempData);
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

    function showYours() {
        setUID(tempUid);
        setRole("");
        setSelectedStudent("");
        setSelectedSchool("");
        setMentorSelect("");
        setInchargeSelect("");
    }

    function handleChange(event) {
        if(event.target.name === "mentorSelect") {
            setMentorSelect(event.target.value);
            setUID(event.target.value);
        } else if(event.target.name === "inchargeSelect") {
            setInchargeSelect(event.target.value);
            setUID(event.target.value);
        } else if(event.target.name === "schoolSelect") {
            setSelectedSchool(event.target.value);
        } else if (event.target.name === "studentSelect") {
            setSelectedStudent(event.target.value);
        } else if (event.target.name === "roleSelect") {
            setRole(event.target.value);
        }
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
                <button className="submitbutton" style={{position: "fixed", top: "0", right: "11rem"}} onClick={() => {setPopupOpen(true)}} ><i className="fa-solid fa-plus"></i> Add task</button>
                <button className="submitbutton" style={{position: "fixed", top: "0", right: "1.5rem"}} onClick={showYours}>Show Yours</button>
            </div>
            {
                tempRole === "admin" ? 
                <div className="subContainer">
                    <label>Role:- </label>
                    <select name="roleSelect" id="roleSelect" onChange={handleChange} value={role}>
                        <option value="" disabled={true}>SELECT</option>
                        <option value={"mentor"}>Mentor</option>
                        <option value={"atlIncharge"}>ATL Incharge</option>
                        <option value={"student"}>Student</option>
                    </select>
                    <br/>
                    {
                        role === "mentor" ?
                        <>
                            <label>Mentor:- </label><select name="mentorSelect" id="mentorSelect" onChange={handleChange} value={mentorSelect}>
                                <option value="" disabled={true}>SELECT</option>
                                {mentorData.map((mentor, index) => (
                                    <option key={index} value={mentor.uid}>{mentor.name}</option>
                                ))}
                            </select>
                        </>
                        : ""
                    }
                    {
                        role === "atlIncharge" ?
                        <>
                            <label>ATL Incharge:- </label><select name="inchargeSelect" id="inchargeSelect" onChange={handleChange} value={inchargeSelect}>
                                <option value="" disabled={true}>SELECT</option>
                                {inchargeData.map((incharge, index) => (
                                    <option key={index} value={incharge.uid}>{incharge.name}</option>
                                ))}
                            </select>
                        </>
                        : ""
                    }
                    {
                        role === "student" ?
                        <>
                        <label>School:- </label><select name="schoolSelect" id="schoolSelect" onChange={handleChange} value={selectedSchool}>
                            <option value="" disabled={true}>SELECT</option>
                            {schoolData.map((school, index) => {
                                return <option key={index} value={school.name}>{school.name}</option>
                            })}
                        </select>
                        {
                            selectedSchool !== "" ? 
                            <div>
                                <label>Student:- </label><select name="studentSelect" id="studentSelect" onChange={handleChange} value={selectedStudent}>
                                    <option value="" disabled={true}>SELECT</option>
                                    {studentData.map((student, index) => {
                                        return <option key={index} value={student.id}>{student.name.firstName} {student.name.lastName}</option>
                                    })}
                                </select>
                            </div>
                            : ""
                        }
                        </>
                        : ""
                    }
                </div>
                : ""
            }
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
                            return <ReportBox key={index} task={task} done={(showWhat === "tasksDone")} />
                        })
                    )}
            </div>
        </div>
    );
}

export default Tasks;