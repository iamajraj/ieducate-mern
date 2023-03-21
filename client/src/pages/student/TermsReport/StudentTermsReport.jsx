import React, { useContext, useEffect, useState } from "react";
import TermsReportCard from "./component/TermsReportCard";
import { authContext } from "../../../context/AuthProvider";
import axiosInstance from "../../../services/axiosInstance";

const StudentTermsReport = () => {
    const { user } = useContext(authContext);
    const [termsReport, setTermsReport] = useState([]);

    const getTermsReport = async (id) => {
        try {
            const res = await axiosInstance.get(`/students/test-reports/${id}`);
            const { reports } = res.data;
            setTermsReport(reports);
        } catch (err) {}
    };

    useEffect(() => {
        if (user) {
            getTermsReport(user?.id);
        }
    }, [user]);

    return (
        <div className="px-[15px] md:px-[48px] mt-[15px] md:py-[32px] h-full flex flex-col">
            <div className="h-full w-full bg-[#CFF0FF] px-[10px] pt-[15px] md:px-[38px] md:pt-[43px] pb-[20px] rounded-[14px] overflow-hidden flex flex-col">
                <h1 className="text-[18px] md:text-[28px] font-medium">
                    Term Reports
                </h1>

                <div className="overflow-y-scroll mt-[32px] no-scrollbar h-full flex flex-col gap-[32px]">
                    {termsReport?.length > 0 ? (
                        termsReport?.map((report) => (
                            <TermsReportCard
                                report={report}
                                key={report?._id}
                            />
                        ))
                    ) : (
                        <p className="text-[14px]">
                            Your term reports will show here once available
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentTermsReport;
