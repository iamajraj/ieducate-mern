import { Button, Select, DatePicker, InputNumber, Input } from "antd";
import React from "react";
import Container from "../../../components/Container";
import InputField from "../../../components/InputField";

const AddStudent = () => {
    const handleSubmit = (e) => {
        e.preventDefaul();
    };
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
                        />
                        <InputField
                            className=""
                            label="Student Name *"
                            placeholder="Enter the student name"
                        />
                        <InputField
                            className=""
                            label="Student Address *"
                            placeholder="Enter the student address"
                        />
                        <InputField
                            label="Student Telephone *"
                            placeholder="Enter the student telephone"
                            type="number"
                        />
                    </div>
                    <div className="flex items-center gap-10">
                        <InputField
                            label="Emergency Name *"
                            placeholder="Enter the emergency name"
                        />
                        <InputField
                            label="Emergency Contact Number *"
                            placeholder="Enter the emergency contact number"
                            type="number"
                        />
                        <InputField
                            label="Email *"
                            placeholder="Enter the email"
                            type="email"
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
                                // onChange={handleChange}
                                options={Array(12)
                                    .fill(0)
                                    .map((v, i) => ({ value: i, label: i }))}
                            />
                        </div>
                        <InputField
                            label="Number of subject *"
                            placeholder="Enter the number of subject"
                            type="number"
                        />
                        <div
                            className="bg-main text-white py-1 px-4 mt-7 rounded-lg
                         text-center text-[14px] cursor-pointer hover:border hover:border-main hover:bg-transparent hover:text-main"
                        >
                            Select Subjects
                        </div>
                        <div className="w-full flex flex-col">
                            <label className="">Registration Date *</label>
                            <DatePicker className="py-3 mt-2 text-[18px]" />
                        </div>
                    </div>
                    <div className="flex items-center gap-10">
                        <div className="flex flex-col gap-3">
                            <label htmlFor="">
                                Registration Amount (in GBP)*
                            </label>
                            <InputNumber
                                defaultValue={0}
                                formatter={(value) =>
                                    `$ ${value}`.replace(
                                        /\B(?=(\d{3})+(?!\d))/g,
                                        ","
                                    )
                                }
                                className="w-full py-2 text-[17px]"
                                parser={(value) =>
                                    value.replace(/\$\s?|(,*)/g, "")
                                }
                            />
                        </div>
                        <div className="flex flex-col gap-3">
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
                            />
                        </div>

                        <Button
                            type="text"
                            className={`flex items-center bg-main text-white  justify-center hover:bg-transparent cursor-pointer mt-5 py-7 w-[180px] ml-auto`}
                        >
                            <p className={`text-[18px]`}>Add</p>
                        </Button>
                    </div>
                </form>
            </div>
        </Container>
    );
};

export default AddStudent;
