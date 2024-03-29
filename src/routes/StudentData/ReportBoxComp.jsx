import React from "react";
import {onSnapshot, query} from "firebase/firestore";

function ReportBox(props) {
    const [displayValue, setDisplayValue] = React.useState("none");
    const [taExists, setTaExists] = React.useState(false);
    const [taData, setTaData] = React.useState({});
    
    function handleMouseOver(event) {
        setDisplayValue("block");
    }

    function handleMouseOut(event) {
       setDisplayValue("none");
    }

    async function handleDelete(event) {
        console.log(props.docId);
        if(window.confirm("You are about to delete a student")) {
            await props.deleteStudent(props.docId)
                .then(() => {
                    alert("Student has been deleted.");
                    window.location.reload();
                })
                .catch(err => {
                    alert("An error has occurred please try again later.");
                })
        }
    }

    function handleEditClick() {
        window.location.href="/student-data/edit/"+props.docId;
    }

    React.useEffect(() => {
        if(props.currentTa !== null && props.currentTa !== undefined) {
            setTaExists(true);
            const q = query(props.currentTa);
            onSnapshot(q, snap => {
                const temp = snap.data();
                temp.docId = snap.id;
                setTaData(temp);
            });
        }
    }, []);

    return (
        <div className="box" id={props.id}  onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} >
            <link rel="stylesheet" href="/CSS/studentreport.css" />
            <div className="name" onMouseOver={handleMouseOver}>{props.fname} {props.lname}</div>
            <div className="boxContainer emailContainer" onMouseOver={handleMouseOver}>Email:- <span className="text-color">{props.email}</span></div>
            <div className="boxContainer">Class:- <span className="text-color">{props.class} {props.section}</span></div>
            {/*<div className="boxContainer" onMouseOver={handleMouseOver}>Whatsapp Number:- {props.whatsappNumber}</div>*/}
            <div className="boxContainer" onMouseOver={handleMouseOver}>Aspiration:- <span className="text-color">{props.aspiration}</span></div>
            <div className="boxContainer" onMouseOver={handleMouseOver}>Gender:- <span className="text-color">{props.gender}</span></div>
            {/*<div className="boxContainer" onMouseOver={handleMouseOver}>Current Experiment:- {props.currentExperiment}</div>*/}
            <div className="boxContainer" onMouseOver={handleMouseOver}>School:-<span className="text-color"> {props.school}</span></div>
            <div className="boxContainer" onMouseOver={handleMouseOver}>Is team leader:-<span className="text-color">  {(props.isTeamLeader)?"Yes":"No"}</span></div>
            { /*sucharitha 4.8*/}
              <div className="boxContainer" onMouseOver={handleMouseOver}>Comments:- <span className="text-color">{props.comments}</span></div>
             { /*sucharitha 4.8*/}
              {
             taExists ?
                    <div className="boxContainer" onMouseOver={handleMouseOver}>Assigned Tinkering Activity:-<span className="text-color">  {taData.taName}</span></div>
                : ""
            }
            <div className="buttonsContainer" id={"btnContainer"+props.id} style={{display: displayValue}}>
                <button className="editBtn resetbutton" onClick={handleEditClick}><i className="fa-solid fa-pencil"></i></button>
                {
                    atob(localStorage.auth).split("-")[2] === "admin" ?
                        <>
                            <button className="submitbutton deleteBtn" onClick={handleDelete}><i className="fa-solid fa-trash-can"></i></button>
                        </> : ""
                }
                
            </div>
        </div>
    );
}

export default ReportBox;