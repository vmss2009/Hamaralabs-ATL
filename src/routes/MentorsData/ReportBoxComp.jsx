import React from "react";

function ReportBox(props) {
    const [displayValue, setDisplayValue] = React.useState("none");
    let editUrl = "/student-data/edit?id=" + props.id;
    let deleteUrl = "/student-data/delete?id=" + props.id;

    function handleMouseOver(event) {
        setDisplayValue("block");
    }

    function handleMouseOut(event) {
        setDisplayValue("none");
    }

    async function handleDelete(event) {
        console.log(props.docId);
        if(window.confirm("You are about to delete a mentor")) {
            await props.deleteMentor(props.docId)
                .then(() => {
                    alert("Mentor has been deleted.");
                    window.location.reload();
                })
                .catch(err => {
                    alert("An error has occurred please try again later.");
                })
        }
    }

    function handleEditClick() {
        window.location.href = "/mentor-data/edit/"+props.docId;
    }

    return (
        <div className="box" id={props.id} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
            <div className="overlay"></div>
            <div className="name" onMouseOver={handleMouseOver}>{props.fname} {props.lname}</div>
            <div className="boxContainer">
                Skills:- {" "}
                {props.skillSet.map((skill, index) => {
                    if(index === props.skillSet.length - 1) {
                        return "and "+skill;
                    } else if(index === props.skillSet.length - 2) {
                        return skill+" ";
                    } else {
                        return skill+", "
                    }
                })}
            </div>
            {/*<div className="boxContainer emailContainer" onMouseOver={handleMouseOver}>Email:- {props.email}</div>*/}
            {/*<div className="boxContainer" onMouseOver={handleMouseOver}>Whatsapp Number:- {props.whatsappNumber}</div>*/}
            {/*<div className="boxContainer" onMouseOver={handleMouseOver}>Aspiration:- {props.aspiration}</div>*/}
            {/*<div className="boxContainer" onMouseOver={handleMouseOver}>Current Experiment:- {props.currentExperiment}</div>*/}
            {/*<div className="boxContainer" onMouseOver={handleMouseOver}>College:- {props.college}</div>*/}
            {/*<div className="boxContainer" onMouseOver={handleMouseOver}>Competition Mapped:- {props.competitionMapped}</div>*/}
            {/*<div className="boxContainer" onMouseOver={handleMouseOver}>Department:- {props.department}</div>*/}
            {/*<div className="boxContainer" onMouseOver={handleMouseOver}>Study:- {props.study}</div>*/}
            {/*<div className="boxContainer" onMouseOver={handleMouseOver}>Year:- {props.year}</div>*/}
            <div className="buttonsContainer" id={"btnContainer"+props.id} style={{display: displayValue}}>
                <button className="editBtn resetbutton" data-url={editUrl} onClick={handleEditClick}><i className="fa-solid fa-pencil"></i></button>
                <button className="submitbutton deleteBtn" data-url={deleteUrl} onClick={handleDelete}><i className="fa-solid fa-trash-can"></i></button>
            </div>
        </div>
    );
}

export default ReportBox;
