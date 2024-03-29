import React, { useState } from "react";
import { Bars } from 'react-loader-spinner';
import { query, onSnapshot, collection } from "firebase/firestore";

import {db, deleteActivity, queryActivity, getSubjects, getTopics, getSubtopics} from "../../firebase/firestore";

import ReportBox from "./ReportBoxComp";
import Sidebar from "../../components/Sidebar";

function TinkeringActivityReport() {
    const [data, setData] = useState([]);
    const [loaderEnable, setLoaderEnable] = useState(true);
    const [displayData, setDisplayData] = useState([]);
    const [students, setStudents] = useState([]);
    const [schools, setSchools] = useState([]);
    const [subject, setSubject] = React.useState("");
    const [subjectID, setSubjectID] = React.useState("");
    const [topic, setTopic] = React.useState("");
    const [subTopic, setSubTopic] = React.useState("");
    const [subjectData, setSubjectData] = React.useState([]);
    const [topicData, setTopicData] = React.useState([]);
    const [subTopicData, setSubtopicData] = React.useState([]);
    const [queryLoaderEnable, setQueryLoaderEnable] = useState(false);
    const [searchValue, setSearchValue] = React.useState("");
    const [searchField, setSearchField] = React.useState("");
    const [searchResults, setSearchResults] = useState([]);

    React.useEffect(() => {
        const q = query(collection(db, "taData"));
        onSnapshot(q, (querySnapshot) => {
            const dataArray = [];
            querySnapshot.forEach(snap => {
                const timestamp = new Date(snap._document.createTime.timestamp.seconds*1000);
                console.log(timestamp.getFullYear()+"-"+timestamp.getMonth()+"-"+timestamp.getDate(), timestamp)
                let tempData = snap.data();
                tempData.docId = snap.id;
                dataArray.push(tempData);
            });
            setData(dataArray);
            setLoaderEnable(false);
        });

        const q2 = query(collection(db, "studentData"));
        onSnapshot(q2, (querySnapshot) => {
           const array = [];
           querySnapshot.forEach(snap => {
               const temp = snap.data();
               temp.docId = snap.id;
               array.push(temp);
           });
           setStudents(array);
        });

        const q3 = query(collection(db, "schoolData"));
        onSnapshot(q3, (querySnapshot) => {
            const array = [];
            querySnapshot.forEach(snap => {
                if(atob(localStorage.auth).split("-")[2] === "atlIncharge") {
                    const temp = snap.data();
                    if(temp.atlIncharge.email === atob(localStorage.auth).split("-")[1]) {
                        temp.docId = snap.id;
                        array.push(temp);
                    }
                } else {
                    const temp = snap.data();
                    temp.docId = snap.id;
                    array.push(temp);
                }
                setSchools(array);
            });
            setSchools(array);
        });
    }, []);

    function handleChange(event) {
        if(event.target.name === "field") {
            setSearchField(event.target.value);
        } else if(event.target.name === "value") {
            setSearchValue(event.target.value);
        } else if (event.target.name === "subject") {
            setSubject(event.target.value);
            setTopicData([]);
            setSubtopicData([]);
            setTopic("");
            setSubTopic("");
        } else if (event.target.name === "topic") {
            setTopic(event.target.value);
            setSubtopicData([]);
            setSubTopic("");
        } else if (event.target.name === "subTopic") {
            setSubTopic(event.target.value);
        }
    }

    async function handleSearch(event) {
        if(searchField === "" || searchValue === "") {
            alert("Please fill the required details for search");
        } else {
            setQueryLoaderEnable(true);
            setSearchResults([]);
            const snaps = await queryActivity(searchField, "==", searchValue);

            const newResults = [];

            snaps.forEach((snap) => {
                const temp = snap.data();
                temp.docId = snap.id;
                newResults.push(temp);
            });

            if(newResults.length === 0) {
                alert("No results found");
            } else {
                setSearchValue("");
            }

            setSearchResults(newResults);
            setQueryLoaderEnable(false);
        }
    }

    function resetSearch() {
        setSearchResults([]);
        setSearchValue("");
    }

    React.useEffect(() => {
        const temp = [];
        if(subject === "ALL") {
            setDisplayData(data);
        } else if ((subject !== "") && (topic !== "") && (subTopic !== "")) {
            data.forEach(ta => {
                if((ta.subject === subject) && (ta.topic === topic) && (ta.subTopic === subTopic)) {
                    temp.push(ta);
                }
            });
            setDisplayData(temp);
        } else if ((subject !== "") && (topic !== "")) {
            data.forEach(ta => {
                console.log("Hi", ta.topic);
                if((ta.subject === subject) && (ta.topic === topic)) {
                    temp.push(ta);
                }
            });
            setDisplayData(temp);
        } else if (subject !== "") {
            data.forEach(ta => {
                console.log("Hi", ta.topic);
                if(ta.subject === subject) {
                    temp.push(ta);
                }
            });
            setDisplayData(temp);
        } 
    }, [subject, topic, subTopic]);

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
        console.log(subject);
        subjectData.forEach((value, index) => {
            if (subject === value.name) {
                id = value.id;
                console.log(id);
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

    document.title = "Tinkering Activity Data Report | Digital ATL";

    return (
        <div className="container" id="mobilescreen">
            <Sidebar />
            <link rel="stylesheet" href="/CSS/form.css" />
            <link rel="stylesheet" href="/CSS/report.css" />
            <div className="title">Tinkering Activity Data Report | Digital ATL</div>
            <hr />
            <div className="querySection" style={{textAlign: "left"}}>
                <select name="field" id="field" value={searchField} style={{borderRadius: "0"}} onChange={handleChange}>
                    <option value="" disabled={true}>SELECT FIELD</option>
                    <option value="taID">TA ID</option>
                    <option value="taName">TA Name</option>
                    <option value="intro">Introduction</option>
                </select>
                <br/>
                <br/>
                <input type="text" name="value" id="value" placeholder="Value to be searched" onChange={handleChange} value={searchValue} style={{
                    padding: "0.3rem",
                    fontSize: "1.2rem",
                    width: "100%",
                    border: "3px solid rgb(94, 94, 94)",
                    borderRadius: "10px",
                    outline: "none",
                    textAlign: "left",
                    transition: "0.3s",
                    margin: "0.5rem"
                }} />
                <button className="submitbutton" onClick={handleSearch}>Search</button>
                <button className="resetbutton" onClick={resetSearch}>Clear Search</button>
                <div className="results">
                    {(queryLoaderEnable)?(
                        <center>
                            <Bars
                                height="80"
                                width="80"
                                radius="9"
                                color="black"
                                ariaLabel="loading"
                                wrapperStyle
                                wrapperClass
                            />
                        </center>
                    ):(console.log("Disabled loader"))}
                    {
                        searchResults.map((activity, index) => {
                            return <ReportBox
                                key={index}
                                id={index}
                                docId={activity.docId}
                                taID={activity.taID}
                                taName={activity.taName}
                                subject={activity.subject}
                                topic={activity.topic}
                                subTopic={activity.subTopic}
                                intro={activity.intro}
                                tips={activity.tips}
                                resources={activity.resources}
                                materials={activity.materials}
                                instructions={activity.instructions}
                                goals={activity.goals}
                                extensions={activity.extensions}
                                assessment={activity.assessment}
                                students={students}
                                schools={schools}
                                deleteActivity={deleteActivity}
                            />
                        })
                    }
                </div>
            </div>
            <hr/>
            <div className="boxContainer">
                <strong>Filter by: </strong>
                <label htmlFor="subject">Subject: </label>
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
                    <option value="ALL">
                        ALL
                    </option>
                    {subjectData.map((option, index) => (
                        <option key={index} value={option.name}>
                            {option.name}
                        </option>
                    ))}
                </select>
                <label htmlFor="topic">Topic: </label>
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
                <label htmlFor="subTopic">Sub Topic: </label>
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
            {displayData.map((activity, index) => {
                    return (
                        <ReportBox
                            key={index}
                            id={index}
                            docId={activity.docId}
                            taID={activity.taID}
                            taName={activity.taName}
                            subject={activity.subject}
                            topic={activity.topic}
                            subTopic={activity.subTopic}
                            intro={activity.intro}
                            tips={activity.tips}
                            resources={activity.resources}
                            materials={activity.materials}
                            instructions={activity.instructions}
                            goals={activity.goals}
                            extensions={activity.extensions}
                            assessment={activity.assessment}
                            students={students}
                            schools={schools}
                            deleteActivity={deleteActivity}
                        />
                    );
                })}
            {(loaderEnable)?(
                <center>
                    <Bars
                        height="80"
                        width="80"
                        radius="9"
                        color="black"
                        ariaLabel="loading"
                        wrapperStyle
                        wrapperClass
                    />
                </center>
            ):(console.log("Disabled loader"))}
        </div>
    );
}

export default TinkeringActivityReport;
