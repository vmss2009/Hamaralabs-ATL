import React from "react";

function ReportBox(props) {
    const [displayValue, setDisplayValue] = React.useState("none");

    let editUrl = "/session-data/edit?id=" + props.id;
    let deleteUrl = "/session-data/delete?id=" + props.id;

    let decodedAuth = atob(localStorage.auth);

    let split = decodedAuth.split("-");

    window.uid = split[0];
    window.email = split[1];
    window.role = split[2];

    function handleMouseOver(event) {
        setDisplayValue("block");
    }

    function handleMouseOut(event) {
        setDisplayValue("none");
    }

    async function handleDelete(event) {
        console.log(props.docId);
        if(window.confirm("You are about to delete a session")) {
            await props.deleteSession(props.docId)
                .then(() => {
                    alert("Session has been deleted.");
                    window.location.reload();
                })
                .catch(err => {
                    alert("An error has occurred please try again later.");
                })
        }
    }

    function handleEditClick() {
        window.location.href = "/session-data/edit/"+props.docId;
    }

    return (
        <div className="box" id={props.id} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
            <div className="overlay"></div>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>Subject:</span> {props.subject}</div>
            <br/>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>Topic:</span> {props.topic}</div>
            <br/>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>Subtopic:</span> {props.subTopic}</div>
            <br/>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>Date and time:</span> {new Date(props.timestamp).toLocaleDateString()} {new Date(props.timestamp).toLocaleTimeString()}</div>
            <br/>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>Duration:</span> {props.duration} hours</div>
            <br/>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>Type:</span> {props.type}</div>
            <br/>
            <div className="boxContainer">
            <span style={{fontWeight: "600"}}>Prerequisites:</span>
                {props.prerequisites.map((prerequisite, index) => {
                    if(index === props.prerequisites.length - 1) {
                        return "and "+prerequisite;
                    } else if(index === props.prerequisites.length - 2) {
                        return prerequisite+" ";
                    } else {
                        return prerequisite+", "
                    }
                })}
            </div>
            <div className="buttonsContainer" id={"btnContainer"+props.id} style={{display: displayValue}}>
                <button className="editBtn resetbutton" data-url={editUrl} onClick={handleEditClick}><i className="fa-solid fa-pencil"></i></button>
                <button className="submitbutton deleteBtn" data-url={deleteUrl} onClick={handleDelete}><i className="fa-solid fa-trash-can"></i></button>
            </div> 
        </div>
    );
}

export default ReportBox;
