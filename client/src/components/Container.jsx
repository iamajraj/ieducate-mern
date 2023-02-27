import React from "react";

const Container = ({ children, className }) => {
    return (
        <div className={`pt-10 px-10 bg-gray-100 h-full ${className}`}>
            {children}
        </div>
    );
};

export default Container;
