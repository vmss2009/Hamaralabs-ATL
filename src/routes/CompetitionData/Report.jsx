import React, { useState } from "react";
import { Bars } from 'react-loader-spinner';
import { query, onSnapshot, collection } from "firebase/firestore";

import { db, deleteCompetition, queryCompetition } from "../../firebase/firestore";
import Sidebar from "../../components/Sidebar";

import ReportBox from "./ReportBoxComp";

function ComRegReport() {
    const [data, setData] = useState([]);
    const [loaderEnable, setLoaderEnable] = useState(true);

    const [queryLoaderEnable, setQueryLoaderEnable] = useState(false);
    const [searchValue, setSearchValue] = React.useState("");
    const [searchField, setSearchField] = React.useState("");
    const [searchResults, setSearchResults] = useState([]);

    const [students, setStudents] = React.useState([]);
    const [schools, setSchools] = React.useState([]);

    React.useEffect(() => {
        const q = query(collection(db, "competitionData"));
        onSnapshot(q, (querySnapshot) => {
            const dataArray = [];
            querySnapshot.forEach(snap => {
                let tempData = snap.data();
                tempData.docId = snap.id;
                dataArray.push(tempData);
            });
            console.log(dataArray);
            setData(dataArray);
            setLoaderEnable(false);
        });

        const q2 = query(collection(db, "studentData"));
        onSnapshot(q2, (querySnapshot) => {
            const dataArray = [];
            querySnapshot.forEach(snap => {
                let tempData = snap.data();
                tempData.docId = snap.id;
                dataArray.push(tempData);
            });
            setStudents(dataArray);
        });

        const q3 = query(collection(db, "schoolData"));
        onSnapshot(q3, (querySnapshot) => {
            const dataArray = [];
            querySnapshot.forEach(snap => {
                let tempData = snap.data();
                tempData.docId = snap.id;
                dataArray.push(tempData);
            });
            setSchools(dataArray);
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
            const snaps = await queryCompetition(searchField, "==", searchValue);

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

    document.title = "Competition Data Report | Digital ATL";

    return (
        <div className="container" id="mobilescreen">
            <Sidebar />
            <link rel="stylesheet" href="/CSS/form.css" />
            <link rel="stylesheet" href="/CSS/report.css" />
            <div className="title">Competition Data Report | Digital ATL</div>
            <hr />
            <div className="querySection" style={{textAlign: "left"}}>
                <select name="field" id="field" style={{borderRadius: "0"}} onChange={handleChange} value={searchField}>
                    <option value="" disabled={true} selected={true}>SELECT FIELD</option>
                    <option value="name">Competition Name</option>
                    <option value="description">Description</option>
                    <option value="organizedBy">Organized By</option>
                    <option value="applicationStartDate">Application Start Date</option>
                    <option value="applicationEndDate">Application End Date</option>
                    <option value="competitionStartDate">Competition Start Date</option>
                    <option value="competitionEndDate">Competition End Date</option>
                    <option value="eligibility.classesFrom">Classes From</option>
                    <option value="eligibility.classesTo">Classes To</option>
                    <option value="refLink">Reference Link</option>
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
                        searchResults.map((s, index) => {
                            return <ReportBox
                                key={index}
                                id={index}
                                competName ={s.name}
                                description ={s.description}
                                organizedBy ={s.organizedBy}
                                applStartDate={s.applicationStartDate}
                                applEndDate={s.applicationEndDate}
                                compStartDate={s.competitionStartDate}
                                compEndDate={s.competitionEndDate}
                                classesFrom ={s.eligibility.classesFrom}
                                classesTo={s.eligibility.classesTo}
                                atlSchools  ={s.eligibility.atlSchools}
                                nonAtlSchools={s.eligibility.nonAtlSchools}
                                individual={s.eligibility.individual}
                                team={s.eligibility.team}
                                refLink ={s.refLink}
                                requirements={s.requirements}
                                docId={s.docId}
                                students={students}
                                schools={schools}
                                deleteCompetition={deleteCompetition}
                            />;
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
            {data.map((s, index) => {
                return (
                    <ReportBox
                        key={index}
                        id={index}
                        competName ={s.name}
                        description ={s.description}
                        organizedBy ={s.organizedBy}
                        applStartDate={s.applicationStartDate}
                        applEndDate={s.applicationEndDate}
                        compStartDate={s.competitionStartDate}
                        compEndDate={s.competitionEndDate}
                        classesFrom ={s.eligibility.classesFrom}
                        classesTo={s.eligibility.classesTo}
                        atlSchools  ={s.eligibility.atlSchools}
                        nonAtlSchools={s.eligibility.nonAtlSchools}
                        individual={s.eligibility.individual}
                        team={s.eligibility.team}
                        refLink ={s.refLink}
                        requirements={s.requirements}
                        docId={s.docId}
                        paymentDetails={s.paymentDetails}
                        fileURL={s.fileURL}
                        students={students}
                        schools={schools}
                        deleteCompetition={deleteCompetition}
                    />
                );
            })}
        </div>
    );
}

export default ComRegReport;