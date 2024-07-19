import React from "react";
import {Link} from "react-router-dom";

function Sidebar() {

    let encodedAuth = localStorage.getItem("auth");
    let role;
    let decodedAuth = atob(encodedAuth);
    let split = decodedAuth.split("-");
    role = split[2];

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }

    function handleClick() {
        document.querySelector(".sidebar").classList.toggle("closed");
        document.querySelector(".open-overlay").classList.toggle("active");
    }

    function overlayToggle() {
        if(!document.querySelector(".sidebar").classList.contains("closed")) {
            document.querySelector(".sidebar").classList.toggle("closed");
            document.querySelector(".open-overlay").classList.toggle("active");
        }
    }

    function logout() {
        localStorage.clear();
        window.location.href = "";
    }
    
    return (
        <div>
            <link rel="stylesheet" href="/CSS/sidebar.css" />
            <span id="more-icon" onClick={handleClick}><i className="fa-solid fa-bars"></i></span>
            <div className="sidebar closed">
                <Link to="/">
                    <div className="title">Digital ATL</div>
                </Link>
                <li className="nav-item" style={{marginLeft: "1.9rem"}}>{atob(localStorage.getItem("auth")).split("-")[1]}</li>
                <ul className="navItemsContainer">
                    <div className="subContent">
                        <Link to="/"><li className="nav-item">Home / Dashboard</li></Link>
                        <a><li className="nav-item last-li" onClick={toggleFullScreen}>Toggle Full Screen</li></a>
                    </div>
                    <div className="subContent">
                        <Link to="/tasks"><li className="nav-item last-li">Tasks & Activities</li></Link>
                    </div>
                    <div className="subTitle"><li className="nav-item">Students</li></div>
                    <div className="subContent">
                        {role !== "student" ? <Link to="/student-data/add"><li className="nav-item">Student data form</li></Link> : ""}
                        {role !== "student" ? <Link to="/student-data/view"><li className="nav-item">Student data report</li></Link>: ""}
                        <Link to="/student-data/snapshot"><li className="nav-item last-li">Student Snapshot</li></Link>
                    </div>
                    <div className="subTitle"><li className="nav-item">Tinkering Activities</li></div>
                    <div className="subContent">
                        <Link to="/ta-data/add"><li className="nav-item">Tinkering Activity form</li></Link>
                        <Link to="/ta-data/view"><li className="nav-item last-li">Tinkering Activity report</li></Link><br/>
                        <Link to="/ta-data/add-subject"><li className="nav-item last-li">TA Dashboard</li></Link>
                    </div>
                    <div className="subTitle"><li className="nav-item">Competitions</li></div>
                    <div className="subContent">
                        {role !== "student" ? <Link to="/competition-data/add"><li className="nav-item">Competition Data Form</li></Link>: ""}
                        <Link to="/competition-data/view"><li className="nav-item last-li">Competition Data Report</li></Link><br/>
                        {role !== "student" ? <><Link to="/competition-data/archive"><li className="nav-item last-li">Competitions - Archived</li></Link><br/></>: ""}
                        {role !== "student" ? <Link to="/competition-data/snapshot"><li className="nav-item last-li">Competition Snapshot</li></Link>: ""}
                    </div>
                    {role !== "student" ?<><div className="subTitle"><li className="nav-item">Courses</li></div>
                    <div className="subContent">
                        <Link to="/courses-data/add"><li className="nav-item">Courses Data Form</li></Link>
                        <Link to="/courses-data/view"><li className="nav-item last-li">Courses Data Report</li></Link>
                    </div></>: ""}
                    {role !== "student" ? <><div className="subTitle"><li className="nav-item">Sessions</li></div>
                    <div className="subContent">
                        <Link to="/session-data/add"><li className="nav-item">Session Data Form</li></Link>
                        <Link to="/session-data/view"><li className="nav-item last-li">Session Data Report</li></Link>
                    </div></> : ""}
                    <div className="subTitle"><li className="nav-item">Slot Management</li></div>
                    {role === "admin" || role === "atlIncharge" ?
                    <div className="subContent">
                        <Link to="/slot-management/add-update"><li className="nav-item">Slot Management Form</li></Link>
                        <Link to="/slot-management/manage"><li className="nav-item last-li">Slot Management Report</li></Link>
                    </div>
                    : "" }
                    {role !== "student" ? <><div className="subTitle"><li className="nav-item">Teams</li></div>
                    <div className="subContent">
                        <Link to="/team-data/add"><li className="nav-item">Team form</li></Link>
                        <Link to="/team-data/view"><li className="nav-item last-li">Team report</li></Link>
                    </div></>: ""}
                    {role !== "student" ? <><div className="subTitle"><li className="nav-item">Mentors</li></div>
                    <div className="subContent">
                        <Link to="/mentor-data/add"><li className="nav-item">Mentor form</li></Link>
                        <Link to="/mentor-data/view"><li className="nav-item last-li">Mentor report</li></Link>
                    </div></>: ""}
                    {role !== "student" ? <><div className="subTitle"><li className="nav-item">Projects</li></div>
                    <div className="subContent">
                        <Link to="/project-data/add"><li className="nav-item">Projects Data Form</li></Link>
                        <Link to="/project-data/view"><li className="nav-item last-li">Projects Data Report</li></Link>
                    </div></>: ""}
                    {role === "admin" ? <> <div className="subTitle"><li className="nav-item">Schools</li></div>
                    <div className="subContent">
                        <Link to="/school-data/add"><li className="nav-item">School form</li></Link>
                        <Link to="/school-data/view"><li className="nav-item last-li">School report</li></Link>
                    </div> </>: ""}
                    {role !== "student" ? <><div className="subTitle"><li className="nav-item">Partners</li></div>
                    <div className="subContent">
                        <Link to="/partner-data/add"><li className="nav-item">Partner Data Form</li></Link>
                        <Link to="/partner-data/view"><li className="nav-item last-li">Partner Data Report</li></Link>
                    </div></> : ""}
                    <div className="subTitle"><li className="nav-item">Contact</li></div>
                    <div className="subContent">
                        <Link to="/chats"><li className="nav-item">Chats</li></Link>
                        <Link to="/chat-with-admin"><li className={role !== "admin" ? "nav-item last-li" : "nav-item"}>Chat with Admin</li></Link>
                        {role === "admin" ? <Link to="/notifications"><li className="nav-item last-li">Notifications</li></Link> : ""}
                    </div>
                    <div className="subTitle"><li className="nav-item">Payments</li></div>
                    <div className="subContent">
                        <Link to="/payments"><li className="nav-item last-li">Payments</li></Link>
                    </div>
                    <br/>
                    {/*<a href="/profile"><li className="nav-item">Your Profile</li></a>*/}
                    <li className="nav-item last-li logout" style={{cursor: "pointer"}} onClick={logout}>Logout</li>
                    <br/>
                </ul>
            </div>
            <div className="open-overlay" onClick={overlayToggle}></div>
        </div>
    );
}

export default Sidebar;
