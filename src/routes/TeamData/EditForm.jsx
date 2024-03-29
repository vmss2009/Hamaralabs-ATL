import React from "react";
import {collection, doc, onSnapshot, query} from "firebase/firestore";
import {useParams} from "react-router-dom";

import {updateTeam, db} from "../../firebase/firestore";
import NonTeamLeadersSelect from "./EditFormNTMS";
import Sidebar from "../../components/Sidebar";

function TeamEditForm() {
    const {teamId} = useParams();

    const [students, setStudents] = React.useState([]);
    const [schoolVal, setSchoolVal] = React.useState("");

    const [teamName, setTeamName] = React.useState("");
    const [teamLeader, setTeamLeader] = React.useState("");
    const [count, setCount] = React.useState(0);
    const [teamMems, setTeamMems] = React.useState([]);

    function clearForm() {
        setTeamName("");
    }

    function hasDuplicates(array) {
        var valuesSoFar = Object.create(null);
        for (var i = 0; i < array.length; ++i) {
            var value = array[i];
            if (value in valuesSoFar) {
                return true;
            }
            valuesSoFar[value] = true;
        }
        return false;
    }

    function handleChange(event) {
        if(event.target.name === "teamName") {
            setTeamName(event.target.value);
        } else if(event.target.name === "teamLeader") {
            setTeamLeader(event.target.value);
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if(hasDuplicates(teamMems)) {
            alert("Team members has duplicate values!");
        } else {
            if(teamName ===  ""){
                alert("Please fill all the fields!")
            } else {
                console.log(teamLeader);
                await updateTeam(teamName, teamLeader, teamMems, teamId)
                    .then(() => {
                        alert("Updated Successfully!");
                        window.location.href = "/team-data/view";
                    })
                    .catch((error) => {
                        console.error(error);
                        alert("Couldn't update the data. Please try again!");
                    });
            }
        }
    }

    function handleClick(event) {
        if(event.target.type === "reset") {
            clearForm();
        }
    }

    function createArray() {
        const arr = [];
        for (let i = 0; i < count; i++) {
            arr.push(i);
        }
        return arr;
    }

    function increaseField(event) {
        event.preventDefault();
        setCount(count+1);
    }

    function decreaseField(event) {
        event.preventDefault();
        if(count !== 0) {
            setCount(count-1);
        }
    }
    const filteredStudents = React.useMemo(() => {
        if (schoolVal) {
          return students.filter((student) => student.school === schoolVal);
        } else {
          return students;
        }
      }, [students, schoolVal])

    let decodedAuth = atob(localStorage.auth);

    let split = decodedAuth.split("-");

    window.uid = split[0];
    window.email = split[1];
    window.role = split[2];

    React.useEffect(() => {
        const q = query(collection(db, "studentData"));

        onSnapshot(q, snaps => {
            const dataArray = [];
            snaps.forEach((docSnap) => {
                const tempData = docSnap.data();
                tempData.docId = docSnap.id;
                dataArray.push(tempData);
            });
            setStudents(dataArray);
            console.log(dataArray);

            const q2 = query(doc(db, "teamData", teamId));

            onSnapshot(q2, (snap) => {
                setTeamLeader(snap.data().leader.path.replace("studentData/", ""));
                const temp = [];
                snap.data().members.forEach(member => {
                    temp.push(member.path.replace("studentData/", ""));
                });
                setTeamMems(temp);
                setTeamName(snap.data().name);
                setCount(temp.length);
            });
        });
    }, []);

    document.title = "Team Data Update | Digital ATL";

    return (
        <div className="container">
            <Sidebar />
            <link rel="stylesheet" href="/CSS/school.css" />
            <form>
                <div className="school-title">Team data update</div>
                <hr />
                <div className="formContainer">
                <div className="row">
            <div className="column">
                    <label htmlFor="teamName"><strong>Team Name:</strong> </label>
                    <input type="text" name="teamName" id="teamName" className="form-inp" placeholder="Enter the Team Name" value={teamName} onChange={handleChange}/>
                </div>
                <div className="column">
                    <label htmlFor="teamLeader"><strong>Team Leader:</strong> </label>
                    <select
                        name="teamLeader"
                        id="teamLeader"
                        onChange={handleChange}
                        placeholder="Enter the Team Leader"
                        className="form-inp"
                        value={teamLeader}
                    >
                        <option value="">--- Select ---</option>
                        {filteredStudents
                            .filter((student) => student.isTeamLeader)
                            .sort((a, b) => {
                                const nameA = `${a.name.firstName} ${a.name.lastName}`.toLowerCase();
                                const nameB = `${b.name.firstName} ${b.name.lastName}`.toLowerCase();
                                return nameA.localeCompare(nameB);
                            })
                            .map((student, index) => (
                                <option key={index} value={student.docId}>
                                    {`${student.name.firstName} ${student.name.lastName}`}
                                </option>
                            ))}
                    </select>
                </div>
                </div>
                </div>
                <div className="formContainer">
                <div className="row">
            <div className="column">
            <label><strong>Team Members:</strong> </label>
          <div className="multiForm">
            {/* Nageswar */}
            {createArray(count).map((_, index) => (
                <NonTeamLeadersSelect 
                    key={index} 
                    index={index} 
                    teamMems={teamMems} 
                    setTeamMems={setTeamMems}
                students={filteredStudents}
              />
            ))}
            {/* Nageswar */}
          </div>
            <button className="submitbutton" onClick={increaseField}> + </button>
            <button className="resetbutton" onClick={decreaseField}> - </button>
          </div>
        </div>
        </div>
                <div className="buttonsContainer formContainer">
                    <button type="submit" className="submitbutton" onClick={handleSubmit}>Add</button>
                    <button type="reset" className="resetbutton" onClick={handleClick}>Reset</button>
                </div>
            </form>
        </div>
    );
}

export default TeamEditForm;
