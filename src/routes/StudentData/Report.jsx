import React, { useState, useEffect } from "react";
import { Bars } from 'react-loader-spinner';
import { collection, onSnapshot, query, where, getDocs } from "firebase/firestore";
import { db, deleteStudent, getSchools, queryStudent } from "../../firebase/firestore";
import ReportBox from "./ReportBoxComp";
import Sidebar from "../../components/Sidebar";

function StudentReport() {
    const [data, setData] = useState([]);
    const [loaderEnable, setLoaderEnable] = useState(true);
    const [schools, setSchools] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState("");
    const [selectedTag, setSelectedTag] = useState("");
    const [queryLoaderEnable, setQueryLoaderEnable] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [searchField, setSearchField] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSchoolSelected, setIsSchoolSelected] = useState(false);
    const [isTagSelected, setIsTagSelected] = useState(false);
    const [selectedClass, setSelectedClass] = useState("");
    let [count, setCount] = useState(0);
    const role = atob(localStorage.auth).split("-")[2];
    const email = atob(localStorage.auth).split("-")[1];

    useEffect(() => {
        const q = query(collection(db, "studentData"));
        const role = atob(localStorage.getItem("auth")).split("-")[2];
        let school;

        if (role === "atlIncharge") {
            const schoolQ = query(collection(db, "schoolData"), where("atlIncharge.email", "==", atob(localStorage.getItem("auth")).split("-")[1]));
            onSnapshot(schoolQ, (schoolSnaps) => {
                schoolSnaps.forEach((schoolSnap) => {
                    school = schoolSnap.data().name;
                    onSnapshot(q, (querySnapshot) => {
                        const dataArray = [];
                        querySnapshot.forEach(snap => {
                            if (snap.data().school === school) {
                                let tempData = snap.data();
                                tempData.docId = snap.id;
                                dataArray.push(tempData);
                            }
                        });
                        setData(dataArray);
                        setCount(dataArray.length);
                        setLoaderEnable(false);
                    });
                });
            });
        } else {
            onSnapshot(q, (querySnapshot) => {
                const dataArray = [];
                querySnapshot.forEach(snap => {
                    let tempData = snap.data();
                    tempData.docId = snap.id;
                    dataArray.push(tempData);
                });
                setData(dataArray);
                setCount(0);
                setLoaderEnable(false);
            });
        }
    }, []);

    useEffect(() => {
        getSchools()
            .then((docSnaps) => {
                const dataArray = [];
                docSnaps.forEach((docSnap) => {
                    dataArray.push(docSnap.data());
                });
                setSchools(dataArray);
            })
            .catch((err) => {
                window.location.reload();
            });

        // Fetch tags from tagData
        const fetchTags = async () => {
            const tagSnaps = await getDocs(query(collection(db, "tagData"), where("role", "==", role)));
            const tagArray = [];
            tagSnaps.forEach((tagSnap) => {
                tagArray.push({ id: tagSnap.id, ...tagSnap.data() });
            });
            setTags(tagArray);
        };

        fetchTags();
    }, []);

    function handleChange(event) {
        if (event.target.name === "field") {
            if (event.target.value === "school") {
                setIsSchoolSelected(true);
                setIsTagSelected(false);
            } else if (event.target.value === "tags") {
                setIsTagSelected(true);
                setIsSchoolSelected(false);
            } else {
                setIsSchoolSelected(false);
                setIsTagSelected(false);
            }
            setSearchField(event.target.value);
        } else if (event.target.name === "value" || event.target.name === "schoolName") {
            setSearchValue(event.target.value);
        }
        if (event.target.name === "schoolName") {
            setSelectedSchool(event.target.value);
        }
        if (event.target.name === "class") {
            setSelectedClass(event.target.value);
        }
        if (event.target.name === "tag") {
            setSelectedTag(event.target.value);
        }
    }

    async function handleSearch(event) {
        if (searchField === "" || (searchField !== "school" && searchField !== "tags" && searchValue === "")) {
            alert("Please fill the required details for search");
        } else {
            if (searchField === "school" && selectedSchool === "") {
                alert("Please select school");
            } else if (searchField === "school" && selectedClass === "") {
                setQueryLoaderEnable(true);
                const temp = []
                data.forEach((student) => {
                    if (student.school === selectedSchool) {
                        temp.push(student);
                    }
                });
                if (temp.length === 0) {
                    alert("No results found");
                }
                setSearchResults(temp);
                count = temp.length;
                setQueryLoaderEnable(false);
                setCount(count);
            } else if (searchField === "school" && selectedSchool !== "" && selectedClass !== "") {
                setQueryLoaderEnable(true);
                const temp = []
                data.forEach((student) => {
                    if (student.school === selectedSchool && student.class === selectedClass) {
                        temp.push(student);
                    }
                });
                if (temp.length === 0) {
                    alert("No results found");
                }
                setSearchResults(temp);
                count = temp.length;
                setQueryLoaderEnable(false);
                setCount(count);
            } else if (searchField === "class") {
                setQueryLoaderEnable(true);
                const temp = []
                data.forEach((student) => {
                    if (student.class === searchValue) {
                        temp.push(student);
                    }
                });
                if (temp.length === 0) {
                    alert("No results found");
                }
                setSearchResults(temp);
                count = temp.length;
                setQueryLoaderEnable(false);
                setCount(count);
            } else if (searchField === "tags") {
                setQueryLoaderEnable(true);
                const temp = []
                data.forEach((student) => {
                    if (student.tags && student.tags.some(tag => tag.id === selectedTag)) {
                        temp.push(student);
                    }
                });
                if (temp.length === 0) {
                    alert("No results found");
                }
                setSearchResults(temp);
                count = temp.length;
                setQueryLoaderEnable(false);
                setCount(count);
            } else {
                setQueryLoaderEnable(true);
                setSearchResults([]);
                const snaps = await queryStudent(searchField, "==", searchValue);
                const newResults = [];
                snaps.forEach((snap) => {
                    newResults.push(snap.data());
                });
                if (newResults.length === 0) {
                    alert("No results found");
                } else {
                    setSearchValue("");
                }
                setSearchResults(newResults);
                count = newResults.length;
                setQueryLoaderEnable(false);
                setCount(count);
            }
        }
    }

    function resetSearch() {
        setSearchField("");
        setSearchResults([]);
        setSearchValue("");
        setCount(0);
    }

    document.title = "Student Data Report | Digital ATL";

    return (
        <div className="container" id="mobilescreen-studentreport">
            <Sidebar />
            <link rel="stylesheet" href="/CSS/form.css" />
            <link rel="stylesheet" href="/CSS/report.css" />
            <link rel="stylesheet" href="/CSS/studentreport.css" />
            <div className="title">Student Data Report | Digital ATL</div>
            <hr />
            <div className="querySection" style={{ textAlign: "left" }}>
                <select name="field" id="field" style={{ borderRadius: "0" }} onChange={handleChange} value={searchField}>
                    <option value="" disabled={true}>SELECT FIELD</option>
                    <option value="name.firstName">First Name</option>
                    <option value="name.lastName">Last Name</option>
                    <option value="email">Email</option>
                    {
                        atob(localStorage.auth).split("-")[2] !== "atlIncharge" ?
                            <option value="school">School</option> : ""
                    }
                    <option value="class">Class</option>
                    <option value="tags">Tags</option>
                </select>
                <br />
                {isSchoolSelected ?
                    <>
                        <br />
                        <select name="schoolName" id="schoolName" value={selectedSchool} onChange={handleChange}>
                            <option value="" disabled={true}>SELECT SCHOOL</option>
                            {
                                schools.map((school, index) => {
                                    if (role === "atlIncharge") {
                                        if (school.atlIncharge.email === email) {
                                            return <option key={index} value={school.name}>{school.name}</option>
                                        }
                                    } else {
                                        return <option key={index} value={school.name}>{school.name}</option>
                                    }
                                })
                            }
                        </select>
                        {selectedSchool === "" ? <br /> : ""}
                        {
                            selectedSchool !== "" ?
                                <>
                                    <select name="class" id="class" value={selectedClass} onChange={handleChange}>
                                        <option value="">SELECT CLASS</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                        <option value="8">8</option>
                                        <option value="9">9</option>
                                        <option value="10">10</option>
                                        <option value="11">11</option>
                                        <option value="12">12</option>
                                    </select>
                                    <br />
                                </> : ""
                        } </> :
                    isTagSelected ?
                        <>
                            <br />
                            <select name="tag" id="tag" value={selectedTag} onChange={handleChange}>
                                <option value="" disabled={true}>SELECT TAG</option>
                                {
                                    tags.map((tag, index) => (
                                        <option key={index} value={tag.id}>{tag.tagName}</option>
                                    ))
                                }
                            </select>
                            <br />
                        </> :
                        <input type="text" name="value" id="value" placeholder="Value to be searched"
                               onChange={handleChange} value={searchValue} style={{
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
                }
                <button className="submitbutton" onClick={handleSearch}>Search</button>
                <button className="resetbutton" onClick={resetSearch}>Clear Search</button>
                <h3 className="count">Records Count:{count}</h3>
                <div className="results">
                    {(queryLoaderEnable) ? (
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
                    ) : ""}
                    {
                        searchResults.map((student, index) => {
                            return <ReportBox
                                key={index}
                                id={index}
                                fname={student.name.firstName}
                                lname={student.name.lastName}
                                class={student.class}
                                gender={student.gender}
                                section={student.section}
                                email={student.email}
                                whatsappNumber={student.whatsappNumber}
                                aspiration={student.aspiration}
                                currentExperiment={student.currentExperiment}
                                school={student.school}
                                isTeamLeader={student.isTeamLeader}
                                comments={student.comments}
                                tags={student.tags}
                                docId={student.docId}
                                deleteStudent={deleteStudent}
                                selectedTag={selectedTag}
                            />;
                        })
                    }
                </div>
            </div>
            <hr />
            {(loaderEnable) ? (
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
            ) : (console.log("Disabled loader"))}
            {
                (atob(localStorage.auth).split("-")[2] === "atlIncharge") && searchResults.length < 1 ?
                    (data.map((student, index) => {
                        return (
                            <ReportBox
                                key={index}
                                id={index}
                                fname={student.name.firstName}
                                lname={student.name.lastName}
                                class={student.class}
                                gender={student.gender}
                                section={student.section}
                                email={student.email}
                                whatsappNumber={student.whatsappNumber}
                                aspiration={student.aspiration}
                                currentExperiment={student.currentExperiment}
                                school={student.school}
                                isTeamLeader={student.isTeamLeader}
                                comments={student.comments}
                                docId={student.docId}
                                tags={student.tags}
                                deleteStudent={deleteStudent}
                                currentTa={student.currentTinkeringActivity}
                                selectedTag={selectedTag}
                            />
                        );
                    })) : ""
            }
        </div>
    );
}

export default StudentReport;