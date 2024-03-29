import React from "react";

import Sidebar from "./components/Sidebar";

function NoAccess(props) {
    return <div>
        <Sidebar />
        <link rel="stylesheet" href="/CSS/report.css"/>
        <div className="title" style={{textAlign: "center"}}>
            You don't have access to {props.name}
        </div>
    </div>
}

export default NoAccess;
