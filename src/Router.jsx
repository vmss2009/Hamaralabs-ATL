import React from "react";
import {createBrowserRouter} from "react-router-dom";
import SnapshotTAEditForm from "./routes/StudentSnapshot/TAEdit";
import SnapshotCompEditForm from "./routes/StudentSnapshot/CompetitionEdit";
import SnapshotCourseEditForm from "./routes/StudentSnapshot/CoursesEdit";

const Index = React.lazy(() => import("./routes/Index"));
const Login = React.lazy(() => import("./routes/Login"));
const Register = React.lazy(() => import("./routes/Register"));

const StudentForm = React.lazy(() => import("./routes/StudentData/Form"));
const StudentEditForm = React.lazy(() => import("./routes/StudentData/EditForm"));
const StudentReport = React.lazy(() => import("./routes/StudentData/Report"));

const MentorForm = React.lazy(() => import("./routes/MentorsData/Form"));
const MentorEditForm = React.lazy(() => import("./routes/MentorsData/EditForm"));
const MentorReport = React.lazy(() => import("./routes/MentorsData/Report"));

const SchoolForm = React.lazy(() => import("./routes/SchoolData/Form"));
const SchoolEditForm = React.lazy(() => import("./routes/SchoolData/EditForm"));
const SchoolReport = React.lazy(() => import("./routes/SchoolData/Report"));

const TeamForm = React.lazy(() => import("./routes/TeamData/Form"));
const TeamReport = React.lazy(() => import("./routes/TeamData/Report"));
const TeamEditForm = React.lazy(() => import("./routes/TeamData/EditForm"));

const TinkeringActivityForm = React.lazy(() => import("./routes/TinkeringActivityData/Form"));
const TinkeringActivityReport = React.lazy(() => import("./routes/TinkeringActivityData/Report"));
const TinkeringActivityEditForm = React.lazy(() => import("./routes/TinkeringActivityData/EditForm"));
const TinkeringAddFieldForm = React.lazy(() => import("./routes/TinkeringActivityData/AddFeilds"));

const CompetitionForm = React.lazy(() => import("./routes/CompetitionData/Form"));
const CompetitionReport = React.lazy(() => import("./routes/CompetitionData/Report"));
const CompetitionEditForm = React.lazy(() => import("./routes/CompetitionData/EditForm"));
const ArchivedCompetitionReport = React.lazy(() => import("./routes/CompetitionData/ArchiveReport"));

const CoursesForm = React.lazy(() => import("./routes/CoursesData/Form"));
const CoursesReport = React.lazy(() => import("./routes/CoursesData/Report"));
const CoursesEditForm = React.lazy(() => import("./routes/CoursesData/EditForm"));

const ProjectForm = React.lazy(() => import("./routes/ProjectData/Form"));
const ProjectReport = React.lazy(() => import("./routes/ProjectData/Report"));
const ProjectEditForm = React.lazy(() => import("./routes/ProjectData/EditForm"));

const PartnerForm = React.lazy(() => import("./routes/PartnerData/Form"));
const PartnerReport = React.lazy(() => import("./routes/PartnerData/Report"));
const PartnerEditForm = React.lazy(() => import("./routes/PartnerData/EditForm"));

const Tasks = React.lazy(() => import("./routes/Tasks/Tasks"));
const TaskEditForm = React.lazy(() => import("./routes/Tasks/EditForm"));

const StudentSnapshot = React.lazy(() => import("./routes/StudentSnapshot/Dashboard"));

const CompetitionSnapshot = React.lazy(() => import("./routes/CompetitionSnapshot/Dashboard"))

const AdminChat = React.lazy(() => import("./routes/ChatWithAdmin/Admin"));
const AdminIndividualChat = React.lazy(() => import("./routes/ChatWithAdmin/AdminIndividualChat"));
const UsersChat = React.lazy(() => import("./routes/ChatWithAdmin/Users"));
const ChatDashboard = React.lazy(() => import("./routes/Chats/Dashboard"));
const Chat = React.lazy(() => import("./routes/Chats/Chat"));

