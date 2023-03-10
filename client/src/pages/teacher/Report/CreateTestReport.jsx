import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Container from "../../../components/Container";
import axiosInstance from "../../../services/axiosInstance";
import { Button, DatePicker, Input, message, Select } from "antd";
import MainButton from "../../../components/MainButton";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeftOutlined,
    InboxOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import { Upload } from "antd";

const CreateGeneralReport = () => {
    const [student, setStudent] = useState(null);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [report, setReport] = useState({
        feedback_files: [],
        date: "",
        summary: "",
        comment: "",
    });
    const [files, setFiles] = useState([]);
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

        const { date, comment, summary } = report;

        if (!selectedSubjectId || !student) return;

        if (!date || !comment || !summary)
            return message.error("Please provide all fields");

        setLoading(true);

        const formData = new FormData();

        formData.append("subject_id", selectedSubjectId);
        formData.append("student_id", id);
        formData.append("comment", comment);
        formData.append("date", date);
        formData.append("summary", summary);

        files.forEach((file) => {
            formData.append("feedback_files[]", file);
        });

        try {
            await axiosInstance.post("/students/test-report", formData);
            message.success("Report has been created !");
            navigate(-1);
            navigate("#test_reports");
        } catch (err) {
            message.error(
                err.response?.data?.message ?? "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setReport((prev) => ({ ...prev, feedback_files: files }));
    }, [files]);

    const props = {
        onRemove: (file) => {
            const index = files.indexOf(file);
            const newFileList = files.slice();
            newFileList.splice(index, 1);
            setFiles(newFileList);
        },
        files,
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
                            Create Test Report for {student?.student_name}
                        </h1>
                        <p className="text-[13px]">
                            Select a subject of the student to create test
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

                                <div className="flex items-start gap-5">
                                    <p className="text-[14px]">Comment:</p>
                                    <Input.TextArea
                                        name="comment"
                                        onChange={handleChange}
                                        placeholder="Add feedback"
                                    />
                                </div>
                                <div className="flex items-start gap-5">
                                    <p className="text-[14px]">Summary:</p>
                                    <Input.TextArea
                                        name="summary"
                                        placeholder="Add Summary"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex gap-5">
                                    <p className="">Feedback Files:</p>
                                    <Upload
                                        {...props}
                                        accept=".pdf"
                                        listType="picture"
                                        beforeUpload={(file) => {
                                            setFiles((prev) => [...prev, file]);
                                            return false;
                                        }}
                                    >
                                        <Button icon={<UploadOutlined />}>
                                            Select File
                                        </Button>
                                    </Upload>
                                </div>
                                <MainButton
                                    loading={loading}
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
