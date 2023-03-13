import React, { useContext } from "react";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { authContext } from "../../../context/AuthProvider";

const SuccessModal = ({ setShow }) => {
    const navigate = useNavigate();
    const { setUser } = useContext(authContext);
    const resetUser = () => {
        localStorage.clear();
        setUser(null);
        navigate("/student");
    };
    return (
        <div className="fixed inset-0 h-full w-full z-50 bg-[#00000050] flex items-center justify-center px-[20px] md:px-0">
            <div className="w-full max-w-[500px] h-[300px] bg-[#E3F6FF] rounded-[16px] relative">
                <div
                    className="absolute right-2 top-2 w-[30px] h-[30px] flex items-center justify-center bg-[#00000020] rounded-full cursor-pointer"
                    onClick={() => setShow(false)}
                >
                    <CloseOutlined />
                </div>

                <div className="w-full flex flex-col items-center justify-center h-full gap-7">
                    <div className="w-[70px] h-[70px] bg-main rounded-full flex items-center justify-center">
                        <CheckOutlined className="text-[30px] text-white" />
                    </div>
                    <p className="font-medium text-[14px] md:text-[16px]">
                        Your Password Changed Successfully
                    </p>
                    <button
                        onClick={resetUser}
                        className="px-6 py-2 bg-main text-white rounded-lg cursor-pointer"
                    >
                        Login with new password
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;
