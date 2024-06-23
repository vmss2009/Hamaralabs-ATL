import React from "react";
import {doc, onSnapshot, query} from "firebase/firestore";

import {db, updateTActivity} from "../../firebase/firestore";
import {useParams} from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import {getDownloadURL, getStorage, ref, uploadBytes, listAll, deleteObject} from "firebase/storage";//newline
import fbApp from "../../firebase/app";//newline

const storage = getStorage(fbApp);//newline

function SnapshotTAEditForm() {
    const {studentId, activityId} = useParams();

    const [taID, setTAID] = React.useState("");
    const [taName, setTAName] = React.useState("");
    const [taNamePermanent, setTaNamePermanent] = React.useState("");
    const [intro, setIntro] = React.useState("");
    const [goals, setGoals] = React.useState([]);
    const [materials, setMaterials] = React.useState([]);
    const [instructions, setInstructions] = React.useState([]);
    const [tips, setTips] = React.useState([]);
    const [assessment, setAssessment] = React.useState([]);
    const [extensions, setExtensions] = React.useState([]);
    const [resources, setResources] = React.useState([]);

    const [goalsCount, setGoalsCount] = React.useState(0);
    const [materialsCount, setMaterialsCount] = React.useState(0);
    const [instructionsCount, setInstructionsCount] = React.useState(0);
    const [tipsCount, setTipsCount] = React.useState(0);
    const [assessmentCount, setAssessmentCount] = React.useState(0);
    const [extensionsCount, setExtensionsCount] = React.useState(0);
    const [resourcesCount, setResourcesCount] = React.useState(0);
    const [comment, setComment] = React.useState("");//newline

    const fileInput = React.useRef(null);
    const [files, setFiles] = React.useState([]);
    const [fileChanged, setFileChanged] = React.useState(false);

    function clearForm() {
    }

    function hasDuplicates(array, hasFiles) {
        if (hasFiles === undefined) {
            hasFiles = false;
        }
        var valuesSoFar = Object.create(null);
        for (var i = 0; i < array.length; ++i) {
            var value = array[i];
            if (hasFiles === true) {
                if (typeof value === "object") {
                    value = value.name;
                }
            }
            if (value in valuesSoFar) {
                return true;
            }
            valuesSoFar[value] = true;
        }
        return false;
    }

    function handleChange(event) {
        if(event.target.name === "taID") {
            setTAID(event.target.value);
        } else if(event.target.name === "taName") {
            setTAName(event.target.value);
        } else if(event.target.name === "introduction") {
            setIntro(event.target.value);
        } else if(event.target.name === "comment") {//newline
            setComment(event.target.value);//newline
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if(hasDuplicates(goals) || hasDuplicates(materials) || hasDuplicates(instructions) || hasDuplicates(tips) || hasDuplicates(assessment) || hasDuplicates(extensions) || hasDuplicates(resources, true)) {
            alert("Data has duplicate values!");
        } else {
            for (let index = 0; index < resources.length; index++) {
                if (typeof resources[index] === "object") {
                    resources[index] = await uploadFileResources(resources[index]);
                }
            }
            const stRef = ref(storage, "tAFiles/"+taName);
            await listAll(stRef)
                .then(res => {
                    res.items.forEach(async itemRef => {
                        await deleteObject(itemRef)
                    })
                })
                const tURL = await uploadFile();
                console.log(tURL);
                await updateTActivity (taID, taName, intro, goals, materials, instructions, tips, assessment, extensions, resources,comment, tURL, doc(db, "studentData", studentId, "taData", activityId))
                .then(() => {
                    alert("Updated successfully!!");
                    window.location.href = "/";
                })
                .catch((error) => {
                    console.log(error);
                    alert("Updating data failed! Please try again.");
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
        if(classes.includes("goalsAdd")) {
            setGoalsCount(goalsCount+1);
        } else if(classes.includes("materialsAdd")) {
            setMaterialsCount(materialsCount+1);
        } else if(classes.includes("instructionsAdd")) {
            setInstructionsCount(instructionsCount+1);
        } else if(classes.includes("tipsAdd")) {
            setTipsCount(tipsCount+1);
        } else if(classes.includes("assessmentAdd")) {
            setAssessmentCount(assessmentCount+1);
        } else if(classes.includes("extensionsAdd")) {
            setExtensionsCount(extensionsCount+1);
        } else if(classes.includes("resourcesAdd")) {
            setResourcesCount(resourcesCount+1);
        }
    }

    function decreaseField(event) {
        event.preventDefault();
        const classes = event.target.className.split(" ");
        if(classes.includes("goalsRemove")) {
            if(goalsCount !== 0) {
                goals.pop();
                setGoalsCount(goalsCount-1);
            }
        } else if(classes.includes("materialsRemove")) {
            if(materialsCount !== 0) {
                materials.pop();
                setMaterialsCount(materialsCount-1);
            }
        } else if(classes.includes("instructionsRemove")) {
            if(instructionsCount !== 0) {
                instructions.pop();
                setInstructionsCount(instructionsCount-1);
            }
        } else if(classes.includes("tipsRemove")) {
            if(tipsCount !== 0) {
                tips.pop();
                setTipsCount(tipsCount-1);
            }
        } else if(classes.includes("assessmentRemove")) {
            if(assessmentCount !== 0) {
                assessment.pop();
                setAssessmentCount(assessmentCount-1);
            }
        } else if(classes.includes("extensionsRemove")) {
            if(extensionsCount !== 0) {
                extensions.pop();
                setExtensionsCount(extensionsCount-1);
            }
        } else if(classes.includes("resourcesRemove")) {
            if(resourcesCount !== 0) {
                resources.pop();
                setResourcesCount(resourcesCount-1);
            }
        }
    }

    function mfHandleChangeGoals(event) {
        const index = Number(event.target.getAttribute("id").replace("goals", ""));
        const temp = [...goals];
        temp[index] = event.target.value;
        setGoals(temp);
    }

    function mfHandleChangeMaterials(event) {
        const index = Number(event.target.getAttribute("id").replace("materials", ""));
        const temp = [...materials];
        temp[index] = event.target.value;
        setMaterials(temp);
    }

    function mfHandleChangeInstructions(event) {
        const index = Number(event.target.getAttribute("id").replace("instructions", ""));
        const temp = [...instructions];
        temp[index] = event.target.value;
        setInstructions(temp);
    }

    function mfHandleChangeTips(event) {
        const index = Number(event.target.getAttribute("id").replace("tips", ""));
        const temp = [...tips];
        temp[index] = event.target.value;
        setTips(temp);
    }

    function mfHandleChangeAssessment(event) {
        const index = Number(event.target.getAttribute("id").replace("assessment", ""));
        const temp = [...assessment];
        temp[index] = event.target.value;
        setAssessment(temp);
    }

    function mfHandleChangeExtensions(event) {
        const index = Number(event.target.getAttribute("id").replace("extension", ""));
        const temp = [...extensions];
        temp[index] = event.target.value;
        setExtensions(temp);
    }

    function mfHandleChangeResources(event, file) {
        const index = Number(event.target.getAttribute("id").replace(file ? "uploadMou" : "resource", ""));
        const temp = [...resources];
        if (file) {
            temp[index] = file;
            setResourcesCount(resourcesCount+1);
            console.log(resourcesCount);
            temp[resourcesCount] = "";
        } else {
            temp[index] = event.target.value;
        }
        setResources(temp);
    }

    async function uploadFile() {
        try {
            const urls = files;
            for (let i = 0; i < files.length; i++) {
                if (typeof files[i] === "object") {
                    const filesFolderRef = ref(storage, `tAFiles/${taName}/${files[i].name}`);
                    const temp2 = await uploadBytes(filesFolderRef, files[i]);
                    const temp = await getDownloadURL(filesFolderRef);
                    urls[i] = temp;
                    console.log(temp2);
                }
            }
            return urls;
        } catch (error){
            console.log(error);
        }
    }

    async function uploadFileResources(file) {
        try {
            const filesFolderRef = ref(storage, `tAFiles/${taName}/${file.name}`);
            const temp2 = await uploadBytes(filesFolderRef, file);
            const temp = await getDownloadURL(filesFolderRef);
            console.log(temp2);
            return temp;
        } catch (error){
            console.log(error);
        }
    }

    async function onFileSelectResources(event) {
        event.preventDefault();
        const selectedFile = event.target.files[0];
        const fileSizeInMB = selectedFile.size / (1024*1024);
        
        if (selectedFile && fileSizeInMB <= 50) {
            mfHandleChangeResources(event, selectedFile);
        } else {
            alert("Please select a file less than 50MB");
            console.log(resources);
        }
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

    const handleFileSelect = (event) => {
        setFileChanged(true);
        console.log(files);
        setFiles([...files, ...event.target.files]);
    };
    
    const handleFileRemove = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    React.useEffect(() => {
        const q = query(doc(db, "studentData", studentId, "taData", activityId));
        onSnapshot(q, (snapshot) => {
            setTAID(snapshot.data().taID);
            setTaNamePermanent(snapshot.data().taName);
            setTAName(snapshot.data().taName);
            setIntro(snapshot.data().intro);
            setAssessment(snapshot.data().assessment);
            setAssessmentCount(snapshot.data().assessment.length);
            setExtensions(snapshot.data().extensions);
            setExtensionsCount(snapshot.data().extensions.length);
            setMaterials(snapshot.data().materials);
            setMaterialsCount(snapshot.data().materials.length);
            setResources(snapshot.data().resources);
            setResourcesCount(snapshot.data().resources.length);
            setGoals(snapshot.data().goals);
            setGoalsCount(snapshot.data().goals.length);
            setInstructions(snapshot.data().instructions);
            setInstructionsCount(snapshot.data().instructions.length);
            setTips(snapshot.data().tips);
            setTipsCount(snapshot.data().tips.length);
            setComment(snapshot.data().comment);
            setFiles(snapshot.data().files === (undefined) ? [] : snapshot.data().files);
        });
    }, []);

    let decodedAuth = atob(localStorage.auth);

    let split = decodedAuth.split("-");

    window.uid = split[0];
    window.email = split[1];
    window.role = split[2];

    document.title = "Tinkering Activity Data Edit | Digital ATL";

    return (
        <div className="container" id="mobilescreen">
            <Sidebar />
            <link rel="stylesheet" href="/CSS/school.css" />
            <form>
                <div className="school-title">Tinkering Activity data edit</div>
                <hr />
                <div className="formContainer">
                <div className="row">
                        <div className="column">
                    <label htmlFor="taID"><strong>TA ID:</strong> </label>
                    <input type="text" name="taID" id="taID" className="form-inp" value={taID} onChange={handleChange}/>
                </div>
                <div className="column">
                    <label htmlFor="taName"><strong>TA Name:</strong> </label>
                    <input type="text" name="taName" id="taName" className="form-inp" value={taName} onChange={handleChange}/>
                </div>
                </div>
                </div>
                <div className="formContainer">
                <div className="row">
                        <div className="column">
                    <label htmlFor="introduction"><strong>Introduction:</strong> </label>
                    <br/>
                    <br/>
                    <textarea name="introduction" id="introduction" cols="18" rows="4" className="form-inp" value={intro} onChange={handleChange}/>
                </div>
                <div className="column">
                    <label><strong>Goals:</strong> </label>
                    <div className="multiForm">
                        {
                            createArray(goalsCount).map((_, index) => {
                                return <div key={index}>
                                    <textarea name={"goals"+index} id={"goals"+index} cols="18" rows="4" className="form-inp" value={goals[index]} onChange={mfHandleChangeGoals} style={{marginTop: "1rem"}}/>
                                    <br/>
                                </div>
                            })
                        }
                    </div>
                    <button className="submitbutton goalsAdd" onClick={increaseField}>+</button>
                    <button className="resetbutton goalsRemove" onClick={decreaseField}>-</button>
                </div>
                </div>
                </div>
                <div className="formContainer">
                <div className="row">
                        <div className="column">
                    <label><strong>Materials:</strong> </label>
                    <div className="multiForm">
                        {
                            createArray(materialsCount).map((_, index) => {
                                return <div key={index}>
                                    <textarea name={"materials"+index} id={"materials"+index} cols="18" rows="4" className="form-inp"value={materials[index]} onChange={mfHandleChangeMaterials} style={{marginTop: "1rem"}}/>
                                    <br/>
                                </div>
                            })
                        }
                    </div>
                    <button className="submitbutton materialsAdd" onClick={increaseField}>+</button>
                    <button className="resetbutton materialsRemove" onClick={decreaseField}>-</button>
                </div>
                <div className="column">
                    <label><strong>Instructions:</strong> </label>
                    <div className="multiForm">
                        {
                            createArray(instructionsCount).map((_, index) => {
                                return <div key={index}>
                                    <textarea name={"instructions"+index} id={"instructions"+index} cols="18" rows="4" className="form-inp" value={instructions[index]} onChange={mfHandleChangeInstructions} style={{marginTop: "1rem"}}/>
                                    <br/>
                                </div>
                            })
                        }
                    </div>
                    <button className="submitbutton instructionsAdd" onClick={increaseField}>+</button>
                    <button className="resetbutton instructionsRemove" onClick={decreaseField}>-</button>
                </div>
                </div>
                </div>
                <div className="formContainer">
                <div className="row">
                        <div className="column">
                    <label><strong>Tips:</strong> </label>
                    <div className="multiForm">
                        {
                            createArray(tipsCount).map((_, index) => {
                                return <div key={index}>
                                    <textarea name={"tips"+index} id={"tips"+index} cols="18" rows="4" value={tips[index]} className="form-inp" onChange={mfHandleChangeTips} style={{marginTop: "1rem"}}/>
                                    <br/>
                                </div>
                            })
                        }
                    </div>
                    <button className="submitbutton tipsAdd" onClick={increaseField}>+</button>
                    <button className="resetbutton tipsRemove" onClick={decreaseField}>-</button>
                </div>
                <div className="column">
                    <label><strong>Assessment:</strong> </label>
                    <div className="multiForm">
                        {
                            createArray(assessmentCount).map((_, index) => {
                                return <div key={index}>
                                    <textarea name={"assessment"+index} id={"assessment"+index} cols="18" rows="4" className="form-inp" value={assessment[index]} onChange={mfHandleChangeAssessment} style={{marginTop: "1rem"}}/>
                                    <br/>
                                </div>
                            })
                        }
                    </div>
                    <button className="submitbutton assessmentAdd" onClick={increaseField}>+</button>
                    <button className="resetbutton assessmentRemove" onClick={decreaseField}>-</button>
                </div>
                </div>
                </div>
                <div className="formContainer">
                <div className="row">
                        <div className="column">
                    <label><strong>Extensions: </strong></label>
                    <div className="multiForm">
                        {
                            createArray(extensionsCount).map((_, index) => {
                                return <div key={index}>
                                    <textarea name={"extension"+index} id={"extension"+index} cols="18" rows="4" value={extensions[index]} className="form-inp" onChange={mfHandleChangeExtensions} style={{marginTop: "1rem"}}/>
                                    <br/>
                                </div>
                            })
                        }
                    </div>
                    <button className="submitbutton extensionsAdd" onClick={increaseField}>+</button>
                    <button className="resetbutton extensionsRemove" onClick={decreaseField}>-</button>
                </div>
                <div className="column">
                    <label><strong>Resources:</strong> </label>
                    <div className="multiForm">
                        {
                            createArray(resourcesCount).map((_, index) => {
                                return <div key={index}>
                                    {typeof resources[index] === "undefined"
                                    ? <textarea name={"resource"+index} id={"resource"+index} cols="18" rows="4" placeholder="Enter the Resources" className="form-inp" value={resources[index]} onChange={mfHandleChangeResources} style={{marginTop: "1rem"}}/>
                                    : <textarea name={"resource"+index} id={"resource"+index} cols="18" rows="4" placeholder="Enter the Resources" className="form-inp" readOnly={typeof resources[index] === "string" ? (resources[index].startsWith("https://firebasestorage.googleapis.com/v0/b/hamaralabs-dev.appspot.com/o/") === true ? true : false) : true} value={typeof resources[index] === "string" ? resources[index] : resources[index].name} onChange={mfHandleChangeResources} style={{marginTop: "1rem"}}/>
                                    }
                                    <label htmlFor={"uploadMou"+index} className="resetbutton">
                                        <i className="fa-solid fa-upload"></i>
                                    </label>
                                    <input type="file" name={"uploadMou"+index} id={"uploadMou"+index} style={{display: "none"}} onChange={onFileSelectResources}/>
                                    <br/>
                                </div>
                            })
                        }
                    </div>
                    <button className="submitbutton resourcesAdd" onClick={increaseField}>+</button>
                    <button className="resetbutton resourcesRemove" onClick={decreaseField}>-</button>
                </div>
                </div>
                </div>
                <div className="formContainer">
                <div className="row">
                    <label><strong>Comments:</strong> </label>
                    <textarea name="comment" id="comment" className="form-inp" value={comment} onChange={handleChange}/>
                </div>
                </div>
                <div className="formContainer">
                    <label><strong>Upload File:</strong> </label>
                    <label htmlFor="uploadMou" className="resetbutton" onClick={(event) => {
                        event.preventDefault();
                        fileInput.current.click();
                    }}>
                        <i className="fa-solid fa-upload"></i>
                    </label>
                    <br/>
                    <br/>
                    <input type="file" name="uploadMou" id="uploadMou" ref={fileInput} onChange={handleFileSelect} multiple style={{ display: "none" }} />
                    {files.map((file, index) => (
                        <div key={index}>
                        <span> <b>{index+1}.</b> {isValidUrl(file) ? <a href={file} target="_blank" rel="noreferrer">{getFileNameFromUrl(file, taNamePermanent)}</a> : file.name}</span>
                        <button onClick={(event) => {
                            event.preventDefault();
                            handleFileRemove(index)
                        }}><i class="fa-solid fa-circle-xmark" style={{cursor: "pointer"}}></i>
                        </button>
                        </div>
                    ))}
                </div>
                <div className="buttonsContainer formContainer">
                    <button type="submit" className="submitbutton" onClick={handleSubmit}>Update</button>
                    <button type="reset" className="resetbutton" onClick={handleClick}>Reset</button>
                </div>
            </form>
        </div>
    );
}

export default SnapshotTAEditForm;