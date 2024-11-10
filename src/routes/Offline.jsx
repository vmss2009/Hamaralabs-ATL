import React from "react";

import Sidebar from "../components/Sidebar";

function Offline(props) {
    return (
        <div className="container">
            {(Boolean(props.loggedIn))?(<Sidebar />):(null)}
            <div className="title">Error | Offline</div>
            <div className="content">
                Sorry, but you are currently offline!
            </div>
        </div>
    );
}

export default Offline;
