import React from "react";

import { addMentor } from "../../firebase/firestore";
import Sidebar from "../../components/Sidebar";

function Form() {
    const [collegeName, setCollegeName] = React.useState("Lankapalli Bullaya College");
    const [fName, setFName] = React.useState("");
    const [lName, setLName] = React.useState("");
    const [mentorStudy, setMentorStudy] = React.useState("Diploma");
    const [mentorDepartment, setMentorDepartment] = React.useState("CSE");
    const [mentorYear, setMentorYear] = React.useState("1");
    const [mentorEmail, setMentorEmail] = React.useState("");
    const [whatsappNumber, setWhatsappNumber] = React.useState("");
    const [aspiration, setAspiration] = React.useState("");
    const [currentExperiment, setCurrentExperiment] = React.useState("");
    const [competitionMapped, setCompetitionMapped] = React.useState("ATL Tinkerpreneur 2023");
    const [skillSet, setSkillSet] = React.useState([]);
    const [skillsLength, setSkillsLength] = React.useState(0);

    function handleChange(event) {
        if (event.target.name === "collegeName") {
            setCollegeName(event.target.value);
        } else if (event.target.name === "fname") {
            setFName(event.target.value);
        } else if (event.target.name === "lname") {
            setLName(event.target.value);
        } else if (event.target.name === "mentorStudy") {
            setMentorStudy(event.target.value);
        } else if (event.target.name === "mentorDepartment") {
            setMentorDepartment(event.target.value);
        } else if (event.target.name === "mentorYear") {
            setMentorYear(event.target.value);
        } else if (event.target.name === "mentorEmail") {
            setMentorEmail(event.target.value);
        } else if (event.target.name === "mentorNumber") {
            setWhatsappNumber(event.target.value);
        } else if (event.target.name === "mentorAspiration") {
            setAspiration(event.target.value);
        } else if (event.target.name === "currentExperiment") {
            setCurrentExperiment(event.target.value);
        } else if (event.target.name === "competitionMapped") {
            setCompetitionMapped(event.target.value);
        }
    }

    function clearForm() {
        setCollegeName("");
        setFName("");
        setLName("");
        setMentorStudy("");
        setMentorDepartment("");
        setMentorYear("");
        setMentorEmail("");
        setWhatsappNumber("");
        setAspiration("");
        setCurrentExperiment("");
        setCompetitionMapped("");
    }

    async function handleSubmit(event) {
        event.preventDefault();
        // await addMentor(collegeName, fName, lName, mentorStudy, mentorDepartment, mentorYear, mentorEmail, whatsappNumber, aspiration, currentExperiment, competitionMapped)
        await addMentor(fName, lName, skillSet)
            .then(() => {
                alert("Added successfully!");
                window.location.href = "/mentor-data/view";
                clearForm();
            })
            .catch((err) => {
                alert("Adding failed please try again!");
            });
    }

    function createArray(maxCount) {
        const arr = [];
        for (let i = 0; i < maxCount; i++) {
            arr.push(i);
        }
        return arr;
    }

    function addField() {
        setSkillsLength(skillsLength + 1);
        setSkillSet([...skillSet, ""]);
    }

    function removeField() {
        if (skillsLength > 0) {
            setSkillsLength(skillsLength - 1);
            setSkillSet([...skillSet].pop());
        }
    }

    function mfHandleChangeSkill(event) {
        const index = Number(event.target.getAttribute("id").replace("skill", ""));
        const value = event.target.value;
        const temp = [...skillSet];
        temp[index] = value;
        setSkillSet(temp);
    }

    document.title = "Mentor Data Form | Digital ATL";

    return (
        <div className="container" id="mobilescreen">
            <Sidebar />
            <form onSubmit={handleSubmit}>
                <link rel="stylesheet" href="/CSS/school.css" />
                <div className="school-title">Mentors form</div>
                <hr />
                <div className="message"></div>
                {/*<div className="formContainer">*/}
                {/*    <label htmlFor="collegeName">College name: </label>*/}
                {/*    <select name="collegeName" id="collegeName" onChange={handleChange} value={collegeName}>*/}
                {/*        <option value="Lankapalli Bullaya College">Lankapalli Bullaya College</option>*/}
                {/*        <option value="GITAM Vizag">Gitam Vizag</option>*/}
                {/*    </select>*/}
                {/*</div>*/}
                <div className="formContainer">
                    <div className="row">
                        <div className="column">
                            <label htmlFor="fname"><strong>First Name:</strong> </label>
                            <input type="text" name="fname" id="fname" className="form-inp" placeholder="Enter the firstname" autoComplete="off" onChange={handleChange} value={fName} />
                        </div>
                        <div className="column">
                            <label htmlFor="lname"><strong>Last Name:</strong> </label>
                            <input type="text" name="lname" id="lname" className="form-inp" placeholder="Enter the lastname" autoComplete="off" onChange={handleChange} value={lName} />
                        </div>
                    </div>
                </div>
                <div className="formContainer">
                    <label><strong>Skills:</strong> </label>
                    <div className="skills">
                        {createArray(skillsLength).map((index) => {
                            return (
                                <div key={index}>
                                    <input type="text" value={skillSet[index]} placeholder="Enter the skills" onChange={mfHandleChangeSkill} name={"skill" + index} id={"skill" + index} className="form-inp" />
                                    <br /><br />
                                </div>
                            );
                        })}
                    </div>
                    <br />
                    <div className="buttonsContainer">
                        <span className="submitbutton addSkill" onClick={addField}>+</span>
                        <span className="resetbutton removeSkill" onClick={removeField}>-</span>
                    </div>
                </div>
                {/*<div className="formContainer">*/}
                {/*    <label htmlFor="mentorStudy">Mentor Study: </label>*/}
                {/*    <select name="mentorStudy" id="mentorStudy" onChange={handleChange} value={mentorStudy}>*/}
                {/*        <option value="Diploma">Diploma</option>*/}
                {/*        <option value="Engineering">Engineering</option>*/}
                {/*        <option value="Medicine">Medicine</option>*/}
                {/*    </select>*/}
                {/*</div>*/}
                {/*<div className="formContainer">*/}
                {/*    <label htmlFor="mentorDepartment">Mentor Department: </label>*/}
                {/*    <select name="mentorDepartment" id="mentorDepartment" onChange={handleChange} value={mentorDepartment}>*/}
                {/*        <option value="CSE">CSE</option>*/}
                {/*        <option value="IT">IT</option>*/}
                {/*        <option value="ECE">ECE</option>*/}
                {/*        <option value="EEE">EEE</option>*/}
                {/*        <option value="MECH">MECH</option>*/}
                {/*        <option value="Civil">Civil</option>*/}
                {/*    </select>*/}
                {/*</div>*/}
                {/*<div className="formContainer">*/}
                {/*    <label htmlFor="mentorYear">Mentor Year: </label>*/}
                {/*    <select name="mentorYear" id="mentorYear" onChange={handleChange} value={mentorYear}>*/}
                {/*        <option value="1">First Year</option>*/}
                {/*        <option value="2">Second Year</option>*/}
                {/*        <option value="3">Third Year</option>*/}
                {/*        <option value="4">Fourth Year</option>*/}
                {/*        <option value="5">Fifth Year</option>*/}
                {/*        <option value="6">Sixth Year</option>*/}
                {/*    </select>*/}
                {/*</div>*/}
                {/*<div className="formContainer">*/}
                {/*    <label htmlFor="mentorEmail">Mentor Email-id: </label>*/}
                {/*    <input type="email" name="mentorEmail" id="mentorEmail" className="form-inp" autoComplete="off" onChange={handleChange} value={mentorEmail} />*/}
                {/*</div>*/}
                {/*<div className="formContainer">*/}
                {/*    <label htmlFor="mentorNumber">Mentor Whatsapp Number: </label>*/}
                {/*    <input type="number" name="mentorNumber" id="mentorNumber" className="form-inp" autoComplete="off" minLength="10" maxLength="10" onChange={handleChange} value={whatsappNumber} />*/}
                {/*</div>*/}
                {/*<div className="formContainer">*/}
                {/*    <label htmlFor="mentorAspiration">Mentor Aspiration: </label>*/}
                {/*    <input type="text" name="mentorAspiration" id="mentorAspiration" className="form-inp" autoComplete="off" onChange={handleChange} value={aspiration} />*/}
                {/*</div>*/}
                {/*<div className="formContainer">*/}
                {/*    <label htmlFor="currentExperiment">Current Experiment: </label>*/}
                {/*    <input type="text" name="currentExperiment" id="currentExperiment" className="form-inp" autoComplete="off" onChange={handleChange} value={currentExperiment} />*/}
                {/*</div>*/}
                {/*<div className="formContainer">*/}
                {/*    <label htmlFor="competitionMapped">Competition Mapped: </label>*/}
                {/*    <select name="competitionMapped" id="competitionMapped" onChange={handleChange} value={competitionMapped}>*/}
                {/*        <option value="ATL Tinkerpreneur 2023">ATL Tinkerpreneur 2023</option>*/}
                {/*    </select>*/}
                {/*</div>*/}
                <br />
                <div className="buttonsContainer">
                    <button type="submit" className="submitbutton">Add</button>
                    <button type="reset" className="resetbutton" onClick={clearForm}>Reset</button>
                </div>
            </form>
        </div>
    );
}

export default Form;
