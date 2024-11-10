import React, { useState } from "react";
import { Bars } from 'react-loader-spinner';
import {collection, onSnapshot, query} from "firebase/firestore";

import {db, queryApartment} from "../../firebase/firestore";
import ReportBox from "./ReportBoxComp";
import Sidebar from "../../components/Sidebar";

function ApartmentReport() {
    const[data,setData] = useState([]);
    const [loaderEnable, setLoaderEnable] = useState(true);

    const [queryLoaderEnable, setQueryLoaderEnable] = useState(false);
    const [searchValue, setSearchValue] = React.useState("");
    const [searchField, setSearchField] = React.useState("");
    const [searchResults, setSearchResults] = useState([]);

    React.useEffect(() => {
        const q = query(collection(db, "apartmentData"));
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
            const snaps = await queryApartment(searchField, "==", searchValue);

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

    document.title = "Apartment Data Report | Digital ATL";

    return(
        <div className="container">
            <Sidebar />
            <link rel="stylesheet" href="/CSS/form.css" />
            <link rel="stylesheet" href="/CSS/report.css" />
            <div className="title">Apaertment Data Report | Digital ATL</div>
            <hr />
            <div className="querySection" style={{textAlign: "left"}}>
                <select name="field" id="field" style={{borderRadius: "0"}} onChange={handleChange} value={searchField}>
                    <option value="" disabled={true} selected={true}>SELECT FIELD</option>
                    <option value="name">Name</option>
                    <option value="address.city">City</option>
                    <option value="address.state">State</option>
                    <option value="address.pincode">Pincode</option>
                    <option value="incharge.email">Incharge Email</option>
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
                        searchResults.map((apartment, index) => {
                            return(
                                <ReportBox
                                    key={index}
                                    id={index}
                                    name={apartment.name}
                                    addressLine1={apartment.address.addressLine1}
                                    city={apartment.address.city}
                                    state={apartment.address.state}
                                    pincode={apartment.address.pincode}
                                    country={apartment.address.country}
                                    inchargeFName={apartment.incharge.firstName}
                                    inchargeLName={apartment.incharge.lastName}
                                    inchargeEmail={apartment.incharge.email}
                                    inchargeWhatsappNumber={apartment.incharge.whatsappNumber}
                                    docId={apartment.docId}
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
                data.map((apartment, index) => {
                    return(
                        <ReportBox
                            key={index}
                            id={index}
                            name={apartment.name}
                            addressLine1={apartment.address.addressLine1}
                            city={apartment.address.city}
                            state={apartment.address.state}
                            pincode={apartment.address.pincode}
                            country={apartment.address.country}
                            inchargeFName={apartment.incharge.firstName}
                            inchargeLName={apartment.incharge.lastName}
                            inchargeEmail={apartment.incharge.email}
                            inchargeWhatsappNumber={apartment.incharge.whatsappNumber}
                            docId={apartment.docId}
                        />
                    )
                })
            }

        </div>
    );
}
export default ApartmentReport;
