import { collection, doc, addDoc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, getFirestore, query, where } from "firebase/firestore";
import moment from "moment";

import fbApp from "./app";

const db = getFirestore(fbApp);

let encodedAuth = localStorage.getItem("auth");
let uid;
if (encodedAuth != null) {
    let decodedAuth = atob(encodedAuth);
    let split = decodedAuth.split("-");
    uid = split[0];
}

// Paths
const studentPath = "studentData";
const mentorPath = "mentorData";
const schoolPath = "schoolData";
const teamPath = "teamData";
const activityPath = "taData";
const competitionPath = "competitionData";
const coursesPath = "coursesData";
const taskPath = "tasksData";
const projectsPath = "projectsData";
const partnerPath = "partnerData";
const sessionPath = "sessionData";
const subjectPath="subject";

// Functions

// async function addStudent(fname, lname, school, gender, classVal, section, email, whatsappNo, aspiration, currentExperiment, isTeamLeader, currentActivity) {
    async function addStudent(fname, lname, school, gender, classVal, section, aspiration, isTeamLeader, comments,/* currentActivity,*/ email) {
        try {
            const docRef = collection(db, studentPath);
            const studentSnap = await addDoc(docRef, {
                name: {
                    firstName: fname,
                    lastName: lname
                },
                school: school,
                gender: gender,
                class: classVal,
                section: section,
                // whatsappNumber: whatsappNo,
                aspiration: aspiration,
                // currentExperiment: currentExperiment,
                isTeamLeader: isTeamLeader,
                comments:comments,/*sucharitha 4.8*/
                email: email
            });
    
            const docRef2 = doc(db, `/${studentPath}/${studentSnap.id}/tinkeringActivities`, "base_version");
    
            const docRef3 = doc(db, "tinkeringActivityData",/* currentActivity*/);
            const docSnap = await getDoc(docRef3);
    
            await setDoc(docRef2, docSnap.data());
        } catch (err) {
            console.error(err);
        }
    }

async function getStudents() {
    const docRef = collection(db, studentPath);
    const docSnaps = await getDocs(docRef);
    return docSnaps;
}

async function getStudent(studentId) {
    const docRef = doc(db, studentPath, studentId);
    const docSnap = await getDoc(docRef);
    return docSnap;
}


// async function updateStudent(id, fname, lname, school, gender, classVal, section, email, whatsappNo, aspiration, currentExperiment, isTeamLeader) {
async function updateStudent(id, fname, lname, school, gender, classVal, section,  aspiration, isTeamLeader, comments, email) {
    const docRef = doc(db, studentPath, id);
    await updateDoc(docRef, {
        name: {
            firstName: fname,
            lastName: lname
        },
        school: school,
        gender: gender,
        class: classVal,
        section: section,
        // whatsappNumber: whatsappNo,
        aspiration: aspiration,
        // currentExperiment: currentExperiment,
        isTeamLeader: isTeamLeader,
        comments: comments,
        email: email,
    });
}

async function deleteStudent(docId) {
    const docRef = doc(db, studentPath, docId);
    const snap = await getDoc(docRef);
    const archiveRef = doc(db, "archivedData", "appData", studentPath, docId);
    await setDoc(archiveRef, snap.data());
    await deleteDoc(docRef);
}

async function queryStudent(field, comparision, value) {
    const ref = collection(db, studentPath);
    const q = await query(ref, where(field, comparision, value));
    const querySnapshot = await getDocs(q);
    return querySnapshot;
}

// async function addMentor(college, fName, lName, study, department, year, email, whatsappNo, aspiration, experiment, competitionMapped) {
async function addMentor(fName, lName, skillSet) {
    const docRef = collection(db, mentorPath);
    await addDoc(docRef, {
        // aspiration: aspiration,
        // college: college,
        // competitionMapped: competitionMapped,
        // department: department,
        // email: email,
        // currentExperiment: experiment,
        // year: year,
        name: {
            firstName: fName,
            lastName: lName
        },
        // study: study,
        // whatsappNumber: whatsappNo
        skillSet: skillSet
    });
}

async function getMentors() {
    const docRef = collection(db, mentorPath);
    const docSnaps = await getDocs(docRef);
    return docSnaps;
}

