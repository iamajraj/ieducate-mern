import React from "react";

const CustomButton = ({ text, onClick, className, textClass }) => {
    return (
        <button
            onClick={onClick}
            type="text"
            className={`flex items-center bg-main text-white  justify-center hover:bg-transparent hover:border-main hover:border transition-all cursor-pointer ${className} px-4 rounded-lg hover:text-main`}
        >
            <p className={`text-[13px] ${textClass}`}>{text}</p>
        </button>
    );
};

export default CustomButton;
