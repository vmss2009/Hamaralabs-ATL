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

const competitionForm = ["admin"];
const competitionReport = ["admin", "atlIncharge", "student", "mentor"];
const competitionArchived = ["admin"];
const competitionSnapshot = ["admin", "atlIncharge", "mentor"];

const myActivityReport = ["admin", "student"];

const tasks = ["admin", "atlIncharge", "student", "mentor"];

const coursesForm = ["admin"];
const coursesReport = ["admin", "atlIncharge"];

const studentsTas = ["admin", "atlIncharge", "student"];
const addFieldsForm = ["admin"];

const studentsCourses = ["admin", "atlIncharge", "student"];

const studentsCompetitions = ["admin", "atlIncharge", "student"];

const studentSnapshot = ["admin", "mentor", "atlIncharge", "student"];
const projectForm = ["admin", "atlIncharge"];
const projectReport = ["admin", "atlIncharge"];

const partnerForm = ["admin", "atlIncharge"];
const partnerReport = ["admin", "atlIncharge"];

const sessionForm = ["admin", "atlIncharge", "mentor"];
const sessionReport = ["admin", "atlIncharge", "mentor"];

const chats = ["admin", "atlIncharge", "mentor", "student"];
const chatWithAdmin = ["admin", "atlIncharge", "mentor", "student"];

const notifications = ["admin", "mentor", "atlIncharge"];
const payments = ["admin", "mentor", "atlIncharge", "student"];

export { studentForm, studentReport, mentorForm, mentorReport, schoolForm, schoolReport, teamForm, teamReport, activityForm, activityReport, competitionForm, competitionReport, competitionArchived, myActivityReport, coursesForm, coursesReport, tasks, studentsTas, studentsCourses, studentsCompetitions, studentSnapshot, projectForm, projectReport, partnerForm, partnerReport,  competitionSnapshot, addFieldsForm  };

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
    competitionForm,
    competitionReport,
    competitionArchived,
    myActivityReport,
    coursesForm,
    coursesReport,
    tasks,
    studentsTas,
    studentsCourses,
    studentsCompetitions,
    studentSnapshot,
    projectForm,
    projectReport,
    partnerForm,
    partnerReport,
    sessionForm,
    sessionReport,
    competitionSnapshot,
    addFieldsForm,
    chats,
    chatWithAdmin,
    notifications,
    payments
}
