import React from "react";

function LogoutBtn() {
    function logout() {
        localStorage.clear();
        window.location.href = "";
    }

    return (
        <button id="logOut" style={{zIndex: "10"}} onClick={logout}>Log Out</button>
    )
}

export default LogoutBtn;
