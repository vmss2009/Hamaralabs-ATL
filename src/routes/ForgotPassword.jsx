import React from "react";

import { sendResetEmail } from "../firebase/auth";
import {Bars} from "react-loader-spinner";

function ForgotPassword() {
    const [email, setEmail] = React.useState("");

    function handleChange(event) {
        if(event.target.name === "email") {
            setEmail(event.target.value);
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        document.getElementById("loading-overlay").classList.add("active");
        await sendResetEmail(email)
        .then(() => {
            alert("Password reset email sent successfully. If not received check in the spam section.");
            document.getElementById("loading-overlay").classList.remove("active");
            setEmail("");
        })
        .catch((err) => {
            alert("An error occurred please try again.");
            document.getElementById("loading-overlay").classList.remove("active");
        });
    }

    return (
        <form style={{borderRadius: "2.5rem"}} onSubmit={handleSubmit}>
            <link rel="stylesheet" href="/CSS/login.css" />
            <div id="loading-overlay" className="open-overlay">
                <Bars
                    height="80"
                    width="80"
                    radius="9"
                    color="white"
                    ariaLabel="loading"
                    wrapperStyle
                    wrapperClass
                />
            </div>
            <div className="errorBox"></div>
            <div className="title">Reset Password</div>
            <input type="email" name="email" className="form-inp" placeholder="Email-id" autoComplete="off" onChange={handleChange} value={email} />
            <br /> <br />
                <center>
                    <button type="submit"><i className="fa-solid fa-arrow-right-to-bracket"></i> Send Link</button>
                </center>
        </form>
    );
}

export default ForgotPassword;