async function getMentor(mentorId) {
    const docRef = doc(db, mentorPath, mentorId);
    const docSnap = await getDoc(docRef);
    return docSnap;
}

// async function updateMentor(docId, college, fName, lName, study, department, year, email, whatsappNo, aspiration, experiment, competitionMapped) {
async function updateMentor(docId, fName, lName, skillSet) {
    const docRef = doc(db, mentorPath, docId);
    await updateDoc(docRef, {
        // aspiration: aspiration,
        // college: college,
        // competitionMapped: competitionMapped,
        // department: department,
        // email: email,
        // currentExperiment: experiment,
        // year: year,
        name: {
            firstName: fName,
            lastName: lName
        },
        skillSet: skillSet
        // study: study,
        // whatsappNumber: whatsappNo
    });
}

async function deleteMentor(docId) {
    const docRef = doc(db, mentorPath, docId);
    const snap = await getDoc(docRef);
    const archiveRef = doc(db, "archivedData", "appData", mentorPath, docId);
    await setDoc(archiveRef, snap.data());
    await deleteDoc(docRef);
}

async function queryMentor(field, comparision, value) {
    const ref = collection(db, mentorPath);
    const q = await query(ref, where(field, comparision, value));
    const querySnapshot = await getDocs(q);
    return querySnapshot;
}

async function addSchool(name,isATL,address,city,state,pincode,inchargeFName,inchargeLName,inchargeEmail,inchargeWhatsappNumber,principalFName,principalLName,principalEmail,principalWhatsappNumber,correspondentfName,correspondentlName,correspondentEmail,correspondentWhatsappNumber,sameAsPrincipal,syllabus,webSite,paidSubscription,socialMediaLink) {
    const docRef = collection(db, schoolPath);
    await addDoc(docRef, {
        name: name,
        isATL: isATL,
        address: {
            addressLine1: address,
            city: city,
            state: state,
            pincode: pincode,
            country: "India"
        },
        atlIncharge: {
            firstName:inchargeFName,
            lastName:inchargeLName,
            email: inchargeEmail,
            whatsappNumber:inchargeWhatsappNumber,
        },
        principal: {
            firstName:principalFName,
            lastName:principalLName,
            email:principalEmail,
            whatsappNumber:principalWhatsappNumber,
        },
        correspondent: {
            firstName:correspondentfName,
            lastName:correspondentlName,
            email:correspondentEmail,
            whatsappNumber:correspondentWhatsappNumber,
        },
        date: moment().format(),
        sameAsPrincipal:sameAsPrincipal,
        syllabus: syllabus,
        webSite: webSite,
        paidSubscription:paidSubscription,
        socialMediaLink:socialMediaLink,
    });
}

async function getSchools() {
    const docRef = collection(db, schoolPath);
    const docSnaps = await getDocs(docRef);
    return docSnaps;
}

async function getSchool(schoolId) {
    const docRef = doc(db, schoolPath, schoolId);
    const docSnap = await getDoc(docRef);
    return docSnap;
}

async function updateSchool(schoolId,name,isATL,address,city,state,pincode,inchargeFName,inchargeLName,inchargeEmail,inchargeWhatsappNumber,principalFName,principalLName,principalEmail,principalWhatsappNumber,correspondentfName,correspondentlName,correspondentEmail,correspondentWhatsappNumber,sameAsPrincipal,syllabus,webSite,paidSubscription,socialMediaLink,) {
    const docRef = doc(db, schoolPath, schoolId);
    await updateDoc(docRef, {
        name: name,
        isATL: isATL,
        address: {
            addressLine1: address,
            city: city,
            state: state,
            pincode: pincode,
            country: "India"
        },
        atlIncharge: {
            firstName:inchargeFName,
            lastName:inchargeLName,
            email: inchargeEmail,
            whatsappNumber:inchargeWhatsappNumber,
        },
        principal: {
            firstName:principalFName,
            lastName:principalLName,
            email:principalEmail,
            whatsappNumber:principalWhatsappNumber,
        },
        correspondent: {
            firstName:correspondentfName,
            lastName:correspondentlName,
            email:correspondentEmail,
            whatsappNumber:correspondentWhatsappNumber,
        },
        date: moment().format(),
        sameAsPrincipal:sameAsPrincipal,
        syllabus: syllabus,
        webSite: webSite,
        paidSubscription:paidSubscription,
        socialMediaLink:socialMediaLink,
    });
}

