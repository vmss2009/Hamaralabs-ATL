import React from "react";

function SubTask(props) {
    const [open, setOpen] = React.useState(false);

    return <div key={props.index} style={{marginLeft: "1.5rem", minWidth: "100%", maxWidth: "100%"}}>
        <div className="subTitle">{props.index+1}. {props.subTask.name}<button className="resetbutton" style={{display: "inline-block"}} onClick={() => {setOpen(!open)}} >{(open)?<i className="fa-solid fa-caret-up"></i>:<i className="fa-solid fa-caret-down"></i>}</button></div>
        {
            (open)?
                <>
                            <div style={{ marginLeft: "1.5rem"}}> Description: {props.subTask.description}</div>
                    <br/>
                </>
            : ""
        }
    </div>
}

export default SubTask;
