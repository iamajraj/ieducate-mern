import { message } from "antd";
import React, { useState } from "react";
import Container from "../../../components/Container";
import InputField from "../../../components/InputField";
import axiosInstance from "../../../services/axiosInstance";
import MainButton from "../../../components/MainButton";
import { Link } from "react-router-dom";

const AddTeacher = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        username: "",
        password: "",
        speciality: "",
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { email, username, name, password, speciality } = data;

        if (!email || !username || !name || !password)
            return message.error("Required fields can't be empty!", 2);

        setLoading(true);

        try {
            await axiosInstance.post("/teachers", data);
            message.success("Teacher has been created", 2);
            setData({
                name: "",
                email: "",
                username: "",
                password: "",
                speciality: "",
            });
        } catch (err) {
            message.error(
                err.response?.data?.message ?? "Something went wrong",
                2
            );
        } finally {
            setLoading(false);
        }
    };

    const onChange = (e) => {
        setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <Container>
            <div className="bg-white p-8 rounded-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-[24px]">Add Teacher</h1>
                        <p className="text-[13px] mt-2">
                            Add the following details to add new teacher
                        </p>
                    </div>
                    <Link to="/admin/dashboard/teachers">
                        <MainButton
                            text="View Teacher"
                            className="py-4"
                            textClass="text-[15px]"
                        />
                    </Link>
                </div>
                <div className="border-b w-full my-7"></div>
                <form
                    onSubmit={handleSubmit}
                    className="w-full flex flex-col gap-7"
                >
                    <div className="flex items-center gap-10">
                        <InputField
                            name="name"
                            onChange={onChange}
                            value={data.name}
                            label="Name *"
                            placeholder="Enter the name"
                        />
                        <InputField
                            name="email"
                            onChange={onChange}
                            label="Email *"
                            value={data.email}
                            placeholder="Enter the email"
                        />
                    </div>
                    <div className="flex items-center gap-10">
                        <InputField
                            name="username"
                            onChange={onChange}
                            label="Username *"
                            value={data.username}
                            placeholder="Enter the username"
                        />
                        <InputField
                            name="password"
                            onChange={onChange}
                            label="Password *"
                            value={data.password}
                            placeholder="Enter new password"
                            isPassword
                        />
                    </div>
                    <InputField
                        name="speciality"
                        onChange={onChange}
                        value={data.speciality}
                        label="Teacher Speciality"
                        placeholder="Enter teacher speciality (if any)"
                    />
                    <MainButton
                        loading={loading}
                        type="submit"
                        className="text-white mt-5 py-7 w-[180px] ml-auto text-[18px]"
                        text="Add"
                    />
                </form>

                <div className="mt-8">
                    <p className="border-b w-max pb-2">Requirements</p>
                    <ul className="mt-4 flex flex-col gap-3 ml-7">
                        <li className="text-[13px] list-disc ">
                            The fields marked with (*) is required
                        </li>
                        <li className="text-[13px] list-disc ">
                            The email should be unique per user
                        </li>
                        <li className="text-[13px] list-disc ">
                            Multiple user with same email not allowed
                        </li>
                    </ul>
                </div>
            </div>
        </Container>
    );
};
export default AddTeacher;