async function deleteSchool(docId) {
    console.log(docId);
    const docRef = doc(db, schoolPath, docId);
    const snap = await getDoc(docRef);
    const archiveRef = doc(db, "archivedData", "appData", schoolPath, docId);
    await setDoc(archiveRef, snap.data());
    await deleteDoc(docRef);
}

async function querySchool(field, comparision, value) {
    const ref = collection(db, schoolPath);
    const q = await query(ref, where(field, comparision, value));
    const querySnapshot = await getDocs(q);
    return querySnapshot;
}

async function addTeam(teamName, teamLeader, teamMembers, schoolVal) {
    console.log(teamName, teamLeader, teamMembers);
    const docRef = collection(db, teamPath);
    const teamLeaderRef = doc(db, "studentData", teamLeader);
    const membersRefs = [];
    teamMembers.forEach(member => {
        membersRefs.push(doc(db, "studentData", member));
    });
    await addDoc(docRef, {
        name: teamName,
        leader: teamLeaderRef,
        members: membersRefs,
        schoolVal: schoolVal,
    })
}

async function getTeams() {
    const docRef = collection(db, teamPath);
    const docSnaps = await getDocs(docRef);
    return docSnaps;
}

async function getTeam(schoolId) {
    const docRef = doc(db, teamPath, schoolId);
    const docSnap = await getDoc(docRef);
    return docSnap;
}

async function updateTeam(teamName, teamLeader, teamMembers, docId) {
    const docRef = doc(db, teamPath, docId);
    const teamLeaderRef = doc(db, "studentData", teamLeader);
    const membersRefs = [];
    teamMembers.forEach(member => {
        membersRefs.push(doc(db, "studentData", member));
    });
    await updateDoc(docRef, {
        name: teamName,
        leader: teamLeaderRef,
        members: membersRefs,
    });
}

async function deleteTeam(docId) {
    const docRef = doc(db, teamPath, docId);
    const snap = await getDoc(docRef);
    const archiveRef = doc(db, "archivedData", "appData", teamPath, docId);
    await setDoc(archiveRef, snap.data());
    await deleteDoc(docRef);
}

async function queryTeam(field, comparision, value) {
    const ref = collection(db, teamPath);
    const q = await query(ref, where(field, comparision, value));
    const querySnapshot = await getDocs(q);
    return querySnapshot;
}

/*sucharitha 13.1*/
async function addSession(sessionTutor, sessionType, sessionDate, sessionTime,  schools) {
    const docRef = collection(db, sessionPath);
    await addDoc(docRef, {
      sessionTutor: sessionTutor,
      sessionType: sessionType,
      sessionDate: sessionDate,
      sessionTime: sessionTime,
      schools: schools, 
    });
  }
  
  async function getSession() {
    const docRef = collection(db, sessionPath);
    const docSnaps = await getDocs(docRef);
    return docSnaps.docs.map(doc => doc.data());
  }
  
  async function getSessions() {
    const docRef = collection(db, sessionPath);
    const docSnaps = await getDocs(docRef);
    return docSnaps;
  }
  
  async function updateSession(sessionId, schools, sessionType,  sessionTutor, sessionDate,  sessionTime) {
    const docRef = doc(db, sessionPath, sessionId);
    // const updates = {};
    await updateDoc(docRef, {
      sessionTutor: sessionTutor,
      sessionType: sessionType,
      sessionDate: sessionDate,
      sessionTime: sessionTime,
      schools: schools,
    });
  }
  
  
  async function deleteSession(docId) {
    const docRef = doc(db, sessionPath, docId);
    const snap = await getDoc(docRef);
    const archiveRef = doc(db, "archivedData", "appData", sessionPath, docId);
    await setDoc(archiveRef, snap.data());
    await deleteDoc(docRef);
  }
  
  async function querySession(field, comparision, value) {
    const ref = collection(db, sessionPath);
    const q = await query(ref, where(field, comparision, value));
    const querySnapshot = await getDocs(q);
    return querySnapshot;
}
  
/*sucharitha 13.1*/

