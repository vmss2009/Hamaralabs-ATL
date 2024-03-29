import React from "react";

function Popup(props) {
    function handleClose() {
        props.setPopupEnabled(false);
    }

    document.body.onkeydown = function(event) {
        if(event.key === "Escape") {
            props.setPopupEnabled(false);
        }
    }

    return (props.trigger) ? (
        <div className="popup" style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "15"
        }}>
            <div className="popup-inner" style={{
                position: "relative",
                width: "75%",
                maxWidth: "75%",
                height: "60%",
                maxHeight: "60%",
                backgroundColor: "#fff",
                border: "10px solid rgb(137 137 137)",
                borderRadius: "3rem",
                padding: "3rem",
                display: "block",
                overflow: "auto"
            }}>
                {(props.closeAllowed)?(
                    <button className="close-btn resetbutton" style={{
                        position: "absolute",
                        top: "0.2rem",
                        right: "1rem"
                    }} onClick={handleClose}><i className="fa-sharp fa-solid fa-xmark"></i></button>
                ):("")}
                {props.children}
            </div>
        </div>
    ) : ("");
}

export default Popup;
