import React from "react";
import AccessObject from "./accessArrays";

const Login = React.lazy(() => import("./routes/Login"));
const NoAccess = React.lazy(() => import("./NoAccess"));

function AccessDeterminer(props) {
    let encodedAuth = localStorage.getItem("auth");

    let email;
    let uid;
    let role;

    if (encodedAuth !== null) {
        let decodedAuth = atob(encodedAuth);

        let split = decodedAuth.split("-");

        uid = split[0];
        email = split[1];
        role = split[2];

        const Component = props.accessForComponent;

        let temp;

        if(props.accessForName === "studentForm") {
            temp = "Student Data Form";
        } else if(props.accessForName === "studentReport") {
            temp = "Student Data Report";
        } else if(props.accessForName === "mentorForm") {
            temp = "Mentor Data Form";
        } else if(props.accessForName === "mentorReport") {
            temp = "Mentor Data Report";
        } else if(props.accessForName === "schoolForm") {
            temp = "School Data Form";
        } else if(props.accessForName === "schoolReport") {
            temp = "School Data Report";
        } else if(props.accessForName === "teamForm") {
            temp = "Team Data Form";
        } else if(props.accessForName === "teamReport") {
            temp = "Team Data Report";
        } else if(props.accessForName === "activityForm") {
            temp = "TA Data Form";
        } else if(props.accessForName === "activityReport") {
            temp = "TA Data Report";
        } else if(props.accessForName === "competitionForm") {
            temp = "Competition Data Form";
        } else if(props.accessForName === "competitionReport") {
            temp = "Competition Data Report";
        } else if(props.accessForName === "competitionArchived") {
            temp = "CompetitionsArchived";
        } else if(props.accessForName === "coursesForm") {
            temp = "Courses Data Form";
        } else if(props.accessForName === "coursesReport") {
            temp = "Courses Data Report";
        } else if(props.accessForName === "projectForm") {
            temp = "Projects Data Form";
        } else if(props.accessForName === "projectReport") {
            temp = "Projects Data Report";
        } else if(props.accessForName === "partnerForm") {
            temp = "Partner Data Form";
        } else if(props.accessForName === "partnerReport") {
            temp = "Partner Data Report";
        } else if (props.accessForName === "sessionForm") {
            temp = "Session Data Form";
        } else if (props.accessForName === "sessionReport") {
            temp = "Session Data Report";
        } else if(props.accessForName === "studentSnapshot") {
            temp = "Student Snapshot";
        } else if(props.accessForName === "competitionSnapshot") {
            temp = "Competition Snapshot";
        } else if(props.accessForName === "addFieldsForm") {
            temp = "AddFieldForm";
        } else if (props.accessForName === "notifications") {
            temp = "Notifications";
        } else if (props.accessForName === "payments") {
            temp = "Payments";
        } else if (props.accessForName === "chats") {
            temp = "Chats";
        } else if (props.accessForName === "chatWithAdmin") {
            temp = "Chat with Admin";
        } else if (props.accessForName === "slotManagement") {
            temp = "Slot Management";
        }

        if(AccessObject[props.accessForName].includes(role)) {
            return <Component />
        } else {
            return <NoAccess name={temp} />
        }
    } else {
        return <Login />
    }
}

export default AccessDeterminer;
