import React from "react";
import {addStudent, db, getSchools, getTags} from "../../firebase/firestore";
import Sidebar from "../../components/Sidebar";
import lodash from "lodash";
import readXlsxFile from "read-excel-file";
import {doc} from "firebase/firestore";

function StudentForm() {
    const [schools, setSchools] = React.useState([]);
    const [tags, setTags] = React.useState([]);
    const [tagsCount, setTagsCount] = React.useState(0);
    const [selectedTags, setSelectedTags] = React.useState([]);

    const [schoolVal, setSchoolVal] = React.useState("");
    const [fname, setFname] = React.useState("");
    const [lname, setLname] = React.useState("");
    const [gender, setGender] = React.useState("Male");
    const [classVal, setClassVal] = React.useState("");
    const [section, setSection] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [whatsappNo, setWhatsappNo] = React.useState("");
    const [aspiration, setAspiration] = React.useState("");
    const [currentExperiment, setCurrentExperiment] = React.useState("");
    const [isLeader, setIsLeader] = React.useState(false);
    const [comments, setComments] = React.useState("");
    const [file, setFile] = React.useState(null);

    function clearForm() {
        setFname("");
        setLname("");
        setClassVal("");
        setSection("");
        setEmail("");
        setWhatsappNo("");
        setAspiration("");
        setCurrentExperiment("");
        setComments("");
        setSelectedTags([]);
        setTagsCount(1);
    }

    function handleChange(event) {
        if(event.target.name === "fname") {
            setFname(event.target.value);
        } else if(event.target.name === "lname") {
            setLname(event.target.value);
        } else if(event.target.name === "gender") {
            setGender(event.target.value);
        } else if(event.target.name === "class") {
            setClassVal(event.target.value);
        } else if(event.target.name === "section") {
            setSection(event.target.value);
        } else if(event.target.name === "email") {
            setEmail(event.target.value);
        } else if(event.target.name === "whatsappNo") {
            setWhatsappNo(event.target.value);
        } else if(event.target.name === "aspiration") {
            setAspiration(event.target.value);
        } else if(event.target.name === "currentExperiment") {
            setCurrentExperiment(event.target.value);
        } else if(event.target.name === "schoolName") {
            setSchoolVal(event.target.value);
        } else if(event.target.name === "isLeader") {
            setIsLeader(event.target.checked);
        } else if (event.target.name === "comments") {
            setComments(event.target.value);
        } else if (event.target.name.startsWith("tags")) {
            const index = parseInt(event.target.name.replace("tags", ""));
            const newSelectedTags = [...selectedTags];
            const newTag = event.target.value;

            if (!newSelectedTags.includes(newTag)) {
                newSelectedTags[index] = newTag;
                setSelectedTags(newSelectedTags);
            } else {
                alert("Duplicate tag selected. Please choose a different tag.");
            }
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (fname === "") {
            alert("Please fill all the fields!");
        } else {
            let tempFName = lodash.capitalize(fname);
            let tempLName = lodash.capitalize(lname);

            const tagRefs = selectedTags.map(tagId => doc(db, "tagData", tagId));

            try {
                await addStudent(tempFName, tempLName, schoolVal, gender, classVal, section, aspiration, isLeader, comments, email, tagRefs);

                alert("Added Successfully!");
                clearForm();
                window.location.href = "/student-data/view";
            } catch (error) {
                alert("Couldn't add the data. Please try again!");
                console.error("Error adding single student:", error);
            }
        }
    }

    function handleClick(event) {
        if(event.target.type === "reset") {
            clearForm();
        }
    }

    function onFileSelect(event) {
        setFile(event.target.files[0]);
    }

    async function addFromXlsx(event) {
        event.preventDefault();

        if (file !== null) {
            try {
                const fileData = await readXlsxFile(file);

                for (let i = 1; i < fileData.length; i++) {
                    const currentFile = fileData[i];
                    const currentSchoolVal = String(currentFile[0]);
                    const currentFname = String(currentFile[1]);
                    const currentLname = String(currentFile[2]);
                    const currentGender = String(currentFile[3]);
                    const currentClassVal = String(currentFile[4]);
                    const currentSection = String(currentFile[5]);
                    const currentAspiration = String(currentFile[6]);
                    const currentIsLeaderValue = String(currentFile[7]);
                    const currentComments = String(currentFile[8]);
                    const currentIsLeader = currentIsLeaderValue === "Yes" || currentIsLeaderValue === "YES" || currentIsLeaderValue === "yes";
                    const currentEmail = String(currentFile[9]);
                    const currentTags = []; // Add logic to handle tags from Excel if needed
                    await addStudent(
                        currentFname,
                        currentLname,
                        currentSchoolVal,
                        currentGender,
                        currentClassVal,
                        currentSection,
                        currentAspiration,
                        currentIsLeader,
                        currentComments,
                        currentEmail,
                        currentTags
                    );
                }

                alert("Added all students from the Excel sheet");
                console.log(event);
                clearForm();
            } catch (error) {
                alert("Error uploading data from the file. Please try again!");
            }
        } else {
            alert("Please select a file!");
        }
    }

    let decodedAuth = atob(localStorage.auth);

    let split = decodedAuth.split("-");

    window.uid = split[0];
    window.email = split[1];
    window.role = split[2];

    React.useEffect(() => {
        getSchools()
            .then((docSnaps) => {
                const dataArray = [];

                docSnaps.forEach((docSnap) => {
                    dataArray.push(docSnap.data());
                });

                setSchools(dataArray);
            })
            .catch((err) => {
                window.location.reload();
            });

        getTags()
            .then((docSnaps) => {
                const dataArray = [];

                docSnaps.forEach((docSnap) => {
                    const data = docSnap.data();
                    if (data.role === window.role) {
                        dataArray.push({ id: docSnap.id, tagName: data.tagName });
                    }
                });

                setTags(dataArray);
            })
            .catch((err) => {
                console.error("Error fetching tags:", err);
            });
    }, []);

    document.title = "Student Data Form | Digital ATL";

    function increaseField(event) {
        event.preventDefault();
        setTagsCount(tagsCount + 1);
    }

    function decreaseField(event) {
        event.preventDefault();
        if (tagsCount > 0) {
            setTagsCount(tagsCount - 1);
            setSelectedTags(selectedTags.slice(0, -1));
        }
    }

    return (
        <div className="container">
            <Sidebar />
            <link rel="stylesheet" href="/CSS/school.css" />
            <form>
                <div className="school-title"> Student data Form </div>
                <div className="formContainer">
                    <label htmlFor="bulk upload"><strong>Bulk Upload</strong></label>
                    <div className="row">
                        <div className="column">
                            <label htmlFor="excelSelect" className="resetbutton">
                                <input type="file" name="excelSelect" id="excelSelect" onChange={onFileSelect} accept=".xlsx" /></label>
                        </div>
                        <div className="column">
                            <button className="submitbutton" onClick={addFromXlsx}> Add from this file </button>
                        </div>
                    </div>
                </div>
                <div className="formContainer">
                    <div className="row">
                        <div className="column">
                            <label htmlFor="schoolName"><strong>School</strong></label>
                            <select name="schoolName" id="schoolName" className="form-inp" onChange={handleChange}>
                                <option value=""> --- Select School ---</option>
                                {
                                    window.role === "atlIncharge" ? (
                                        schools.map((school, index) => {
                                            if (school.atlIncharge.email === window.email) {
                                                return (
                                                    <option key={index} value={school.name}>{school.name}</option>
                                                );
                                            }
                                            return null;
                                        })
                                    ) : (
                                        <>
                                            <option value=""> --- Select School ---</option>
                                            {
                                                schools.map((school, index) => (
                                                    <option key={index} value={school.name}>{school.name}</option>
                                                ))
                                            }
                                        </>
                                    )
                                }
                            </select>
                        </div>
                    </div>
                </div>
                <div className="formContainer">
                    <div className="row">
                        <div className="column">
                            <label htmlFor="firstName"><strong>First Name</strong> </label>
                            <input type="text" name="fname" className="form-inp" placeholder="Enter your first Name" value={fname} id="firstName" autoComplete="off" onChange={handleChange} />
                        </div>
                        <div className="column">
                            <label htmlFor="lastName"><strong>Last Name</strong> (Family Name or Surname)</label>
                            <input type="text" name="lname" className="form-inp" placeholder="Enter your last Name" value={lname} id="lastName" autoComplete="off" onChange={handleChange} />
                        </div>
                    </div>
                </div>
                <div className="formContainer">
                    <div className="row">
                        <div className="column">
                            <label htmlFor="gender"><strong>Gender</strong> </label>
                            <select name="gender" id="gender" className="form-inp" placeholder="Enter your gender" value={gender} onChange={handleChange}>
                                <option value="Male" selected={true}>Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div className="column">
                            <label htmlFor="aspiration"><strong>Aspiration</strong> </label>
                            <input type="text" className="form-inp" name="aspiration" id="aspiration" placeholder="Enter your aspiration" value={aspiration} onChange={handleChange} />
                        </div>
                    </div>
                </div>
                <div className="formContainer">
                    <div className="row">
                        <div className="column">
                            <label htmlFor="class"><strong>Class</strong></label>
                            <select name="class" id="class" className="form-inp" placeholder="Enter your class" value={classVal} onChange={handleChange}>
                                <option value="">--Select--</option>
                                <option value="6">6th</option>
                                <option value="7">7th</option>
                                <option value="8">8th</option>
                                <option value="9">9th</option>
                                <option value="10">10th</option>
                                <option value="11">11th</option>
                                <option value="12">12th</option>
                                <option value="Graduation">Graduation</option>
                            </select>
                        </div>
                        <div className="column">
                            <label htmlFor="section"><strong>Section</strong> </label>
                            <input type="text" className="form-inp" name="section" id="section" placeholder="Enter your section" value={section} onChange={handleChange} />
                        </div>
                    </div>
                </div>
                <div className="formContainer">
                    <div className="row">
                        <div className="column">
                            <label htmlFor="email"><strong>Email ID:</strong> </label>
                            <input type="email" className="form-inp" name="email" id="email" value={email} placeholder="Enter your Email" autoComplete="off" onChange={handleChange} />
                        </div>
                        <div className="column">
                            <label htmlFor="isLeader" class="isLeader"><strong>Is team leader</strong></label>
                            <input type="checkbox" class="checked" name="isLeader"  id="isLeader" onChange={handleChange} />
                        </div>
                    </div>

                </div>
                <div className="formContainer">
                    <div className="row">
                        <label htmlFor="comments"><strong>Comments</strong> (Skills, Courses, Competitions etc.)</label>
                        <input type="text" className="form-inp" name="comments" id="comments" placeholder="Enter your comments" value={comments} onChange={handleChange} />
                    </div>
                </div>
                <div className="formContainer">
                    <div className="row">
                        <div className="column">
                            <label><strong>Tags:</strong> </label>
                            <div className="multiForm">
                                {
                                    Array.from({length: tagsCount}).map((_, index) => (
                                        <div key={index}>
                                            <select name={`tags${index}`} id={`tags${index}`} className="form-inp"
                                                    onChange={handleChange} value={selectedTags[index] || ""}
                                                    style={{marginTop: "1rem"}}>
                                                <option value="">--Select Tag--</option>
                                                {tags.map((tag, idx) => (
                                                    <option key={idx} value={tag.id}>{tag.tagName}</option>
                                                ))}
                                            </select>
                                            <br/>
                                        </div>
                                    ))
                                }
                            </div>
                            <button className="submitbutton tagsAdd" onClick={increaseField}>+</button>
                            <button className="resetbutton tagsRemove" onClick={decreaseField}>-</button>
                        </div>
                    </div>
                </div>
                <div className="buttonsContainer formContainer">
                    <button type="submit" className="submitbutton" onClick={handleSubmit}>Add</button>
                    <button type="reset" className="resetbutton" onClick={handleClick}>Reset</button>
                </div>
            </form>
        </div>
    )
}

export default StudentForm;