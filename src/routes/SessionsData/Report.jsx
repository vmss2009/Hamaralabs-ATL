import React, { useState } from "react";
import { Bars } from 'react-loader-spinner';
import { query, collection, onSnapshot } from "firebase/firestore";

import {db, deleteSession, querySession} from "../../firebase/firestore";

import ReportBox from "./ReportBoxComp";
import Sidebar from "../../components/Sidebar";

function StudentReport() {
    const [data, setData] = useState([]);
    const [loaderEnable, setLoaderEnable] = useState(true);

    const [queryLoaderEnable, setQueryLoaderEnable] = useState(false);
    const [searchValue, setSearchValue] = React.useState("");
    const [searchField, setSearchField] = React.useState("");
    const [searchResults, setSearchResults] = useState([]);

    React.useEffect(() => {
        const q = query(collection(db, "sessionData"));
        onSnapshot(q, (querySnapshot) => {
            const dataArray = [];
            querySnapshot.forEach(snap => {
                let tempData = snap.data();
                tempData.docId = snap.id;
                dataArray.push(tempData);
            });
            setData(dataArray);
            setLoaderEnable(false);
        });
    }, []);

    function handleChange(event) {
        if(event.target.name === "field") {
            setSearchField(event.target.value);
        } else if(event.target.name === "value") {
            setSearchValue(event.target.value);
        }
    }

    async function handleSearch(event) {
        if(searchField === "" || searchValue === "") {
            alert("Please fill the required details for search");
        } else {
            setQueryLoaderEnable(true);
            setSearchResults([]);
            let snaps;
            if (searchField === "duration") {
                snaps = await querySession(searchField, "==", parseInt(searchValue));
            } else {
                snaps = await querySession(searchField, "==", searchValue);
            }

            const newResults = [];

            snaps.forEach((snap) => {
                newResults.push(snap.data());
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

    document.title = "Session Data Report | Digital ATL";

    return (
        <div className="container" id="mobilescreen">
            <Sidebar />
            <link rel="stylesheet" href="/CSS/form.css" />
            <div className="title">Session Data Report | Digital ATL</div>
            <hr />
            <link rel="stylesheet" href="/CSS/report.css" />
            <div className="querySection" style={{textAlign: "left"}}>
                <select name="field" id="field" style={{borderRadius: "0"}} onChange={handleChange} value={searchField}>
                    <option value="" disabled={true} selected={true}>SELECT FIELD</option>
                    <option value="duration">Duration</option>
                    <option value="type">Type</option>
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
                        searchResults.map((session, index) => {
                            return (<ReportBox
                                key={index}
                                id={index}
                                subject={session.subject}
                                topic={session.topic}
                                subTopic={session.subTopic}
                                timestamp={session.timestamp}
                                duration={session.duration}
                                type={session.type}
                                prerequisistes={session.prerequisistes}
                                docId={session.docId}
                                deleteSession={deleteSession}
                            />);
                        })
                    }
                </div>
            </div>
            <hr/>
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
            {data.map((session, index) => {
                return (
                    <ReportBox
                        key={index}
                        id={index}
                        subject={session.subject}
                        topic={session.topic}
                        subTopic={session.subTopic}
                        timestamp={session.timestamp}
                        duration={session.duration}
                        type={session.type}
                        prerequisites={session.prerequisites}
                        docId={session.docId}
                        deleteSession={deleteSession}
                    />
                );
            })}
        </div>
    );
}

export default StudentReport;
