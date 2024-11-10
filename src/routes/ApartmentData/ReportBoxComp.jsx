import React from "react";
import {deleteApartment} from "../../firebase/firestore";

function ReportBox(props) {
    const [displayValue, setDisplayValue] = React.useState("none");

    function handleMouseOver(event) {
        setDisplayValue("block");
    }

    function handleMouseOut(event) {
        setDisplayValue("none");
    }

    async function handleDelete() {
        if(window.confirm("You are about to delete a apartment")) {
            await deleteApartment(props.docId)
            .then(() => {
                alert("Deleted successfully");
            })
            .catch(() => {
                alert("An error occurred please try again later");
            })
        }
    }

    function handleEditClick() {
        window.location.href = "/apartment-data/edit/"+props.docId;
    }

    return (
        <div className="box" id={props.id} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
            <div className="name" onMouseOver={handleMouseOver}>{props.name}</div>
            <link rel="stylesheet" href="/CSS/schoolreport.css" />
            <div className="boxContainer">Address Line 1:<span className="text-color">{props.addressLine1}</span></div>
            <div className="boxContainer">City: <span className="text-color">{props.city}</span></div>
            <div className="boxContainer">State:<span className="text-color">{props.state}</span></div>
            <div className="boxContainer">Country:<span className="text-color">{props.country}</span></div>
            <div className="boxContainer">Pin Code:<span className="text-color">{props.pincode}</span></div>
            <div className="boxContainer">Incharge Name:<span className="text-color">{props.inchargeFName} {props.inchargeLName}</span></div>
            <div className="boxContainer">Incharge Email:<span className="text-color">{props.inchargeEmail}</span></div>
            <div className="boxContainer">Incharge Whatsapp Number:<span className="text-color">{props.inchargeWhatsappNumber}</span></div>
            <div className="buttonsContainer" id={"btnContainer"+props.id} style={{display: displayValue}}>
                <button className="editBtn resetbutton" onClick={handleEditClick}><i className="fa-solid fa-pencil"></i></button>
                <button className="submitbutton deleteBtn" onClick={handleDelete}><i className="fa-solid fa-trash-can"></i></button>
            </div>
        </div>
    );
}

export default ReportBox;
