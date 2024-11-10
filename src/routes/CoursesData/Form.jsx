import React from "react";

import { addCourse } from "../../firebase/firestore";
import Sidebar from "../../components/Sidebar";

function CoursesForm() {
    const [courseName, setCourseName] = React.useState("");
    const [courseTag, setCourseTag] = React.useState([]);
    const [tagcount, setTagCount] = React.useState(0);
    const [description, setDescription] = React.useState("");
    const [applStartDate, setApplStartDate] = React.useState("");
    const [applEndDate, setApplEndDate] = React.useState("");
    const [crsStartDate, setCrsStartDate] = React.useState("");
    const [crsEndDate, setCrsEndDate] = React.useState("");
    const [organizedBy, setOrganizedBy] = React.useState("");
    const [externalValue, setExternalValue] = React.useState("");
    const [classesFrom, setclassesFrom] = React.useState("");
    const [classesTo, setclassesTo] = React.useState("");
    const [refLink, setrefLink] = React.useState("");
    const [count, setCount] = React.useState(0);
    const [requirements, setRequirements] = React.useState([]);

    function clearForm() {
        setCourseName("")
        setCourseTag([]);
        setDescription("");
        setApplStartDate("");
        setApplEndDate("");
        setCrsStartDate("");
        setCrsEndDate("");
        setOrganizedBy("");
        setExternalValue("");
        setclassesFrom("");
        setclassesTo("");
        setrefLink("");
        setRequirements([]);
    }

    function handleChange(event) {
        if (event.target.name === "courseName") {
            setCourseName(event.target.value);
        } else if (event.target.name === "courseTag") {
            setCourseTag(event.target.value);
        } else if (event.target.name === "description") {
            setDescription(event.target.value);
        } else if (event.target.name === "applStartDate") {
            setApplStartDate(event.target.value);
        } else if (event.target.name === "applEndDate") {
            setApplEndDate(event.target.value);
        } else if (event.target.name === "crsStartDate") {
            setCrsStartDate(event.target.value);
        } else if (event.target.name === "crsEndDate") {
            setCrsEndDate(event.target.value);
        } else if (event.target.name === "classesFrom") {
            setclassesFrom(event.target.value);
        } else if (event.target.name === "classesTo") {
            setclassesTo(event.target.value);
        } else if (event.target.name === "refLink") {
            setrefLink(event.target.value);
        } else if (event.target.name === "requirements") {
            setRequirements(event.target.value);
        }
    };
    const handleOrganizedByChange = (e) => {
        setOrganizedBy(e.target.value);
    };

    const handleExternalValueChange = (e) => {
        setExternalValue(e.target.value);
    };


    async function handleSubmit(event) {
        event.preventDefault();
        if (courseName === "" || refLink === "" || requirements.length === 0) {
            alert("Please fill all the fields!");
        } else {
            try {
                await addCourse(courseName, courseTag, description, (organizedBy === "AIM" ? organizedBy : externalValue), applStartDate, applEndDate, crsStartDate, crsEndDate, classesFrom, classesTo, refLink, requirements)
                    .then(() => {
                        alert("Added Successfully!");
                        clearForm();
                        window.location.href = "/courses-data/view";
                    })
            } catch (error) {
                console.error("Error adding courses: ", error);
                alert("Couldn't add the data. Please try again!");
            }
        }

    }

    function handleClick(event) {
        if (event.target.type === "reset") {
            clearForm();
        }
    }

    function newArray() {
        const newarr = [];
        for (let x = 1; x < tagcount; x++) {
            newarr.push(x);
        }
        return newarr;
    }

    function handleRequestChange(event, index) {
        const value = event.target.value;
        const updatedCourseTags = [...courseTag];
        updatedCourseTags[index] = value;
        setCourseTag(updatedCourseTags);
    }

    function addField(event) {
        event.preventDefault();
        setTagCount(tagcount + 1);
    }

    function removeField(event) {
        event.preventDefault();
        if (tagcount !== 0) {
            setTagCount(tagcount - 1);
        }
    }

    function createArray() {
        const arr = [];
        for (let i = 1; i < count; i++) {
            arr.push(i);
        }
        return arr;
    }

    function handleServiceChange(event, index) {
        const value = event.target.value;
        const updatedRequirements = [...requirements];
        updatedRequirements[index] = value;
        setRequirements(updatedRequirements);
    }

    function increaseField(event) {
        event.preventDefault();
        setCount(count + 1);
    }

    function decreaseField(event) {
        event.preventDefault();
        if (count !== 0) {
            setCount(count - 1);
        }
    }

    document.title = "Courses Registration Form | Digital ATL";

    return (
        <div className="container" id="mobilescreen" >
            <Sidebar />
            <link rel="stylesheet" href="/CSS/school.css" />
            <form>
                <div className="school-title">Courses Registration Form</div>
                <hr />
                <div className="formContainer">
                    <div className="row">
                        <div className="column">
                            <label htmlFor="courseName"><strong>Name:</strong> </label>
                            <input type="text" name="courseName" id="courseName" placeholder="Enter the CoursesName" className="form-inp" value={courseName} onChange={handleChange} />
                        </div>
                    </div>
                </div>
                <div className="formContainer">
                    <div className="row">
                        <div className="column">
                            <label htmlFor="description" ><strong>Description:</strong> </label>
                            <br />
                            <textarea id="description" name="description" cols="18" rows="4" className="c form-inp" placeholder="Enter the Description" onChange={handleChange} value={description} />
                        </div>
                        <div className="column">
                            <label htmlFor="organizedBy"><strong>Organized By:</strong></label>
                            <select id="organizedBy" value={organizedBy} class="a form-inp" onChange={handleOrganizedByChange}>
                                <option value="">Select...</option>
                                <option value="AIM">AIM</option>
                                <option value="External">External</option>
                            </select>
                            {organizedBy === "External" && (
                                <input type="text" id="externalValue" className="form-inp" value={externalValue} onChange={handleExternalValueChange} />
                            )}
                        </div>
                    </div>
                </div>
                <div className="formContainer">
                    <div className="row">
                        <div className="column">
                            <label htmlFor="applStartDate"><strong>Application Start Date :</strong> </label>
                            <input type="date" name="applStartDate" value={applStartDate} className="form-inp" onChange={handleChange} />&nbsp;&nbsp;&nbsp;&nbsp;
                        </div>
                        <div className="column">
                            <label htmlFor="applEndDate"><strong>  End Date :</strong> </label>
                            <input type="date" name="applEndDate" value={applEndDate} className="form-inp" onChange={handleChange} />
                        </div>
                    </div>
                </div>
                <div className="formContainer">
                    <div className="row">
                        <div className="column">
                            <label htmlFor="crsStartDate"><strong>Course Start Date :</strong> </label>
                            <input type="date" name="crsStartDate" value={crsStartDate} className="form-inp" onChange={handleChange} />&nbsp;&nbsp;&nbsp;&nbsp;
                        </div>
                        <div className="column">
                            <label htmlFor="crsEndDate"><strong>End Date :</strong> </label>
                            <input type="date" name="crsEndDate" value={crsEndDate} className="form-inp" onChange={handleChange} />
                        </div>
                    </div>
                </div>
                <div className="formContainer">
                    <div className="row">
                        <div className="column">
                            <label><b>Eligibility: </b> </label>
                            </div>
                            </div>
                            </div>
                    <div className="formContainer">
                        <div className="row">
                            <div className="column">
                                <label htmlFor="classesFrom" className='a'><strong> Class From:</strong>   </label>
                                <select name="classesFrom" id="classesFrom" onChange={handleChange} value={classesFrom} className="a form-inp">
                                    <option value="Select..." >Select... </option>
                                    <option value="6th">6th</option><option value="7th">7th</option>
                                    <option value="8th">8th</option><option value="9th">9th</option>
                                    <option value="10th">10th</option><option value="11th">11th</option>
                                    <option value="12th">12th</option>
                                </select>
                            </div>
                            <div className="column">
                                <label htmlFor="classesTo" className='a'><strong> To:</strong></label>
                                <select name="classesTo" id="classesTo" onChange={handleChange} value={classesTo} className="a form-inp">
                                    <option value="Select..." >Select... </option>
                                    <option value="6th">6th</option><option value="7th">7th</option>
                                    <option value="8th">8th</option><option value="9th">9th</option>
                                    <option value="10th">10th</option><option value="11th">11th</option>
                                    <option value="12th">12th</option>
                                </select>
                            </div>
                        </div>
                    </div>
                <div className="formContainer">
                    <div className="row">
                        <label htmlFor="refLink"><strong>Reference link:</strong> </label>
                        <input type="text" id="refLink" name="refLink" className="d form-inp"  placeholder="Enter the Reference link" value={refLink} onChange={handleChange} />
                    </div>
                </div>
                <div className="formContainer">
                    <div className="row">
                        <div className="column">
                            <label htmlFor="Requirements"><strong>Requirements:</strong> </label>
                            {createArray(count).map((_, index) => {
                                return <><input key={index} index={index} name="requirements" id="Requirements" placeholder="Enter the Requirements" className="b form-inp"
                                    value={requirements[index] || ""}
                                    onChange={(event) => handleServiceChange(event, index)} /><br /><br /></>
                            })}{" "}
                            <div className="buttonsContainer formContainer">
                                <button className="submitbutton" onClick={increaseField}> + </button>
                                <button className="resetbutton" onClick={decreaseField}> - </button>
                            </div>
                        </div>
                        <div className="column">
                            <label htmlFor="courseTag"><strong>Course Tags:</strong> </label>
                            {newArray(tagcount).map((_, index) => {
                                return <><input key={index} index={index} name="courseTag" id="courseTag" placeholder="Enter the Course Tags" className="b form-inp"
                                    value={courseTag[index] || ""}
                                    onChange={(event) => handleRequestChange(event, index)} /><br /><br /></>
                            })}{" "}
                            <div className="buttonsContainer formContainer">
                                <button className="submitbutton" onClick={addField}> + </button>
                                <button className="resetbutton" onClick={removeField}> - </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="buttonsContainer formContainer">
                    <button type="submit" className="submitbutton" onClick={handleSubmit}> Submit </button>
                    <button type="reset" className="resetbutton" onClick={handleClick}> Reset </button>
                </div>
            </form>
        </div>
    );
}

export default CoursesForm;