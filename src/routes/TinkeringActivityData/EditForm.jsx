import React from "react";
import {doc, onSnapshot, query} from "firebase/firestore";

import {db, updateActivity, getSubjects, getTopics, getSubtopics} from "../../firebase/firestore";
import {useParams} from "react-router-dom";
import Sidebar from "../../components/Sidebar";

function TinkeringActivityForm() {
    const {activityId} = useParams();

    const [taID, setTAID] = React.useState("");
    const [taName, setTAName] = React.useState("");
    const [subject, setSubject] = React.useState("");
    const [subjectID, setSubjectID] = React.useState("");
    const [topic, setTopic] = React.useState("");
    const [subTopic, setSubTopic] = React.useState("");
    const [intro, setIntro] = React.useState("");
    const [goals, setGoals] = React.useState([]);
    const [materials, setMaterials] = React.useState([]);
    const [instructions, setInstructions] = React.useState([]);
    const [tips, setTips] = React.useState([]);
    const [observations, setObservations] = React.useState([]);
    const [extensions, setExtensions] = React.useState([]);
    const [resources, setResources] = React.useState([]);
    const [subjectData, setSubjectData] = React.useState([]);
    const [topicData, setTopicData] = React.useState([]);
    const [subTopicData, setSubtopicData] = React.useState([]);

    const [goalsCount, setGoalsCount] = React.useState(0);
    const [materialsCount, setMaterialsCount] = React.useState(0);
    const [instructionsCount, setInstructionsCount] = React.useState(0);
    const [tipsCount, setTipsCount] = React.useState(0);
    const [observationsCount, setObservationsCount] = React.useState(0);
    const [extensionsCount, setExtensionsCount] = React.useState(0);
    const [resourcesCount, setResourcesCount] = React.useState(0);

    function clearForm() {
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
        if(event.target.name === "taID") {
            setTAID(event.target.value);
        } else if(event.target.name === "taName") {
            setTAName(event.target.value);
        } else if(event.target.name === "subject") {
            setSubject(event.target.value);
        } else if(event.target.name === "topic") {
            setTopic(event.target.value);
        } else if(event.target.name === "subTopic") {
            setSubTopic(event.target.value);
        } else if(event.target.name === "introduction") {
            setIntro(event.target.value);
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if(hasDuplicates(goals) || hasDuplicates(materials) || hasDuplicates(instructions) || hasDuplicates(tips) || hasDuplicates(observations) || hasDuplicates(extensions) || hasDuplicates(resources)) {
            alert("Data has duplicate values!");
        } else {
            await updateActivity(activityId, taID, taName, subject, topic, subTopic, intro, goals, materials, instructions, tips, observations, extensions, resources)
                .then(() => {
                    alert("Updated successfully!!");
                    window.location.href = "/ta-data/view";
                })
                .catch(() => {
                    alert("Updating data failed! Please try again.");
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
        if(classes.includes("goalsAdd")) {
            setGoalsCount(goalsCount+1);
        } else if(classes.includes("materialsAdd")) {
            setMaterialsCount(materialsCount+1);
        } else if(classes.includes("instructionsAdd")) {
            setInstructionsCount(instructionsCount+1);
        } else if(classes.includes("tipsAdd")) {
            setTipsCount(tipsCount+1);
        } else if(classes.includes("observationsAdd")) {
            setObservationsCount(observationsCount+1);
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
        } else if(classes.includes("observationsRemove")) {
            if(observationsCount !== 0) {
                observations.pop();
                setObservationsCount(observationsCount-1);
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
        const temp = [...goals];
        temp[index] = event.target.value;
        setGoals(temp);
    }

    function mfHandleChangeMaterials(event) {
        const index = Number(event.target.getAttribute("id").replace("materials", ""));
        const temp = [...materials];
        temp[index] = event.target.value;
        setMaterials(temp);
    }

    function mfHandleChangeInstructions(event) {
        const index = Number(event.target.getAttribute("id").replace("instructions", ""));
        const temp = [...instructions];
        temp[index] = event.target.value;
        setInstructions(temp);
    }

    function mfHandleChangeTips(event) {
        const index = Number(event.target.getAttribute("id").replace("tips", ""));
        const temp = [...tips];
        temp[index] = event.target.value;
        setTips(temp);
    }

    function mfHandleChangeobservations(event) {
        const index = Number(event.target.getAttribute("id").replace("observations", ""));
        const temp = [...observations];
        temp[index] = event.target.value;
        setObservations(temp);
    }

    function mfHandleChangeExtensions(event) {
        const index = Number(event.target.getAttribute("id").replace("extension", ""));
        const temp = [...extensions];
        temp[index] = event.target.value;
        setExtensions(temp);
    }

    function mfHandleChangeResources(event) {
        const index = Number(event.target.getAttribute("id").replace("resource", ""));
        const temp = [...resources];
        temp[index] = event.target.value;
        setResources(temp);
    }

    React.useEffect(() => {
        const q = query(doc(db, "taData", activityId));
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
        onSnapshot(q, (snapshot) => {
            setTAID(snapshot.data().taID);
            setTAName(snapshot.data().taName);
            setSubject(snapshot.data().subject ? snapshot.data().subject : "");
            setTopic(snapshot.data().topic ? snapshot.data().topic : "");
            setSubTopic(snapshot.data().subTopic ? snapshot.data().subTopic : "");
            setIntro(snapshot.data().intro);
            setObservations(snapshot.data().assessment);
            setObservationsCount(snapshot.data().assessment.length);
            setExtensions(snapshot.data().extensions);
            setExtensionsCount(snapshot.data().extensions.length);
            setMaterials(snapshot.data().materials);
            setMaterialsCount(snapshot.data().materials.length);
            setResources(snapshot.data().resources);
            setResourcesCount(snapshot.data().resources.length);
            setGoals(snapshot.data().goals);
            setGoalsCount(snapshot.data().goals.length);
            setInstructions(snapshot.data().instructions);
            setInstructionsCount(snapshot.data().instructions.length);
            setTips(snapshot.data().tips);
            setTipsCount(snapshot.data().tips.length);
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
        getTopics(id || " ")
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
        getSubtopics(subjectID || " ", id || " ")
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

    let decodedAuth = atob(localStorage.auth);

    let split = decodedAuth.split("-");

    window.uid = split[0];
    window.email = split[1];
    window.role = split[2];

    document.title = "Tinkering Activity Data Edit | Digital ATL";

    return (
        <div className="container" id="mobilescreen">
            <Sidebar />
            <link rel="stylesheet" href="/CSS/school.css" />
            <form>
                <div className="school-title">Tinkering Activity data edit</div>
                <hr />
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
                <div className="formContainer"></div>
                <div className="formContainer">
                <div className="row">
                    <div className="column">
                    <label htmlFor="taID"><strong>TA ID:</strong> </label>
                    <input type="text" name="taID"  id="taID" className="form-inp" value={taID} onChange={handleChange}  disabled={true} />                
                </div>
                <div className="column">
                    <label htmlFor="taName"><strong>TA Name:</strong> </label>
                    <input type="text" name="taName" id="taName" placeholder="Enter the Activity Name" className="form-inp" value={taName} onChange={handleChange}/>
                </div>
                </div>
                </div>
                <div className="formContainer">
                <div className="row">
                    <div className="column">
                    <label htmlFor="introduction"><strong>Introduction:</strong> </label>
                    <br/>
                    <br/>
                    <textarea name="introduction" id="introduction" placeholder="Enter the Introduction" cols="18" rows="4" className="form-inp" value={intro} onChange={handleChange}/>
                </div>
                <div className="column">
                    <label><strong>Goals:</strong> </label>
                    <div className="multiForm">
                        {
                            createArray(goalsCount).map((_, index) => {
                                return <div key={index}>
                                    <textarea name={"goals"+index} cols="18" rows="4" placeholder="Enter the Goals" id={"goals"+index} className="form-inp" value={goals[index]} onChange={mfHandleChangeGoals} style={{marginTop: "1rem"}}/>
                                    <br/>
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
                    <label><strong>Materials:</strong> </label>
                    <div className="multiForm">
                        {
                            createArray(materialsCount).map((_, index) => {
                                return <div key={index}>
                                    <textarea name={"materials"+index} id={"materials"+index} placeholder="Enter the Materials" cols="18" rows="4" className="form-inp" value={materials[index]} onChange={mfHandleChangeMaterials} style={{marginTop: "1rem"}}/>
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
                                    <textarea name={"instructions"+index} id={"instructions"+index} placeholder="Enter the Instructions" cols="18" rows="4" className="form-inp" value={instructions[index]} onChange={mfHandleChangeInstructions} style={{marginTop: "1rem"}}/>
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
                                    <textarea name={"tips"+index} id={"tips"+index} cols="18" rows="4" className="form-inp" placeholder="Enter the Tips" value={tips[index]} onChange={mfHandleChangeTips} style={{marginTop: "1rem"}}/>
                                    <br/>
                                </div>
                            })
                        }
                    </div>
                    <button className="submitbutton tipsAdd" onClick={increaseField}>+</button>
                    <button className="resetbutton tipsRemove" onClick={decreaseField}>-</button>
                </div>
                <div className="column">
                    <label><strong>observations:</strong> </label>
                    <div className="multiForm">
                        {
                            createArray(observationsCount).map((_, index) => {
                                return <div key={index}>
                                    <textarea name={"observations"+index} cols="18" rows="4"  placeholder="Enter the Observation" id={"observations"+index} className="form-inp" value={observations[index]} onChange={mfHandleChangeobservations} style={{marginTop: "1rem"}}/>
                                    <br/>
                                </div>
                            })
                        }
                    </div>
                    <button className="submitbutton observationsAdd" onClick={increaseField}>+</button>
                    <button className="resetbutton observationsRemove" onClick={decreaseField}>-</button>
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
                                    <textarea name={"extension"+index} id={"extension"+index} cols="18" rows="4" placeholder="Enter the Extensions" className="form-inp" value={extensions[index]} onChange={mfHandleChangeExtensions} style={{marginTop: "1rem"}}/>
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
                                return <div key={index}>
                                    <textarea name={"resource"+index} id={"resource"+index} cols="18" rows="4" placeholder="Enter the Resources" className="form-inp" value={resources[index]} onChange={mfHandleChangeResources} style={{marginTop: "1rem"}}/>
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
                    <button type="submit" className="submitbutton" onClick={handleSubmit}>Update</button>
                    <button type="reset" className="resetbutton" onClick={handleClick}>Reset</button>
                </div>
            </form>
        </div>
    );
}

export default TinkeringActivityForm;
