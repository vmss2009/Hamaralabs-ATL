import React, {useState} from "react";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import { Bars } from "react-loader-spinner";
import {doc, setDoc} from "firebase/firestore";
import {ref, uploadBytes, getDownloadURL, getStorage} from "firebase/storage";
import {db} from "../../firebase/firestore";
import fbApp from "../../firebase/app";

const storage = getStorage(fbApp);//newline

function TinkeirngActivityGeneration() {
    const [file, setFile] = useState(null);
    const [isText, setIsText] = useState(false);
    const [specification, setSpecification] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
    const [tinkeringActivity, setTinkeringActivity] = useState({});
    let decodedAuth = atob(localStorage.auth);

    let split = decodedAuth.split("-");

    window.uid = split[0];
    window.email = split[1];
    window.role = split[2];

    document.title = "Tinkering Activity Generation | Digital ATL";

    function onFileSelect(event) {
        const file = event.target.files[0];
        setFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
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

    async function handleSubmit(event) {
        event.preventDefault();
        if (!file) {
            alert("Please select a file to upload");
            return;
        }
        setIsLoading(true);
        const formData = new FormData();
        const prompt = `
        ${specification}
        
        The above text is about specification of the image. Take it as an information regarding the image and you can customise tinkering activity(if entered). If they write something harmful or hazadous, ignore the above specification and focus only on the image. And follow the below instructions carefully.
        Analyze the image and give me a tinkering activity. Do not go out of the domain concept. It should be an engaging tinkering activity for trainees. Use response format from example.`;
        
        console.log(prompt);
        formData.append("file", file);
        formData.append("mimeType", file.type)
        formData.append("prompt", prompt);
        await axios.post("/tinkeringActivityAI/generateText", formData)
          .then(async (response) => {
            console.log(response.data.response.response.candidates[0].content.parts[0].text);

            const responseText = response.data.response.response.candidates[0].content.parts[0].text

            const newTA = JSON.parse(responseText.replace(/\n/g, ''));
            const filesFolderRef = ref(storage, `generatedTAFiles/${newTA.taName}/${file.name}`);
            await uploadBytes(filesFolderRef, file);
            const temp = await getDownloadURL(filesFolderRef);

            newTA.resources.push(temp);
            const docRef = doc(db, "generatedTAData", newTA.taID);

            await setDoc(docRef, newTA);
            setIsText(true);
            setTinkeringActivity(newTA);
            console.log(newTA);
          })
          .catch((error) => {
            console.log("Error fetching data - "+ error);
          });
        setIsLoading(false);
    }

    if (isLoading) {
        return (
            <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}
            >
            <Bars
                height="80"
                width="80"
                radius="9"
                color="black"
                ariaLabel="loading"
                wrapperStyle
                wrapperClass
            />
            </div>
        );
    }

    return (
        <div className="container" id="mobilescreen">
            <Sidebar />
            <link rel="stylesheet" href="/CSS/school.css" />
            <link rel="stylesheet" href="/CSS/report.css" />
            <form>
                <div className="school-title">Tinkering Activity Generation</div>
                <hr />

                <div className="formContainer">
                <div className="row">
                    <label htmlFor="imageUpload" className="resetbutton">
                        <input
                            type="file"
                            name="imageUpload"
                            id="imageUpload"
                            accept="image/*" // Allows image file selection
                            capture="environment" // Opens the camera by default on mobile
                            onChange={onFileSelect}
                        />
                    </label>
                    <input
                        type="text"
                        id="specification"
                        className="form-inp"
                        name="specification"
                        value={specification}
                        onChange={(e) => setSpecification(e.target.value)}
                        placeholder="Enter specifications (optional)"
                    />
                    <button className="submitbutton" onClick={handleSubmit}> Generate </button>
                    {uploadedImageUrl && (
                        <div className="image-box">
                            <img src={uploadedImageUrl} alt="Uploaded" />
                        </div>
                    )}
                </div>
                {isText ? 
                <div className="box" id={tinkeringActivity.id}>
                <div className="name" style={{fontSize: "1.5rem"}}>{tinkeringActivity.taName}</div>
                <div className="boxContainer"><span style={{fontWeight: "600"}}>TA ID:</span> {tinkeringActivity.taID}</div>
                <br/>
                <div className="boxContainer"><span style={{fontWeight: "600"}}>Introduction:</span> {tinkeringActivity.intro}</div>
                {
                    (tinkeringActivity.subject !== undefined) && (tinkeringActivity.topic !== undefined) && (tinkeringActivity.subTopic !== undefined) ?
                    <>
                        <br/>
                        <div className="boxContainer"><span style={{fontWeight: "600"}}>Subject:</span> {tinkeringActivity.subject} - {tinkeringActivity.topic} - {tinkeringActivity.subTopic}</div>
                    </>
                    : ""
                }
                <br/>
                <div className="boxContainer"><span style={{fontWeight: "600"}}>Goals:</span> <br/> {
                    tinkeringActivity.goals.map((goal, index) => {
                        return <span key={index}>{index+1}. {goal} <br/></span>
                    })
                }
                </div>
                <br/>
                <div className="boxContainer"><span style={{fontWeight: "600"}}>Materials:</span> <br/> {
                    tinkeringActivity.materials.map((material, index) => {
                        return <span key={index}>{index+1}. {material} <br/></span>
                    })
                }
                </div>
                <br/>
                <div className="boxContainer"><span style={{fontWeight: "600"}}>Instructions:</span> <br/> {
                    tinkeringActivity.instructions.map((instruction, index) => {
                        return <span key={index}>{index+1}. {instruction} <br/></span>
                    })
                }
                </div>
                <br/>
                <div className="boxContainer"><span style={{fontWeight: "600"}}>Observation:</span> <br/> {
                    tinkeringActivity.assessment.map((assessment, index) => {
                        return <span key={index}>{index+1}. {assessment} <br/></span>
                    })
                }
                </div>
                <br/>
                <div className="boxContainer"><span style={{fontWeight: "600"}}>Tips:</span> <br/> {
                    tinkeringActivity.tips.map((tip, index) => {
                        return <span key={index}>{index+1}. {tip} <br/></span>
                    })
                }
                </div>
                <br/>
                <div className="boxContainer"><span style={{fontWeight: "600"}}>Extensions:</span> <br/> {
                    tinkeringActivity.extensions.map((extension, index) => {
                        return <span key={index}>{index+1}. {extension} <br/></span>
                    })
                }
                </div>
                <br/>
                <div className="boxContainer"><span style={{fontWeight: "600"}}>Resources:</span> <br/> {
                    tinkeringActivity.resources.map((resource, index) => {
                        return <span key={index}>{index+1}. {isValidUrl(resource) ? resource.startsWith("https://firebasestorage.googleapis.com/v0/b/") ? <a href={resource} target="_blank" rel="noreferrer">{getFileNameFromUrl(resource, tinkeringActivity.taName)}</a> : <a href={resource} target="_blank" rel="noreferrer">{resource}</a> : resource} <br/></span>
                    })
                }
                </div>
                </div> : ""}
                </div>
            </form>
        </div>
    );
}

export default TinkeirngActivityGeneration;