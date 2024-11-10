import React from "react";
import { db, deleteActivity } from "../../firebase/firestore";
import { doc, query, onSnapshot, collection, where } from "firebase/firestore";
import Sidebar from "../../components/Sidebar";
import DisplayElement from "./DisplayElement";

function StudentsDashboard() {
    const [currentStudentData, setCurrentStudentData] = React.useState({});
    const [schools, setSchools] = React.useState([]);
    const [selectedSchool, setSelectedSchool] = React.useState("");
    const [selectedStudent, setSelectedStudent] = React.useState("");
    const [students, setStudents] = React.useState([]);
    const [displayStudents, setDisplayStudents] = React.useState([]);
    const [currentlyViewing, setCurrentlyViewing] = React.useState("");
    const [competitions, setCompetitions] = React.useState([]);
    const [tas, setTAs] = React.useState([]);
    const [courses, setCourses] = React.useState([]);
    const isStudent = atob(localStorage.getItem("auth")).split("-")[2] === "student";

    let encodedAuth = localStorage.getItem("auth");
    let uid;
    let email;

    if (encodedAuth != null) {
        let decodedAuth = atob(encodedAuth);
        let split = decodedAuth.split("-");
        uid = split[0];
        email = split[1];
    }

    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const schoolParam = urlParams.get("school");
        const studentParam = urlParams.get("student");

        if (isStudent) {
            const q = query(collection(db, "studentData"), where("email", "==", atob(localStorage.auth).split("-")[1]));
            const array = [];
            onSnapshot(q, snaps => {
                snaps.forEach(snap => {
                    if (snap.exists()) {
                        const data = snap.data();
                        data.docId = snap.id;
                        setStudents([data]);
                        setSelectedStudent(data.name);
                        const q2 = query(collection(db, "schoolData"), where("name", "==", data.school));
                        onSnapshot(q2, snaps2 => {
                            snaps2.forEach(snap2 => {
                                if (snap2.exists()) {
                                    const data2 = snap2.data();
                                    data2.docId = snap2.id;
                                    array.push(data2);
                                    setSelectedSchool(data2.name);
                                }
                            });
                        });
                        setCurrentStudentData(data);
                        setCompetitions(snap.data().competitions);
                    }
                });
            });
            setSchools(array);
        } else {
            const q = query(collection(db, "schoolData"));
            onSnapshot(q, snaps => {
                const array = [];
                if (atob(localStorage.getItem("auth")).split("-")[2] === "atlIncharge") {
                    snaps.forEach(snap => {
                        const temp = snap.data();
                        if (temp.atlIncharge.email === atob(localStorage.getItem("auth")).split("-")[1]) {
                            temp.docId = snap.id;
                            setSelectedSchool(temp.name);
                            array.push(temp);
                        }
                    });
                } else {
                    snaps.forEach(snap => {
                        const temp = snap.data();
                        temp.docId = snap.id;
                        array.push(temp);
                    });
                }
                setSchools(array);
            });

            const q2 = query(collection(db, "studentData"));
            onSnapshot(q2, snaps => {
                const array = [];
                snaps.forEach(snap => {
                    const temp = snap.data();
                    temp.docId = snap.id;
                    array.push(temp);
                });
                setStudents(array);

                if (schoolParam) {
                    setSelectedSchool(schoolParam);
                }
                if (studentParam) {
                    setSelectedStudent(studentParam);
                    const q = query(doc(db, "studentData", studentParam));
                    onSnapshot(q, snap => {
                        const data = snap.data();
                        data.docId = snap.id;
                        setCurrentStudentData(data);
                    });
                }
            });
        }
    }, []);

    React.useEffect(() => {
        if (currentStudentData.class !== null && currentStudentData.class !== undefined) {
            const docRef = query(doc(db, "studentData", currentStudentData.docId));
            onSnapshot(docRef, snap => {
                if (snap.data().courses) {
                    setCompetitions(snap.data().competitions);
                }
            });
        }
    }, [currentStudentData]);

    React.useEffect(() => {
        const tempStudents = [...students];
        const tempDisplayStudents = [];
        tempStudents.forEach(student => {
            if (student.school === selectedSchool) {
                tempDisplayStudents.push(student);
            }
        });
        setDisplayStudents(tempDisplayStudents);
    }, [selectedSchool, students]);

    function handleOnChange(event) {
        if (event.target.name === "schoolSelect") {
            setSelectedSchool(event.target.value);
            setSelectedStudent("");
        } else if (event.target.name === "studentSelect") {
            setSelectedStudent(event.target.value);
            setCompetitions([]);
            setCourses([]);
            setTAs([]);
            const q = query(doc(db, "studentData", event.target.value));
            onSnapshot(q, snap => {
                const data = snap.data();
                data.docId = snap.id;
                setCurrentStudentData(data);
            });
        } else if (event.target.name === "currentlyViewing") {
            if (selectedStudent === "") {
                alert("Please select a student first");
            } else {
                setCurrentlyViewing(event.target.value);
            }
        }
    }

    function handleTabMouseOver(event) {
        if (currentlyViewing !== event.target.getAttribute("data-option")) {
            event.target.style.backgroundColor = "#e6e6e6";
        }
    }

    function handleTabMouseOut(event) {
        if (currentlyViewing !== event.target.getAttribute("data-option")) {
            event.target.style.backgroundColor = "#ffffff";
        }
    }

    function handleTabChange(event) {
        if (selectedStudent !== "") {
            setCurrentlyViewing(event.target.getAttribute("data-option"));
        } else {
            alert("Please select a student.");
        }
    }

    document.title = "Student Snapshot | Digital ATL";

    const tabStyles = {
        display: "inline-block",
        fontSize: "1rem",
        marginRight: "1rem",
        border: "1px solid black",
        padding: "0.5rem",
        height: "1.3rem",
        minWidth: "15rem",
        cursor: "pointer",
        transition: "0.25s",
        userSelect: "none"
    };

    const activeTabStyles = {
        display: "inline-block",
        fontSize: "1rem",
        marginRight: "1rem",
        border: "1px solid black",
        padding: "0.5rem",
        borderRadius: "25px",
        height: "1.3rem",
        minWidth: "15rem",
        cursor: "pointer",
        transition: "0.25s",
        userSelect: "none",
        backgroundColor: "#717171",
        color: "#ffffff"
    };

    React.useEffect(() => {
        console.log(currentlyViewing);
    }, [currentlyViewing]);

    return (
        <div className="container">
            <Sidebar />
            <link rel="stylesheet" href="/CSS/form.css" />
            <link rel="stylesheet" href="/CSS/report.css" />
            <div style={{ height: "10vh" }}>
                <h1 className="title">Student Snapshot | Digital ATL</h1>
                <hr />
                <div className="boxContainer">
                    School:- <select name="schoolSelect" id="schoolSelect" onChange={handleOnChange} value={selectedSchool}>
                    <option value="" disabled={true}>SELECT</option>
                    {schools
                        .slice()
                        .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
                        .map((school, index) => (
                            <option key={index} value={school.name}>{school.name}</option>
                        ))}
                </select> Student:-
                    <select name="studentSelect" id="studentSelect" value={selectedStudent} onChange={handleOnChange}>
                        <option value="" disabled={true}>SELECT</option>
                        {displayStudents
                            .slice()
                            .sort((a, b) => a.name.firstName.toLowerCase().localeCompare(b.name.firstName.toLowerCase()))
                            .map((student, index) => (
                                <option key={index} value={student.docId}>{student.name.firstName} {student.name.lastName}</option>
                            ))}
                    </select>
                </div>
                <hr />
                <div className="tabs">
                    <div className="tab" onClick={handleTabChange} data-option="competitions" style={currentlyViewing === "competitions" ? activeTabStyles : tabStyles} onMouseOver={handleTabMouseOver} onMouseOut={handleTabMouseOut}>
                        <i className="fa-solid fa-user"></i> Student Competitions
                    </div>
                    <div className="tab" onClick={handleTabChange} data-option="courses" style={currentlyViewing === "courses" ? activeTabStyles : tabStyles} onMouseOver={handleTabMouseOver} onMouseOut={handleTabMouseOut}>
                        <i className="fa-solid fa-book"></i> Student Courses
                    </div>
                    <div className="tab" onClick={handleTabChange} data-option="tas" style={currentlyViewing === "tas" ? activeTabStyles : tabStyles} onMouseOver={handleTabMouseOver} onMouseOut={handleTabMouseOut}>
                        <i className="fa-solid fa-flask-vial"></i> Student Tinkering Activities
                    </div>
                    <div className="tab" onClick={handleTabChange} data-option="sessions" style={currentlyViewing === "sessions" ? activeTabStyles : tabStyles} onMouseOver={handleTabMouseOver} onMouseOut={handleTabMouseOut}>
                        <i className="fa-solid fa-handshake"></i> Student Sessions
                    </div>
                </div>
                {currentlyViewing !== "" ? (
                    <DisplayElement
                        type={currentlyViewing}
                        competitions={currentStudentData.competitions}
                        courses={currentStudentData.courses}
                        studentId={currentStudentData.docId}
                        uid={uid}
                    />
                ) : ""}
            </div>
        </div>
    );
}

export default StudentsDashboard;