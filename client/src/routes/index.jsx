import { createBrowserRouter, Outlet } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import Admins from "../pages/admin/Admins";

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
                        element: <div>register new admin</div>,
                    },
                ],
            },
            {
                path: "teachers",
                children: [
                    {
                        index: true,
                        element: <div>teachers</div>,
                    },
                    {
                        path: "register",
                        element: <div>register new teacher</div>,
                    },
                ],
            },
            {
                path: "students",
                children: [
                    {
                        index: true,
                        element: <div>students</div>,
                    },
                    {
                        path: "register",
                        element: <div>register new students</div>,
                    },
                ],
            },
            {
                path: "fees-billings",
                element: <div>Fees and billings</div>,
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
