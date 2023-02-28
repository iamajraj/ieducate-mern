import React from "react";
import InputField from "./InputField";
import MainButton from "./MainButton";

const Login = ({ usertype, onSubmit, loading, values, onChange, message }) => {
    return (
        <div className="flex items-center justify-center h-screen w-full bg-[#f8f8f8] flex-col gap-[30px]">
            <div className="bg-white shadow-md w-full max-w-[500px] rounded-lg px-5 py-7">
                <h1 className="text-[28px] font-bold leading-[25px] relative w-max">
                    Welcome to iEducate
                    <span className="text-[20px] font-normal absolute -top-[25px] right-0">
                        {usertype}
                    </span>
                </h1>
                <p className="text-[13px] mt-3">
                    Enter the credentials to login
                </p>
                <div className="my-7 border-b"></div>
                <form onSubmit={onSubmit} className="flex flex-col gap-5">
                    <InputField
                        name="email"
                        label="Email"
                        placeholder="Enter your email address"
                        value={values.email}
                        onChange={onChange}
                    />

                    <InputField
                        name="password"
                        label="Password"
                        placeholder="Enter your password"
                        isPassword
                        value={values.password}
                        onChange={onChange}
                    />

                    <div>
                        {message && (
                            <p className="text-[13px] text-red-500">
                                {message}
                            </p>
                        )}

                        <MainButton
                            loading={loading}
                            type="submit"
                            text="Login"
                            className="w-full mt-3 text-[18px] py-6"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;