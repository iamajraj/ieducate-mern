import React, { useContext, useEffect, useState } from "react";
import GeneralCard from "./component/GeneralCard";
import { authContext } from "../../../context/AuthProvider";
import axiosInstance from "../../../services/axiosInstance";

const StudentGeneralReport = () => {
    const { user } = useContext(authContext);
    const [generalReports, setGeneralReports] = useState([]);

    const getGeneralReports = async (id) => {
        try {
            const res = await axiosInstance.get(
                `/students/general-reports/${id}`
            );
            const { reports } = res.data;
            setGeneralReports(reports);
        } catch (err) {}
    };

    useEffect(() => {
        if (user) {
            getGeneralReports(user?.id);
        }
    }, [user]);

    return (
        <div className="px-[15px] md:px-[48px] md:py-[32px] h-full flex flex-col">
            <h1 className="hidden md:block text-[28px] font-medium">
                General Feedback
            </h1>
            {/* <p className="text-[13px]">Your subject wise feedback is here</p> */}
            <div className="overflow-y-scroll mt-[20px] md:mt-[32px] no-scrollbar h-full flex flex-wrap gap-[32px]">
                {generalReports?.map((report) => {
                    return <GeneralCard report={report} />;
                })}
            </div>
        </div>
    );
};

export default StudentGeneralReport;
