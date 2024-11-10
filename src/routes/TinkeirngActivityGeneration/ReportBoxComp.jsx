import React from "react";
import {db, getSubjects, getSubtopics, getTopics, addActivity} from "../../firebase/firestore";
import {doc, query} from "firebase/firestore";

const Popup = React.lazy(() => import("../../components/Popup"));

function ReportBox(props) {
    const role = atob(localStorage.auth).split("-")[2];
    const [displayValue, setDisplayValue] = React.useState("none");
    const [tinkeringActivityEdit, setTinkeringActivityEdit] = React.useState(false);
    const [subject, setSubject] = React.useState("");
    const [topic, setTopic] = React.useState("");
    const [subTopic, setSubTopic] = React.useState("");
    const [subjectData, setSubjectData] = React.useState([]);
    const [topicData, setTopicData] = React.useState([]);
    const [subTopicData, setSubtopicData] = React.useState([]);

    function handleMouseOver(event) {
        setDisplayValue("block");
    }

    function handleMouseOut(event) {
        setDisplayValue("none");
    }

    function handleChange(event) {
        if(event.target.name === "subject") {
            setSubject(event.target.value);
        } else if(event.target.name === "topic") {
            setTopic(event.target.value);
        } else if(event.target.name === "subTopic") {
            setSubTopic(event.target.value);
        }
    }

    React.useEffect(() => {
        if (tinkeringActivityEdit) {
            const q = query(doc(db, "taData", props.taID));
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
        }
    }, [tinkeringActivityEdit]);

    React.useEffect(() => {
        if (tinkeringActivityEdit) {
            let subjectId;
            for (let index = 0; index < subjectData.length; index++) {
                if (subject === subjectData[index].name) {
                    subjectId = subjectData[index].id;
                }
            }
            getTopics(subjectId || " ")
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

                    let id;
                    for (let index = 0; index < dataArray.length; index++) {
                        if (topic === dataArray[index].name) {
                            id = dataArray[index].id;
                        }
                    }

                    getSubtopics(subjectId || " ", id || " ")
                        .then((docSnaps) => {
                            const dataArraySubTopics = [];
                            docSnaps.forEach((docSnap) => {
                                const temp = {
                                    name: docSnap.data().name,
                                    id: docSnap.id
                                };
                                dataArraySubTopics.push(temp);

                            });

                            setSubtopicData(dataArraySubTopics.sort((a, b) => a.name.localeCompare(b.name)));
                        });
                })
                .catch((err) => {
                    window.location.reload();
                });
        }
    }, [subject, topic, subTopic, tinkeringActivityEdit]);


    function getFileNameFromUrl(url, operation) {
        const urlObj = new URL(url);
        const pathSegments = urlObj.pathname.split('/');
        const encodedFileName = pathSegments[pathSegments.length - 1];
        let fileName = decodeURIComponent(encodedFileName);
        fileName = fileName.replace(`tAFiles/${operation}/`, '');
        return fileName;
    }

    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (err) {
            return false;
        }
    }

    async function handleDelete(event) {
        if(window.confirm("You are about to delete an activity")) {
            await props.deleteActivity(props.docId)
                .then(() => {
                    alert("Activity has been deleted.");
                })
                .catch(err => {
                    alert("An error has occurred please try again later.");
                })
        }
    }

    async function handleEditTA(event) {
        const tinkeringActivity = props.activity;
        tinkeringActivity.subject = subject;
        tinkeringActivity.topic = topic;
        tinkeringActivity.subTopic = subTopic;
        await props.deleteActivity(props.docId);
        console.log(tinkeringActivity.taID, tinkeringActivity.taName, subject, topic, subTopic, tinkeringActivity.intro, tinkeringActivity.goals, tinkeringActivity.materials, tinkeringActivity.instructions, tinkeringActivity.tips, tinkeringActivity.assessment, tinkeringActivity.extensions, tinkeringActivity.resources);
        await addActivity(tinkeringActivity.taID, tinkeringActivity.taName, subject, topic, subTopic, tinkeringActivity.intro, tinkeringActivity.goals, tinkeringActivity.materials, tinkeringActivity.instructions, tinkeringActivity.tips, tinkeringActivity.assessment, tinkeringActivity.extensions, tinkeringActivity.resources)
            .then(() => {
                alert("Added successfully!!");
                localStorage.setItem("activityId", tinkeringActivity.taID);
                window.location.href = "/ta-data/view";
            })
            .catch((error) => {
                console.log(error);
                alert("Adding data failed! Please try again.");
            });
    }

    let decodedAuth = atob(localStorage.auth);

    let split = decodedAuth.split("-");

    window.uid = split[0];
    window.email = split[1];
    window.role = split[2];

    return (
        <div className="box" id={props.id} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
            {tinkeringActivityEdit ? (
                <Popup trigger={tinkeringActivityEdit} setPopupEnabled={setTinkeringActivityEdit} closeAllowed={true}>
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
                        </div>
                    </div>
                    <div className="formContainer">
                        <div className="row">
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
                                    {console.log(subTopicData)}
                                    {subTopicData.map((option, index) => (
                                        <option key={index} value={option.name}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="container" style={{fontSize: "1.2rem"}}>
                        <button className="submitbutton" onClick={handleEditTA}>Update</button>
                    </div>
                </Popup>
            ) : ""
            }
            <div className="name" onMouseOver={handleMouseOver} style={{fontSize: "1.5rem"}}>{props.taName}</div>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>TA ID:</span> {props.taID}</div>
            <br/>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>Introduction:</span> {props.intro}</div>
            {
                (props.subject !== undefined) && (props.topic !== undefined) && (props.subTopic !== undefined) ?
                    <>
                        <br/>
                        <div className="boxContainer"><span
                            style={{fontWeight: "600"}}>Subject:</span> {props.subject} - {props.topic} - {props.subTopic}
                        </div>
                    </>
                    : ""
            }
            <br/>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>Goals:</span> <br/> {
                props.goals.map((goal, index) => {
                    return <span key={index}>{index + 1}. {goal} <br/></span>
                })
            }
            </div>
            <br/>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>Materials:</span> <br/> {
                props.materials.map((material, index) => {
                    return <span key={index}>{index + 1}. {material} <br/></span>
                })
            }
            </div>
            <br/>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>Instructions:</span> <br/> {
                props.instructions.map((instruction, index) => {
                    return <span key={index}>{index + 1}. {instruction} <br/></span>
                })
            }
            </div>
            <br/>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>Observation:</span> <br/> {
                props.assessment.map((assessment, index) => {
                    return <span key={index}>{index + 1}. {assessment} <br/></span>
                })
            }
            </div>
            <br/>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>Tips:</span> <br/> {
                props.tips.map((tip, index) => {
                    return <span key={index}>{index + 1}. {tip} <br/></span>
                })
            }
            </div>
            <br/>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>Extensions:</span> <br/> {
                props.extensions.map((extension, index) => {
                    return <span key={index}>{index + 1}. {extension} <br/></span>
                })
            }</div>
            <br/>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>Resources:</span> <br/> {
                props.resources.map((resource, index) => {
                    return <span
                        key={index}>{index + 1}. {isValidUrl(resource) ? resource.startsWith("https://firebasestorage.googleapis.com/v0/b/") ?
                        <a href={resource} target="_blank"
                           rel="noreferrer">{getFileNameFromUrl(resource, props.taName)}</a> :
                        <a href={resource} target="_blank" rel="noreferrer">{resource}</a> : resource} <br/></span>
                })
            }
            </div>
            <div className="buttonsContainer" id={"btnContainer" + props.id} style={{display: displayValue}}>
                {
                    role === "admin" ?
                        <>
                            <button className="submitbutton deleteBtn" onClick={handleDelete}><i
                                className="fa-solid fa-trash-can"></i></button>
                        </> : ""
                }
                <button className="submitbutton editBtn" onClick={() => {setTinkeringActivityEdit(true)}}><i className="fa-solid fa-edit"></i></button>
            </div>
        </div>
    );
}

export default ReportBox;
