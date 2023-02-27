import React from "react";

const Container = ({ children, className }) => {
    return (
        <div className={`py-10 px-10 h-full bg-[#F8F8F8] ${className}`}>
            {children}
        </div>
    );
};

export default Container;
