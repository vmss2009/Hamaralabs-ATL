import React from "react";
import { doc, onSnapshot, query } from "firebase/firestore";

import { updateStudent, db } from "../../firebase/firestore";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

function StudentForm() {
    const { studentId } = useParams();

    const [schoolVal, setSchoolVal] = React.useState("");
    const [fname, setFname] = React.useState("");
    const [lname, setLname] = React.useState("");
    const [gender, setGender] = React.useState("Male");
    const [classVal, setClassVal] = React.useState("");
    const [section, setSection] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [whatsappNo, setWhatsappNo] = React.useState("");
    const [aspiration, setAspiration] = React.useState("");
    const [currentExperiment, setCurrentExperiment] = React.useState("");
    const [isLeader, setIsLeader] = React.useState(false);
    const [comments, setComments] = React.useState("");

    function clearForm() {
        setFname("");
        setLname("");
        setClassVal("");
        setSection("");
        setEmail("");
        setWhatsappNo("");
        setAspiration("");
        setCurrentExperiment("");
        setComments("");
    }

    function handleChange(event) {
        if (event.target.name === "fname") {
            setFname(event.target.value);
        } else if (event.target.name === "lname") {
            setLname(event.target.value);
        } else if (event.target.name === "gender") {
            setGender(event.target.value);
        } else if (event.target.name === "class") {
            setClassVal(event.target.value);
        } else if (event.target.name === "section") {
            setSection(event.target.value);
        } else if (event.target.name === "email") {
            setEmail(event.target.value);
        } else if (event.target.name === "whatsappNo") {
            setWhatsappNo(event.target.value);
        } else if (event.target.name === "aspiration") {
            setAspiration(event.target.value);
        } else if (event.target.name === "currentExperiment") {
            setCurrentExperiment(event.target.value);
        } else if (event.target.name === "isLeader") {
            setIsLeader(event.target.checked);
        } else if (event.target.name === "comments") {
            setComments(event.target.value);
        }
    }

    async function handleSubmit(event) {
        if (fname === "" || lname === "") {
            alert("Please fill all the fields!")
        } else {
            event.preventDefault();
            const updatedComments = comments !== undefined ? comments : "";
            // await updateStudent(studentId, fname, lname, schoolVal, gender, classVal, section, email, whatsappNo, aspiration, currentExperiment, isLeader)
            await updateStudent(studentId, fname, lname, schoolVal, gender, classVal, section, aspiration, isLeader, comments, email)
                .then(() => {
                    alert("Updated Successfully!");
                    window.location.href = "/student-data/view";
                })
                .catch(() => {
                    alert("Couldn't update the data. Please try again!");
                });
        }
    }

    function handleClick(event) {
        if (event.target.type === "reset") {
            clearForm();
        }
    }

    React.useEffect(() => {
        const q = query(doc(db, "studentData", studentId));
        onSnapshot(q, (snap) => {
            setFname(snap.data().name.firstName);
            setLname(snap.data().name.lastName);
            setClassVal(snap.data().class);
            setSection(snap.data().section);
            setWhatsappNo(snap.data().whatsappNumber);
            setAspiration(snap.data().aspiration);
            setCurrentExperiment(snap.data().currentExperiment);
            setIsLeader(snap.data().isTeamLeader);
            setGender(snap.data().gender);
            setSchoolVal(snap.data().school);
            if (snap.data().isTeamLeader) {
                document.querySelector("#isLeader").checked = true;
            }
            setComments(snap.data().comments || "");
            setEmail(snap.data().email || "");
        });
    }, [studentId]);

    let decodedAuth = atob(localStorage.auth);

    let split = decodedAuth.split("-");

    window.uid = split[0];
    window.email = split[1];
    window.role = split[2];

    document.title = "Student Data Form | Digital ATL";

    return (
        <div className="container" id="mobilescreen">
            <link rel="stylesheet" href="/CSS/school.css" />
            <Sidebar />
            <form>
                <div className="school-title">Student Data Update</div>
                <hr/>
                {/* <div className="row">
                    <label htmlFor="isLeader" class="isLeader">Is team leader</label>
                    <input type="checkbox" class="checked" name="isLeader" id="isLeader" onChange={handleChange} />
                </div> */}
                <div className="formContainer">
                    <div className="row">
                        <div className="column">
                            <label htmlFor="firstName"><strong>First Name:</strong> </label>
                            <input type="text" name="fname" className="form-inp" value={fname} id="firstName" autoComplete="off" onChange={handleChange} />
                        </div>
                        <div className="column">
                            <label htmlFor="lastName"><strong>Last Name </strong>(Family Name or Surname)</label>
                            <input type="text" name="lname" className="form-inp" value={lname} id="lastName" autoComplete="off" onChange={handleChange} />
                        </div>
                    </div>
                </div>
                <div className="formContainer">
                    <div className="row">
                        <div className="column">
                            <label htmlFor="gender"><strong>Gender:</strong> </label>
                            <select name="gender" id="gender" value={gender} className="form-inp" onChange={handleChange}>
                                <option value="Male" selected={true}>Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div className="column">
                            <label htmlFor="aspiration"><strong>Aspiration:</strong> </label>
                            <input type="text" className="form-inp" name="aspiration" id="aspiration" value={aspiration} onChange={handleChange} />
                        </div>
                    </div>
                </div>
                <div className="formContainer">
                    <div className="row">
                        <div className="column">
                            <label htmlFor="class"><strong>Class:</strong> </label>
                            <select name="class" id="class" value={classVal} className="form-inp" onChange={handleChange}>
                                <option value="">--Select--</option>{/*sucharitha bug 16*/}
                                <option value="6">6th</option>
                                <option value="7">7th</option>
                                <option value="8">8th</option>
                                <option value="9">9th</option>
                                <option value="10">10th</option>
                                <option value="11">11th</option>
                                <option value="12">12th</option>
                                <option value="Graduation">Graduation</option>
                            </select>
                        </div>
                        <div className="column">
                            <label htmlFor="section"><strong>Section:</strong> </label>
                            <input type="text" className="form-inp" name="section" id="section" value={section} onChange={handleChange} />
                        </div>
                    </div>
                </div>
                {/*<div className="formContainer">*/}
                {/*    <label htmlFor="whatsappNo">Whatsapp Number: </label>*/}
                {/*    <input type="text" className="form-inp" name="whatsappNo" id="whatsappNo" value={whatsappNo} onChange={handleChange} />*/}
                {/*<div className="formContainer">*/}
                {/*    <label htmlFor="currentExperiment">Current Experiment: </label>*/}
                {/*    <input type="text" className="form-inp" name="currentExperiment" id="currentExperiment" value={currentExperiment} onChange={handleChange} />*/}
                {/*</div>*/}           
                    <div className="formContainer">
                    <div className="row">
                        <div className="column">
                            <label htmlFor="email"><strong>Email-ID: </strong></label>
                            <input type="email" className="form-inp" name="email" id="email" value={email} autoComplete="off" onChange={handleChange} />
                    </div>
                    <div className="column">
                            <label htmlFor="isLeader" class="isLeader"><strong>Is team leader</strong></label>
                            <input type="checkbox" class="checked" name="isLeader" id="isLeader" onChange={handleChange} />
                        </div>
                    </div>
                </div>
                <div className="formContainer">
                    <div className="row">
                            <label htmlFor="comments"><strong>Comments (Skills, Courses, Competitions etc.)</strong></label>
                            <input type="text" className="form-inp" name="comments" id="comments" placeholder="Enter your comments" value={comments} onChange={handleChange} />
                        </div>
                    </div>
                {/* <div className="formContainer">
                    <label htmlFor="isLeader">Is team leader: </label>
                    <input type="checkbox" className="form-inp" name="isLeader" id="isLeader" value={(isLeader)?"on":"off"} onChange={handleChange} />
                </div> */}

                <div className="buttonsContainer formContainer">
                    <button type="submit" className="submitbutton" onClick={handleSubmit}>Update</button>
                    <button type="reset" className="resetbutton" onClick={handleClick}>Reset</button>
                </div>
            </form>
        </div>
    );
}

export default StudentForm;
