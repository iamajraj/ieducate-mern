import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./admin/Sidebar";

const MainLayout = () => {
    return (
        <div className="flex h-screen w-full">
            <Sidebar />
            <div className="flex-1 w-full h-full flex flex-col">
                <Header />
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;
