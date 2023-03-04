import { message } from "antd";
import React, { useContext, useEffect, useState } from "react";
import Container from "../../components/Container";
import InputField from "../../components/InputField";
import MainButton from "../../components/MainButton";
import { authContext } from "../../context/AuthProvider";
import axiosInstance from "../../services/axiosInstance";

const CredentialsUpdate = () => {
    const { user, setUser } = useContext(authContext);
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { email, password } = credentials;

        if (!email && !password)
            return message.error(
                "Please provide email or new password to update"
            );

        setLoading(true);
        try {
            const res = await axiosInstance.patch(
                "/teachers/update-credentials",
                credentials
            );
            localStorage.setItem("user", JSON.stringify(res.data.user));
            setUser(res.data.user);
            message.success("Credentials are updated !");
        } catch (err) {
            message.error(err.response?.data.message ?? "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const onChange = (e) => {
        setCredentials((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    useEffect(() => {
        if (user) {
            setCredentials({
                email: user.email,
                password: "",
            });
        }
    }, [user]);

    return (
        <Container>
            <div className="bg-white p-8 rounded-lg flex flex-col">
                <div>
                    <h1 className="text-[22px]">Update your credentials</h1>
                    <p className="text-[13px]">
                        Fill the below inputs to update your own email and
                        password
                    </p>
                </div>

                <div className="my-5 border-b"></div>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5 mt-5"
                >
                    <InputField
                        value={credentials.email}
                        label="Email"
                        placeholder="Enter the email"
                        name="email"
                        onChange={onChange}
                    />
                    <InputField
                        value={credentials.password}
                        label="New Password"
                        placeholder="Enter the password"
                        name="password"
                        onChange={onChange}
                        isPassword
                    />
                    <MainButton
                        loading={loading}
                        type="submit"
                        text="Update"
                        className="py-6 text-[18px]"
                    />
                </form>
            </div>
        </Container>
    );
};

export default CredentialsUpdate;