async function addActivity(taID, taName, subject, topic, subTopic, intro, goals, materials, instructions, tips, assessment, extensions, resources) {
    const docRef = doc(db, activityPath, taID);

    await setDoc(docRef, {
        taID: taID,
        taName: taName,
        subject: subject,
        topic: topic,
        subTopic: subTopic,
        intro: intro,
        goals: goals,
        materials: materials,
        instructions: instructions,
        tips: tips,
        assessment: assessment,
        extensions: extensions,
        resources: resources
    });
}

async function getActivities() {
    const docRef = collection(db, activityPath);
    const docSnaps = await getDocs(docRef);
    return docSnaps;
}

async function getActivity(activityId) {
    const docRef = doc(db, activityPath, activityId);
    const docSnap = await getDoc(docRef);
    return docSnap;
}

async function updateActivity(docId, taID, taName, subject, topic, subTopic, intro, goals, materials, instructions, tips, assessment, extensions, resources, docRef = doc(db, activityPath, docId)) {
    await updateDoc(docRef, {
        taID: taID,
        taName: taName,
        subject: subject,
        topic: topic,
        subTopic: subTopic,
        intro: intro,
        goals: goals,
        materials: materials,
        instructions: instructions,
        tips: tips,
        assessment: assessment,
        extensions: extensions,
        resources: resources
    });
}
async function updateTActivity(taID, taName, intro, goals, materials, instructions, tips, assessment, extensions, resources, comment, uploadURL, docRef) {
    const data = {
        taID: taID,
        taName: taName,
        intro: intro,
        goals: goals,
        materials: materials,
        instructions: instructions,
        tips: tips,
        assessment: assessment,
        extensions: extensions,
        resources: resources,
        comment: comment === undefined ? "" : comment,
        files: uploadURL.length > 0 ? uploadURL : []
    }

    console.log(data);

    await updateDoc(docRef, data);
}

async function taskAssign(taskId, user) {
    try {
        const docRef = collection(db, taskPath);
        const userDocRef = doc(db, "atlUsers", user);

        const userData = await getDoc(userDocRef);

        let tasks = [];

        if(userData.data().tasks !== undefined) {
            userData.data().tasks.forEach(task => {
                tasks.push(task);
            });
        }

        const taskRef = doc(db, taskPath, taskId);
        const taskData = await getDoc(taskRef);
        tasks.push({
            ref: taskRef,
            taskName: taskData.data().taskName
        });

        await setDoc(userDocRef, {
            tasks: tasks
        }, {merge: true});

        await setDoc(taskRef, {
            assignedTo: userDocRef
        }, {merge: true});
    } catch(err) {
        console.error(err);
    }
}

async function deleteActivity(docId) {
    const docRef = doc(db, activityPath, docId);
    const snap = await getDoc(docRef);
    const archiveRef = doc(db, "archivedData", "appData", activityPath, docId);
    await setDoc(archiveRef, snap.data());
    await deleteDoc(docRef);
}

async function queryActivity(field, comparision, value) {
    const ref = collection(db, activityPath);
    const q = await query(ref, where(field, comparision, value));
    const querySnapshot = await getDocs(q);
    return querySnapshot;
}

async function addCompetition(competName, description, organizedBy, applStartDate, applEndDate, classesFrom, classesTo,
                              atlSchools, nonAtlSchools, individual, team, refLink, requirements, feeDetails, compStartDate, compEndDate, fileURL = "") {
    const docRef = collection(db, competitionPath);
    const data = {
        name: competName,
        description: description,
        organizedBy: organizedBy,
        applicationStartDate: applStartDate,
        applicationEndDate: applEndDate,
        eligibility: {
            classesFrom: classesFrom,
            classesTo: classesTo,
            atlSchools: atlSchools,
            nonAtlSchools: nonAtlSchools,
            individual: individual,
            team: team,
        },
        refLink: refLink,
        requirements: requirements,
        paymentDetails: feeDetails,
        competitionStartDate: compStartDate,
        competitionEndDate: compEndDate
    };

    if(fileURL !== "") {
        data.fileURL = fileURL;
    }

    await addDoc(docRef, data);
}

async function getCompetitions() {
    const docRef = collection(db, competitionPath);
    const docSnaps = await getDocs(docRef);
    return docSnaps;
}

async function getCompetition(competitionId) {
    const docRef = doc(db, competitionPath, competitionId);
    const docSnap = await getDoc(docRef);
    return docSnap;
}

