import React from "react";
import {deleteSchool} from "../../firebase/firestore";

function ReportBox(props) {
    const [displayValue, setDisplayValue] = React.useState("none");

    function handleMouseOver(event) {
        setDisplayValue("block");
    }

    function handleMouseOut(event) {
        setDisplayValue("none");
    }

    async function handleDelete() {
        if(window.confirm("You are about to delete a school")) {
            await deleteSchool(props.docId)
            .then(() => {
                alert("Deleted successfully");
            })
            .catch(() => {
                alert("An error occurred please try again later");
            })
        }
    }

    function handleEditClick() {
        window.location.href = "/school-data/edit/"+props.docId;
    }

    return (
        <div className="box" id={props.id} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
            <div className="name" onMouseOver={handleMouseOver}>{props.name}</div>
            <link rel="stylesheet" href="/CSS/schoolreport.css" />
            <br />
            <div className="boxContainer">Is ATL School: <span className="text-color">{(props.isATL)?"Yes":"No"}</span></div>
            <div className="boxContainer">Address Line 1:<span className="text-color">{props.addressLine1}</span></div>
            <div className="boxContainer">City: <span className="text-color">{props.city}</span></div>
            <div className="boxContainer">State:<span className="text-color">{props.state}</span></div>
            <div className="boxContainer">Country:<span className="text-color">{props.country}</span></div>
            <div className="boxContainer">Pin Code:<span className="text-color">{props.pincode}</span></div>
            <div className="boxContainer">Incharge Name:<span className="text-color">{props.inchargeFName} {props.inchargeLName}</span></div>
            <div className="boxContainer">Incharge Email:<span className="text-color">{props.inchargeEmail}</span></div>
            <div className="boxContainer">Incharge Whatsapp Number:<span className="text-color">{props.inchargeWhatsappNumber}</span></div>
            <div className="boxContainer">Principal Name:<span className="text-color">{props.principalFName} {props.principalLName}</span></div>
            <div className="boxContainer">Principal Email:<span className="text-color">{props.principalEmail}</span></div>
            <div className="boxContainer">Correspondent same as Principal:<span className="text-color">{props.correspondentSameAsPrincipal?"Yes":"No"}</span> </div>
            <div className="boxContainer">Principal Whatsapp Number:<span className="text-color">{props.principalWhatsappNumber}</span></div>
            <div className="boxContainer">Correspondent Name:<span className="text-color">{props.correspondentFName} {props.correspondentLName}</span></div>
            <div className="boxContainer">Correspondent Whatsapp Number:<span className="text-color">{props.correspondentWhatsappNumber}</span></div>
            <div className="boxContainer">Correspondent Email:<span className="text-color">{props.correspondentEmail}</span></div>
            <div className="boxContainer">Syllabus:
            <span className="text-color">{props.syllabus.cbse?"CBSE":""}</span> <span className="text-color">{props.syllabus.icse?"ICSE":""} </span><span className="text-color">{props.syllabus.igcse?"IGCSE":""}</span>
            <span className="text-color"> {props.syllabus.ib?"IB":""}</span><span className="text-color"> {props.syllabus.state?"STATE":""}</span>
            </div>
            <div className="boxContainer">Website URL:<a href={props.website} target="_blank" rel="noreferrer"><span className="text-color">{props.website}</span></a></div>
            <div className="boxContainer">Paid Subscription:<span className="text-color">{props.paidSubscription?"Yes":"No"}</span> </div>
            <div className="boxContainer">
                Social Media Links: {
                    props.socialMediaLink.map((link, index) => {
                        return <a href={link} target="_blank" key={index} rel="noreferrer"><span className="text-color">{link}</span></a>
                    })
                }
            </div>
            <div className="boxContainer"></div>
            <div className="buttonsContainer" id={"btnContainer"+props.id} style={{display: displayValue}}>
                <button className="editBtn resetbutton" onClick={handleEditClick}><i className="fa-solid fa-pencil"></i></button>
                <button className="submitbutton deleteBtn" onClick={handleDelete}><i className="fa-solid fa-trash-can"></i></button>
            </div>
        </div>
    );
}

export default ReportBox;
