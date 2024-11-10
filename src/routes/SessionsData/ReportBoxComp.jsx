import React from "react";
import {doc, getDoc, setDoc} from "firebase/firestore";
import Select from 'react-select';
import db from "../../firebase/firestore";

const Popup = React.lazy(() => import("../../components/Popup"));

function ReportBox(props) {
    const [displayValue, setDisplayValue] = React.useState("none");
    const [assignToOpen, setAssignToOpen] = React.useState(false);
    const [selectedOptions, setSelectedOptions] = React.useState([]);
    const [school, setSchool] = React.useState("");
    const [checkBox, setCheckBox] = React.useState(null);
    const [studentData, setStudentData] = React.useState([]);

    const students = props.students;
    const schools = props.schools;

    let editUrl = "/session-data/edit?id=" + props.id;
    let deleteUrl = "/session-data/delete?id=" + props.id;

    let decodedAuth = atob(localStorage.auth);

    let split = decodedAuth.split("-");

    window.uid = split[0];
    window.email = split[1];
    window.role = split[2];

    React.useEffect(() => {
        const temp = [];
        students.forEach(student => {
            if(student.school === school) {
                temp.push(student);
            }
        });
        const sortedStudents = temp
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
    }, [school]);

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

    function handleMouseOver(event) {
        setDisplayValue("block");
    }

    function handleMouseOut(event) {
        setDisplayValue("none");
    }

    async function handleAssignTo() {
        if (selectedOptions.length === 0) {
            alert("Please select at least one student to assign the Tinkering Activity.");
            return;
        }
    
        const docRef = doc(db, "sessionData", props.docId);
        const sessionData = await getDoc(docRef);
    
        const d = new Date();
        const currentDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    
        const assignPromises = selectedOptions.map(async (selectedStudent) => {
            const assignToStudent = selectedStudent.value;
            const assignPathDocRef = doc(db, "studentData", assignToStudent, "sessionData", props.docId);
            const data = sessionData.data();
    
            data.status = [{ status: "Assigned", modifiedAt: currentDate }];
            data.paymentRequired = checkBox;
            data.paymentInfo = {
                status: "pending",
                amount: 50,
                merchantTransactionId: "",
            }

            const assignSessionPromise = setDoc(assignPathDocRef, data);
            const studentRef = doc(db, "studentData", assignToStudent);
            const updateStudentPromise = setDoc(studentRef, {
                currentCourse: assignPathDocRef
            }, { merge: true });
    
            return Promise.all([assignSessionPromise, updateStudentPromise]);
        });

        setSelectedOptions([]);
    
        Promise.all(assignPromises)
            .then(() => {
                alert("Assigned!");
            })
            .catch(() => {
                alert("An error occurred while assigning the Session. Please try again later.");
            });
    }

    async function handleDelete(event) {
        console.log(props.docId);
        if(window.confirm("You are about to delete a session")) {
            await props.deleteSession(props.docId)
                .then(() => {
                    alert("Session has been deleted.");
                    window.location.reload();
                })
                .catch(err => {
                    alert("An error has occurred please try again later.");
                })
        }
    }

    function handleEditClick() {
        window.location.href = "/session-data/edit/"+props.docId;
    }

    return (
        <div className="box" id={props.id} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
            <div className="overlay"></div>
            {assignToOpen ? (
                    <Popup trigger={assignToOpen} setPopupEnabled={setAssignToOpen} closeAllowed={true}>
                        <div className="container" style={{ fontSize: "1.2rem" }}>
                        Assign to School:
                        <select name="schoolSelect" onChange={e => {setCheckBox(schools[e.target.options.selectedIndex].isATL ? false : true); setSchool(e.target.value)}} value={school}>
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

                        {
                            checkBox !== null && window.role === "admin" ? 
                                <>
                                <br/>
                                <label>
                                    Payment required ? &nbsp;
                                    <input type={"checkbox"} defaultChecked={checkBox} onChange={(e) => {setCheckBox(e.target.checked)}}/></label>
                                </>
                            : ""
                        }
                        
                        <br/>
                        <button className="submitbutton" onClick={handleAssignTo}>Assign</button>
                        </div>
                    </Popup>
              )  : ""
            }
            <div className="boxContainer"><span style={{fontWeight: "600"}}>Subject:</span> {props.subject}</div>
            <br/>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>Topic:</span> {props.topic}</div>
            <br/>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>Subtopic:</span> {props.subTopic}</div>
            <br/>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>Date and time:</span> {new Date(props.timestamp).toLocaleDateString()} {new Date(props.timestamp).toLocaleTimeString()}</div>
            <br/>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>Duration:</span> {props.duration} hours</div>
            <br/>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>Type:</span> {props.type}</div>
            <br/>
            <div className="boxContainer"><span style={{fontWeight: "600"}}>Details:</span> {props.details}</div>
            <br/>
            <div className="boxContainer">
            <span style={{fontWeight: "600"}}>Prerequisites:</span>
            {props.prerequisites.map((prerequisite, index) => {
                if(props.prerequisites.length > 2) {
                    if(index === props.prerequisites.length - 1) {
                        return "and "+prerequisite;
                    } else if(index === props.prerequisites.length - 2) {
                        return prerequisite+" ";
                    } else {
                        return prerequisite+", "
                    }
                } else {
                    if (props.prerequisites.length === 1) {
                        return prerequisite;
                    } else {
                        if(index === props.prerequisites.length - 1) {
                            return " and "+prerequisite;
                        } else {
                            return prerequisite+" "
                        }
                    
                    }
                }
            })}
            </div>
            <div className="buttonsContainer" id={"btnContainer"+props.id} style={{display: displayValue}}>
                <button className="submitbutton deleteBtn" onClick={() => setAssignToOpen(true)}>Assign To</button>
                <button className="editBtn resetbutton" data-url={editUrl} onClick={handleEditClick}><i className="fa-solid fa-pencil"></i></button>
                <button className="submitbutton deleteBtn" data-url={deleteUrl} onClick={handleDelete}><i className="fa-solid fa-trash-can"></i></button>
            </div>
        </div>
    );
}

export default ReportBox;