async function updateCompetition(competitionId, competName, description, organizedBy, applStartDate, applEndDate, classesFrom, classesTo,
                              atlSchools, nonAtlSchools, individual, team, refLink, requirements, feeDetails, compStartDate, compEndDate, fileURL = "") {
    const docRef = doc(db, competitionPath, competitionId);
    const data = {
        name: competName,
        description: description,
        organizedBy: organizedBy,
        applicationStartDate: applStartDate,
        applicationEndDate: applEndDate,
        eligibility: {
            classesFrom: classesFrom,
            classesTo: classesTo,
            atlSchools: atlSchools,
            nonAtlSchools: nonAtlSchools,
            individual: individual,
            team: team,
        },
        refLink: refLink,
        requirements: requirements,
        paymentDetails: feeDetails,
        competitionStartDate: compStartDate,
        competitionEndDate: compEndDate
    };

    if(fileURL !== "") {
        data.fileURL = fileURL;
    }

    await setDoc(docRef, data, {merge: true});
}

async function updateStudentCompetition(competName, description, organizedBy, applStartDate, applEndDate, classesFrom, classesTo,
                                     atlSchools, nonAtlSchools, individual, team, refLink, requirements, feeDetails, compStartDate, compEndDate, fileURL, comments, studentSubmission, docRef) {
    console.log("Raja5", description);
   // console.log("Raja6", comments);
    const data = {
    name: competName,
    description: description,
    
    organizedBy: organizedBy,
    applicationStartDate: applStartDate,
    applicationEndDate: applEndDate,
    eligibility: {
      classesFrom: classesFrom,
      classesTo: classesTo,
      atlSchools: atlSchools,
      nonAtlSchools: nonAtlSchools,
      individual: individual,
      team: team,
    },
    refLink: refLink,
    requirements: requirements,
    paymentDetails: feeDetails,
    competitionStartDate: compStartDate,
    competitionEndDate: compEndDate,
    comments: comments === undefined ? "" : comments,
   }
 
   if(fileURL !== "") {
        data.uploadFile = fileURL;
    }
  if (studentSubmission !== "") {
      data.studentUploadFile = studentSubmission;
  }
    console.log("testedby Nagu", comments)
    console.log("NAGESWARARAO", studentSubmission);
     await updateDoc(docRef, data);
}

async function deleteCompetition(docId) {
    const docRef = doc(db, competitionPath, docId);
    const snap = await getDoc(docRef);
    const archiveRef = doc(db, "archivedData", "appData", competitionPath, docId);
    await setDoc(archiveRef, snap.data());
    await deleteDoc(docRef);
}

async function queryCompetition(field, comparision, value) {
    const ref = collection(db, competitionPath);
    const q = await query(ref, where(field, comparision, value));
    const querySnapshot = await getDocs(q);
    return querySnapshot;
}

async function task(taskName, taskDescription, taskDueDate, taskDone, taskComments) {
    try {
        const docRef = collection(db, taskPath);
        const userDocRef = doc(db, "atlUsers", uid);

        const docSnap = await addDoc(docRef, {
            taskName: taskName,
            taskDescription: taskDescription,
            taskDueDate: taskDueDate,
            taskDone: taskDone,
            taskComments: taskComments,
        });

        const userData = await getDoc(userDocRef);

        let tasks = [];

        if(userData.data().tasks !== undefined) {
            userData.data().tasks.forEach(task => {
                tasks.push(task);
            });
        }

        tasks.push({taskName: taskName, taskDueDate: taskDueDate, ref: doc(db, "tasksData", docSnap.id)});

        await setDoc(userDocRef, {
            tasks: tasks
        }, {merge: true});
    } catch(err) {
        console.error(err);
    }
}

