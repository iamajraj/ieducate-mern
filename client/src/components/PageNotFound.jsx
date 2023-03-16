import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-sky-700 via-cyan-500 to-cyan-600">
            <h1 className="text-3xl text-white">
                404 <span className="">Page not found</span>
            </h1>
            <Link to="/" className="underline text-white mt-5 cursor-pointer">
                Home
            </Link>
        </div>
    );
};

export default PageNotFound;
