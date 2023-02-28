import React, { useState } from "react";
import Container from "../../../components/Container";
import InputField from "../../../components/InputField";
import MainButton from "../../../components/MainButton";
import validateEmail from "../../../utils/validateEmail";
import axiosInstance from "../../../services/axiosInstance";
import { message } from "antd";
import { Link } from "react-router-dom";

const AddAdmin = () => {
    const [adminInfo, setAdminInfo] = useState({
        name: "",
        email: "",
        username: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [info, setInfo] = useState("");

    const onChange = (e) => {
        setAdminInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, email, username, password } = adminInfo;

        if (!name || !email || !username || !password)
            return setInfo("All fields are required");

        if (!validateEmail(email))
            return setInfo("Please enter a valid email address");

        setInfo("");
        setLoading(true);

        try {
            await axiosInstance.post("/admins", adminInfo);
            message.success("New Admin Created", 2);
            setAdminInfo({ name: "", email: "", username: "", password: "" });
        } catch (err) {
            setInfo(err.response.data?.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <div className="bg-white p-8 rounded-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-[24px]">Add Admin</h1>
                        <p className="text-[13px] mt-2">
                            Add the following details to add new admin
                        </p>
                    </div>
                    <Link to="/admin/dashboard/admins">
                        <MainButton
                            text="View Admin"
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
                            value={adminInfo.name}
                            onChange={onChange}
                            label="Name *"
                            placeholder="Enter the name"
                        />
                        <InputField
                            name="email"
                            value={adminInfo.email}
                            onChange={onChange}
                            label="Email *"
                            placeholder="Enter the email"
                        />
                    </div>
                    <div className="flex items-center gap-10">
                        <InputField
                            value={adminInfo.username}
                            onChange={onChange}
                            name="username"
                            label="Username *"
                            placeholder="Enter the username"
                        />
                        <InputField
                            value={adminInfo.password}
                            onChange={onChange}
                            name="password"
                            label="Password *"
                            placeholder="Enter new password"
                            isPassword
                        />
                    </div>

                    {info && <p className="text-red-500 text-[15px]">{info}</p>}

                    <MainButton
                        type="submit"
                        loading={loading}
                        text="Add"
                        className={` mt-5 py-7 w-[180px] ml-auto text-[20px]`}
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

export default AddAdmin;