async function deleteTask(docId) {
    const docRef = doc(db, taskPath, docId);
    const userDocRef = doc(db, "atlUsers", uid);
    const userDocumentData = await getDoc(userDocRef);
    let taskFieldDocument = userDocumentData.data().tasks;
    const taskData = await getDoc(docRef);

    await deleteDoc(docRef);

    userDocumentData.data().tasks.forEach((value, index) => {
        if(value.ref.path === "tasksData/" + docId){
            taskFieldDocument.splice(index, 1);
        }
    });

    setDoc(userDocRef, {
        tasks : taskFieldDocument
    }, {merge: true});

    if(taskData.data().assignedTo !== undefined) {
        const assignedToDoc = await getDoc(taskData.data().assignedTo);
        let assignedToTasks = assignedToDoc.data().tasks;
        assignedToTasks.forEach((value, index) => {
            if(value.ref.path === "tasksData/" + docId){
                assignedToTasks.splice(index, 1);
            }
        });
        await setDoc(assignedToDoc.ref, {
            tasks: assignedToTasks
        }, {merge: true});
    }
}

async function getTasksById(documentRef) {
    const documentData = await getDoc(documentRef);
    return documentData;
}

async function addCourse(courseName, courseTag, description, organizedBy, applStartDate, applEndDate, crsStartDate, crsEndDate, classesFrom, classesTo, refLink, requirements) {
    const docRef = collection(db, coursesPath);
    await addDoc(docRef, {
        courseName: courseName,
        courseTag: courseTag,
        description: description,
        organizedBy: organizedBy,
        applicationStartDate: applStartDate,
        applicationEndDate: applEndDate,
        crsStartDate: crsStartDate,
        crsEndDate: crsEndDate,
        classesFrom: classesFrom,
        classesTo: classesTo,
        refLink: refLink,
        requirements: requirements
    });
}

async function getCourses() {
    const docRef = collection(db, coursesPath);
    const docSnaps = await getDocs(docRef);
    return docSnaps;
}


async function getCourse(coursesId) {
    const docRef = doc(db, coursesPath, coursesId);
    const docSnap = await getDoc(docRef);
    return docSnap;
}

async function updateCourse(id, courseName, courseTag, description, organizedBy, applStartDate, applEndDate, crsStartDate, crsEndDate, classesFrom, classesTo, refLink, requirements) {
    const docRef = doc(db, coursesPath, id);
    await updateDoc(docRef, {
        courseName: courseName,
        courseTag: courseTag,
        description: description,
        organizedBy: organizedBy,
        applicationStartDate: applStartDate,
        applicationEndDate: applEndDate,
        crsStartDate: crsStartDate,
        crsEndDate: crsEndDate,
        classesFrom: classesFrom,
        classesTo: classesTo,
        refLink: refLink,
        requiorements: requirements
    });
}

async function updateStudentCourse(courseName, courseTag, description, organizedBy, applStartDate, applEndDate, crsStartDate, crsEndDate, classesFrom, classesTo, refLink, requirements, comments, fileURL, docRef) {
        const data = {
        courseName: courseName,
        courseTag: courseTag,
        description: description,
        organizedBy: organizedBy,
        applicationStartDate: applStartDate,
        applicationEndDate: applEndDate,
        crsStartDate: crsStartDate,
        crsEcndDate: crsEndDate,
        classesFrom: classesFrom,
        classesTo: classesTo,
        refLink: refLink,
        requirements: requirements,
        comments: comments === undefined ? "" : comments
        }
        if(fileURL !== "") {
            data.courseUploadFile = fileURL;
        }
        await updateDoc(docRef,data);
    }


async function deleteCourse(docId) {
    const docRef = doc(db, coursesPath, docId);
    const snap = await getDoc(docRef);
    const archiveRef = doc(db, "archivedData", "appData", coursesPath, docId);
    await setDoc(archiveRef, snap.data());
    await deleteDoc(docRef);
}

async function queryCourse(field, comparision, value) {
    const ref = collection(db, coursesPath);
    const q = await query(ref, where(field, comparision, value));
    const querySnapshot = await getDocs(q);
    return querySnapshot;
}

async function addProject(projectId, projectName, projectDescription, projectStartDate, projectEndDate, tags, projectMembers, tasks, schoolName = "all") {
    const ref = doc(db, projectsPath, projectId);
    const docSnap = await setDoc(ref, {
        projectId: projectId,
        projectName: projectName,
        projectDescription: projectDescription,
        expectedStartDate: projectStartDate,
        expectedEndDate: projectEndDate,
        projectMembers: projectMembers,
        tags: tags,
        tasks: tasks,
        schoolName: schoolName
    });
}

async function getProjects() {
    const ref = collection(db, projectsPath);
    const docSnaps = await getDocs(ref);
    return docSnaps;
}

