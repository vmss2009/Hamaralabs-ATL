import React from "react";

import Sidebar from "../components/Sidebar";
import {Link} from "react-router-dom";

function Page404(props) {
    return (
        <div className="container">
            <link rel="stylesheet" href="/CSS/form.css"/>
            <div className="title">404 | Page not found</div>
            <div className="content">
                Sorry, but the requested route is not found on the server
            </div>
            {(localStorage.getItem("auth") !== null && localStorage.getItem("auth") !== undefined)?(<Sidebar />):(<Link to="/"><button className="submitbutton">
                <i className="fa-solid fa-right-to-bracket"></i> Login</button></Link>)}
        </div>
    );
}

export default Page404;
