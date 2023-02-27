import { createBrowserRouter, Outlet } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import AddAdmin from "../pages/admin/AddAdmin";
import AddStudent from "../pages/admin/AddStudent";
import AddTeacher from "../pages/admin/AddTeacher";
import Admins from "../pages/admin/Admins";
import FeesBilling from "../pages/admin/FeesBilling";
import Students from "../pages/admin/Students";
import Teachers from "../pages/admin/Teachers";

const router = createBrowserRouter([
    // admin route
    {
        path: "/admin/dashboard",
        element: <MainLayout />,
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
                element: <div>Teacher attendance</div>,
            },
            {
                path: "announcements",
                element: <div>announcements</div>,
            },
        ],
    },
]);

export default router;
