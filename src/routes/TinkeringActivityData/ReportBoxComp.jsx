import React from "react";
import {doc, getDoc, setDoc} from "firebase/firestore";
import db from "../../firebase/firestore";
import Select from 'react-select';

const Popup = React.lazy(() => import("../../components/Popup"));

function ReportBox(props) {
    const role = atob(localStorage.auth).split("-")[2];
    console.log(role);
    const [displayValue, setDisplayValue] = React.useState("none");
    const students = props.students;
    const schools = props.schools;
    const [school, setSchool] = React.useState("");
    const [assignToOpen, setAssignToOpen] = React.useState(false);
    const [selectedOptions, setSelectedOptions] = React.useState([]);
    const [studentData, setStudentData] = React.useState([]);

    function handleMouseOver(event) {
        setDisplayValue("block");
    }

    function handleMouseOut(event) {
        setDisplayValue("none");
    }

    const formatOptionLabel = ({label, value}) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={selectedOptions.some(option => option.value === value)}
            style={{ marginRight: '8px' }}
            readOnly
          />
          <span>{label}</span>
        </div>
        )

    async function handleDelete(event) {
        console.log(props.docId);
        if(window.confirm("You are about to delete an activity")) {
            await props.deleteActivity(props.docId)
                .then(() => {
                    alert("Activity has been deleted.");
                })
                .catch(err => {
                    alert("An error has occurred please try again later.");
                })
        }
    }

    function handleEditClick() {
        window.location.href="/ta-data/edit/"+props.docId;
    }

    function getFileNameFromUrl(url, operation) {
        const urlObj = new URL(url);
        const pathSegments = urlObj.pathname.split('/');
        const encodedFileName = pathSegments[pathSegments.length - 1];
        let fileName = decodeURIComponent(encodedFileName);
        fileName = fileName.replace(`tAFiles/${operation}/`, '');
        return fileName;
    }

    function isValidUrl(string) {
        try {
          new URL(string);
          return true;
        } catch (err) {
          return false;
        }
    }

    // async function handleAssignTo(event) {
    //     const docRef = doc(db, "taData", props.docId);
    //     const taData = await getDoc(docRef);
    //     const assignToStudent = student;
    //     const assignPathDocRef = doc(db, "studentData", assignToStudent, "taData", props.docId);
    //     const data = taData.data();
    //     const d = new Date();
    //     const currentDate = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
    //     data.status = [{status: "Assigned", modifiedAt: currentDate}];
    //     await setDoc(assignPathDocRef, data);
    //     const studentRef = doc(db, "studentData", assignToStudent);
    //     await setDoc(studentRef, {
    //         currentTinkeringActivity: assignPathDocRef
    //     }, {merge: true});
    //     alert("Assigned!");
    // }

    async function handleAssignTo(event) {
        if (selectedOptions.length === 0) {
            alert("Please select at least one student to assign the Tinkering Activity.");
            return;
        }
    
        const docRef = doc(db, "taData", props.docId);
        const taData = await getDoc(docRef);
    
        const d = new Date();
        const currentDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    
        const assignPromises = selectedOptions.map(async (selectedStudent) => {
            const assignToStudent = selectedStudent.value;
            const assignPathDocRef = doc(db, "studentData", assignToStudent, "taData", props.docId);
            const data = taData.data();
    
            data.status = [{ status: "Assigned", modifiedAt: currentDate }];
    
            const assignTAPromise = setDoc(assignPathDocRef, data);
            const studentRef = doc(db, "studentData", assignToStudent);
            const updateStudentPromise = setDoc(studentRef, {
                currentCourse: assignPathDocRef
            }, { merge: true });
    
            return Promise.all([assignTAPromise, updateStudentPromise]);
        });
    
        Promise.all(assignPromises)
            .then(() => {
                alert("Assigned!");
            })
            .catch(() => {
                alert("An error occurred while assigning the TA. Please try again later.");
            });
    }

    React.useEffect(() => {
        const temp = [];
        students.forEach(student => {
            if(student.school === school) {
                temp.push(student);
            }
        });const sortedStudents = temp
        .sort((a, b) =>
            a.name.firstName.localeCompare(b.name.firstName) ||
            a.name.lastName.localeCompare(b.name.lastName)
        )
        .map((value, index) => ({
            value: value.docId,
            label: `${value.name.firstName} ${value.name.lastName}`,
        }));
    setStudentData(sortedStudents);
    setSelectedOptions([]);
    }, [school])
    let decodedAuth = atob(localStorage.auth);

    let split = decodedAuth.split("-");

    window.uid = split[0];
    window.email = split[1];
    window.role = split[2];

    return (
        <div className="box" id={props.id} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
             {assignToOpen ? (
                    <Popup trigger={assignToOpen} setPopupEnabled={setAssignToOpen} closeAllowed={true}>
                        <div className="container" style={{ fontSize: "1.2rem" }}>
                        Assign to School:
                        <select name="schoolSelect" onChange={e => setSchool(e.target.value)} value={school}>
                        <option value="" disabled={true}>SELECT</option>
                        {schools
                            .filter((school, index) => {
                            // Filter schools based on the role and email condition
                            if (window.role === "atlIncharge" && school.atlIncharge.email === window.email) {
                                return true;
                            } else if (window.role !== "atlIncharge") {
                                return true;
                            }
                            return false;
                            })
                            .sort((a, b) => a.name.localeCompare(b.name)) // Sort the schools alphabetically
                            .map((school, index) => (
                            <option key={index} value={school.name}>
                                {school.name}
                            </option>
                            ))}
                        </select>

                        <Select
                        isMulti
                        name="colors"
                        options={studentData}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={(value) => {setSelectedOptions(value)}}
                        value={selectedOptions}
                        formatOptionLabel={formatOptionLabel}
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        />
                            <br/>
                            <button className="submitbutton" onClick={handleAssignTo}>Assign</button>
                        </div>
                    </Popup>
              )  : ""
            }
            <div className="name" onMouseOver={handleMouseOver} style={{fontSize: "1.5rem"}}>{props.taName}</div>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>TA ID:</span> {props.taID}</div>
            <br/>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>Introduction:</span> {props.intro}</div>
            {
                (props.subject !== undefined) && (props.topic !== undefined) && (props.subTopic !== undefined) ?
                <>
                    <br/>
                    <div className="boxContainer"><span style={{fontWeight: "600"}}>Subject:</span> {props.subject} - {props.topic} - {props.subTopic}</div>
                </>
                : ""
            }
            <br/>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>Goals:</span> <br/> {
                props.goals.map((goal, index) => {
                    return <span key={index}>{index+1}. {goal} <br/></span>
                })
            }
            </div>
            <br/>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>Materials:</span> <br/> {
                props.materials.map((material, index) => {
                    return <span key={index}>{index+1}. {material} <br/></span>
                })
            }
            </div>
            <br/>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>Instructions:</span> <br/> {
                props.instructions.map((instruction, index) => {
                    return <span key={index}>{index+1}. {instruction} <br/></span>
                })
            }
            </div>
            <br/>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>Observation:</span> <br/> {
                props.assessment.map((assessment, index) => {
                    return <span key={index}>{index+1}. {assessment} <br/></span>
                })
            }
            </div>
            <br/>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>Tips:</span> <br/> {
                props.tips.map((tip, index) => {
                    return <span key={index}>{index+1}. {tip} <br/></span>
                })
            }
            </div>
            <br/>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>Extensions:</span> <br/> {
                props.extensions.map((extension, index) => {
                    return <span key={index}>{index+1}. {extension} <br/></span>
                })
            }</div>
            <br/>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>Resources:</span> <br/> {
                props.resources.map((resource, index) => {
                    return <span key={index}>{index+1}. {isValidUrl(resource) ? <a href={resource} target="_blank" rel="noreferrer">{getFileNameFromUrl(resource, props.taName)}</a> : resource} <br/></span>
                })
            }
            </div>
            <div className="buttonsContainer" id={"btnContainer"+props.id} style={{display: displayValue}}>
                <button className="submitbutton deleteBtn" onClick={() => setAssignToOpen(true)}>Assign To</button>
                {
                    atob(localStorage.auth).split("-")[2] === "admin" ?
                <>
                <button className="editBtn resetbutton" onClick={handleEditClick}><i className="fa-solid fa-pencil"></i></button>
                <button className="submitbutton deleteBtn" onClick={handleDelete}><i className="fa-solid fa-trash-can"></i></button>
                </>: ""
                }
            </div>
        </div>
    );
}

export default ReportBox;
