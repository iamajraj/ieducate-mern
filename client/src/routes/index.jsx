import { useEffect } from "react";
import { createBrowserRouter, useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";

import Admins from "../pages/admin/Admin/Admins";
import AddAdmin from "../pages/admin/Admin/AddAdmin";
import AdminLogin from "../pages/admin/Admin/AdminLogin";

import AddTeacher from "../pages/admin/Teacher/AddTeacher";
import TeacherAttendance from "../pages/admin/Teacher/TeacherAttendance";
import SetTeacherAttendance from "../pages/admin/Teacher/SetTeacherAttendance";
import Teachers from "../pages/admin/Teacher/Teachers";

import AddStudent from "../pages/admin/Student/AddStudent";
import Students from "../pages/admin/Student/Students";

import AddAnnouncement from "../pages/admin/Announcements/AddAnnouncement";
import FeesBilling from "../pages/admin/FeesBilling";
import Announcements from "../pages/admin/Announcements/Announcement";
import Home from "../pages/Home";

const AdminProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            return navigate("/admin");
        } else if (user.user_type !== "admin") {
            return navigate("/admin");
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
                        element: <Admins />,
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
                        ],
                    },
                    {
                        path: "fees-billings",
                        element: <FeesBilling />,
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
]);

export default router;
