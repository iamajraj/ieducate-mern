import React from 'react';
import CustomButton from './CustomButton';
import { useNavigate } from 'react-router-dom';

function DemoPanel() {
  const navigate = useNavigate();

  const loginRoute = (type) => () => {
    navigate(`/${type}`);
  };

  return (
    <div className="flex items-center justify-center h-screen w-full bg-[#f8f8f8] flex-col gap-[30px] bg-gradient-to-r from-sky-700 via-cyan-500 to-cyan-600">
      <div className="flex items-end">
        <img
          src="/assets/header_logo.png"
          alt=""
          className="h-[100px] object-contain"
        />
      </div>
      <div className="bg-white shadow-md w-full max-w-[500px] rounded-lg px-5 pb-7 pt-9">
        <h1 className="text-[28px] font-bold leading-[25px] relative w-max">
          Welcome to iEducate
        </h1>
        <p className="text-[16px] mt-3">
          This is the Demo Panel to login to different roles
        </p>
        <div className="my-7 border-b"></div>
        <div className="flex items-center gap-4">
          <CustomButton
            text="Student"
            className="py-4 border border-transparent"
            onClick={loginRoute('student')}
          />
          <CustomButton
            text="Teacher"
            className="py-4 border border-transparent"
            onClick={loginRoute('teacher')}
          />
          <CustomButton
            text="Admin"
            className="py-4 border border-transparent"
            onClick={loginRoute('admin')}
          />
        </div>
      </div>
    </div>
  );
}

export default DemoPanel;
