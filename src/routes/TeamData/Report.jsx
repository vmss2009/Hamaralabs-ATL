import React, { useState } from "react";
import { Bars } from 'react-loader-spinner';
import {query, onSnapshot, collection, where} from "firebase/firestore";

import { db, deleteTeam, queryTeam } from "../../firebase/firestore";
import Sidebar from "../../components/Sidebar";

import ReportBox from "./ReportBoxComp";

function TeamReport() {
    const [data, setData] = useState([]);
    const [loaderEnable, setLoaderEnable] = useState(true);
    const [school, setSchool] = React.useState("");

    const [queryLoaderEnable, setQueryLoaderEnable] = useState(false);
    const [searchValue, setSearchValue] = React.useState("");
    const [searchField, setSearchField] = React.useState("");
    const [searchResults, setSearchResults] = useState([]);



    React.useEffect(() => {
        const q = query(collection(db, "teamData"));
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

    React.useEffect(() => {
        if(atob(localStorage.getItem("auth")).split("-")[2] === "atlIncharge") {
            const q = query(collection(db, "schoolData"), where("atlIncharge.email", "==", atob(localStorage.getItem("auth")).split("-")[1]));
            onSnapshot(q, (querySnapshot) => {
                querySnapshot.forEach(snap => {
                    setSchool(snap.data().name);
                });
            });
        }
    }, []);

    function handleChange(event) {
        if(event.target.name === "field") {
            setSearchField(event.target.value);
        } 
        else if(event.target.name === "value") {
            setSearchValue(event.target.value);
        }
    }

    async function handleSearch(event) {
        if(searchField === "" || searchValue === "") {
            alert("Please fill the required details for search");
        } else {
            setQueryLoaderEnable(true);
            setSearchResults([]);
            const snaps = await queryTeam(searchField, "==", searchValue);

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
        setSearchField("");
    }

    document.title = "Team Data Report | Digital ATL";

    return (
        <div className="container" id="mobilescreen">
            <link rel="stylesheet" href="/CSS/form.css" />
            <link rel="stylesheet" href="/CSS/report.css" />
            <Sidebar />
            <div className="title">Team Data Report | Digital ATL</div>
            <hr />
            <div className="querySection" style={{textAlign: "left"}}>
                <select name="field" id="field" value={searchField} style={{borderRadius: "0"}} onChange={handleChange}>
                    <option value="" disabled={true}>SELECT FIELD</option>
                    <option value="name">Team Name</option>
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
                    ):""}
                    {
                        searchResults.map((team, index) => {
                            return <ReportBox
                                key={index}
                                id={index}
                                docId={team.docId}
                                name={team.name}
                                leader={team.leader}
                                members={team.members}
                                deleteTeam={deleteTeam}
                            />
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
            {/* Nageswar */}
            {data.map((team, index) => {
                // Add a conditional check to ensure 'team' is defined before accessing its properties
                if (team && team.name) {
                    return (
                        <ReportBox
                            key={index}
                            id={index}
                            docId={team.docId}
                            name={team.name}
                            leader={team.leader}
                            members={team.members}
                            deleteTeam={deleteTeam}
                        />
                    );
                } else {
                    // Handle the case where 'team' or 'team.name' is undefined
                    console.error("Team or team.name is undefined:", team);
                    return null; // or any fallback UI you want to render
                }
            })}
            {/* Nageswar */}
        </div>
    );
}

export default TeamReport;
