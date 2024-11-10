import React from "react";
import { Bars } from 'react-loader-spinner';
import { query, onSnapshot, collection } from "firebase/firestore";

import { db } from "../../firebase/firestore";
import Sidebar from "../../components/Sidebar";

import ArchiveReportBox from "./ArchiveReportBox"; // Assuming the ReportBox component remains the same

function ArchivedCompetitionReport() {
    const [data, setData] = React.useState([]);
    const [loaderEnable, setLoaderEnable] = React.useState(true);
    const [students, setStudents] = React.useState([]);
    const [schools, setSchools] = React.useState([]);

    React.useEffect(() => {
        const q = query(collection(db, "archivedData", "appData", "competitionData"));
        onSnapshot(q, (querySnapshot) => {
            const dataArray = [];
            querySnapshot.forEach(snap => {
                let tempData = snap.data();
                tempData.docId = snap.id;
                dataArray.push(tempData);
            });
            setData(dataArray);
            setLoaderEnable(false);
        });

        const q2 = query(collection(db, "studentData"));
        onSnapshot(q2, (querySnapshot) => {
            const dataArray = [];
            querySnapshot.forEach(snap => {
                let tempData = snap.data();
                tempData.docId = snap.id;
                dataArray.push(tempData);
            });
            setStudents(dataArray);
        });

        const q3 = query(collection(db, "schoolData"));
        onSnapshot(q3, (querySnapshot) => {
            const dataArray = [];
            querySnapshot.forEach(snap => {
                let tempData = snap.data();
                tempData.docId = snap.id;
                dataArray.push(tempData);
            });
            setSchools(dataArray);
        });
    }, []);

    document.title = "Archived Competitions | Digital ATL";

    return (
        <div className="container">
            <Sidebar />
            <link rel="stylesheet" href="/CSS/form.css" />
            <link rel="stylesheet" href="/CSS/report.css" />
            <div className="title">Archived Competitions Report | Digital ATL</div>
            <hr />
            <div className="results">
                {(loaderEnable) ? (
                    <center>
                        <Bars
                            height="80"
                            width="80"
                            radius="9"
                            color="black"
                            ariaLabel="loading"
                            wrapperStyle
                            wrapperClass
                        />
                    </center>
                ) : (console.log("Disabled loader"))}
                {
                    data.map((archive, index) => {
                        console.log(archive)
                        return (
                            <ArchiveReportBox
                                key={index}
                                id={index}
                                competName={archive.name}
                                description={archive.description}
                                organizedBy={archive.organizedBy}
                                applStartDate={archive.applicationStartDate}
                                applEndDate={archive.applicationEndDate}
                                compStartDate={archive.competitionStartDate}
                                compEndDate={archive.competitionEndDate}
                                classesFrom={archive.eligibility.classesFrom}
                                classesTo={archive.eligibility.classesTo}
                                atlSchools={archive.eligibility.atlSchools}
                                nonAtlSchools={archive.eligibility.nonAtlSchools}
                                individual={archive.eligibility.individual}
                                team={archive.eligibility.team}
                                refLink={archive.refLink}
                                requirements={archive.requirements}
                                docId={archive.docId}
                                paymentDetails={archive.paymentDetails}
                                fileURL={archive.fileURL}
                                students={students}
                                schools={schools}
                            />
                        );
                    })
                }
            </div>
        </div>
    );
}

export default ArchivedCompetitionReport;


