import React from "react";

const CustomButton = ({ text, onClick, className, textClass }) => {
    return (
        <button
            onClick={onClick}
            type="text"
            className={`flex items-center bg-main text-white  justify-center hover:bg-transparent hover:border-main hover:border transition-all cursor-pointer ${className} px-4 rounded-lg hover:text-main`}
        >
            {text}
        </button>
    );
};

export default CustomButton;
