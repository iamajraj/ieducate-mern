import React from 'react';
import { Link } from 'react-router-dom';
import InputField from './InputField';
import MainButton from './MainButton';

const Login = ({ usertype, onSubmit, loading, values, onChange, message }) => {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-[#f8f8f8] flex-col gap-[30px] bg-gradient-to-r from-sky-700 via-cyan-500 to-cyan-600">
      <div className="flex items-end">
        <img
          src="/assets/header_logo.png"
          alt=""
          className="h-[100px] object-contain"
        />
        {/* <h1 className="text-[35px] text-white font-semibold">
                    Educate
                </h1> */}
      </div>
      <div className="bg-white shadow-md w-full max-w-[500px] rounded-lg px-5 pb-7 pt-9">
        <h1 className="text-[28px] font-bold leading-[25px] relative w-max">
          Welcome to iEducate
          <span className="text-[20px] font-normal absolute -top-[25px] right-0">
            {usertype}
          </span>
        </h1>
        <p className="text-[13px] mt-3">Enter the credentials to login</p>
        <div className="my-7 border-b"></div>
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <InputField
            name="email"
            label="Email"
            placeholder="Enter your email address"
            value={values.email}
            onChange={onChange}
          />

          <InputField
            name="password"
            label="Password"
            placeholder="Enter your password"
            isPassword
            value={values.password}
            onChange={onChange}
          />

          <p className="text-[12px] text-blue-700">
            *Credentials are pre-filled*
          </p>

          <div>
            {message && <p className="text-[13px] text-red-500">{message}</p>}

            <MainButton
              loading={loading}
              type="submit"
              text="Login"
              className="w-full mt-3 text-[18px] py-6"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
