import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import StudentHeader from "./StudentHeader";
import StudentSidebar from "./StudentSidebar";

const StudentLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileCollapsed, setMobileCollapsed] = useState(true);
    const [currentMenu, setCurrentMenu] = useState("Dashboard");

    return (
        <div className="flex h-full md:h-screen w-full ">
            <StudentSidebar
                className="h-screen hidden md:block z-[999]"
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />

            {/* Mobile View */}
            <StudentSidebar
                className="h-screen fixed top-0 md:hidden z-[999]"
                collapsed={mobileCollapsed}
                setCollapsed={setMobileCollapsed}
                setCurrentMenu={setCurrentMenu}
                mobile
            />

            <div className="flex-1 w-full h-full flex flex-col">
                <div
                    className={`fixed ${
                        collapsed
                            ? "w-[calc(100%-85px)]"
                            : "w-[calc(100%-250px)]"
                    } bg-white z-50 hidden md:block`}
                >
                    <StudentHeader />
                </div>

                <div className="md:hidden">
                    <StudentHeader
                        setCollapsed={setMobileCollapsed}
                        title={currentMenu}
                    />
                </div>
                <div className="md:mt-[70px] overflow-y-scroll h-full bg-[#F3F3F9] pb-[40px]">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default StudentLayout;