async function getProject(projectId) {
    const ref = doc(db, projectsPath, projectId);
    const docSnap = await getDoc(ref);
    return docSnap;
}

async function updateProject(projectId, projectName, projectDescription, projectStartDate, projectEndDate, tags, projectMembers, tasks) {
    const ref = doc(db, projectsPath, projectId);
    const docSnap = await setDoc(ref, {
        projectId: projectId,
        projectName: projectName,
        projectDescription: projectDescription,
        expectedStartDate: projectStartDate,
        expectedEndDate: projectEndDate,
        projectMembers: projectMembers,
        tags: tags,
        tasks: tasks
    }, {merge: true});
}

async function deleteProject(docId) {
    const docRef = doc(db, projectsPath, docId);
    const snap = await getDoc(docRef);
    const archiveRef = doc(db, "archivedData", "appData", projectsPath, docId);
    await setDoc(archiveRef, snap.data());
    await deleteDoc(docRef);
}

async function queryProject(field, comparision, value) {
    const ref = collection(db, projectsPath);
    const q = await query(ref, where(field, comparision, value));
    const querySnapshot = await getDocs(q);
    return querySnapshot;
}

async function addPartner(type, name, line1, city, state, country, pincode, dmFirstName, dmLastName, dmEmail, dmPhone,
                          contactPersons, proposedActivities, projects, mouURL = "") {
    const docRef = collection(db, partnerPath);

    const data = {
        type: type,
        name: name,
        address: {
            addressLine1: line1,
            city: city,
            state: state,
            country: country,
            pincode: pincode
        },
        decisionMaker: {
            firstName: dmFirstName,
            lastName: dmLastName,
            email: dmEmail,
            phone: dmPhone
        },
        contactPersons: contactPersons,
        proposedActivities: proposedActivities,
        projects: projects,
    }

    if(mouURL !== ""){
        data.mouFile = mouURL;
    }

    await addDoc(docRef, data);
}

async function getPartners() {
    const docRef = collection(db, partnerPath);
    const docSnaps = await getDocs(docRef);
    return docSnaps;
}

async function getPartner(partnerId) {
    const docRef = doc(db, partnerPath, partnerId);
    const docSnap = await getDoc(docRef);
    return docSnap;
}

async function updatePartner(partnerId, type, name, line1, city, state, country, pincode, dmFirstName, dmLastName, dmEmail, dmPhone,
                             contactPersons, proposedActivities, projects, mouURL = "") {
    const docRef = doc(db, partnerPath, partnerId);

    const data = {
        type: type,
        name: name,
        address: {
            addressLine1: line1,
            city: city,
            state: state,
            country: country,
            pincode: pincode
        },
        decisionMaker: {
            firstName: dmFirstName,
            lastName: dmLastName,
            email: dmEmail,
            phone: dmPhone
        },
        contactPersons: contactPersons,
        projects: projects,
        proposedActivities: proposedActivities,
    }

    if(mouURL !== ""){
        data.mouFile = mouURL;
    }

    await setDoc(docRef, data, {merge: true});
}

async function deletePartner(docId) {
    const docRef = doc(db, partnerPath, docId);
    const snap = await getDoc(docRef);
    const archiveRef = doc(db, "archivedData", "appData", partnerPath, docId);
    await setDoc(archiveRef, snap.data());
    await deleteDoc(docRef);
}

async function queryPartner(field, comparision, value) {
    const ref = collection(db, partnerPath);
    const q = await query(ref, where(field, comparision, value));
    const querySnapshot = await getDocs(q);
    return querySnapshot;
}

async function deleteAssignedTA(docId, taskId) {
    const docRef = doc(db, studentPath, docId, "taData", taskId);
    const snap = await getDoc(docRef);
    const archiveRef = doc(db, "archivedData", "appData", studentPath, docId, "taData", taskId);
    await setDoc(archiveRef, snap.data());
    await deleteDoc(docRef);
}

async function deleteAssignedCompetition(docId, competitionId) {
    const docRef = doc(db, studentPath, docId, "competitionData", competitionId);
    const snap = await getDoc(docRef);
    const archiveRef = doc(db, "archivedData", "appData", studentPath, docId, "competitionData", competitionId);
    await setDoc(archiveRef, snap.data());
    await deleteDoc(docRef);
}

