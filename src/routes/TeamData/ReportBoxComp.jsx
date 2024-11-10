import React from "react";
import {collection, getDoc, onSnapshot, query, where} from "firebase/firestore";
import db from "../../firebase/firestore";

function ReportBox(props) {
    const [displayValue, setDisplayValue] = React.useState("none");
    const [teamLeaderName, setTeamLeaderName] = React.useState("");
    const [membersNames] = React.useState([]);
    const [isIncharge, setIsIncharge] = React.useState(false);
    const [inchargeSchool, setInchargeSchool] = React.useState("");
    const [teamLeaderSchool, setTeamLeaderSchool] = React.useState("");

    const [role, setRole] = React.useState("");
    
    function handleMouseOver(event) {
        setDisplayValue("block");
    }

    function handleMouseOut(event) {
        setDisplayValue("none");
    }

    async function handleDelete(event) {
        console.log(props.docId);
        if(window.confirm("You are about to delete a team")) {
            await props.deleteTeam(props.docId)
                .then(() => {
                    alert("Team has been deleted.");
                })
                .catch(err => {
                    alert("An error has occurred please try again later.");
                })
        }
    }

    function handleEditClick() {
        window.location.href="/team-data/edit/"+props.docId;
    }

    
    React.useEffect(() => {
        setRole(atob(localStorage.auth).split("-")[2]);
        if(atob(localStorage.auth).split("-")[2] === "atlIncharge") {
            setIsIncharge(true);
            const q = query(collection(db, "schoolData"), where("atlIncharge.email", "==", atob(localStorage.getItem("auth")).split("-")[1]));
            onSnapshot(q, (querySnapshot) => {
                querySnapshot.forEach(snap => {
                    setInchargeSchool(snap.data().name);
                });
            });
        }

        const q = query(props.leader);
        onSnapshot(q, (snap) => {
            setTeamLeaderName(snap.data().name.firstName + " " + snap.data().name.lastName);
            setTeamLeaderSchool(snap.data().school);
        });

        props.members.forEach(member => {
            getDoc(member)
                .then(memberData => {
                    console.log(memberData);
                    membersNames.push(`${memberData.data().name.firstName} ${memberData.data().name.lastName}`);
                });
        })
    }, []);

    return (
        <>
            {
                (isIncharge === true && inchargeSchool === teamLeaderSchool)|| role ==="admin" ?
                    <div className="box" id={props.id} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                        <div className="name" onMouseOver={handleMouseOver}>{props.name}</div>
                        <div className="boxContainer">School Name:{teamLeaderSchool}</div>
                        <div className="boxContainer">Team Leader:- {teamLeaderName}</div>
                        <div className="boxContainer">
                            Team Members:-
                            {
                                membersNames.map((memberName, index) => {
                                    if(index === membersNames.length - 2) {
                                        return <span key={index}>{memberName} and </span>
                                    } else if(index === membersNames.length - 1) {
                                        return <span key={index}>{memberName}</span>
                                    } else {
                                        return <span key={index}>{memberName}, </span>
                                    }
                                })
                            }
                        </div>
                        <div className="buttonsContainer" id={"btnContainer"+props.id} style={{display: displayValue}}>
                            <button className="editBtn resetbutton" onClick={handleEditClick}><i className="fa-solid fa-pencil"></i></button>
                            <button className="submitbutton deleteBtn" onClick={handleDelete}><i className="fa-solid fa-trash-can"></i></button>
                        </div>
                    </div> : ""
            }
        </>
    );
}

export default ReportBox;
