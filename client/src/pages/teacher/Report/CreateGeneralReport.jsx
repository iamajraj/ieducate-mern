import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Container from "../../../components/Container";
import axiosInstance from "../../../services/axiosInstance";
import { DatePicker, Input, message, Select } from "antd";
import MainButton from "../../../components/MainButton";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

const CreateGeneralReport = () => {
    const [student, setStudent] = useState(null);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [report, setReport] = useState({
        date: "",
        progress: "",
        attainment: "",
        effort: "",
        comment: "",
    });
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchStudent = async () => {
        try {
            const res = await axiosInstance.get(`/students/${id}`);
            setStudent(res.data.student);
        } catch (err) {}
    };
    useEffect(() => {
        if (id) {
            fetchStudent();
        }
    }, [id]);

    const handleSubjectChange = (value) => {
        setSelectedSubjectId(value);
    };

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
            await axiosInstance.post("/students/general-report", {
                subject_id: selectedSubjectId,
                student_id: id,
                ...report,
            });
            message.success("Report has been created !");
            navigate(-1);
        } catch (err) {
            message.error(
                err.response?.data?.message ?? "Something went wrong."
            );
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
                        <h1 className="text-[22px]">
                            Create General Report for {student?.student_name}
                        </h1>
                        <p className="text-[13px]">
                            Select a subject of the student to create general
                            report
                        </p>
                    </div>
                </div>

                <div className="my-6 border-b"></div>
                {student && (
                    <>
                        <Select
                            placeholder="Select subject"
                            className="w-[170px]"
                            onChange={handleSubjectChange}
                            options={student.subjects.map((subject) => {
                                return {
                                    value: subject._id,
                                    label: subject.subject_name,
                                };
                            })}
                        />

                        <div className="my-7 border-b"></div>

                        {selectedSubjectId ? (
                            <form
                                onSubmit={handleSubmit}
                                className="flex flex-col gap-4"
                                key={selectedSubjectId}
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
                                    />
                                </div>

                                <div className="flex items-start gap-5">
                                    <p className="text-[14px]">Comment:</p>
                                    <Input.TextArea
                                        name="comment"
                                        onChange={handleChange}
                                    />
                                </div>
                                <MainButton
                                    text="Create Report"
                                    type="submit"
                                />
                            </form>
                        ) : (
                            <p className="text-gray-400 font-light">
                                *Select select a subject*
                            </p>
                        )}
                    </>
                )}
            </div>
        </Container>
    );
};

export default CreateGeneralReport;