const Page404 = React.lazy(() => import("./routes/404"));
const Offline = React.lazy(() => import("./routes/Offline"));
const ForgotPassword = React.lazy(() => import("./routes/ForgotPassword"));

const FallBack = React.lazy(() => import("./App").then(module => ({default: module.FallBack})));

const AccessDeterminer = React.lazy(() => import("./AccessDeterminer"));

let encodedAuth = localStorage.getItem("auth");

let email;
let uid;
let role;

if (encodedAuth != null) {
    let decodedAuth = atob(encodedAuth);

    let split = decodedAuth.split("-");

    uid = split[0];
    email = split[1];
    role = split[2];
    console.log(uid, email, role)

    if(email === null || uid === null || role === null || email === undefined || uid === undefined || role === undefined) {
        localStorage.clear();
        window.location.reload();
    }
}

const Router = createBrowserRouter([
    {
        path: "/",
        element: (localStorage.getItem("auth") !== null) ? (<StudentSnapshot />) : (<Login />),
        errorElement: <Page404 />,
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/auth",
        children: [
            {
                path: "reset-password",
                element: <ForgotPassword />
            }
        ]
    },
    {
        path: "/student-data",
        children: [
            {
                path: "add",
                element: <AccessDeterminer accessForName="studentForm" accessForComponent={StudentForm} />
            },
            {
                path: "view",
                element: <AccessDeterminer accessForName="studentReport" accessForComponent={StudentReport} />
            },
            {
                path: "edit/:studentId",
                element: <AccessDeterminer accessForName="studentForm" accessForComponent={StudentEditForm} />
            },
            {
                path: "snapshot",
                element: <AccessDeterminer accessForName="studentSnapshot" accessForComponent={StudentSnapshot} />,
                children: [

                ]
            }
        ]
    },
    {
        path: "/student-data/snapshot/:studentId/ta/edit/:activityId",
        element: <AccessDeterminer accessForName="studentSnapshot" accessForComponent={SnapshotTAEditForm} />
    },
    {
        path: "/student-data/snapshot/:studentId/competition/edit/:competitionId",
        element: <AccessDeterminer accessForName="studentSnapshot" accessForComponent={SnapshotCompEditForm} />
    },
    {
        path: "/student-data/snapshot/:studentId/courses/edit/:courseId",
        element: <AccessDeterminer accessForName="studentSnapshot" accessForComponent={SnapshotCourseEditForm} />
    },
    {
        path: "/mentor-data",
        children: [
            {
                path: "add",
                element: <AccessDeterminer accessForName="mentorForm" accessForComponent={MentorForm} />
            },
            {
                path: "view",
                element: <AccessDeterminer accessForName="mentorReport" accessForComponent={MentorReport} />
            },
            {
                path: "edit/:mentorId",
                element: <AccessDeterminer accessForName="mentorForm" accessForComponent={MentorEditForm} />
            }
        ]
    },
    {
        path: "/school-data",
        children: [
            {
                path: "add",
                element: <AccessDeterminer accessForName="schoolForm" accessForComponent={SchoolForm} />
            },
            {
                path: "view",
                element: <AccessDeterminer accessForName="schoolReport" accessForComponent={SchoolReport} />
            },
            {
                path: "edit/:schoolId",
                element: <AccessDeterminer accessForName="schoolForm" accessForComponent={SchoolEditForm} />
            }
        ]
    },
    {
        path: "/team-data",
        children: [
            {
                path: "add",
                element: <AccessDeterminer accessForName="teamForm" accessForComponent={TeamForm} />
            },
            {
                path: "view",
                element: <AccessDeterminer accessForName="teamReport" accessForComponent={TeamReport} />
            },
            {
                path: "edit/:teamId",
                element: <AccessDeterminer accessForName="teamForm" accessForComponent={TeamEditForm} />
            }
        ]
    },
    {
        path: "/ta-data",
        children: [
            {
                path: "add",
                element: <AccessDeterminer accessForName="activityForm" accessForComponent={TinkeringActivityForm} />
            },
            {
                path: "view",
                element: <AccessDeterminer accessForName="activityReport" accessForComponent={TinkeringActivityReport} />
            },
            {
                path: "edit/:activityId",
                element: <AccessDeterminer accessForName="activityForm" accessForComponent={TinkeringActivityEditForm} />
            },
            {
                path: "add-subject",
                element: <AccessDeterminer accessForName="addFieldsForm" accessForComponent={TinkeringAddFieldForm} />
            }
        ]
    },
    {
        path: "/competition-data",
        children: [
            {
                path: "add",
                element: <AccessDeterminer accessForName="competitionForm" accessForComponent={CompetitionForm} />
            },
            {
                path: "view",
                element: <AccessDeterminer accessForName="competitionReport" accessForComponent={CompetitionReport} />
            },
            {
                path: "edit/:competitionId",
                element: <AccessDeterminer accessForName="competitionForm" accessForComponent={CompetitionEditForm} />
            },
            {
                path: "archive",
                element: <AccessDeterminer accessForName="competitionArchived" accessForComponent={ArchivedCompetitionReport} />
            },
            //9.1 nageswar
            {
                path: "snapshot",
                element: <AccessDeterminer accessForName="competitionSnapshot" accessForComponent={CompetitionSnapshot} />,
                children: [

                ]
            }//9.1 nageswar
        ]
    },
    {
        path: "/courses-data",
        children: [
            {
                path: "add",
                element: <AccessDeterminer accessForName="coursesForm" accessForComponent={CoursesForm} />
            },
            {
                path: "view",
                element: <AccessDeterminer accessForName="coursesReport" accessForComponent={CoursesReport} />
            },
            {
                path: "edit/:courseId",
                element: <AccessDeterminer accessForName="coursesReport" accessForComponent={CoursesEditForm} />
            }
        ]
    },
    {
        path: "/project-data",
        children: [
            {
                path: "add",
                element: <AccessDeterminer accessForName="projectForm" accessForComponent={ProjectForm} />
            },
            {
                path: "view",
                element: <AccessDeterminer accessForName="projectReport" accessForComponent={ProjectReport} />
            },
            {
                path: "edit/:projID",
                element: <AccessDeterminer accessForName="projectForm" accessForComponent={ProjectEditForm} />
            }
        ]
    },
    {
        path: "/partner-data",
        children: [
            {
                path: "add",
                element: <AccessDeterminer accessForName="partnerForm" accessForComponent={PartnerForm} />
            },
            {
                path: "view",
                element: <AccessDeterminer accessForName="partnerReport" accessForComponent={PartnerReport} />
            },
            {
                path: "edit/:partnerId",
                element: <AccessDeterminer accessForName="partnerForm" accessForComponent={PartnerEditForm} />
            }
        ]
    },
    {
        path: "/fallback",
        element: <FallBack />
    },
    {
        path: "/tasks",
        element: <AccessDeterminer accessForName="tasks" accessForComponent={Tasks} />
    },
    {
        path: "/tasks/edit/:taskId",
        element: <AccessDeterminer accessForName="tasks" accessForComponent={TaskEditForm} />
    },
    {
        path: "/chats",
        element: (localStorage.getItem("auth") !== null) ? (<ChatDashboard />) : (<Login />),
    },
    {
        path: "/chats/:groupId",
        element: (localStorage.getItem("auth") !== null) ? (<Chat />) : (<Login />)
    },
    {
        path: "/chat-with-admin",
        element: (localStorage.getItem("auth") !== null) ? ((role === "admin") ? <AdminChat /> : <UsersChat />) : (<Login />),
    },
    {
        path: "/chat-with-admin/:userId",
        element: (localStorage.getItem("auth") !== null) ? ((role === "admin") ? <AdminIndividualChat /> : <UsersChat />) : (<Login />),
    },
    {
        path: "/offline",
        element: <Offline />,
    },
]);

export default Router;
