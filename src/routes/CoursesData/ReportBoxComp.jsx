import React from "react";
import db, {deleteCourses} from "../../firebase/firestore";
import Popup from "../../components/Popup";
import {doc, arrayUnion, getDoc, setDoc} from "firebase/firestore";
import Select from 'react-select';

function ReportBox(props) {
    const [displayValue, setDisplayValue] = React.useState("none");
    const students = props.students;
    const schools = props.schools;
    const [school, setSchool] = React.useState("");
    const [selectedOptions, setSelectedOptions] = React.useState([]);
    const [assignToOpen, setAssignToOpen] = React.useState(false);
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

    async function handleDelete() {
        if(window.confirm("You are about to delete a Course")) {
            await props.deleteCourse(props.docId)
                .then(() => {
                    alert("Deleted successfully");
                })
                .catch(() => {
                    alert("An error occurred please try again later");
                })
        }
    }

    function handleEditClick() {
        window.location.href = "/courses-data/edit/"+ props.docId;
    }

    async function handleAssignTo(event) {
    if (selectedOptions.length === 0) {
        alert("Please select at least one student to assign the course.");
        return;
    }

    const docRef = doc(db, "coursesData", props.docId);
    const coursesData = await getDoc(docRef);

    const d = new Date();
    const currentDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

    const assignPromises = selectedOptions.map(async (selectedStudent) => {
        const assignToStudent = selectedStudent.value;
        const assignPathDocRef = doc(db, "studentData", assignToStudent, "coursesData", props.docId);
        const data = coursesData.data();

        data.status = [{ status: "Assigned", modifiedAt: currentDate }];

        const assignCoursePromise = setDoc(assignPathDocRef, data);
        const studentRef = doc(db, "studentData", assignToStudent);
        const updateStudentPromise = setDoc(studentRef, {
            currentCourse: assignPathDocRef
        }, { merge: true });

        return Promise.all([assignCoursePromise, updateStudentPromise]);
    });

    Promise.all(assignPromises)
        .then(() => {
            alert("Assigned!");
        })
        .catch(() => {
            alert("An error occurred while assigning the course. Please try again later.");
        });
}


    React.useEffect(() => {
        const temp = [];
        students.forEach(student => {
            if (student.school === school) {
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
                        {/* Student: <select name="studentsAssignSelect" onChange={e => setStudent(e.target.value)} value={student}>
                            <option value="" disabled={true}>SELECT</option>
                            {displayStudents.map((student, index) => {
                                return <option key={index} value={student.docId}>{`${student.name.firstName} ${student.name.lastName}`}</option>
                            })}
                        </select> */}
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
            <div className="name" onMouseOver={handleMouseOver}>{props.courseName}</div>
            <div className="boxContainer"> Description: {props.description}</div><br/>
            <div className="boxContainer"> Course Tag:
                {props.courseTag.map((coursesTag, index) => {
                    return <><br/><span key={index}>{index+1}.{coursesTag}</span></>
                })
                }</div><br/>
            <div className="boxContainer"> Organized By: {props.organizedBy}</div><br/>
            <div className="boxContainer"> Application Start Date: {props.applStartDate === "" ? "Not Mentioned" : props.applStartDate}</div><br/>
            <div className="boxContainer"> Application End Date: {props.applEndDate === "" ? "Not Mentioned" : props.applEndDate}</div><br/>
            <div className="boxContainer"> Course Start Date: {props.crsStartDate === "" ? "Not Mentioned" : props.crsStartDate}</div><br/>
            <div className="boxContainer"> Course End Date: {props.crsEndDate === "" ? "Not Mentioned" : props.crsEndDate}</div><br/>
            <div className="boxContainer"> Classes from: {props.classesFrom === "" ? "Not Mentioned" : props.classesFrom}</div><br/>
            <div className="boxContainer"> Classes to: {props.classesTo === "" ? "Not Mentioned" : props.classesTo}</div><br/>
            <div className="boxContainer"> Reference Links: <a href={props.refLink} target="_blank">{props.refLink}</a></div><br/>
            <div className="boxContainer">Requirements:
                {Array.isArray(props.requirements) ? props.requirements.map((requirement, index) => {
                    return <><br/><span key={index}>{index+1}.{requirement} </span></>
                }) : null}
            </div><br/>
            <div className="buttonsContainer" id={"btnContainer"+props.id} style={{display: displayValue}}>
                <button className="submitbutton deleteBtn" onClick={() => setAssignToOpen(true)}>Assign To</button>
                {
                    atob(localStorage.auth).split("-")[2] === "admin" ?
                        <>
                            <button className="editBtn resetbutton" onClick={handleEditClick}><i className="fa-solid fa-pencil"></i></button>
                            <button className="submitbutton deleteBtn" onClick={handleDelete}><i className="fa-solid fa-trash-can"></i></button>
                        </> : ""
                }
            </div>
        </div>
    );
}

export default ReportBox;
