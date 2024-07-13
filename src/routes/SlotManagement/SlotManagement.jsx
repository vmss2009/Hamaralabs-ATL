import react, { useState } from "react";
import Sidebar from "../../components/Sidebar";

function SlotManagement () {
    let encodedAuth = localStorage.getItem("auth");
    let uid;
    let email;
    let role;

    if (encodedAuth != null) {
        let decodedAuth = atob(encodedAuth);

        let split = decodedAuth.split("-");

        uid = split[0];
        email = split[1];
        role = split[2];
    }

    document.title = "Slot Management | Digital ATL";

    return(
        <div className="container">
            <Sidebar />
            <link rel="stylesheet" href="/CSS/form.css"/>
            <link rel="stylesheet" href="/CSS/report.css"/>

        </div>
    );
}

export default SlotManagement;