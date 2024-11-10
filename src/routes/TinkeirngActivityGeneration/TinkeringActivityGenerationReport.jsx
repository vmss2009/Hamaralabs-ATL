import React, { useState, useEffect } from "react";
import { Bars } from "react-loader-spinner";
import { toast, Bounce } from "react-toastify";
import { query, onSnapshot, collection, orderBy, startAfter, documentId, limit } from "firebase/firestore";
import { db, deleteGeneratedActivity } from "../../firebase/firestore";
import ReportBox from "./ReportBoxComp";
import Sidebar from "../../components/Sidebar";

function TinkeringActivityGenerationReport() {
    const [loaderEnable, setLoaderEnable] = useState(true);
    const [displayData, setDisplayData] = useState([]);
    const [paginate, setPaginate] = useState(null);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        const q = query(collection(db, "generatedTAData"), orderBy(documentId()), limit(10));
        onSnapshot(q, (querySnapshot) => {
            const dataArray = [];
            querySnapshot.forEach((snap) => {
                let tempData = snap.data();
                tempData.docId = snap.id;
                dataArray.push(tempData);
            });
            if (dataArray.length > 0) {
                const lastDocument = dataArray[dataArray.length - 1].taID;
                setPaginate(lastDocument);
                const nextQuery = query(collection(db, "taID"), orderBy(documentId()), limit(1), startAfter(lastDocument));
                if (nextQuery) setShowMore(true);
                else setShowMore(false);
            }
            setDisplayData(dataArray);
            setLoaderEnable(false);
            if (localStorage.getItem("generatedActivityId") !== undefined) {
                if (localStorage.getItem("generatedActivityId") !== null) {
                    if (localStorage.getItem("generatedActivityId") !== "") {
                        console.log(localStorage.getItem("generatedActivityId"));
                        toast.success(
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <h3>{localStorage.getItem("generatedActivityId")}</h3>
                                <span
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            localStorage.getItem("generatedActivityId")
                                        );
                                    }}
                                >
                <i class="fa-solid fa-copy fa-xl"></i>
              </span>
                            </div>,
                            {
                                position: "bottom-center",
                                autoClose: false,
                                closeOnClick: false,
                                hideProgressBar: false,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "dark",
                                transition: Bounce,
                                onClose: () => {
                                    localStorage.removeItem("generatedActivityId");
                                },
                            }
                        );
                    }
                }
            }
        });
    }, []);

    const handleLoadMore = () => {
        const q = query(collection(db, "generatedTAData"), orderBy(documentId()), startAfter(paginate), limit(10));
        onSnapshot(q, (querySnapshot) => {
            const dataArray = [];
            querySnapshot.forEach((snap) => {
                let tempData = snap.data();
                tempData.docId = snap.id;
                dataArray.push(tempData);
            });
            if (dataArray.length > 0) {
                const lastDocument = dataArray[dataArray.length - 1].taID;
                setPaginate(lastDocument);
                const temp = [];
                const nextQuery = query(collection(db, "taID"), orderBy(documentId()), limit(1), startAfter(lastDocument));
                temp.push(nextQuery);
                if (temp.length === 1) setShowMore(true);
                else setShowMore(false);
            } else {
                setShowMore(false);
            }
            setDisplayData((prevState) => [...prevState, ...dataArray]);
            setLoaderEnable(false);
        });
    };

    document.title = "Tinkering Activity Data Report | Digital ATL";

    if (loaderEnable) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <Bars height="80" width="80" radius="9" color="black" ariaLabel="loading" wrapperStyle wrapperClass />
            </div>
        );
    }

    return (
        <div className="container" id="mobilescreen">
            <Sidebar />
            <link rel="stylesheet" href="/CSS/form.css" />
            <link rel="stylesheet" href="/CSS/report.css" />
            <div className="title">Tinkering Activity Data Report | Digital ATL</div>
            <hr />
            {displayData.map((activity, index) => (
                <ReportBox
                    activity={activity}
                    key={index}
                    id={index}
                    docId={activity.docId}
                    taID={activity.docId}
                    taName={activity.taName}
                    subject={activity.subject}
                    topic={activity.topic}
                    subTopic={activity.subTopic}
                    intro={activity.intro}
                    tips={activity.tips}
                    resources={activity.resources}
                    materials={activity.materials}
                    instructions={activity.instructions}
                    goals={activity.goals}
                    extensions={activity.extensions}
                    assessment={activity.assessment}
                    setLoading={setLoaderEnable}
                    deleteActivity={deleteGeneratedActivity}
                />
            ))}
            {loaderEnable ? (
                <center>
                    <Bars height="80" width="80" radius="9" color="black" ariaLabel="loading" wrapperStyle wrapperClass />
                </center>
            ) : (
                ""
            )}
            {showMore && (
                <div>
                    <button type="button" onClick={handleLoadMore} style={{ border: "none", background: "none", margin: "10px", cursor: "pointer", color: "blue" }}>
                        Load more...
                    </button>
                </div>
            )}
        </div>
    );
}

export default TinkeringActivityGenerationReport;