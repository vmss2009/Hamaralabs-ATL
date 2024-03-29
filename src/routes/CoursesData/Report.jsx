import React, { useState } from "react";
import { Bars } from 'react-loader-spinner';
import { query, onSnapshot, collection } from "firebase/firestore";

import { db, deleteCourse, queryCourse } from "../../firebase/firestore";
import Sidebar from "../../components/Sidebar";

import ReportBox from "./ReportBoxComp";

function CoursesReport() {
    const [data, setData] = useState([]);
    const [loaderEnable, setLoaderEnable] = useState(true);

    const [queryLoaderEnable, setQueryLoaderEnable] = useState(false);
    const [searchValue, setSearchValue] = React.useState("");
    const [searchField, setSearchField] = React.useState("");
    const [searchResults, setSearchResults] = useState([]);

    const [students, setStudents] = React.useState([]);
    const [schools, setSchools] = React.useState([]);

    React.useEffect(() => {
        const q = query(collection(db, "coursesData"));
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
            const snaps = await queryCourse(searchField, "==", searchValue);

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

    document.title = "Courses Data Report | Digital ATL";

    return (
        <div className="container" id="mobilescreen">
            <Sidebar />
            <link rel="stylesheet" href="/CSS/form.css" />
            <link rel="stylesheet" href="/CSS/report.css" />
            <div className="title">Courses Data Report | Digital ATL</div>
            <hr />
            <div className="querySection" style={{textAlign: "left"}}>
                <select name="field" id="field" style={{borderRadius: "0"}} onChange={handleChange} value={searchField}>
                    <option value="" disabled={true} selected={true}>SELECT FIELD</option>
                    <option value="courseName">Course Name</option>
                    <option value="courseTag">Courses Tag</option>
                    <option value="description">Description</option>
                    <option value="organizedBy">Organized By</option>
                    <option value="applStartDate">Application Start Date</option>
                    <option value="applEndDate">Application End Date</option>
                    <option value="crsStartDate">Course Start Date</option>
                    <option value="crsEndDate">Course End Date</option>
                    <option value="classesFrom">Classes From</option>
                    <option value="classesTo">Classes To</option>
                    <option value="refLink">Reference Link</option>
                    <option value="requirements">Requirements</option>
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
                        searchResults.map((course, index) => {
                            return <ReportBox
                                key={index}
                                id={index}
                                courseName ={course.courseName}
                                courseTag ={course.courseTag}
                                description ={course.description}
                                organizedBy ={course.organizedBy}
                                applStartDate={course.applicationStartDate}
                                applEndDate={course.applicationEndDate}
                                crsStartDate={course.crsStartDate}
                                crsEndDate={course.crsEndDate}
                                classesFrom ={course.classesFrom}
                                classesTo={course.classesTo}
                                refLink ={course.refLink}
                                requirements={course.requirements}
                                docId={course.docId}
                                students={students}
                                schools={schools}
                                deleteCourse={deleteCourse}
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
            {data.map((course, index) => {
                return (
                    <ReportBox
                        key={index}
                        id={index}
                        courseName ={course.courseName}
                        courseTag = {course.courseTag}
                        description ={course.description}
                        organizedBy ={course.organizedBy}
                        applStartDate={course.applicationStartDate}
                        applEndDate={course.applicationEndDate}
                        crsStartDate={course.crsStartDate}
                        crsEndDate={course.crsEndDate}
                        classesFrom ={course.classesFrom}
                        classesTo={course.classesTo}
                        refLink ={course.refLink}
                        requirements={course.requirements}
                        docId={course.docId}
                        students={students}
                        schools={schools}
                        deleteCourse={deleteCourse}
                    />
                );
            })}
        </div>
    );
}

export default CoursesReport;