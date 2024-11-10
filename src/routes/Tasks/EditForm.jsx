import React from "react";
import {useParams} from "react-router-dom";
import {doc, getDoc, setDoc} from "firebase/firestore";

import Sidebar from "../../components/Sidebar";
import db from "../../firebase/firestore";

function EditForm() {
    const {taskId} = useParams();
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [dueDate, setDueDate] = React.useState("");
    const [comments, setComments] = React.useState("");

    const [inititalName, setInitialName] = React.useState("");
    const [initialDueDate, setInitialDueDate] = React.useState("");

    React.useEffect(() => {
        const docRef = doc(db, "tasksData", taskId);
        getDoc(docRef).then((docSnap) => {
            setInitialName(docSnap.data().taskName);
            setInitialDueDate(docSnap.data().taskDueDate);
            setName(docSnap.data().taskName);
            setDescription(docSnap.data().taskDescription);
            setDueDate(docSnap.data().taskDueDate);
            setComments(docSnap.data().taskComments);
        });
    }, []);

    async function submit() {
        if(initialDueDate !== dueDate) {
            const uid = atob(localStorage.auth).split("-")[0];
            const docRef = doc(db, "atlUsers", uid);
            const docSnap = await getDoc(docRef);
            const temp = docSnap.data();
            docSnap.data().tasks.map((task, id) => {
                if(task.taskName === inititalName) {
                    temp.tasks[id].taskDueDate = dueDate;
                }
                return "";
            })
            await setDoc(docRef, temp, {merge: true});
        }

        if(inititalName !== name) {
            const uid = atob(localStorage.auth).split("-")[0];
            const docRef = doc(db, "atlUsers", uid);
            const docSnap = await getDoc(docRef);
            const temp = docSnap.data();
            docSnap.data().tasks.map((task, id) => {
                if(task.taskName === inititalName) {
                    temp.tasks[id].taskName = name;
                }
                return "";
            })
            await setDoc(docRef, temp, {merge: true});
        }

        const docRef = doc(db, "tasksData", taskId);
        await setDoc(docRef, {
            taskName: name,
            taskDescription: description,
            taskDueDate: dueDate,
            taskComments: comments
        }, {merge: true})
            .then(() => {
                alert("Updated Successfully");
                window.location.href = "/tasks";
            })
            .catch((err) => {
                alert("Updating failed please try again!");
            });
    }

    document.title = "Edit Task | Digital ATL";

    return <div className="container">
        <Sidebar />
        <link rel="stylesheet" href="/CSS/form.css"/>
        <h1 className="title">Edit Task | Digital ATL</h1>
        <hr/>
        <div className="formContainer" style={{fontSize: "1.2rem"}}>Name: <input type="text" className="form-inp" name="taskName" id="taskName" value={name} onChange={(e) => {setName(e.target.value)}} autoComplete="off"/></div>
        <div className="formContainer" style={{fontSize: "1.2rem"}}>Description: <br/><br/><textarea name="taskDueDate" id="taskDueDate" value={description} onChange={(e) => {setDescription(e.target.value)}}/></div>
        <div className="formContainer" style={{fontSize: "1.2rem"}}>Comments: <br/><br/><textarea name="taskComments" id="taskComments" value={comments} onChange={(e) => {setComments(e.target.value)}}/></div>
        <div className="formContainer" style={{fontSize: "1.2rem"}}>Due Date: <input type="date" className="form-inp" name="taskDueDate" id="taskDueDate" value={dueDate} onChange={(e) => {setDueDate(e.target.value)}}/></div>
        <button className="submitbutton" onClick={submit}>Update Task</button>
    </div>
}

export default EditForm;
