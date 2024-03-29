import React, { useState } from "react";
import { Bars } from 'react-loader-spinner';
import {collection, onSnapshot, query} from "firebase/firestore";

import {db, querySchool} from "../../firebase/firestore";
import ReportBox from "./ReportBoxComp";
import Sidebar from "../../components/Sidebar";

function SchoolReport() {
    const[data,setData] =useState([]);
    const [loaderEnable, setLoaderEnable] = useState(true);

    const [queryLoaderEnable, setQueryLoaderEnable] = useState(false);
    const [searchValue, setSearchValue] = React.useState("");
    const [searchField, setSearchField] = React.useState("");
    const [searchResults, setSearchResults] = useState([]);

    React.useEffect(() => {
        const q = query(collection(db, "schoolData"));
        onSnapshot(q, (querySnapshot) => {
            const dataArray = [];
            querySnapshot.forEach(snap => {
                let tempData = snap.data();
                if(atob(localStorage.auth).split("-")[2] === "atlIncharge" && atob(localStorage.auth).split("-")[1] === snap.data().atlIncharge.email) {
                    tempData.docId = snap.id;
                    dataArray.push(tempData);
                } else if(atob(localStorage.auth).split("-")[2] !== "atlIncharge") {
                    tempData.docId = snap.id;
                    dataArray.push(tempData);
                }
            });
            setData(dataArray);
            setLoaderEnable(false);
        });
    }, []);

    function handleChange(event) {
        if(event.target.name === "field") {
            setSearchField(event.target.value);
        } else if(event.target.name === "value") {
            setSearchValue(event.target.value);
        }
    }

    async function handleSearch(event) {
        if(searchField === "" || searchValue === "") {
            alert("Please fill the required details for search");
        } else {
            setQueryLoaderEnable(true);
            setSearchResults([]);
            const snaps = await querySchool(searchField, "==", searchValue);

            const newResults = [];

            snaps.forEach((snap) => {
                const temp = snap.data(); //Lakshmi bug9
                temp.docId = snap.id; //Lakshmi bug9
                newResults.push(temp);
            });

            if(newResults.length === 0) {
                alert("No results found");
            } else {
                setSearchValue("");
            }

            setSearchResults(newResults);
            setQueryLoaderEnable(false);
        }
    }

    function resetSearch() {
        setSearchResults([]);
        setSearchValue("");
    }

    document.title = "School Data Form | Digital ATL";

    return(
        <div className="container">
            <Sidebar />
            <link rel="stylesheet" href="/CSS/form.css" />
            <link rel="stylesheet" href="/CSS/report.css" />
            <div className="title">School Data Report | Digital ATL</div>
            <hr />
            <div className="querySection" style={{textAlign: "left"}}>
                <select name="field" id="field" style={{borderRadius: "0"}} onChange={handleChange} value={searchField}>
                    <option value="" disabled={true} selected={true}>SELECT FIELD</option>
                    <option value="name">Name</option>
                    <option value="address.city">City</option>
                    <option value="address.state">State</option>
                    <option value="address.pincode">Pincode</option>
                    <option value="atlIncharge.email">Incharge Email</option>
                    <option value="principal.email">Principal Email</option>
                    <option value="correspondent.email">Correspondent Email</option>
                    <option value="webSite">Website URL</option>
                </select>
                <br/>
                <br/>
                <input type="text" name="value" id="value" placeholder="Value to be searched" onChange={handleChange} value={searchValue} style={{
                    padding: "0.3rem",
                    fontSize: "1.2rem",
                    width: "100%",
                    border: "3px solid rgb(94, 94, 94)",
                    borderRadius: "10px",
                    outline: "none",
                    textAlign: "left",
                    transition: "0.3s",
                    margin: "0.5rem"
                }} />
                <button className="submitbutton" onClick={handleSearch}>Search</button>
                <button className="resetbutton" onClick={resetSearch}>Clear Search</button>
                <div className="results">
                    {(queryLoaderEnable)?(
                        <center>
                            <Bars
                                height="80"
                                width="80"
                                radius="9"
                                color="black"
                                ariaLabel="loading"
                                wrapperStyle
                                wrapperClass
                            />
                        </center>
                    ):(console.log("Disabled loader"))}
                    {
                        searchResults.map((school, index) => {
                            return(
                                <ReportBox
                                    key={index}
                                    id={index}
                                    name={school.name}
                                    addressLine1={school.address.addressLine1}
                                    city={school.address.city}
                                    state={school.address.state}
                                    pincode={school.address.pincode}
                                    country={school.address.country}
                                    inchargeFName={school.atlIncharge.firstName}
                                    inchargeLName={school.atlIncharge.lastName}
                                    inchargeEmail={school.atlIncharge.email}
                                    inchargeWhatsappNumber={school.atlIncharge.whatsappNumber}
                                    principalFName={school.principal.firstName}
                                    principalLName={school.principal.lastName}
                                    principalEmail={school.principal.email}
                                    principalWhatsappNumber={school.principal.whatsappNumber}
                                    correspondentFName={school.correspondent.firstName}
                                    correspondentLName={school.correspondent.lastName}
                                    correspondentEmail={school.correspondent.email}
                                    correspondentWhatsappNumber={school.correspondent.whatsappNumber}
                                    correspondentSameAsPrincipal={school.sameAsPrincipal}
                                    isATL={school.isATL}
                                    syllabus={school.syllabus}
                                    website={school.webSite}
                                    paidSubscription={school.paidSubscription}
                                    socialMediaLink={school.socialMediaLink}
                                    docId={school.docId}
                                />
                            )
                        })
                    }
                </div>
            </div>
            <hr />
            {(loaderEnable)?(
                <center>
                    <Bars
                        height="80"
                        width="80"
                        radius="9"
                        color="black"
                        ariaLabel="loading"
                        wrapperStyle
                        wrapperClass
                    />
                </center>
            ):(console.log("Disabled loader"))}
            {
                data.map((school,index)  =>{
                    console.log (school);
                    return(
                        <ReportBox
                            key={index}
                            id={index}
                            name={school.name}
                            addressLine1={school.address.addressLine1}
                            city={school.address.city}
                            state={school.address.state}
                            pincode={school.address.pincode}
                            country={school.address.country}
                            inchargeFName={school.atlIncharge.firstName}
                            inchargeLName={school.atlIncharge.lastName}
                            inchargeEmail={school.atlIncharge.email}
                            inchargeWhatsappNumber={school.atlIncharge.whatsappNumber}
                            principalFName={school.principal.firstName}
                            principalLName={school.principal.lastName}
                            principalEmail={school.principal.email}
                            principalWhatsappNumber={school.principal.whatsappNumber}
                            correspondentFName={school.correspondent.firstName}
                            correspondentLName={school.correspondent.lastName}
                            correspondentEmail={school.correspondent.email}
                            correspondentWhatsappNumber={school.correspondent.whatsappNumber}
                            correspondentSameAsPrincipal={school.sameAsPrincipal}
                            isATL={school.isATL}
                            syllabus={school.syllabus}
                            website={school.webSite}
                            paidSubscription={school.paidSubscription}
                            socialMediaLink={school.socialMediaLink}
                            docId={school.docId}
                        />
                    );
                })}

        </div>
    );
}
export default SchoolReport;
