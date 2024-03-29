import React, {useState} from "react";
import {Bars} from 'react-loader-spinner';
import {collection, onSnapshot, query, where} from "firebase/firestore";
import {db, deleteStudent, getSchools, queryStudent} from "../../firebase/firestore";
import ReportBox from "./ReportBoxComp";
import Sidebar from "../../components/Sidebar";
import { set } from "lodash";

function StudentReport() {
    const [data, setData] = useState([]);
    const [loaderEnable, setLoaderEnable] = useState(true);
    const [schools, setSchools] = React.useState([]);
    const [selectedSchool, setSelectedSchool] = React.useState("");
    const [queryLoaderEnable, setQueryLoaderEnable] = useState(false);
    const [searchValue, setSearchValue] = React.useState("");
    const [searchField, setSearchField] = React.useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSchoolselected, setIsSchoolSelected] = React.useState(false);
    const [selectedClass, setSelectedClass] = React.useState("");
    let [count, setCount] = React.useState(0);



    React.useEffect(() => {
        const q = query(collection(db, "studentData"));
        const role = atob(localStorage.getItem("auth")).split("-")[2];
        let school;

        if(role === "atlIncharge") {
            const schoolQ = query(collection(db, "schoolData"), where("atlIncharge.email", "==", atob(localStorage.getItem("auth")).split("-")[1]));
            onSnapshot(schoolQ, (schoolSnaps) => {
                schoolSnaps.forEach((schoolSnap) => {
                    school = schoolSnap.data().name;
                    onSnapshot(q, (querySnapshot) => {
                        const dataArray = [];
                        querySnapshot.forEach(snap => {
                            if(snap.data().school === school) {
                                let tempData = snap.data();
                                tempData.docId = snap.id;
                                dataArray.push(tempData);
                            }
                        });
                       setData(dataArray);
                       setCount(dataArray.length); // Update the count here
                        setLoaderEnable(false);
                    });
                });
            });
        } 
        else {
            onSnapshot(q, (querySnapshot) => {
                const dataArray = [];
                querySnapshot.forEach(snap => {
                    let tempData = snap.data();
                    tempData.docId = snap.id;
                    dataArray.push(tempData);
                });
                setData(dataArray);
                setCount(0); // Update the count here
                setLoaderEnable(false);
            });
        }
    }, []);

    React.useEffect(() => {
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
    }, []);


    function handleChange(event) {
        if (event.target.name === "field") {
            if (event.target.value === "school") {
                setIsSchoolSelected(true)
            } else {
                setIsSchoolSelected(false)
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
    }

    async function handleSearch(event) {
        if (searchField === "" || (searchField !== "school" && searchValue === "")) {
            alert("Please fill the required details for search");
        } else {
            if (searchField === "school" && selectedSchool === "") {
                alert("Please select school");
            } 
            else if (searchField === "school" && selectedClass === "") {
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
                count=temp.length;
                setQueryLoaderEnable(false);
                setCount(count);
            } 
            else if (searchField === "school" && selectedSchool !== "" && selectedClass !== "") {
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
                count=temp.length;
                setQueryLoaderEnable(false);
                setCount(count);
            } 
            else if (searchField === "class") {
                setQueryLoaderEnable(true);
                const temp = []
                data.forEach((student) => {
                  if (student.class === searchValue){
                    temp.push(student);
                    }
                });
                if (temp.length === 0) {
                    alert("No results found");
                }
                setSearchResults(temp);
                count=temp.length;
                setQueryLoaderEnable(false);
                setCount(count);
            } 
            else  {
                setQueryLoaderEnable(true);
                setSearchResults([]);  
                const snaps = await queryStudent(searchField, "==", searchValue);
                const newResults = [];
                snaps.forEach((snap) => {
                    newResults.push(snap.data());
                });
                if (newResults.length === 0) {
                    alert("No results found");
                }
                 else {
                    setSearchValue("");
                }
                setSearchResults(newResults);
                count=newResults.length;
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
            <Sidebar/>
            <link rel="stylesheet" href="/CSS/form.css"/>
            <link rel="stylesheet" href="/CSS/report.css"/>
            <link rel="stylesheet" href="/CSS/studentreport.css"/>
            <div className="title">Student Data Report | Digital ATL</div>
            <hr/>
            <div className="querySection" style={{textAlign: "left"}}>
                <select name="field" id="field" style={{borderRadius: "0"}} onChange={handleChange}
                        value={searchField}>
                    <option value="" disabled={true}>SELECT FIELD</option>
                    <option value="name.firstName">First Name</option>
                    <option value="name.lastName">Last Name</option>
                    <option value="email">Email</option>
                    {
                        atob(localStorage.auth).split("-")[2] !== "atlIncharge" ?
                            <option value="school">School</option>: ""
                    }               
                    <option value="class">class</option>
                    {/* <option value="currentExperiment">Current Experiment</option> */}
                </select>
                <br/>
                {isSchoolselected ?
                    <>
                        <br/>
                        <select name="schoolName" id="schoolName" value={selectedSchool} onChange={handleChange}>
                            <option value="" disabled={true}>SELECT SCHOOL</option>
                            {
                                schools.map((school, index) => {
                                    if (window.role === "atlIncharge") {
                                        if (school.atlIncharge.email === window.email) {
                                            return <option key={index} value={school.name}>{school.name}</option>
                                        }
                                    } else {
                                        return <option key={index} value={school.name}>{school.name}</option>
                                    }
                                })
                            }
                        </select>
                        {selectedSchool === "" ? <br/> : ""}
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
                                    <br/>
                                </> : ""
                        } </> :
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
                    }}/>
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
                                comments={student.comments}/*sucharitha 4.8*/   
                                docId={student.docId}
                                deleteStudent={deleteStudent}
                            />;
                        }) 
                    }
                    </div>
                    </div>
                    <hr />
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
                    {
                                (atob(localStorage.auth).split("-")[2] === "atlIncharge") && searchResults.length <1?
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
                                            comments={student.comments}/*sucharitha 4.8*/
                                            docId={student.docId}
                                            deleteStudent={deleteStudent}
                                            currentTa={student.currentTinkeringActivity}
                                        />
                                    );                    
                        })):""      
                    }                                                               
        </div>
    );
}

export default StudentReport;