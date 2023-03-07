import { useEffect } from "react";
import { createBrowserRouter, Navigate, useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";

import Admins from "../pages/admin/Admin/Admins";
import AddAdmin from "../pages/admin/Admin/AddAdmin";
import AdminLogin from "../pages/admin/AdminLogin";

import TeacherLogin from "../pages/teacher/TeacherLogin";
import AddTeacher from "../pages/admin/Teacher/AddTeacher";
import TeacherAttendance from "../pages/admin/Teacher/TeacherAttendance";
import SetTeacherAttendance from "../pages/admin/Teacher/SetTeacherAttendance";
import Teachers from "../pages/admin/Teacher/Teachers";

import AllStudents from "../pages/teacher/Report/AllStudents";
import CreateGeneralReport from "../pages/teacher/Report/CreateGeneralReport";
import CreateTestReport from "../pages/teacher/Report/CreateTestReport";

import AddStudent from "../pages/admin/Student/AddStudent";
import Students from "../pages/admin/Student/Students";

import AddAnnouncement from "../pages/admin/Announcements/AddAnnouncement";
import FeesBilling from "../pages/admin/feesbillings/FeesBilling";
import FeesStudents from "../pages/admin/feesbillings/FeesStudents";
import Announcements from "../pages/admin/Announcements/Announcement";
import Home from "../pages/Home";
import EditStudent from "../pages/admin/Student/EditStudent";
import ViewFees from "../pages/admin/feesbillings/ViewFees";
import CredentialsUpdate from "../pages/teacher/CredentialsUpdate";
import TrackAttendance from "../pages/teacher/TrackAttendance";
import StudentReports from "../pages/teacher/Report/StudentReports";
import EditGeneralReport from "../pages/teacher/Report/EditGeneralReport";
import Dashboard from "../pages/Dashboard";
import AllFees from "../pages/admin/feesbillings/AllFees";
import EditTestReport from "../pages/teacher/Report/EditTestReport";

const AdminProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            return navigate("/admin");
        } else if (user.user_type !== "admin") {
            return navigate("/");
        }
    }, []);
    return children;
};

const TeacherProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            return navigate("/teacher");
        } else if (user.user_type !== "teacher") {
            return navigate("/");
        }
    }, []);
    return children;
};

const AuthRoute = ({ children }) => {
    const navigate = useNavigate();
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            switch (user.user_type) {
                case "admin":
                    return navigate("/admin/dashboard");
                case "teacher":
                    return navigate("/teacher/dashboard");
                case "student":
                    return navigate("/student/dashboard");
            }
        }
    }, []);
    return children;
};

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <AuthRoute>
                <Home />
            </AuthRoute>
        ),
    },
    // admin route
    {
        path: "/admin",
        children: [
            {
                index: true,
                element: (
                    <AuthRoute>
                        <AdminLogin />
                    </AuthRoute>
                ),
            },
            {
                path: "dashboard",
                element: (
                    <AdminProtectedRoute>
                        <MainLayout />
                    </AdminProtectedRoute>
                ),
                children: [
                    {
                        index: true,
                        element: <Dashboard />,
                    },
                    {
                        path: "admins",
                        children: [
                            {
                                index: true,
                                element: <Admins />,
                            },
                            {
                                path: "register",
                                element: <AddAdmin />,
                            },
                        ],
                    },
                    {
                        path: "teachers",
                        children: [
                            {
                                index: true,
                                element: <Teachers />,
                            },
                            {
                                path: "register",
                                element: <AddTeacher />,
                            },
                        ],
                    },
                    {
                        path: "students",
                        children: [
                            {
                                index: true,
                                element: <Students />,
                            },
                            {
                                path: "register",
                                element: <AddStudent />,
                            },
                            {
                                path: "edit/:id",
                                element: <EditStudent />,
                            },
                        ],
                    },
                    {
                        path: "fees-billings",
                        children: [
                            {
                                index: true,
                                element: <FeesStudents />,
                            },
                            {
                                path: ":student_id",
                                children: [
                                    {
                                        index: true,
                                        element: <FeesBilling />,
                                    },
                                    {
                                        path: "view/:fee_id",
                                        element: <ViewFees />,
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        path: "teachers-attendance",
                        children: [
                            {
                                index: true,
                                element: <TeacherAttendance />,
                            },
                            {
                                path: ":id",
                                element: <SetTeacherAttendance />,
                            },
                        ],
                    },
                    {
                        path: "announcements",
                        children: [
                            {
                                index: true,
                                element: <Announcements />,
                            },
                            {
                                path: "add",
                                element: <AddAnnouncement />,
                            },
                        ],
                    },
                ],
            },
        ],
    },
    // teacher route
    {
        path: "/teacher",
        children: [
            {
                index: true,
                element: <TeacherLogin />,
            },
            {
                path: "dashboard",
                element: (
                    <TeacherProtectedRoute>
                        <MainLayout />
                    </TeacherProtectedRoute>
                ),
                children: [
                    {
                        index: true,
                        element: <AllStudents />,
                    },
                    {
                        path: "update",
                        element: <CredentialsUpdate />,
                    },
                    {
                        path: "track-attendance",
                        element: <TrackAttendance />,
                    },
                    {
                        path: "reports",
                        children: [
                            {
                                index: true,
                                element: <Navigate to="/teacher/dashboard" />,
                            },
                            {
                                path: ":id",
                                children: [
                                    {
                                        index: true,
                                        element: <StudentReports />,
                                    },
                                    {
                                        path: "general-report",
                                        children: [
                                            {
                                                index: true,
                                                element: (
                                                    <CreateGeneralReport />
                                                ),
                                            },
                                            {
                                                path: "edit/:reportId",
                                                element: <EditGeneralReport />,
                                            },
                                        ],
                                    },
                                    {
                                        path: "test-report",
                                        children: [
                                            {
                                                index: true,
                                                element: <CreateTestReport />,
                                            },
                                            {
                                                path: "edit/:reportId",
                                                element: <EditTestReport />,
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
]);

export default router;
