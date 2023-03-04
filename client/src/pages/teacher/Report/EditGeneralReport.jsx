import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Container from "../../../components/Container";
import axiosInstance from "../../../services/axiosInstance";
import { DatePicker, Input, message, Select } from "antd";
import MainButton from "../../../components/MainButton";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import moment from "moment";

const EditGeneralReport = () => {
    const [report, setReport] = useState({
        date: "",
        progress: "",
        attainment: "",
        effort: "",
        comment: "",
    });
    const [loading, setLoading] = useState(false);
    const { id, reportId } = useParams();
    const navigate = useNavigate();

    const fetchReport = async () => {
        try {
            const res = await axiosInstance.get(
                `/students/general-report/${reportId}`
            );
            setReport(res.data.report);
        } catch (err) {
            setReport(null);
        }
    };

    useEffect(() => {
        if (reportId) {
            fetchReport();
        }
    }, [reportId]);

    const handleChange = (e) => {
        setReport((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(report);

        const { date, progress, attainment, comment, effort } = report;

        if (!date || !progress || !attainment || !comment || !effort)
            return message.error("Please provide all fields");

        setLoading(true);

        try {
            await axiosInstance.put(`/students/general-report/${reportId}`, {
                ...report,
            });
            message.success("Report has been updated !");
            navigate(-1);
        } catch (err) {
            message.error(
                err.response?.data?.message ?? "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <div className="bg-white p-8 rounded-lg flex flex-col">
                <div className="flex items-start gap-3">
                    <ArrowLeftOutlined
                        className="mt-2"
                        onClick={() => {
                            navigate(-1);
                        }}
                    />
                    <div>
                        <h1 className="text-[22px]">Edit the report</h1>
                        <p className="text-[13px]">
                            Edit the report and click on the save button to save
                            it !
                        </p>
                    </div>
                </div>

                <div className="my-6 border-b"></div>

                {!report ? (
                    <p>Report doesn't Exists</p>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4"
                    >
                        <div className="flex items-center gap-5">
                            <p className="text-[14px]">Date:</p>
                            <DatePicker
                                onChange={(value) => {
                                    handleChange({
                                        target: {
                                            name: "date",
                                            value: value.toISOString(),
                                        },
                                    });
                                }}
                                value={moment(report.date)}
                            />
                        </div>
                        <div className="flex items-center gap-5">
                            <p className="text-[14px]">Progress:</p>
                            <Select
                                placeholder="Select Progress"
                                className="min-w-[200px]"
                                options={[
                                    {
                                        value: "Below Expected Progress",
                                        label: "Below Expected Progress",
                                    },
                                    {
                                        value: "Making Expected Progress",
                                        label: "Making Expected Progress",
                                    },
                                    {
                                        value: "Above Expected Progress",
                                        label: "Above Expected Progress",
                                    },
                                ]}
                                value={report.progress}
                                onChange={(value) => {
                                    handleChange({
                                        target: {
                                            name: "progress",
                                            value: value,
                                        },
                                    });
                                }}
                            />
                        </div>
                        <div className="flex items-center gap-5">
                            <p className="text-[14px]">Attainment:</p>
                            <Select
                                placeholder="Select Attainment"
                                className="min-w-[200px]"
                                options={[
                                    {
                                        value: "Working towards the national standard",
                                        label: "Working towards the national standard",
                                    },
                                    {
                                        value: "Working at the National Standard",
                                        label: "Working at the National Standard",
                                    },
                                    {
                                        value: "Working at greater depth than the national standard",
                                        label: "Working at greater depth than the national standard",
                                    },
                                ]}
                                onChange={(value) => {
                                    handleChange({
                                        target: {
                                            name: "attainment",
                                            value: value,
                                        },
                                    });
                                }}
                                value={report.attainment}
                            />
                        </div>
                        <div className="flex items-center gap-5">
                            <p className="text-[14px]">Effort:</p>
                            <Select
                                placeholder="Select Attainment"
                                className="min-w-[150px]"
                                options={[
                                    {
                                        value: "Sometimes tried hard",
                                        label: "Sometimes tried hard",
                                    },
                                    {
                                        value: "Tries hard most of the time",
                                        label: "Tries hard most of the time",
                                    },
                                    {
                                        value: "Always tries hard",
                                        label: "Always tries hard",
                                    },
                                ]}
                                onChange={(value) => {
                                    handleChange({
                                        target: {
                                            name: "effort",
                                            value: value,
                                        },
                                    });
                                }}
                                value={report.effort}
                            />
                        </div>

                        <div className="flex items-start gap-5">
                            <p className="text-[14px]">Comment:</p>
                            <Input.TextArea
                                name="comment"
                                onChange={handleChange}
                                value={report.comment}
                            />
                        </div>
                        <MainButton text="Save Report" type="submit" />
                    </form>
                )}
            </div>
        </Container>
    );
};

export default EditGeneralReport;
