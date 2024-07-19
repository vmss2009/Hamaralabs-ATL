import React, {useState, useEffect} from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firestore";

function ReportBox(props) {
    const [displayValue, setDisplayValue] = useState("none");
    const [data, setData] = useState({});
    
    useEffect(() => {
        (async () => {
            const docPath = props.docPath.value;
            const docRef = doc(db, docPath);
            const docSnap = await getDoc(docRef);
            const temp = docSnap.data();
            temp.id = docSnap.id;
            setData({data: temp, timePeriod: props.docPath.timePeriod, day: props.docPath.day});
            console.log({data: temp, timePeriod: props.docPath.timePeriod, day: props.docPath.day});
        })()
    }, [props]);

    let decodedAuth = atob(localStorage.auth);

    let split = decodedAuth.split("-");

    window.uid = split[0];
    window.email = split[1];
    window.role = split[2];

    function handleMouseOver(event) {
        setDisplayValue("block");
    }

    function handleMouseOut(event) {
        setDisplayValue("none");
    }

    return (
        <div className="box" id={props.id} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
            <div className="overlay"></div>
            <div className="name"><span style={{fontWeight: "600"}}>Date and time: {data.day}, {data?.timePeriod}</span></div>
            <br/>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>Email: {data?.data?.email}</span></div>
            <br/>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>Phone Number: {data?.data?.phone}</span></div>
            <br/>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>Aspiration: {data?.data?.aspiration}</span></div>
            <br/>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>Address: </span></div>
            <div className="boxContainer">Address Line 1:<span className="text-color">{data?.data?.addressLine}</span></div>
            <div className="boxContainer">City: <span className="text-color">{data?.data?.city}</span></div>
            <div className="boxContainer">State:<span className="text-color">{data?.data?.state}</span></div>
            <div className="boxContainer">Country:<span className="text-color">{data?.data?.country}</span></div>
            <div className="boxContainer">Pin Code:<span className="text-color">{data?.data?.pincode}</span></div>
        </div>
    );
}

export default ReportBox;
