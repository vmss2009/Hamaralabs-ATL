import React, { useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { Bars } from 'react-loader-spinner';
import fbAuth, { signIn } from "../firebase/auth";
import db from "../firebase/firestore";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleOnChange(event) {
    if(event.target.name === "email") {
      setEmail(event.target.value);
    } else if(event.target.name === "password") {
      setPassword(event.target.value);
    } else if(event.target.name === "show") {
      if(event.target.checked) {
        document.getElementById("passwordbox").setAttribute("type", "text");
      } else {
        document.getElementById("passwordbox").setAttribute("type", "password");
      }
    }
  }

  async function handleLoginRequest(event) {
    event.preventDefault();
    document.getElementById("loading-overlay").classList.add("active");
    if(email !== undefined && password !== undefined) {
      const res = await signIn(email, password, setEmail, setPassword);

      console.log(res);

      if(res.user.uid !== null) {
        const docRef = doc(db, "atlUsers", fbAuth.currentUser.uid);
        const docSnap = await getDoc(docRef);

        const role = docSnap.data().role;

        localStorage.setItem("auth", btoa(`${fbAuth.currentUser.uid}-${fbAuth.currentUser.email}-${role}`));

        window.location.reload();
      }
    }
  }

  document.title = "Login | Digital ATL";

  return(
      <form>
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
        <div className="title">Login</div>
        <center style={{fontSize: "1.2rem"}}><div>Digital Tinkering Labs</div></center>
        <br />
        <input type="email" name="email" className="form-inp" placeholder="Email-id" autoComplete="off" value={email} onChange={handleOnChange} required /> <br /><br />
        <input type="password" name="password" className="form-inp" id="passwordbox" placeholder="Password" autoComplete="off" value={password} onChange={handleOnChange} required /> <br /><br />
        <center>
          <div className="show" id="showPassword">
            <input type="checkbox" name="show" id="show" onChange={handleOnChange} />
            <label htmlFor="show">Show Password</label>
          </div>
          <button type="submit" onClick={handleLoginRequest}><i className="fa-solid fa-arrow-right-to-bracket"></i> Login</button>
          {/* <br /> */}
          {/* <button onClick={handleGoogleOAuthRequest}><i className="fa-brands fa-google"></i> Login via Google</button> */}
          <br />
          <a href="/auth/reset-password" className="helpLink">Forgot password?</a> | <a href="mailto:contact@hamaralabs.com" className="helpLink">Need to contact us?</a>
          <br/><br/>
          <a href="/register" className="helpLink">Register?</a>
        </center>
      </form>
  );
}

export default LoginPage;
