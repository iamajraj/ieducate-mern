import { Button } from "antd";
import React from "react";

const MainButton = ({ text, onClick, className, type, loading }) => {
    return (
        <Button
            htmlType={type}
            loading={loading}
            onClick={onClick}
            className={`flex items-center justify-center py-5 bg-main text-white hover:bg-transparent ${className}`}
        >
            {text}
        </Button>
    );
};

export default MainButton;
