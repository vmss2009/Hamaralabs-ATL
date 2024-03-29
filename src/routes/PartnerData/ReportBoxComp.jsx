import React from "react";
import {Link} from "react-router-dom";

function ReportBox(props) {
    const [displayValue, setDisplayValue] = React.useState("none");

    function handleMouseOver(event) {
        setDisplayValue("block");
    }

    function handleMouseOut(event) {
        setDisplayValue("none");
    }

    async function handleDelete(event) {
        console.log(props.docId);
        if(window.confirm("You are about to delete a partner")) {
            await props.deletePartner(props.docId)
                .then(() => {
                    alert("Partner has been deleted.");
                    window.location.reload();
                })
                .catch(err => {
                    alert("An error has occurred please try again later.");
                })
        }
    }

    function handleEditClick() {
        window.location.href="/ta-data/edit/"+props.docId;
    }

    return (
        <div className="box" id={props.id} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
            <div className="name" onMouseOver={handleMouseOver} style={{fontSize: "1.5rem"}}>{props.name}</div>
            <div className="boxContainer">Partner Type: {props.type}</div>
            {props.mouFile?<div className="boxContainer">MOU File: <a href={props.mouFile} target="_blank" rel="noreferrer">Click here to open</a></div>:""}
            <div className="boxContainer">Address Line: {props.address.addressLine1}</div>
            <div className="boxContainer">City: {props.address.city}</div>
            <div className="boxContainer">State: {props.address.state}</div>
            <div className="boxContainer">Country: {props.address.country}</div>
            <div className="boxContainer">Pincode: {props.address.pincode}</div>
            <div className="boxContainer">Decision Maker Name: {props.decisionMaker.firstName} {props.decisionMaker.lastName}</div>
            <div className="boxContainer">Decision Maker Email: {props.decisionMaker.email}</div>
            <div className="boxContainer">Decision Maker Phone: {props.decisionMaker.phone}</div>
            
            {props.contactPersons && props.contactPersons.length > 0 &&
                props.contactPersons.map((contactPerson, index) => {
                    return <div key={index}>
                        <div className="boxContainer">Contact Person {index+1} Name: {contactPerson.firstName} {contactPerson.lastName}</div>
                        <div className="boxContainer">Contact Person {index+1} Email: {contactPerson.email}</div>
                        <div className="boxContainer">Contact Person {index+1} Phone: {contactPerson.phone}</div>
                        <div className="boxContainer">Contact Person {index + 1} Designation: {contactPerson.designation}</div>
                        <br/>
                    </div>
                })
            }
            <div className="boxContainer">
        Proposed Activities: <br />
        {props.proposedActivities && props.proposedActivities.length > 0 &&
          props.proposedActivities.map((activity, index) => {
            return <div key={index}>{index + 1}. {activity}</div>;
          })
        }
      </div>
      <br />
      <div className="boxContainer">
        Projects: <br />
        
        {props.projects && props.projects.length > 0 &&
          props.projects.map((project, index) => {
            return <div key={index}>{index + 1}. {project.projectName} ({project.projectId})</div>;
          })
        }
      </div>
            <div className="buttonsContainer" id={"btnContainer"+props.id} style={{display: displayValue}}>
                <button className="editBtn resetbutton"><Link to={"/partner-data/edit/"+props.docId}><i className="fa-solid fa-pencil" style={{color: "#000"}}></i></Link></button>
                <button className="submitbutton deleteBtn" onClick={handleDelete}><i className="fa-solid fa-trash-can"></i></button>
            </div>
        </div>
    );
}

export default ReportBox;
