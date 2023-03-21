import { Button, Select, DatePicker, InputNumber, Input, message } from "antd";
import React, { useEffect, useState } from "react";
import Container from "../../../components/Container";
import InputField from "../../../components/InputField";
import { DeleteOutlined, EyeFilled } from "@ant-design/icons";
import validEmail from "../../../utils/validateEmail.js";
import axiosInstance from "../../../services/axiosInstance";
import SelectSubjectModal from "./Subject/SelectSubjectModal";
import ViewSubjectModal from "./Subject/ViewSubjectModal";

const initialData = {
    student_roll_no: "",
    student_name: "",
    student_address: "",
    student_telephone: "",
    emergency_name: "",
    emergency_contact_number: "",
    email: "",
    learning_support_needs: "",
    year: 10,
    number_of_subject: 0,
    subjects: [],
    registration_date: "",
    registration_amount: "",
    status: "Active",
    password: "",
};

const AddStudent = () => {
    const [studentData, setStudentData] = useState(initialData);
    const [subjectData, setSubjectData] = useState([]);
    const [showSelectSubject, setShowSelectSubject] = useState(false);
    const [viewSubject, setViewSubject] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (studentData.number_of_subject === 0) {
            return message.error("Please add student subjects");
        }

        if (
            studentData.subjects.length < 1 &&
            studentData.number_of_subject > 0
        ) {
            return message.error("Please add the selected numbered subjects");
        }

        let err;
        Object.keys(studentData).some((key) => {
            let value = studentData[key];

            if (value === null || value === "" || value?.length < 1) {
                err = true;
                return message.error("Required fields can't be empty", 2);
            }
        });

        if (err) return;

        if (!validEmail(studentData.email))
            return message.error("Email is not valid", 2);

        setLoading(true);

        try {
            await axiosInstance.post("/students", studentData);
            message.success("Student has been created successfully !", 2);
            setStudentData(initialData);
            setSubjectData([]);
        } catch (err) {
            message.error(
                err.response?.data?.message ?? "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    const onChange = (e, type, key) => {
        if (type === "date") {
            const date = e.toISOString();
            setStudentData((prev) => ({
                ...prev,
                [key]: date,
            }));
        } else if (type === "select") {
            setStudentData((prev) => ({
                ...prev,
                [key]: e,
            }));
        } else {
            setStudentData((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
            }));
        }
    };

    const removeSubject = (subject) => {
        setSubjectData((prev) =>
            prev.filter((sub) => sub.local_id !== subject.local_id)
        );
    };

    useEffect(() => {
        setStudentData((prev) => ({ ...prev, subjects: subjectData }));
    }, [subjectData]);

    return (
        <Container>
            <div className="bg-white p-8 rounded-lg">
                <h1 className="text-[24px]">Add Student</h1>
                <p className="text-[13px] mt-2">
                    Add the following details to add new student
                </p>
                <div className="border-b w-full my-7"></div>
                <form
                    onSubmit={handleSubmit}
                    className="w-full flex flex-col gap-7"
                >
                    <div className="flex items-center gap-10">
                        <InputField
                            className=""
                            label="Student Roll No *"
                            placeholder="Enter the roll number"
                            type="number"
                            name="student_roll_no"
                            value={studentData.student_roll_no}
                            onChange={onChange}
                        />
                        <InputField
                            className=""
                            label="Student Name *"
                            placeholder="Enter the student name"
                            name="student_name"
                            value={studentData.student_name}
                            onChange={onChange}
                        />
                        <InputField
                            className=""
                            label="Student Address *"
                            placeholder="Enter the student address"
                            name="student_address"
                            onChange={onChange}
                            value={studentData.student_address}
                        />
                        <InputField
                            label="Student Telephone *"
                            placeholder="Enter the student telephone"
                            type="number"
                            name="student_telephone"
                            onChange={onChange}
                            value={studentData.student_telephone}
                        />
                    </div>
                    <div className="flex items-center gap-10">
                        <InputField
                            label="Emergency Name *"
                            placeholder="Enter the emergency name"
                            name="emergency_name"
                            onChange={onChange}
                            value={studentData.emergency_name}
                        />
                        <InputField
                            label="Emergency Contact Number *"
                            placeholder="Enter the emergency contact number"
                            type="number"
                            name="emergency_contact_number"
                            onChange={onChange}
                            value={studentData.emergency_contact_number}
                        />
                        <InputField
                            label="Email *"
                            placeholder="Enter the email"
                            type="email"
                            name="email"
                            onChange={onChange}
                            value={studentData.email}
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label>
                            Learning Support Needs *{" "}
                            <span className="text-[13px]">(150 character)</span>
                        </label>
                        <Input.TextArea
                            rows={2}
                            placeholder="Enter the learning support needs"
                            maxLength={150}
                            className="text-[15px]"
                            name="learning_support_needs"
                            onChange={onChange}
                            value={studentData.learning_support_needs}
                        />
                    </div>
                    <div className="flex items-center gap-10">
                        <div className="flex flex-col">
                            <label className="text-[18px]">Year *</label>
                            <Select
                                defaultValue="1"
                                style={{ width: 120 }}
                                className="border py-2 mt-2 rounded-md"
                                bordered={false}
                                name="year"
                                value={studentData.year}
                                onChange={(value) =>
                                    onChange(value, "select", "year")
                                }
                                // onChange={handleChange}
                                options={Array(12)
                                    .fill(0)
                                    .map((v, i) => ({
                                        value: i + 1,
                                        label: i + 1,
                                    }))}
                            />
                        </div>
                        <InputField
                            label="Number of subject *"
                            placeholder="Enter the number of subject"
                            type="number"
                            value={studentData.number_of_subject}
                            name="number_of_subject"
                            onChange={(e) => {
                                if (
                                    Number(e.target.value) <
                                    studentData.subjects.length
                                )
                                    return message.error(
                                        "First remove the added subject"
                                    );
                                onChange({
                                    target: {
                                        name: e.target.name,
                                        value: Number(e.target.value),
                                    },
                                });
                            }}
                        />
                        <div
                            onClick={() => {
                                if (
                                    Number(studentData.number_of_subject) >
                                    studentData.subjects.length
                                ) {
                                    setShowSelectSubject(true);
                                } else {
                                    message.error(
                                        "Please increase the number of subject before adding more"
                                    );
                                }
                            }}
                            className="bg-main text-white px-4 mt-7 rounded-lg
                         text-center text-[14px] cursor-pointer hover:border hover:border-main hover:bg-transparent hover:text-main shrink-0 py-3"
                        >
                            Add Subject
                        </div>
                    </div>
                    <div className="flex gap-7 flex-wrap">
                        {studentData.subjects.length > 0 ? (
                            studentData.subjects.map((subject) => (
                                <div
                                    className="flex flex-col gap-5"
                                    key={subject?._id}
                                >
                                    <h2>Subjects</h2>
                                    <div className="border border-main rounded-md px-10 text-[15px] py-3  hover:bg-gray-200 cursor-pointer relative">
                                        <div
                                            onClick={() =>
                                                removeSubject(subject)
                                            }
                                            className="absolute -top-3 -right-1 bg-white rounded-full text-red-500 shadow-md border px-1 active:scale-110 transition-all"
                                        >
                                            <DeleteOutlined />
                                        </div>
                                        <div
                                            onClick={() =>
                                                setViewSubject(subject)
                                            }
                                            className="absolute -top-3 right-6 bg-white rounded-full text-blue-500 shadow-md border px-1 active:scale-110 transition-all"
                                        >
                                            <EyeFilled />
                                        </div>
                                        {subject.subject_name}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-[14px] font-light">
                                *Selected subject will show here*
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-10">
                        <div className="flex flex-col shrink-0">
                            <label className="">Registration Date *</label>
                            <DatePicker
                                className="py-3 mt-2 text-[18px]"
                                onChange={(value) =>
                                    onChange(value, "date", "registration_date")
                                }
                            />
                        </div>
                        <div className="flex flex-col gap-3 shrink-0">
                            <label htmlFor="">
                                Registration Amount (in GBP)*
                            </label>
                            <InputNumber
                                defaultValue={0}
                                formatter={(value) => `£ ${value}`}
                                className="w-full py-2 text-[17px]"
                                min={0}
                                name="registration_amount"
                                onChange={(value) => {
                                    onChange({
                                        target: {
                                            name: "registration_amount",
                                            value: value,
                                        },
                                    });
                                    console.log(value);
                                }}
                                value={studentData.registration_amount}
                            />
                        </div>
                        <div className="flex flex-col gap-3 shrink-0">
                            <label>Status *</label>
                            <Select
                                defaultValue="Status"
                                className="py-2 border rounded-lg"
                                bordered={false}
                                style={{ width: 120 }}
                                options={[
                                    { value: "Active", label: "Active" },
                                    { value: "Suspended", label: "Suspended" },
                                    { value: "Left", label: "Left" },
                                ]}
                                name="status"
                                onChange={(value) =>
                                    onChange(value, "select", "status")
                                }
                                value={studentData.status}
                            />
                        </div>
                        <InputField
                            label="Student Password *"
                            placeholder="Enter the password for student"
                            name="password"
                            className=""
                            onChange={onChange}
                            value={studentData.password}
                            isPassword
                        />
                        <Button
                            loading={loading}
                            htmlType="submit"
                            className={`flex items-center bg-main text-white  justify-center hover:bg-transparent cursor-pointer mt-5 py-7 w-[180px] ml-auto`}
                        >
                            <p className={`text-[18px]`}>Add</p>
                        </Button>
                    </div>
                </form>
            </div>

            {/* View Subject */}
            <ViewSubjectModal
                open={viewSubject}
                subject={viewSubject}
                setOpen={setViewSubject}
                removeSubject={removeSubject}
            />

            {/* Select Subject */}
            <SelectSubjectModal
                open={showSelectSubject}
                numberOfSubject={studentData.number_of_subject}
                setSubjectData={setSubjectData}
                setOpen={setShowSelectSubject}
            />
        </Container>
    );
};

export default AddStudent;
