import React, { useState } from "react";
import AuthImg from "../../../svgassets/AuthImg";
import { Button, Input, message } from "antd";
import axiosInstance from "../../../services/axiosInstance";
import SuccessModal from "./SuccessModal";

const ProfileSetting = () => {
    const [loading, setLoading] = useState(false);
    const [info, setInfo] = useState({
        old_password: "",
        new_password: "",
        confirm_password: "",
    });
    const [show, setShow] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { old_password, new_password, confirm_password } = info;

        if (!old_password || !new_password || !confirm_password)
            return message.error("Input fields can't be empty");

        if (new_password !== confirm_password)
            return message.error(
                "Confirm password doesn't match with the new password"
            );

        setLoading(true);

        try {
            await axiosInstance.patch("/students/change-password", info);
            setInfo({});
            setShow(true);
        } catch (err) {
            message.error(
                err.response?.data?.message ?? "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    const onChange = (e) => {
        setInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="px-[15px] md:px-[48px] md:py-[32px] h-full flex flex-col">
            <h1 className="text-[28px] font-medium hidden md:block">
                Change Password
            </h1>

            <div className="flex flex-col md:flex-row items-center w-full h-full bg-white rounded-[16px] mt-5 justify-between px-[30px] md:px-0 pb-[30px] md:pb-0">
                <AuthImg className="w-full h-[150px] md:h-auto" />
                <form
                    onSubmit={handleSubmit}
                    className="md:mr-[95px] mt-[30px] md:mt-0 w-full flex flex-col gap-5"
                >
                    <div className="flex flex-col gap-2 w-full">
                        <label className="text-[14px] md:text-[16px]">
                            Old Password
                        </label>
                        <Input.Password
                            placeholder="Enter old password"
                            className="rounded-md py-2 md:py-3 text-[15px] md:text-[16px]"
                            name="old_password"
                            value={info.old_password}
                            onChange={onChange}
                        />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <label className="text-[14px] md:text-[16px]">
                            New Password
                        </label>
                        <Input.Password
                            placeholder="Enter new password"
                            className="rounded-md py-2 md:py-3 text-[15px] md:text-[16px]"
                            name="new_password"
                            value={info.new_password}
                            onChange={onChange}
                        />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <label className="text-[14px] md:text-[16px]">
                            Confirm Password
                        </label>
                        <Input.Password
                            placeholder="Enter confirm password"
                            className="rounded-md py-2 md:py-3 text-[15px] md:text-[16px]"
                            name="confirm_password"
                            value={info.confirm_password}
                            onChange={onChange}
                        />
                    </div>

                    <Button
                        type="default"
                        loading={loading}
                        htmlType="submit"
                        className="h-auto py-2 md:py-3 bg-main text-white text-[15px] md:text-[17px] hover:bg-transparent hover:border-main hover:text-main"
                    >
                        Set Password
                    </Button>
                </form>
            </div>

            {show && <SuccessModal setShow={setShow} />}
        </div>
    );
};

export default ProfileSetting;
