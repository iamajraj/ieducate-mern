import React, { useContext, useEffect, useState } from "react";
import { authContext } from "../../context/AuthProvider";
import randomColor from "../../utils/randomColor";
import QuoteLeft from "../../svgassets/QuoteLeft";
import QuoteRight from "../../svgassets/QuoteRight";
import { Slider } from "antd";
import axiosInstance from "../../services/axiosInstance";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const PROGRESS = [
    "Below Expected Progress",
    "Making Expected Progress",
    "Above Expected Progress",
];

const ATTAINMENT = [
    "Working towards the national standard",
    "Working at the National Standard",
    "Working at greater depth than the national standard",
];

const EFFORT = [
    "Sometimes tried hard",
    "Tries hard most of the time",
    "Always tries hard",
];

const StudentDashboard = () => {
    const { user } = useContext(authContext);
    const [announcements, setAnnouncements] = useState([]);
    const [activeInvoice, setActiveInvoice] = useState(null);
    const [termReport, setTermReport] = useState(null);
    const [generalReport, setGeneralReport] = useState(null);

    const navigate = useNavigate();

    const getAnnouncements = async () => {
        try {
            const res = await axiosInstance.get("/announcements");
            setAnnouncements(res.data.announcements);
        } catch (err) {}
    };

    const getActiveInvoice = async (id) => {
        try {
            const res = await axiosInstance.get(`/active-invoice/${id}`);
            const { activeInvoice } = res.data;
            setActiveInvoice(activeInvoice);
        } catch (err) {}
    };

    const getRecentTermsReport = async (id) => {
        try {
            const res = await axiosInstance.get(
                `/students/test-report/recent/${id}`
            );
            const { report } = res.data;
            setTermReport(report);
        } catch (err) {}
    };

    const getRecentGeneralReport = async (id) => {
        try {
            const res = await axiosInstance.get(
                `/students/general-report/recent/${id}`
            );
            const { report } = res.data;
            setGeneralReport(report);
        } catch (err) {}
    };

    useEffect(() => {
        if (user) {
            getAnnouncements();
            getActiveInvoice(user?.id);
            getRecentTermsReport(user?.id);
            getRecentGeneralReport(user?.id);
        }
    }, [user]);

    return (
        <div className="md:pt-[32px] px-[15px] pb-[25px] md:pl-[48px] md:pr-[34px] h-full">
            <h1 className="hidden md:block text-[30px] font-semibold">
                Dashboard
            </h1>

            <div className="mt-[19px] flex flex-col md:flex-row gap-[50px] h-full pb-[25px]">
                <div className="flex-1 flex flex-col">
                    <div className="px-[10px] md:px-[38px] bg-[#FFD2E7] rounded-lg flex justify-between items-center py-3">
                        <h1 className="text-[16px] md:text-[28px] font-semibold text-[#E5247D]">
                            Welcome back, {user?.name}
                        </h1>

                        <img src="/assets/student_table_home.png" alt="" />
                    </div>

                    <div className="flex flex-col md:flex-row gap-[26px] mt-[26px]">
                        <div className="bg-white w-full px-[24px] py-[17px] rounded-[20px]">
                            <h1 className="text-[18px] font-medium">
                                Payment Reminder
                            </h1>
                            <div className="h-[1px] w-full bg-[#E9EBEC] my-4"></div>
                            <div className="flex gap-3 items-center justify-around">
                                <img src="/assets/payment.png" alt="" />
                                <h1 className="text-[22px] text-[#E5247D] font-medium">
                                    {dayjs(activeInvoice?.due_date).format(
                                        "MMMM"
                                    )}{" "}
                                    Invoice
                                </h1>
                            </div>
                            <div className="flex items-center justify-between mt-5 pb-4">
                                <p className="text-[18px]">Due Date: </p>
                                <p className="text-[#E5247D] font-semibold text-[22px]">
                                    {dayjs(activeInvoice?.due_date).format(
                                        "DD/MM/YYYY"
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="bg-white w-full px-[24px] py-[17px] rounded-[20px]">
                            <h1 className="text-[18px] font-medium">
                                Terms Report
                            </h1>
                            <div className="h-[1px] w-full bg-[#E9EBEC] my-4"></div>
                            {termReport ? (
                                <>
                                    {" "}
                                    <div className="flex gap-3 items-center justify-around">
                                        <img src="/assets/report.png" alt="" />
                                        <h1 className="text-[22px] text-[#E5247D] font-medium">
                                            {termReport.subject.subject_name}
                                        </h1>
                                    </div>
                                    <div className="flex flex-col gap-3 mt-5">
                                        <p className="text-[15px]">
                                            Teacher feedback:
                                        </p>
                                        <p className="text-[14px] relative">
                                            <QuoteLeft className="absolute -left-3" />
                                            {termReport?.summary.slice(0, 70) +
                                                "..."}
                                            <span
                                                className="text-blue-500 ml-5 cursor-pointer relative"
                                                onClick={() => {
                                                    navigate(
                                                        `terms-report/${termReport._id}`
                                                    );
                                                }}
                                            >
                                                <QuoteRight className="absolute top-0 -left-5" />
                                                View More
                                            </span>
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <p>No terms report yet.</p>
                            )}
                        </div>
                    </div>

                    <div className="h-full bg-white rounded-[20px] mt-7 px-[25px] pt-[11px]">
                        <h1 className="text-[18px] font-medium border-b border-b-[#E9EBEC] pb-2">
                            General Feedback
                        </h1>
                        {generalReport ? (
                            <>
                                <h2
                                    style={{ color: randomColor() }}
                                    className="text-[22px] font-medium mt-2"
                                >
                                    {generalReport.subject.subject_name}
                                </h2>
                                <p className="font-semibold text-black text-[12px] my-2">
                                    Teacher Comment:
                                </p>
                                <p className="text-[13px] relative ml-3">
                                    <QuoteLeft className="absolute -left-3" />
                                    {generalReport?.comment}
                                    <span className="text-blue-500 ml-5 cursor-pointer relative">
                                        <QuoteRight className="absolute top-0 -left-5" />
                                    </span>
                                </p>
                                <div className="flex items-center mt-4 gap-[40px]">
                                    <div className="w-full">
                                        <p className="text-[14px]">Progress</p>
                                        <Slider
                                            trackStyle={{
                                                backgroundColor: "#78B72B",
                                            }}
                                            railStyle={{
                                                backgroundColor: "#ECFFD4",
                                            }}
                                            className="progress_slider"
                                            min={0}
                                            max={3}
                                            value={
                                                PROGRESS.indexOf(
                                                    generalReport?.progress
                                                ) + 1
                                            }
                                            tooltip={{
                                                formatter: (index) => {
                                                    let value =
                                                        PROGRESS[index - 1];
                                                    return value;
                                                },
                                            }}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <p className="text-[14px]">
                                            Attainment
                                        </p>
                                        <Slider
                                            trackStyle={{
                                                backgroundColor: "#ED6F1B",
                                            }}
                                            railStyle={{
                                                backgroundColor: "#FFE6D6",
                                            }}
                                            className="attainment_slider"
                                            min={0}
                                            max={3}
                                            value={
                                                ATTAINMENT.indexOf(
                                                    generalReport?.attainment
                                                ) + 1
                                            }
                                            tooltip={{
                                                formatter: (index) => {
                                                    let value =
                                                        ATTAINMENT[index - 1];
                                                    return value;
                                                },
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="w-full max-w-[500px]">
                                    <p className="text-[14px]">Effort</p>
                                    <Slider
                                        trackStyle={{
                                            backgroundColor: "#199FDA",
                                        }}
                                        railStyle={{
                                            backgroundColor: "#EFFAFF",
                                        }}
                                        className="effort_slider"
                                        min={0}
                                        max={3}
                                        value={
                                            EFFORT.indexOf(
                                                generalReport?.effort
                                            ) + 1
                                        }
                                        tooltip={{
                                            formatter: (index) => {
                                                let value = EFFORT[index - 1];
                                                return value;
                                            },
                                        }}
                                    />
                                </div>
                            </>
                        ) : (
                            <p>No general report yet.</p>
                        )}
                    </div>
                </div>
                <div className="md:w-[30%] bg-white rounded-[20px] shadow-sm px-[17px] py-[24px] h-full overflow-hidden flex flex-col">
                    <h1 className="text-[20px] text-[#3F434A] font-semibold pb-[10px] border-b-2 border-b-[#E9EBEC]">
                        Announcements
                    </h1>

                    <div className="flex flex-col h-full overflow-y-scroll no-scrollbar mt-5">
                        {announcements
                            .map((item) => (
                                <div className="pb-6">
                                    <h1
                                        // style={{ color: randomColor() }}
                                        className="font-semibold text-[#E5247D]"
                                    >
                                        {item.title}
                                    </h1>

                                    <p className="font-semibold my-3">
                                        Dear Student
                                    </p>
                                    <p>{item.description}</p>

                                    <div className="mt-4">
                                        <p>Thanks</p>
                                        <p className="font-semibold">Admin</p>
                                    </div>
                                    <div className="h-[1px] w-full bg-[#E9EBEC] mt-4"></div>
                                </div>
                            ))
                            .reverse()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