async function deleteAssignedCourse(docId, courseId) {
    const docRef = doc(db, studentPath, docId, "coursesData", courseId);
    const snap = await getDoc(docRef);
    const archiveRef = doc(db, "archivedData", "appData", studentPath, docId, "courseData", courseId);
    await setDoc(archiveRef, snap.data());
    await deleteDoc(docRef);
}

async function addSubject(subName) {
    const subjectRef = collection(db, subjectPath);
    await addDoc(subjectRef, { name: subName });
  }

  async function getSubjects() {
    const subjectRef = collection(db, subjectPath);
    const snapshot = await getDocs(subjectRef);
    return snapshot.docs;
  }

// async function deleteSubject(docId) {
//     console.log(docId);
//     const docRef = doc(db, subjectPath, docId);
//     const snap = await getDoc(docRef);
//     const archiveRef = doc(db, "archivedData", "appData", subjectPath, docId);
//     await setDoc(archiveRef, snap.data());
//     await deleteDoc(docRef);
// }

// Function to delete a subject from the database
async function deleteSubject(docId) {
    const docRef = doc(db, "subject", docId);
    const snap = await getDoc(docRef);
    const archiveRef = doc(db, "archivedData", "appData", "subject", docId);
    await setDoc(archiveRef, snap.data());
    await deleteDoc(docRef);
  }
  

async function addTopic(name, subjectId) {
    const docRef = collection(db, `subject/${subjectId}/topic`);
    await addDoc(docRef, {
        name: name
    });
}

async function getTopics(subjectId) {
    const id = `/subject/${subjectId}/topic`;
    const docRef = collection(db, id);
    const docSnaps = await getDocs(docRef);
    return docSnaps.docs;
}

async function deleteTopic(docId, subjectId) {
    console.log(docId);
    const docRef = doc(db, `subject/${subjectId}/topic`, docId);
    const snap = await getDoc(docRef);
    const archiveRef = doc(db, "archivedData", "appData", "topic", docId);
    await setDoc(archiveRef, snap.data());
    await deleteDoc(docRef);
}

async function addSubTopic(name, subjectId, topicId) {
    const docRef = collection(db, `subject/${subjectId}/topic/${topicId}/subTopic`);
    await addDoc(docRef, {
        name: name
    });
}

async function getSubtopics(subjectId, topicId) {
    const docRef = collection(db, `subject/${subjectId}/topic/${topicId}/subTopic`);
    const docSnaps = await getDocs(docRef);
    return docSnaps.docs;
}

async function deleteSubtopic(docId, subjectId, topicId) {
    const docRef = doc(db, `subject/${subjectId}/topic/${topicId}/subTopic`, docId);
    const snap = await getDoc(docRef);
    const archiveRef = doc(db, "archivedData", "appData", "subTopic", docId);
    await setDoc(archiveRef, snap.data());
    await deleteDoc(docRef);
}

export default db;
export { db };
export { addStudent, getStudents, getStudent, updateStudent, deleteStudent, queryStudent, deleteAssignedTA };
export { addMentor, getMentors, getMentor, updateMentor, deleteMentor, queryMentor };
export { addSchool, getSchools, getSchool, updateSchool, deleteSchool, querySchool };
export { addTeam, getTeams, getTeam, updateTeam, deleteTeam, queryTeam };
export { addActivity, getActivities, getActivity, updateActivity, deleteActivity, queryActivity, updateTActivity };
export { addCompetition, getCompetitions, getCompetition, updateCompetition, deleteCompetition, queryCompetition, deleteAssignedCompetition, updateStudentCompetition };
export { addCourse, getCourses, getCourse, updateCourse, deleteCourse, queryCourse, deleteAssignedCourse, updateStudentCourse };
export { addProject, getProjects, getProject, updateProject, deleteProject, queryProject };
export { addPartner, getPartners, getPartner, updatePartner, deletePartner, queryPartner };
export { addSession, getSessions, getSession, updateSession, deleteSession, querySession };
export { task, taskAssign, deleteTask, getTasksById };
export { addSubject, getSubjects, deleteSubject, addTopic, getTopics, deleteTopic, addSubTopic, getSubtopics, deleteSubtopic};