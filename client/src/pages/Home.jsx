import { Link } from "react-router-dom";
import React from "react";
import MainButton from "../components/MainButton";

const Home = () => {
    return (
        <div className="flex flex-col h-screen items-center justify-center gap-[70px] px-4 bg-gradient-to-r from-sky-700 via-cyan-500 to-cyan-600">
            <div className="flex items-end">
                <img
                    src="/assets/logo.png"
                    alt=""
                    className="h-[70px] object-contain"
                />
                <h1 className="text-[35px] text-white font-semibold">
                    Educate
                </h1>
            </div>
            <div className="w-full max-w-[400px] border rounded-lg shadow-md px-8 pt-4 pb-6 bg-white">
                <h1 className="text-[25px] border-b mb-5 pb-2">Login as</h1>
                <div className="flex flex-col gap-4 items-center justify-center">
                    <Link to="/admin" className="w-full">
                        <MainButton text="Admin" className="w-full" />
                    </Link>
                    <Link to="/teacher" className="w-full">
                        <MainButton
                            text="Teacher"
                            className="w-full bg-indigo-500"
                        />
                    </Link>
                    <Link to="/student" className="w-full">
                        <MainButton
                            text="Student"
                            className="w-full bg-violet-500"
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
