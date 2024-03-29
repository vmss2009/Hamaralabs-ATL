import React from "react";
import {doc, onSnapshot, query} from "firebase/firestore";

import {updateCourse, db} from "../../firebase/firestore";
import {useParams} from "react-router-dom";
import Sidebar from "../../components/Sidebar";

function CoursesEditForm() {
    const {courseId} = useParams();

    const [courseName, setCourseName] = React.useState("");
    const [courseTag, setCourseTag] = React.useState([]);
    const [description, setDescription] = React.useState("");
    const [applStartDate, setApplStartDate] = React.useState("");
    const [applEndDate, setApplEndDate] = React.useState("");
    const [crsStartDate, setCrsStartDate] = React.useState("");
    const [crsEndDate, setCrsEndDate] = React.useState("");
    const [organizedBy, setOrganizedBy] = React.useState("");
    const [classesFrom, setclassesFrom] = React.useState("");
    const [classesTo, setclassesTo] = React.useState("");
    const [refLink, setrefLink] = React.useState("");
    const [requirements, setRequirements] = React.useState([]);

    const [courseTagCount, setCourseTagCount] = React.useState(0);
    const [externalValue, setExternalValue] = React.useState("");
    const [requirementsCount, setRequirementsCount] = React.useState(0);

    function clearForm() {
    }

    function hasDuplicates(array) {
        var valuesSoFar = Object.create(null);
        for (var i = 0; i < array.length; ++i) {
            var value = array[i];
            if (value in valuesSoFar) {
                return true;
            }
            valuesSoFar[value] = true;
        }
        return false;
    }

    function handleChange(event) {
        if(event.target.name === "courseName"){
            setCourseName(event.target.value);
        }  else if(event.target.name === "description") {
            setDescription(event.target.value);
        }  else if(event.target.name === "applStartDate") {
            setApplStartDate(event.target.value);
        }  else if(event.target.name === "applEndDate") {
            setApplEndDate(event.target.value);
        }  else if(event.target.name === "crsStartDate") {
            setCrsStartDate(event.target.value);
        }  else if(event.target.name === "crsEndDate") {
            setCrsEndDate(event.target.value);
        }  else if(event.target.name === "classesFrom") {
            setclassesFrom(event.target.value);
        }  else if(event.target.name === "classesTo") {
            setclassesTo(event.target.value);
        }  else if(event.target.name === "refLink") {
            setrefLink(event.target.value);
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
        if(hasDuplicates(courseTag)) {
            alert("Data has duplicate values!");
        } else {
            await updateCourse(courseId, courseName, courseTag, description,(organizedBy === "AIM" ? organizedBy : externalValue), applStartDate, applEndDate, crsStartDate, crsEndDate, classesFrom, classesTo, refLink, requirements)
                .then(() => {
                    alert("Updated successfully!!");
                })
                .catch(() => {
                    alert("Updating data failed!")
                });
        }
    }

    function handleClick(event) {
        if(event.target.type === "reset") {
            clearForm();
        }
    }

    function createArray(maxCount) {
        const arr = [];
        for (let i = 0; i < maxCount; i++) {
            arr.push(i);
        }
        return arr;
    }

    function increaseField(event) {
        event.preventDefault();
        const classes = event.target.className.split(" ");
        if(classes.includes("courseTagAdd")) {
            setCourseTagCount(courseTagCount+1);
        } else if(classes.includes("requirementsAdd")) {
            setRequirementsCount(requirementsCount+1);
        }
    }

    function decreaseField(event) {
        event.preventDefault();
        const classes = event.target.className.split(" ");
        if(classes.includes("courseTagRemove")) {
            if(courseTagCount !== 0) {
                courseTag.pop();
                setCourseTagCount(courseTagCount-1);
            }
        } else if(classes.includes("requirementsRemove")) {
            if(requirementsCount !== 0) {
                requirements.pop();
                setRequirementsCount(requirementsCount-1);
            }
        }
    }

    function mfHandleChangeCourseTag(event) {
        const index = Number(event.target.getAttribute("id").replace("courseTag",""));
        const temp = [...courseTag];
        temp[index] = event.target.value;
        setCourseTag(temp);
    }

    function mfHandleChangeRequirements(event) {
        const index = Number(event.target.getAttribute("id").replace("requirements",""));
        const temp = [...requirements];
        temp[index] = event.target.value;
        setRequirements(temp);
    }

    React.useEffect(() => {
        const q = query(doc(db, "coursesData", courseId));
        onSnapshot(q, (snapshot) => {
            setCourseName(snapshot.data().courseName);
            setCourseTag(snapshot.data().courseTag);
            setCourseTagCount(snapshot.data().courseTag.length);
            setDescription(snapshot.data().description);
            setOrganizedBy(snapshot.data().organizedBy);
            setExternalValue(snapshot.data().organizedBy);
            setApplStartDate(snapshot.data().applicationStartDate);
            setApplEndDate(snapshot.data().applicationEndDate);
            setCrsStartDate(snapshot.data().crsStartDate);
            setCrsEndDate(snapshot.data().crsEndDate);
            setclassesFrom(snapshot.data().classesFrom);
            setclassesTo(snapshot.data().classesTo);
            setrefLink(snapshot.data().refLink);
            setRequirements(snapshot.data().requirements);
            setRequirementsCount(snapshot.data().requirements.length);
        });
    }, []);

    let decodedAuth = atob(localStorage.auth);

    let split = decodedAuth.split("-");

    window.uid = split[0];
    window.email = split[1];
    window.role = split[2];

    document.title = "Courses Data Edit | Digital ATL";

    return (
        <div className="container" id="mobilescreen">
            <Sidebar />
            <link rel="stylesheet" href="/CSS/school.css" />
            <form>
                <div className="school-title">Courses Registration Form</div>
                <hr />
                <div className="formContainer">
                <div className="row">
                <div className="column">
                    <label htmlFor="courseName"><strong>Name:</strong> </label>
                    <input type="text" name="courseName" id="courseName" className="form-inp" placeholder="Enter the CourseName" value={courseName} onChange={handleChange}/>
                </div>
                </div>
                </div>
                <div className="formContainer">
                <div className="row">
                <div className="column">
                    <label htmlFor="description" ><strong>Description:</strong> </label>
                    <br/>
                    <textarea id="description" name="description"  cols="18" rows="4" className="c form-inp" placeholder="Enter the Description " onChange={handleChange} value={description} />
                </div>
                <div className="column">
                    <label htmlFor="organizedBy"><strong>Organized By:</strong></label>
                    <select id="organizedBy" value={organizedBy} class = 'a' className="form-inp" onChange={handleOrganizedByChange}>
                        <option value="">Select...</option>
                        <option value="AIM">AIM</option>
                        <option value="External">External</option>
                    </select>
                    {organizedBy === "External" && (
                        <input type="text" id="externalValue" className="form-inp"value={externalValue} onChange={handleExternalValueChange}/>
                    )}
                </div>
                </div>
                </div>
                <div className="formContainer">
                <div className="row">
            <div className="column">
                    <label htmlFor="applStartDate"><strong>Application Start Date :</strong>  </label>
                    <input type="date" name="applStartDate" value={applStartDate} className="form-inp" onChange={handleChange}/>&nbsp;&nbsp;&nbsp;&nbsp;
                    <label htmlFor="applEndDate"><strong> End Date : </strong></label>
                    <input type="date" name="applEndDate" value={applEndDate} className="form-inp" onChange={handleChange}/>
                </div>
                <div className="column">
                    <label htmlFor="crsStartDate"><strong>Course Start Date : </strong> </label>
                    <input type="date" name="crsStartDate" value={crsStartDate} className="form-inp" onChange={handleChange}/>&nbsp;&nbsp;&nbsp;&nbsp;
                    <label htmlFor="crsEndDate"><strong> End Date :</strong></label>
                    <input type="date" name="crsEndDate" value={crsEndDate} className="form-inp" onChange={handleChange}/>
                </div>
                </div>
                </div>
                <div className="formContainer">
                    <label><b>Eligibility: </b> </label><br/>
                    </div>
                    <div className="formContainer">
                    <div className="row">
            <div className="column">
                        <label htmlFor="classesFrom" className='a'> <strong>Class From: </strong>   </label>
                        <select name="classesFrom" id="classesFrom" onChange={handleChange}  value={classesFrom} class="a form-inp">
                            <option value="Select..." >Select... </option>
                            <option value="6th">6th</option><option value="7th">7th</option>
                            <option value="8th">8th</option><option value="9th">9th</option>
                            <option value="10th">10th</option><option value="11th">11th</option>
                            <option value="12th">12th</option>
                        </select>
                        </div>
                        <div className="column">
                        <label htmlFor="classesTo" className ='a'> <strong>To:</strong></label>
                        <select name="classesTo" id="classesTo" onChange={handleChange}  value={classesTo} class="a form-inp">
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
                    <label htmlFor="refLink"><strong>Reference link:</strong></label>
                    <input type = "text" id="refLink" name="refLink" className="d form-inp" placeholder="Enter the Reference link " value={refLink} onChange={handleChange}/>
                </div>
                <div className="formContainer">
                <div className="row">
            <div className="column">
                    <label><strong>Requirements:</strong></label>
                    <div className="multiForm">
                        {
                            createArray(requirementsCount).map((_, index) => {
                                return <div key={index}>
                                    <input name={"requirements"+index} id={"requirements"+index} placeholder="Enter the Requirements" className="b form-inp" value={requirements[index]} onChange={mfHandleChangeRequirements} style={{marginTop: "1rem"}}/>
                                    <br/>
                                </div>
                            })
                        }
                    </div>
                    <button className="submitbutton requirementsAdd" onClick={increaseField}>+</button>
                    <button className="resetbutton requirementsRemove" onClick={decreaseField}>-</button>
                </div>
                <div className="column">
                    <label><strong>Course Tags:</strong> </label>
                    <div className="multiForm">
                        {
                            createArray(courseTagCount).map((_, index) => {
                                return <div key={index}>
                                    <input name={"courseTag"+index} id={"courseTag"+index} placeholder="Enter the Course Tags " className="b form-inp" value={courseTag[index]} onChange={mfHandleChangeCourseTag} style={{marginTop: "1rem"}}/>
                                    <br/>
                                </div>
                            })
                        }
                    </div>
                    <button className="submitbutton courseTagAdd" onClick={increaseField}>+</button>
                    <button className="resetbutton courseTagRemove" onClick={decreaseField}>-</button>
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
export default CoursesEditForm;