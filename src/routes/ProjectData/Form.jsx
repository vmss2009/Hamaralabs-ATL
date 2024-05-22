import React from "react";
import {addActivity, addProject, db} from "../../firebase/firestore";
import Sidebar from "../../components/Sidebar";
import {collection, onSnapshot, query} from "firebase/firestore";

function ProjectForm() {
    const [projectID, setProjectID] = React.useState("");
    const [projectName, setProjectName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [expectedStartDate, setExpectedStartDate] = React.useState("");
    const [expectedEndDate, setExpectedEndDate] = React.useState("");
    const [tags, setTags] = React.useState([]);
    const [tagsCount, setTagsCount] = React.useState(0);
    const [teamMembers, setTeamMembers] = React.useState([]);
    const [teamMembersCount, setTeamMembersCount] = React.useState(0);
    const [externalStudents, setExternalStudents] = React.useState([]);
    const [tasks, setTasks] = React.useState([]);
    const [tasksCount, setTasksCount] = React.useState(0);
    const [schoolName, setSchoolName] = React.useState("");

    function clearForm() {
        setProjectID("");
        setProjectName("");
        setDescription("");
        setExpectedStartDate("");
        setExpectedEndDate("");
        setTags([]);
        setTeamMembers([]);
        setTagsCount(0);
        setTeamMembersCount(0);
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
        if(event.target.name === "projectID") {
            setProjectID(event.target.value);
        } else if(event.target.name === "projectName") {
            setProjectName(event.target.value);
        } else if(event.target.name === "description") {
            setDescription(event.target.value);
        } else if(event.target.name === "expectedStartDate") {
            setExpectedStartDate(event.target.value);
        } else if(event.target.name === "expectedEndDate") {
            setExpectedEndDate(event.target.value);
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if(hasDuplicates(teamMembers) || hasDuplicates(tags)) {
            alert("Data has duplicate values!");
        } else {
            await addProject(projectID, projectName, description, expectedStartDate, expectedEndDate, tags, teamMembers, tasks, schoolName)
                .then(() => {
                    alert("Added successfully!!");
                    clearForm();
                    window.location.href = "/project-data/view";
                })
                .catch(() => {
                    alert("Adding data failed! Please try again.");
                });
        }
    }

    function handleClick(event) {
        if(event.target.type === "reset") {
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
        console.log(classes);
        if(classes.includes("tagsAdd")) {
            setTagsCount(tagsCount+1);
        } else if(classes.includes("membersAdd")) {
            setTeamMembersCount(teamMembersCount+1);
        } else if(classes.includes("tasksAdd")) {
            const temp = [...tasks];
            temp.push({
                subTasksCount: 0,
                subTasks: []
            });
            setTasks(temp)
            setTasksCount(tasksCount+1);
        } else if(classes.includes("subTasksAdd")) {
            const taskId = event.target.getAttribute("data-task");
            const temp = [...tasks];
            temp[taskId].subTasksCount = temp[taskId].subTasksCount + 1;
            if(temp[taskId].taskName === undefined) {
                temp[taskId].taskName = "";
            }
            temp[taskId].subTasks.push({name: "", description: ""});
            setTasks(temp);
        }
    }

    function decreaseField(event) {
        event.preventDefault();
        const classes = event.target.className.split(" ");
        if(classes.includes("tagsRemove")) {
            if(tagsCount !== 0) {
                const temp = [...tags];
                temp.pop();
                setTags(temp);
                setTagsCount(tagsCount-1);
            }
        } else if(classes.includes("membersRemove")) {
            if(teamMembersCount !== 0) {
                const temp = [...teamMembers];
                temp.pop();
                setTeamMembers(temp);
                setTeamMembersCount(teamMembersCount-1);
            }
        } else if(classes.includes("tasksRemove")) {
            if(tasksCount !== 0) {
                const temp = [...tasks];
                temp.pop();
                setTasks(temp);
                setTasksCount(tasksCount-1);
            }
        } else if(classes.includes("subTasksRemove")) {
            const taskId = event.target.getAttribute("data-task");
            if(tasks[taskId].subTasksCount !== 0) {
                const temp = [...tasks];
                console.log(temp[taskId.subTasks])
                temp[taskId].subTasks.pop();
                temp[taskId].subTasksCount = temp[taskId].subTasksCount - 1;
                setTasks(temp);
            }
        }
    }

    function mfHandleChangeTags(event) {
        const index = Number(event.target.getAttribute("id").replace("tags", ""));
        const temp = [...tags];
        temp[index] = event.target.value;
        setTags(temp);
    }

    function mfHandleChangeTaskName(event) {
        const index = Number(event.target.getAttribute("id").replace("taskName", ""));
        const temp = [...tasks];
        temp[index].taskName = event.target.value;
        setTasks(temp);
    }

    function mfHandleChangeTaskDescription(event) {
        const index = Number(event.target.getAttribute("id").replace("taskDescription", ""));
        const temp = [...tasks];
        temp[index].taskDescription = event.target.value;
        setTasks(temp);
    }

    function mfHandleChangeSubTaskName(event) {
        const index = Number(event.target.getAttribute("data-subTask"));
        const taskId = Number(event.target.getAttribute("data-task"));
        const temp = [...tasks];
        console.log(temp[taskId])
        temp[taskId].subTasks[index].name = event.target.value;
        setTasks(temp);
    }

    function mfHandleChangeSubTaskDescription(event) {
        const index = Number(event.target.getAttribute("data-subTask"));
        const taskId = Number(event.target.getAttribute("data-task"));
        const temp = [...tasks];
        temp[taskId].subTasks[index].description = event.target.value;
        setTasks(temp);
    }

    function mfHandleChangeMembers(event) {
        const index = Number(event.target.getAttribute("id").replace("members", ""));
        const temp = [...teamMembers];
        temp[index] = event.target.value;
        setTeamMembers(temp);
    }

    React.useEffect(() => {
        let currentSchool = "";

        const q = query(collection(db, "schoolData"));
        onSnapshot(q, snaps => {
            snaps.forEach(doc => {
                const temp = doc.data();
                temp.docId = doc.id;
                if(temp.atlIncharge.email === atob(localStorage.auth).split("-")[1]) {
                    currentSchool = temp.name;
                    setSchoolName(temp.name);
                }
            });

            const q2 = query(collection(db, "studentData"));
            onSnapshot(q2, snapshots => {
                snapshots.forEach(snap => {
                    const temp = snap.data();
                    temp.docId = snap.id;
                    if(!(temp.school === currentSchool)) {
                        setExternalStudents(prev => [...prev, temp]);
                    }
                });
            });
        });
    }, []);

    let decodedAuth = atob(localStorage.auth);

    let split = decodedAuth.split("-");

    window.uid = split[0];
    window.email = split[1];
    window.role = split[2];

    document.title = "Project Data Form | Digital ATL";

    return (
        
        <div className="container" id="mobilescreen">
            <Sidebar />
            <link rel="stylesheet" href="/CSS/school.css" />
            <link rel="stylesheet" href="/CSS/report.css" />
                <form>
                    <div className="school-title">Project data form</div>
                    <hr />
                    <div className="formContainer">
                    <div className="row">
                        <div className="column">
                        <label htmlFor="taID"><strong>Project ID: </strong></label>
                            <input type="text" name="projectID" id="projectID" placeholder="Enter the project Id" className="form-inp" value={projectID} onChange={handleChange}/>
                    </div>
                    <div className="column">
                        <label htmlFor="projectName"><strong>Project Name:</strong> </label>
                        <input type="text" name="projectName" id="projectName"  placeholder="Enter the project name" className="form-inp" value={projectName} onChange={handleChange}/>
                    </div>
                    </div>
                    </div>
                    <div className="formContainer">
                    <div className="row">
                    <div className="column">
                        <label htmlFor="description"><strong>Description:</strong> </label>
                        <br/>
                        <br/>
                        <textarea name="description" id="description" placeholder="Enter the Description" className="form-inp" cols="30" rows="5" value={description} onChange={handleChange}/>
                    </div>
                    </div>
                    </div>
                    <div className="formContainer">
                    <div className="row">
                        <div className="column">
                        <label htmlFor="expectedStartDate"><strong>Expected Start Date:</strong> </label>
                        <input type="date" name="expectedStartDate" placeholder="Enter the Expected Start Date" id="expectedStartDate" className="form-inp" value={expectedStartDate} onChange={handleChange} />
                    </div>
                    <div className="column">
                        <label htmlFor="expectedEndDate"><strong>Expected End Date:</strong> </label>
                        <input type="date" name="expectedEndDate" placeholder="Enter the Expected End Date" id="expectedEndDate" className="form-inp" value={expectedEndDate} onChange={handleChange} />
                    </div>
                    </div>
                    </div>
                    <div className="formContainer">
                    <div className="row">
                        <div className="column">
                        <label><strong>Tags:</strong> </label>
                        <div className="multiForm">
                            {
                                createArray(tagsCount).map((_, index) => {
                                    return <div key={index}>
                                        <input className="form-inp" placeholder="Enter the Tags" name={"tags"+index} id={"tags"+index} style={{marginTop: "1rem"}} onChange={mfHandleChangeTags} value={tags[index]} />
                                        <br/>
                                    </div>
                                })
                            }
                        </div>
                        <button className="submitbutton tagsAdd" onClick={increaseField}>+</button>
                        <button className="resetbutton tagsRemove" onClick={decreaseField}>-</button>
                    </div>
                        <div className="column">
                        <label><strong>External Team Members(Out of School): </strong></label>
                        <div className="multiForm">
                            {
                                createArray(teamMembersCount).map((_, index) => {
                                    return <div key={index}>
                                        <select name={"member"+index}  placeholder="Enter the External Team Members"  id={"member"+index} style={{marginTop: "1rem"}} onChange={mfHandleChangeMembers} className="form-inp" value={teamMembers[index] !== undefined?"":teamMembers[index]}>
                                            <option value="" disabled={true}>SELECT</option>
                                            {
                                                externalStudents.map((student, index) => {
                                                    return <option key={index} value={student.docId}>{student.name.firstName} {student.name.lastName}</option>
                                                })
                                            }
                                        </select>
                                        <br/>
                                    </div>
                                })
                            }
                        </div>
                        <button className="submitbutton membersAdd" onClick={increaseField}>+</button>
                        <button className="resetbutton membersRemove" onClick={decreaseField}>-</button>
                    </div>
                    </div>
                    </div>
                    <div className="formContainer">
                    <div className="row">
                    <div className="column">
                        <label><strong>Tasks:</strong> </label>
                        <div className="multiForm">
                            {
                                createArray(tasksCount).map((_, index) => {
                                    return <div key={index}>
                                        <div className="box">
                                            <div className="name">
                                               <strong> Task {index+1} name:</strong>
                                                <input type="text" name={"taskName"+index} placeholder="Enter the Task" id={"taskName"+index} value={tasks[index].taskName} onChange={mfHandleChangeTaskName} className="form-inp"/>
                                                <br/><br/> Description: <br/><br/>
                                                <textarea name={"taskDescription"+index} placeholder="Enter the Description" className="form-inp" id={"taskDescription"+index}  cols="30" rows="5"
                                                 value={tasks[index].taskDescription} onChange={mfHandleChangeTaskDescription}/>
                                            </div>
                                            {
                                                createArray(tasks[index].subTasksCount).map((_, index2) => {
                                                    return <div className="formContainer" key={index2} style={{display: "inline-block"}}>
                                                      <strong>  Sub Task {index2 + 1}: Name: </strong><input type="text" name={"task"+index+"SubTask"+index2} id={"task"+index+"SubTask"+index2} data-task={index} data-subTask={index2}  placeholder="Enter the subTask" value={tasks[index].subTasks[index2].name} onChange={mfHandleChangeSubTaskName} className="form-inp"/>
                                                        <br/><br/><strong>Description:</strong> <br/><br/> <textarea name={"task"+index+"SubTask"+index2+"Description"} id={"task"+index+"SubTask"+index2+"Description"} placeholder="Enter the Description"  cols="30" rows="5" data-task={index} data-subTask={index2} value={tasks[index].subTasks[index2].description} className="form-inp" onChange={mfHandleChangeSubTaskDescription}/>
                                                    </div>
                                                })
                                            }
                                            <br/>
                                            <div className="boxContainer"><strong>Add and Remove Sub Tasks:</strong></div>
                                            <br/>
                                            <button className="submitbutton subTasksAdd" data-task={index} onClick={increaseField}>+</button>
                                            <button className="resetbutton subTasksRemove" data-task={index} onClick={decreaseField}>-</button>
                                        </div>
                                        <br/>
                                    </div>
                                })
                            }
                        </div>
                        <button className="submitbutton tasksAdd" onClick={increaseField}>+</button>
                        <button className="resetbutton tasksRemove" onClick={decreaseField}>-</button>
                    </div>
                    </div>
                    </div>
                    <div className="formContainer">
                        <button type="submit" className="submitbutton" onClick={handleSubmit}>Add</button>
                        <button type="reset" className="resetbutton" onClick={handleClick}>Reset</button>
                    </div>
                </form>
        </div>
    );
}

export default ProjectForm;
