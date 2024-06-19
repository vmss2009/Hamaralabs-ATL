import React from "react";

import { addSession, getSubjects, getTopics, getSubtopics } from "../../firebase/firestore";
import Sidebar from "../../components/Sidebar";

function Form() {
    const [subject, setSubject] = React.useState("");
    const [subjectID, setSubjectID] = React.useState("");
    const [topic, setTopic] = React.useState("");
    const [subTopic, setSubTopic] = React.useState("");
    const [subjectData, setSubjectData] = React.useState([]);
    const [topicData, setTopicData] = React.useState([]);
    const [subTopicData, setSubtopicData] = React.useState([]);
    const [dateTime, setDateTime] = React.useState("");
    const [duration, setDuration] = React.useState(0);
    const [sessionType, setSessionType] = React.useState("");
    const [prerequisites, setPrerequisites] = React.useState([]);
    const [prerequisitesLength, setPrerequisitesLength] = React.useState(0);

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

    function handleChange(event) {
        if(event.target.name === "subject") {
            setSubject(event.target.value);
        } else if(event.target.name === "topic") {
            setTopic(event.target.value);
        } else if(event.target.name === "subTopic") {
            setSubTopic(event.target.value);
        } else if (event.target.name === "dateTime") {
            setDateTime(event.target.value);
        } else if (event.target.name === "duration") {
            setDuration(event.target.value);
        } else if (event.target.name === "sessionType") {
            setSessionType(event.target.value);
        }
    }

    function clearForm() {
        setSubject("");
        setTopic("");
        setSubTopic("");
        setDateTime("");
        setDuration(0);
        setSessionType("");
        setPrerequisites([]);
        setPrerequisitesLength(0);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        await addSession(subject, topic, subTopic, dateTime, duration, prerequisites, sessionType)
            .then(() => {
                alert("Added successfully!");
                window.location.href = "/session-data/view";
                clearForm();
            })
            .catch((err) => {
                alert("Adding failed please try again!");
            });
    }

    function createArray(maxCount) {
        const arr = [];
        for (let i = 0; i < maxCount; i++) {
            arr.push(i);
        }
        return arr;
    }

    function addField() {
        setPrerequisitesLength(prerequisitesLength + 1);
        setPrerequisites([...prerequisites, ""]);
    }

    function removeField() {
        if (prerequisitesLength > 0) {
            setPrerequisitesLength(prerequisitesLength - 1);
            setPrerequisites([...prerequisites].pop());
        }
    }

    function mfHandleChangePrerequisite(event) {
        const index = Number(event.target.getAttribute("id").replace("prerequisite", ""));
        const value = event.target.value;
        const temp = [...prerequisites];
        temp[index] = value;
        setPrerequisites(temp);
    }

    document.title = "Session Data Form | Digital ATL";

    return (
        <div className="container" id="mobilescreen">
            <Sidebar />
            <form onSubmit={handleSubmit}>
                <link rel="stylesheet" href="/CSS/school.css" />
                <div className="school-title">Sessions form</div>
                <hr />
                <div className="message"></div>
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
                            <label htmlFor="dateTime"><strong>Date and Time:</strong></label>
                            <input
                                type="datetime-local"
                                name="dateTime"
                                id="dateTime"
                                className="form-inp"
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="formContainer">
                    <div className="row">
                        <div className="column">
                            <label htmlFor="duration"><strong>Duration (hours):</strong></label>
                            <input
                                type="number"
                                name="duration"
                                id="duration"
                                className="form-inp"
                                onChange={handleChange} // Assuming you have a function to handle changes
                                min="1" // Set minimum value to 1 hour
                                step="0.5" // Allow increments of half an hour
                            />
                        </div>
                    </div>
                </div>
                <div className="formContainer">
                    <div className="row">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                        <label><strong>Session Type:</strong></label>
                            <div style={{ marginRight: '20px' }}> {/* Adds space between the two options */}
                                <input
                                    type="radio"
                                    id="physical"
                                    name="sessionType"
                                    value="physical"
                                    onChange={handleChange}
                                />
                                <label htmlFor="physical">Physical</label>
                            </div>
                            <div>
                                <input
                                    type="radio"
                                    id="online"
                                    name="sessionType"
                                    value="online"
                                    onChange={handleChange}
                                />
                                <label htmlFor="online">Online</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="formContainer">
                    <label><strong>Prerequisites:</strong> </label>
                    <div className="prerequisites">
                        {createArray(prerequisitesLength).map((index) => {
                            return (
                                <div key={index}>
                                    <input type="text" value={prerequisites[index]} placeholder="Enter the prerequisite" onChange={mfHandleChangePrerequisite} name={"prerequisite" + index} id={"prerequisite" + index} className="form-inp" />
                                    <br /><br />
                                </div>
                            );
                        })}
                    </div>
                    <br />
                    <div className="buttonsContainer">
                        <span className="submitbutton addPrerequisite" onClick={addField}>+</span>
                        <span className="resetbutton removePrerequisite" onClick={removeField}>-</span>
                    </div>
                </div>
                <br />
                <div className="buttonsContainer">
                    <button type="submit" className="submitbutton">Add</button>
                    <button type="reset" className="resetbutton" onClick={clearForm}>Reset</button>
                </div>
            </form>
        </div>
    );
}

export default Form;
