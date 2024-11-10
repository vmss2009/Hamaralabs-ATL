import React from "react";
import {Link} from "react-router-dom";

import Sidebar from "../components/Sidebar";

function index() {
    function logout(event) {
        event.preventDefault();
        localStorage.clear();
        window.location.reload();
    }

    document.title = "Home | Digital ATL";

    return (
        <div className="container">
            <Sidebar />
            <link rel="stylesheet" href="/CSS/home.css"/>
            <div className="title">Home / Dashboard</div>
            <div className="content">
                <div className="subTitle">Tasks & Activities</div>
                <Link to="/tasks"><div className="item">Tasks & Activities</div></Link>
                <div className="subTitle">Students</div>
                <Link to="/student-data/add"><div className="item">Student data form</div></Link>
                <Link to="/student-data/view"><div className="item">Student data report</div></Link>
                <Link to="/student-data/snapshot"><div className="item">Student Snapshot</div></Link>
                <div className="subTitle">Mentors</div>
                <Link to="/mentor-data/add"><div className="item">Mentor form</div></Link>
                <Link to="/mentor-data/view"><div className="item">Mentor report</div></Link>
                <div className="subTitle">Schools</div>
                <Link to="/school-data/add"><div className="item">School form</div></Link>
                <Link to="/school-data/view"><div className="item">School report</div></Link>
                <div className="subTitle">Teams</div>
                <Link to="/team-data/add"><div className="item">Team form</div></Link>
                <Link to="/team-data/view"><div className="item">Team report</div></Link>
                <div className="subTitle">Tinkering Activities</div>
                <Link to="/ta-data/add"><div className="item">Tinkering Activity form</div></Link>
                <Link to="/ta-data/view"><div className="item">Tinkering Activity report</div></Link>
                <div className="subTitle">Competition Data</div>
                <Link to="/competition-data/add"><div className="item">Competition Data Form</div></Link>
                <Link to="/competition-data/view"><div className="item">Competition Data Report</div></Link>
                <Link to="/competition-data/archive:view"><div className="item">Archived Competition Data Report</div></Link>
                <Link to="/competition-data/snapshot"><div className="item">Competition Snapshot</div></Link>
                <div className="subTitle">Courses Data</div>
                <Link to="/courses-data/add"><div className="item">Courses Data Form</div></Link>
                <Link to="/courses-data/view"><div className="item">Courses Data Report</div></Link>
                <div className="subTitle">Projects Data</div>
                <Link to="/project-data/add"><div className="item">Projects Data Form</div></Link>
                <Link to="/project-data/view"><div className="item">Projects Data Report</div></Link>
                <div className="subTitle">Partner Data</div>
                <Link to="/partner-data/add"><div className="item">Partner Data Form</div></Link>
                <Link to="/partner-data/view"><div className="item">Partner Data Report</div></Link>
                <div className="subTitle">Contact</div>
                <Link to="/chats"><div className="item">Chats</div></Link>
                <Link to="/chat-with-admin"><div className="item">Chat with Admin</div></Link>
                <div className="subTitle">Others</div>
                <a href="/logout" onClick={logout}><div className="item">Logout</div></a>
            </div>
        </div>
    );
}

export default index;