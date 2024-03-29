import React from "react";
import db, { deleteComReg } from "../../firebase/firestore";
import { arrayUnion, doc, setDoc, getDoc } from "firebase/firestore";
import { listAll, getStorage, ref, getDownloadURL } from "firebase/storage";
import Popup from "../../components/Popup";
import Select from 'react-select';

function ReportBox(props) {
    const [displayValue, setDisplayValue] = React.useState("none");
    const students = props.students;
    const schools = props.schools;
    const [student, setStudent] = React.useState("");
    const [school, setSchool] = React.useState("");
    const [displayStudents, setDisplayStudents] = React.useState([]);
    const [assignToOpen, setAssignToOpen] = React.useState(false);
    const [fileLinks, setFileLinks] = React.useState([]); // Store file download links
    const [selectedOptions, setSelectedOptions] = React.useState([]);
    const [studentData, setStudentData] = React.useState([]);

    // Function to fetch and set download links for files in the competition folder
    const fetchFileLinks = async (competitionName) => {
        const storage = getStorage();
        const storageRef = ref(storage, `competitionFiles/${competitionName}`);
        const files = await listAll(storageRef);
        const links = await Promise.all(
            files.items.map(async (file) => {
                const downloadURL = await getDownloadURL(file);
                return { name: file.name, url: downloadURL };
            })
        );
        setFileLinks(links);
    };

    // Fetch file links when the component mounts or competition name changes
    React.useEffect(() => {
        if (props.competName) {
            fetchFileLinks(props.competName);
        }
    }, [props.competName]);

    function handleMouseOver(event) {
        setDisplayValue("block");
    }

    function handleMouseOut(event) {
        setDisplayValue("none");
    }

    const formatOptionLabel = ({ label, value }) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
                type="checkbox"
                checked={selectedOptions.some(option => option.value === value)}
                style={{ marginRight: '8px' }}
                readOnly
            />
            <span>{label}</span>
        </div>
    );

    async function handleDelete() {
        if (window.confirm("You are about to delete a competition")) {
            try {
                await props.deleteCompetition(props.docId);
                alert("Deleted successfully");
            } catch (error) {
                alert("An error occurred please try again later");
            }
        }
    }

    function handleEditClick() {
        window.location.href = "/competition-data/edit/" + props.docId;
    }

    function formatDate(dateString) {
        if (!dateString) {
            return ""; // Return an empty string for empty date values
        }

        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    async function handleAssignTo(event) {
        if (selectedOptions.length === 0) {
            alert("Please select at least one student to assign the competition.");
            return;
        }

        const docRef = doc(db, "competitionData", props.docId);
        const competitionData = await getDoc(docRef);

        const d = new Date();
        const currentDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

        const assignPromises = selectedOptions.map(async (selectedStudent) => {
            const assignToStudent = selectedStudent.value;
            const assignPathDocRef = doc(db, "studentData", assignToStudent, "competitionData", props.docId);
            const data = competitionData.data();

            data.status = [{ status: "Assigned", modifiedAt: currentDate }];

            const assignCompetitionPromise = setDoc(assignPathDocRef, data);
            const studentRef = doc(db, "studentData", assignToStudent);
            const updateStudentPromise = setDoc(studentRef, {
                currentCompetition: assignPathDocRef
            }, { merge: true });

            return Promise.all([assignCompetitionPromise, updateStudentPromise]);
        });

        try {
            await Promise.all(assignPromises);
            alert("Assigned!");
        } catch (error) {
            console.error("An error occurred while assigning the competition:", error);
            alert("An error occurred while assigning the competition. Please try again later.");
        }
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
       // {/*Nageswar 6.8*/}
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
                         {/*Nageswar 6.8*/}
                        {/* Student: <select name="studentsAssignSelect" onChange={e => setStudent(e.target.value)} value={student}>
                            <option value="" disabled={true}>SELECT</option>
                            {displayStudents.map((student, index) => {
                                return <option key={index} value={student.docId}>{`${student.name.firstName} ${student.name.lastName}`}</option>
                            })}
                        </select> */}
                         {/*Nageswar 6.8*/}
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
            <div className="name" onMouseOver={handleMouseOver}>{props.competName}</div>
            <div className="boxContainer"><strong>Description:</strong>{props.description}</div><br />
            <div className="boxContainer"> <strong>Organized By:</strong> {props.organizedBy}</div><br />
            <div className="boxContainer"><strong>Application Start Date:</strong>{formatDate(props.applStartDate)}</div><br />
            <div className="boxContainer"><strong> Application End Date: </strong> {formatDate(props.applEndDate)}</div><br />
            <div className="boxContainer"> <strong>Competition Start Date:</strong>{formatDate(props.compStartDate)}</div><br />
            <div className="boxContainer"><strong> Competition End Date: </strong>{formatDate(props.compEndDate)}</div><br />
            <div className="boxContainer"> <strong>Classes from:</strong>{props.classesFrom}</div><br />
            <div className="boxContainer"><strong>Classes to: </strong>{props.classesTo}</div><br />
            <div className="boxContainer"> <strong>ATL Schools:</strong> {(props.atlSchools) ? "Yes" : "No"}</div><br />
            <div className="boxContainer"> <strong>Non ATL Schools:</strong> {(props.nonAtlSchools) ? "Yes" : "No"}</div><br />
            <div className="boxContainer"> <strong>Individual: </strong>{(props.individual) ? "Yes" : "No"}</div><br />
            <div className="boxContainer"> <strong>Team:</strong>{(props.team) ? "Yes" : "No"}</div><br />
            <div className="boxContainer"><strong>Reference Links:</strong> <br/>
            {Array.isArray(props.refLink) && props.refLink.length > 0 ? (
                props.refLink.map((refLink, index) => (
                <span key={index}>
                    {index + 1}. <a href={refLink}>{refLink}</a><br />
                </span>
                ))
            ) : null}
            </div>
            <br/>
            <div className="boxContainer"><strong> Fee Details: </strong>{props.paymentDetails.type === "free" ? "Free of cost" : "Paid for "} {props.paymentDetails.type === "paid" ? "₹ " + props.paymentDetails.fee : ""}</div><br/>
            <div className="boxContainer"><strong>Uploaded Files: </strong><br/>
                {fileLinks.map((file, index) => (
                <span key={index}>
                    {index + 1}. <a href={file.url} target="_blank" rel="noreferrer">
                    {file.name}
                    </a>
                    <br />
                </span>
                ))}
            </div><br/>
            <div className="boxContainer"><strong>Requirements:</strong>
            <br />
            {Array.isArray(props.requirements) && props.requirements.length > 0 ? (
                props.requirements.map((requirement, index) => (
                <>&nbsp;&nbsp;&nbsp;<span key={index}>{index + 1}. {requirement} </span><br /></>
                ))
            ) : "None"}
            </div>
            <div className="buttonsContainer" id={"btnContainer" + props.id} style={{ display: displayValue }}>
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
