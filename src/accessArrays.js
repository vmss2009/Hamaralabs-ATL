const studentForm = ["admin", "atlIncharge"];
const studentReport = ["admin", "mentor", "atlIncharge", "student"];

const mentorForm = ["admin", "atlIncharge"];
const mentorReport  = ["admin", "atlIncharge", "mentor"];

const schoolForm = ["admin"];
const schoolReport = ["admin"];

const teamForm = ["admin", "atlIncharge"];
const teamReport = ["admin", "atlIncharge", "mentor"];

const activityForm = ["admin", "atlIncharge", "mentor"];
const activityReport = ["admin", "atlIncharge", "mentor", "student"];

const tinkeringActivityGeneration = ["admin", "atlIncharge", "mentor"];
const tinkeringActivityGenerationReport = ["admin"];

const competitionForm = ["admin"];
const competitionReport = ["admin", "atlIncharge", "student", "mentor"];
const competitionArchived = ["admin"];
const competitionSnapshot = ["admin", "atlIncharge", "mentor"];

const apartmentForm = ["admin", "mentor"];
const apartmentReport = ["admin", "mentor", "student"];

const tasks = ["admin", "atlIncharge", "student", "mentor"];

const coursesForm = ["admin"];
const coursesReport = ["admin", "atlIncharge"];

const addFieldsForm = ["admin"];

const studentSnapshot = ["admin", "mentor", "atlIncharge", "student"];
const projectForm = ["admin", "atlIncharge"];
const projectReport = ["admin", "atlIncharge"];

const partnerForm = ["admin", "atlIncharge"];
const partnerReport = ["admin", "atlIncharge"];

const sessionForm = ["admin", "atlIncharge", "mentor"];
const sessionReport = ["admin", "atlIncharge", "mentor"];

const slotManagement = ["admin", "atlIncharge"];

const chats = ["admin", "atlIncharge", "mentor", "student"];
const chatWithAdmin = ["admin", "atlIncharge", "mentor", "student"];

const notifications = ["admin", "mentor", "atlIncharge"];
const payments = ["admin", "mentor", "atlIncharge", "student"];

export { studentForm,
    studentReport,
    mentorForm,
    mentorReport,
    schoolForm,
    schoolReport,
    teamForm,
    teamReport,
    activityForm,
    activityReport,
    tinkeringActivityGeneration,
    tinkeringActivityGenerationReport,
    competitionForm,
    competitionReport,
    competitionArchived,
    coursesForm,
    coursesReport,
    tasks,
    studentSnapshot,
    projectForm,
    projectReport,
    partnerForm,
    partnerReport,
    sessionForm,
    sessionReport,
    slotManagement,
    competitionSnapshot,
    apartmentForm,
    apartmentReport,
    addFieldsForm,
    chats,
    chatWithAdmin,
    notifications,
    payments  };

export default {
    studentForm,
    studentReport,
    mentorForm,
    mentorReport,
    schoolForm,
    schoolReport,
    teamForm,
    teamReport,
    activityForm,
    activityReport,
    tinkeringActivityGeneration,
    tinkeringActivityGenerationReport,
    competitionForm,
    competitionReport,
    competitionArchived,
    coursesForm,
    coursesReport,
    tasks,
    studentSnapshot,
    projectForm,
    projectReport,
    partnerForm,
    partnerReport,
    sessionForm,
    sessionReport,
    slotManagement,
    competitionSnapshot,
    apartmentForm,
    apartmentReport,
    addFieldsForm,
    chats,
    chatWithAdmin,
    notifications,
    payments
}