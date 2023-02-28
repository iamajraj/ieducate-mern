import { Link } from "react-router-dom";
import React from "react";
import MainButton from "../components/MainButton";

const Home = () => {
    return (
        <div className="flex flex-col h-screen items-center justify-center gap-[50px] px-4">
            <div className="flex itesm-center">
                <p className="block rotate-180 scale-150 text-[22px]">i</p>
                <h1 className="text-[28px]">Educate</h1>
            </div>
            <div className="w-full max-w-[400px] h-[300px] border rounded-lg shadow-md px-8 py-4">
                <h1 className="text-[25px] border-b mb-5 pb-2">Login as _</h1>
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
