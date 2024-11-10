import React, { useState } from "react";
import { Bars } from 'react-loader-spinner';
import { query, onSnapshot, collection } from "firebase/firestore";

import {db, deleteProject, queryProject} from "../../firebase/firestore";

import ReportBox from "./ReportBoxComp";
import Sidebar from "../../components/Sidebar";

function ProjectReport() {
    const [data, setData] = useState([]);
    const [loaderEnable, setLoaderEnable] = useState(true);

    const [queryLoaderEnable, setQueryLoaderEnable] = useState(false);
    const [searchValue, setSearchValue] = React.useState("");
    const [searchField, setSearchField] = React.useState("");
    const [searchResults, setSearchResults] = useState([]);

    React.useEffect(() => {
        const q = query(collection(db, "projectsData"));
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
            const snaps = await queryProject(searchField, "==", searchValue);

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

    document.title = "Project Data Report | Digital ATL";

    return (
        <div className="container" id="mobilescreen">
            <Sidebar />
            <link rel="stylesheet" href="/CSS/form.css" />
            <link rel="stylesheet" href="/CSS/report.css" />
            <div className="title">Project Data Report | Digital ATL</div>
            <hr />
            <div className="querySection" style={{textAlign: "left"}}>
                <select name="field" id="field" value={searchField} style={{borderRadius: "0"}} onChange={handleChange}>
                    <option value="" disabled={true}>SELECT FIELD</option>
                    <option value="projectId">Project ID</option>
                    <option value="projectName">Project Name</option>
                    <option value="projectDescription">Description</option>
                    <option value="expectedStartDate">Expected Start Date</option>
                    <option value="expectedEndDate">Expected End Date</option>
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
                        searchResults.map((project, index) => {
                            return <ReportBox
                                key={index}
                                id={index}
                                docId={project.docId}
                                projectID={project.projectId}
                                projectName={project.projectName}
                                projectDescription={project.projectDescription}
                                expectedStartDate={project.expectedStartDate}
                                expectedEndDate={project.expectedEndDate}
                                externalTeamMembers={project.projectMembers}
                                tags={project.tags}
                                tasks={project.tasks}
                                deleteProject={deleteProject}
                            />
                        })
                    }
                </div>
            </div>
            <hr/>
            {data.map((project, index) => {
                return (
                    <ReportBox
                        key={index}
                        id={index}
                        docId={project.docId}
                        projectID={project.projectId}
                        projectName={project.projectName}
                        projectDescription={project.projectDescription}
                        expectedStartDate={project.expectedStartDate}
                        expectedEndDate={project.expectedEndDate}
                        externalTeamMembers={project.projectMembers}
                        tags={project.tags}
                        tasks={project.tasks}
                        deleteProject={deleteProject}
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

export default ProjectReport;
