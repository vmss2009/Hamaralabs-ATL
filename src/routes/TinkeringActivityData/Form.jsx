import React from "react";
import {Bars} from "react-loader-spinner";
import readXlsxFile from "read-excel-file";
import lodash from "lodash";
import {getDownloadURL, getStorage, ref, uploadBytes, listAll, deleteObject} from "firebase/storage";//newline
import {addActivity, getSubjects, getTopics, getSubtopics} from "../../firebase/firestore";
import Popup from "../../components/Popup";
import Sidebar from "../../components/Sidebar";
import fbApp from "../../firebase/app";

const storage = getStorage(fbApp);

function TinkeringActivityForm() {
    const [taID, setTAID] = React.useState("");
    const [taName, setTAName] = React.useState("");
    const [intro, setIntro] = React.useState("");
    const [subject, setSubject] = React.useState("");
    const [subjectID, setSubjectID] = React.useState("");
    const [topic, setTopic] = React.useState("");
    const [subTopic, setSubTopic] = React.useState("");
    const [goals, setGoals] = React.useState([]);
    const [materials, setMaterials] = React.useState([]);
    const [instructions, setInstructions] = React.useState([]);
    const [tips, setTips] = React.useState([]);
    const [observation, setObservation] = React.useState([]);
    const [extensions, setExtensions] = React.useState([]);
    const [resources, setResources] = React.useState([]);
    const [subjectData, setSubjectData] = React.useState([]);
    const [topicData, setTopicData] = React.useState([]);
    const [subTopicData, setSubtopicData] = React.useState([]);

    const [goalsCount, setGoalsCount] = React.useState(0);
    const [materialsCount, setMaterialsCount] = React.useState(0);
    const [instructionsCount, setInstructionsCount] = React.useState(0);
    const [tipsCount, setTipsCount] = React.useState(0);
    const [observationCount, setObservationCount] = React.useState(0);
    const [extensionsCount, setExtensionsCount] = React.useState(0);
    const [resourcesCount, setResourcesCount] = React.useState(0);

    const [file, setFile] = React.useState(null);
    const [loadingTrigger, setLoadingTrigger] = React.useState(false);

    function clearForm() {
        setTAID("");
        setTAName("");
        setIntro([]);
        setGoals([]);
        setMaterials([]);
        setInstructions([]);
        setTips([]);
        setObservation([]);
        setExtensions([]);
        setResources([]);
        setGoalsCount(0);
        setMaterialsCount(0);
        setInstructionsCount(0);
        setTipsCount(0);
        setObservationCount(0);
        setExtensionsCount(0);
        setResourcesCount(0);
    }

    function hasDuplicates(array, hasFiles) {
        if (hasFiles === undefined) {
            hasFiles = false;
        }
        var valuesSoFar = Object.create(null);
        for (var i = 0; i < array.length; ++i) {
            var value = array[i];
            if (hasFiles === true) {
                if (typeof value === "object") {
                    value = value.name;
                }
            }
            if (value in valuesSoFar) {
                return true;
            }
            valuesSoFar[value] = true;
        }
        return false;
    }

    function handleChange(event) {
        if(event.target.name === "taID") {
            setTAID(event.target.value);
        } else if(event.target.name === "taName") {
            setTAName(event.target.value);
        } else if(event.target.name === "introduction") {
            setIntro(event.target.value);
        } else if(event.target.name === "subject") {
            setSubject(event.target.value);
        } else if(event.target.name === "topic") {
            setTopic(event.target.value);
        } else if(event.target.name === "subTopic") {
            setSubTopic(event.target.value);
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if(hasDuplicates(goals) || hasDuplicates(materials) || hasDuplicates(instructions) || hasDuplicates(tips) || hasDuplicates(observation) || hasDuplicates(extensions) || hasDuplicates(resources, true)) {
            alert("Data has duplicate values!");
        } else {
            for (let index = 0; index < resources.length; index++) {
                if (typeof resources[index] === "object") {
                    resources[index] = await uploadFile(resources[index]);
                }
            }
            await addActivity(taID, taName, subject, topic, subTopic, intro, goals, materials, instructions, tips, observation, extensions, resources)
                .then(() => {
                    alert("Added successfully!!");
                    clearForm();
                    window.location.href = "/ta-data/view";
                })
                .catch(() => {
                    alert("Adding data failed! Please try again.");
                });
        }
    }

    React.useEffect(() => {
        getSubjects()
          .then((docSnaps) => {
            const dataArray = [];
            docSnaps.forEach((docSnap) => {
                const temp = {
                    name: docSnap.data().name,
                    id: docSnap.id
                  };

              dataArray.push(temp);
            });
            setSubjectData(dataArray.sort((a, b) => a.name.localeCompare(b.name)));
          })
          .catch((err) => {
            window.location.reload();
          });
    }, []);

    React.useEffect(() => {
        let id;
        subjectData.forEach((value, index) => {
            if (subject === value.name) {
                id = value.id;

            }
        });
        setSubjectID(id);
        getTopics(id === "" ? " " : id)
        .then((docSnaps) => {
            const dataArray = [];
            docSnaps.forEach((docSnap) => {
                const temp = {
                    name: docSnap.data().name,
                    id: docSnap.id
                  };
                dataArray.push(temp);
            });
    
            setTopicData(dataArray.sort((a, b) => a.name.localeCompare(b.name)));
        })
        .catch((err) => {
            window.location.reload();
        });
    }, [subject, topic, subTopic]);

    React.useEffect(() => {
        let id = "";
        topicData.forEach((value, index) => {
            if (topic === value.name) {
                id = value.id;
            }
        });
        getSubtopics(subjectID === "" ? " " : subjectID, id === "" ? " " : id)
        .then((docSnaps) => {
            const dataArray = [];
            docSnaps.forEach((docSnap) => {
                const temp = {
                    name: docSnap.data().name,
                    id: docSnap.id
                };
                dataArray.push(temp);
            });
            setSubtopicData(dataArray.sort((a, b) => a.name.localeCompare(b.name)));
        })
        .catch((err) => {
            window.location.reload();
        });
    }, [subject, topic, subTopic]);

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
        if(classes.includes("goalsAdd")) {
            setGoalsCount(goalsCount+1);
        } else if(classes.includes("materialsAdd")) {
            setMaterialsCount(materialsCount+1);
        } else if(classes.includes("instructionsAdd")) {
            setInstructionsCount(instructionsCount+1);
        } else if(classes.includes("tipsAdd")) {
            setTipsCount(tipsCount+1);
        } else if(classes.includes("observationAdd")) {
            setObservationCount(observationCount+1);
        } else if(classes.includes("extensionsAdd")) {
            setExtensionsCount(extensionsCount+1);
        } else if(classes.includes("resourcesAdd")) {
            setResourcesCount(resourcesCount+1);
        }
    }

    function decreaseField(event) {
        event.preventDefault();
        const classes = event.target.className.split(" ");
        if(classes.includes("goalsRemove")) {
            if(goalsCount !== 0) {
                goals.pop();
                setGoalsCount(goalsCount-1);
            }
        } else if(classes.includes("materialsRemove")) {
            if(materialsCount !== 0) {
                materials.pop();
                setMaterialsCount(materialsCount-1);
            }
        } else if(classes.includes("instructionsRemove")) {
            if(instructionsCount !== 0) {
                instructions.pop();
                setInstructionsCount(instructionsCount-1);
            }
        } else if(classes.includes("tipsRemove")) {
            if(tipsCount !== 0) {
                tips.pop();
                setTipsCount(tipsCount-1);
            }
        } else if(classes.includes("observationRemove")) {
            if(observationCount !== 0) {
                observation.pop();
                setObservationCount(observationCount-1);
            }
        } else if(classes.includes("extensionsRemove")) {
            if(extensionsCount !== 0) {
                extensions.pop();
                setExtensionsCount(extensionsCount-1);
            }
        } else if(classes.includes("resourcesRemove")) {
            if(resourcesCount !== 0) {
                resources.pop();
                setResourcesCount(resourcesCount-1);
            }
        }
    }

    function mfHandleChangeGoals(event) {
        const index = Number(event.target.getAttribute("id").replace("goals", ""));
        goals[index] = event.target.value;
    }

    function mfHandleChangeMaterials(event) {
        const index = Number(event.target.getAttribute("id").replace("materials", ""));
        materials[index] = event.target.value;
    }

    function mfHandleChangeInstructions(event) {
        const index = Number(event.target.getAttribute("id").replace("instructions", ""));
        instructions[index] = event.target.value;
    }

    function mfHandleChangeTips(event) {
        const index = Number(event.target.getAttribute("id").replace("tips", ""));
        tips[index] = event.target.value;
    }

    function mfHandleChangeObservation(event) {
        const index = Number(event.target.getAttribute("id").replace("observation", ""));
        observation[index] = event.target.value;
    }

    function mfHandleChangeExtensions(event) {
        const index = Number(event.target.getAttribute("id").replace("extension", ""));
        extensions[index] = event.target.value;
    }

    function mfHandleChangeResources(event, file) {
        const index = Number(event.target.getAttribute("id").replace(file ? "uploadMou" : "resource", ""));
        if (file) {
            resources[index] = file;
            setResourcesCount(resourcesCount+1);
            resources[resourcesCount] = "";
        } else {
            resources[index] = event.target.value;
        }
    }

    async function uploadFile(file) {
        try {
            const filesFolderRef = ref(storage, `tAFiles/${taName}/${file.name}`);
            const temp2 = await uploadBytes(filesFolderRef, file);
            const temp = await getDownloadURL(filesFolderRef);
            console.log(temp2);
            return temp;
        } catch (error){
            console.log(error);
        }
    }


    function onFileSelect(event) {
        setFile(event.target.files[0]);
    }

    async function onFileSelectResources(event) {
        event.preventDefault();
        const selectedFile = event.target.files[0];
        const fileSizeInMB = selectedFile.size / (1024*1024);
        
        if (selectedFile && fileSizeInMB <= 50) {
            mfHandleChangeResources(event, selectedFile);
        } else {
            alert("Please select a file less than 50MB");
            console.log(resources);
        }
    }

    async function addFromXlsx(event) {
        event.preventDefault();
        if(file !== null) {
            setLoadingTrigger(true);
            const fileData = await readXlsxFile(file);
            for(let i = 1; i < fileData.length; i++) {
                const currentFile = fileData[i];
                const currentTAId = String(currentFile[0]);
                const name = String(currentFile[1].split(":")[0]);
                const intro = String(currentFile[1].split(":")[1]);
                if(intro !== undefined && intro !== "undefined") {
                    await addActivity(currentTAId, name, intro, [], [], [], [], [], [], []);
                } else {
                    await addActivity(currentTAId, name, "", [], [], [], [], [], [], []);
                }
            }
            setLoadingTrigger(false);
            alert("Added all activities from the excel sheet");
        } else {
            alert("Please select a file!");
        }
    }

    let decodedAuth = atob(localStorage.auth);

    let split = decodedAuth.split("-");

    window.uid = split[0];
    window.email = split[1];
    window.role = split[2];

    React.useEffect(() => {
        const now = Date.now();
        let temp = "";
        if(subject.length !== 0) {
            temp += lodash.toUpper(subject.charAt(0));
        }

        if(topic.length !== 0) {
            temp += lodash.toUpper(topic.charAt(0));
        }

        if(subTopic.length !== 0) {    
            temp += lodash.toUpper(subTopic.charAt(0));
        }
        temp += now;
        setTAID(temp);
    }, [subject, topic, subTopic]);

    document.title = "Tinkering Activity Data Form | Digital ATL";

    return (
        <div className="container" id="mobilescreen">
            <Sidebar />
            <link rel="stylesheet" href="/CSS/school.css" />
            <Popup trigger={loadingTrigger} setPopupEnabled={setLoadingTrigger} closeAllowed={false}>
                <div style={{height: "85%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                    {<Bars
                        height="80"
                        width="80"
                        radius="9"
                        color="black"
                        ariaLabel="loading"
                        wrapperStyle
                        wrapperClass
                    />}
                </div>
            </Popup>
            <form>
                <div className="school-title">Tinkering Activity data form</div>
                <hr />
                <div>
                    <label htmlFor="excelSelect" className="resetbutton"><i className="fa-solid fa-upload"></i> Add activities from file</label>
                    <input type="file" name="excelSelect" id="excelSelect" onChange={onFileSelect} accept=".xlsx" style={{display: "none"}} />
                    <button className="submitbutton" onClick={addFromXlsx}>Add from this file</button>
                </div>
                <div className="formContainer">
                    <div className="row">
                        <div className="column">
                            <label htmlFor="subject"><strong>Subject:</strong> </label>
                            <select
                                name="subject"
                                id="subject"
                                value={subject}
                                className="form-inp"
                                onChange={handleChange}
                            >
                                <option value="" disabled={true}>
                                    SELECT SUBJECT
                                </option>
                                {subjectData.map((option, index) => (
                                    <option key={index} value={option.name}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="formContainer">
                    <div className="row">
                        <div className="column">
                            <label htmlFor="topic"><strong>Topic:</strong> </label>
                            <select
                                name="topic"
                                id="topic"
                                value={topic}
                                className="form-inp"
                                onChange={handleChange}
                            >
                                <option value="" disabled={true}>
                                    SELECT TOPIC
                                </option>
                                {topicData.map((option, index) => (
                                    <option key={index} value={option.name}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="column">
                                <label htmlFor="subTopic"><strong>Sub Topic:</strong> </label>
                                <select
                                    name="subTopic"
                                    id="subTopic"
                                    value={subTopic}
                                    className="form-inp"
                                    onChange={handleChange}
                                >
                                    <option value="" disabled={true}>
                                        SELECT SUB TOPIC
                                    </option>
                                    {subTopicData.map((option, index) => (
                                        <option key={index} value={option.name}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                <div className="formContainer">
                <div className="row">
            <div className="column">
                    <label htmlFor="taID"><strong>Activity ID:</strong> </label>
                    <input type="text" name="taID" id="taID" className="form-inp" style={{cursor: "no-drop", backgroundColor: "#f4f4f4"}} value={taID} onChange={handleChange} disabled={true}/>
                </div>
                <div className="column">
                    <label htmlFor="taName"><strong>Activity Name:</strong> </label>
                    <input type="text" name="taName" id="taName" placeholder="Enter the Activity Name" className="form-inp" value={taName} onChange={handleChange}/>
                </div>
                </div>
                </div>
                <div className="formContainer">
                <div className="row">
                <div className="column">
                        <label htmlFor="introduction"><strong>Introduction: </strong></label>
                        <br/>
                        <textarea name="introduction" id="introduction" placeholder="Enter the Introduction" className="form-inp" cols="18" rows="4" value={intro} onChange={handleChange}/>
                </div>
            <div className="column">
                    <label><strong>Goals: </strong></label>
                    <div className="multiForm">
                        {
                            createArray(goalsCount).map((_, index) => {
                                return <div key={index}>
                                    <textarea name={"goals"+index} id={"goals"+index} cols="18" rows="4" className="form-inp"  placeholder="Enter the Goals" onChange={mfHandleChangeGoals}/>
                                    
                                </div>
                            })
                        }
                    </div>
                    <button className="submitbutton goalsAdd" onClick={increaseField}>+</button>
                    <button className="resetbutton goalsRemove" onClick={decreaseField}>-</button>
                </div>
                </div>
                </div>
                <div className="formContainer">
                <div className="row">
                <div className="column">
                    <label htmlFor="Materials"><strong>Materials:</strong> </label>
                    <div className="multiForm">
                        {
                            createArray(materialsCount).map((_, index) => {
                                return <div key={index}>
                                    <textarea name={"materials"+index} id={"materials"+index} cols="18" rows="4" className="form-inp"  placeholder="Enter the Materials" onChange={mfHandleChangeMaterials} style={{marginTop: "1rem"}}/>
                                    <br/>
                                </div>
                            })
                        }
                    </div>
                    <button className="submitbutton materialsAdd" onClick={increaseField}>+</button>
                    <button className="resetbutton materialsRemove" onClick={decreaseField}>-</button>
                </div>
            <div className="column">
                    <label><strong>Instructions:</strong> </label>
                    <div className="multiForm">
                        {
                            createArray(instructionsCount).map((_, index) => {
                                return <div key={index}>
                                    <textarea name={"instructions"+index} id={"instructions"+index} cols="18" rows="4" className="form-inp" placeholder="Enter the Instructions"  onChange={mfHandleChangeInstructions} style={{marginTop: "1rem"}}/>
                                    <br/>
                                </div>
                            })
                        }
                    </div>
                    <button className="submitbutton instructionsAdd" onClick={increaseField}>+</button>
                    <button className="resetbutton instructionsRemove" onClick={decreaseField}>-</button>
                </div>
                </div>
                </div>
                <div className="formContainer">
                <div className="row">
                <div className="column">
                    <label><strong>Tips:</strong> </label>
                    <div className="multiForm">
                        {
                            createArray(tipsCount).map((_, index) => {
                                return <div key={index}>
                                    <textarea name={"tips"+index} id={"tips"+index} cols="18" rows="4" className="form-inp" placeholder="Enter the Tips" onChange={mfHandleChangeTips} style={{marginTop: "1rem"}}/>
                                    <br/>
                                </div>
                            })
                        }
                    </div>
                    <button className="submitbutton tipsAdd" onClick={increaseField}>+</button>
                    <button className="resetbutton tipsRemove" onClick={decreaseField}>-</button>
                </div>
            <div className="column">
                    <label><strong>Observation:</strong> </label>
                    <div className="multiForm">
                        {
                            createArray(observationCount).map((_, index) => {
                                return <div key={index}>
                                    <textarea name={"observation"+index} id={"observation"+index} cols="18" rows="4" placeholder="Enter the Observation" className="form-inp" onChange={mfHandleChangeObservation} style={{marginTop: "1rem"}}/>
                                    <br/>
                                </div>
                            })
                        }
                    </div>
                    <button className="submitbutton observationAdd" onClick={increaseField}>+</button>
                    <button className="resetbutton observationRemove" onClick={decreaseField}>-</button>
                </div>
                </div>
                </div>
                <div className="formContainer">
                <div className="row">
                <div className="column">
                    <label><strong>Extensions:</strong> </label>
                    <div className="multiForm">
                        {
                            createArray(extensionsCount).map((_, index) => {
                                return <div key={index}>
                                    <textarea name={"extension"+index} id={"extension"+index} cols="18" rows="4" placeholder="Enter the Extensions" className="form-inp" onChange={mfHandleChangeExtensions} style={{marginTop: "1rem"}}/>
                                    <br/>
                                </div>
                            })
                        }
                    </div>
                    <button className="submitbutton extensionsAdd" onClick={increaseField}>+</button>
                    <button className="resetbutton extensionsRemove" onClick={decreaseField}>-</button>
                </div>
                <div className="column">
                    <label><strong>Resources:</strong> </label>
                    <div className="multiForm">
                        {
                            createArray(resourcesCount).map((_, index) => {
                                console.log(resources[index]);
                                return <div key={index}>
                                    {typeof resources[index] === "undefined" 
                                    ? <textarea name={"resource"+index} id={"resource"+index} cols="18" rows="4" placeholder="Enter the Resources" className="form-inp" onChange={mfHandleChangeResources} style={{marginTop: "1rem"}}/>
                                    : <textarea name={"resource"+index} id={"resource"+index} cols="18" rows="4" placeholder="Enter the Resources" className="form-inp" readOnly={typeof resources[index] === "string" ? false : true} value={typeof resources[index] === "string" ? resources[index] : resources[index].name} onChange={mfHandleChangeResources} style={{marginTop: "1rem"}}/>
                                    } 
                                    <label htmlFor={"uploadMou"+index} className="resetbutton">
                                        <i className="fa-solid fa-upload"></i>
                                    </label>
                                    <input type="file" name={"uploadMou"+index} id={"uploadMou"+index} style={{display: "none"}} onChange={onFileSelectResources}/>
                                    <br/>
                                </div>
                            })
                        }
                    </div>
                    <button className="submitbutton resourcesAdd" onClick={increaseField}>+</button>
                    <button className="resetbutton resourcesRemove" onClick={decreaseField}>-</button>
                </div>
                </div>
                </div>
                <div className="buttonsContainer formContainer">
                    <button type="submit" className="submitbutton" onClick={handleSubmit}>Add</button>
                    <button type="reset" className="resetbutton" onClick={handleClick}>Reset</button>
                </div>
            </form>
        </div>
    );
}

export default TinkeringActivityForm;