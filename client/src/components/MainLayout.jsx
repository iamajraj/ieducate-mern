import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex h-screen w-full overflow-hidden">
            <Sidebar
                className="h-full"
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />
            <div className="flex-1 w-full h-full flex flex-col">
                <div
                    className={`fixed ${
                        collapsed
                            ? "w-[calc(100%-85px)]"
                            : "w-[calc(100%-250px)]"
                    } bg-white z-50`}
                >
                    <Header />
                </div>
                <div className="mt-[70px] overflow-y-scroll h-full bg-[#F3F3F9] pb-[40px]">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
