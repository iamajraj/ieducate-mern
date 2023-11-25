import React, { useContext, useState } from 'react';
import { Button, Input, message } from 'antd';
import axiosInstance from '../../services/axiosInstance';
import { authContext } from '../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';

const StudentLogin = () => {
  const [login, setLogin] = useState({
    email: 'student@gmail.com',
    password: 'student',
  });
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(authContext);

  const navigate = useNavigate();

  const onChange = (e) => {
    setLogin((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const { email, password } = login;

      if (!email || !password)
        return message.error("Email or Password can't be empty");

      setLoading(true);

      const res = await axiosInstance.post('/auth/student/login', {
        email: email.toLowerCase(),
        password: password,
      });

      const { user, token } = res.data;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', JSON.stringify(token));
      setUser(res.data.user);
      navigate('/student/dashboard');
    } catch (err) {
      message.error(err.response?.data?.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-main">
      <div className="md:h-full flex flex-col gap-5 md:flex-row md:items-center md:justify-evenly">
        <img
          src="/assets/login_bg.png"
          alt="img"
          className="object-contain h-[150px] md:h-auto md:w-auto"
        />
        <div className="bg-white p-5 mx-5 md:mx-0 md:mr-[62px] flex-1 max-w-[700px] rounded-lg flex flex-col md:h-full md:max-h-[800px] justify-center">
          <div className="flex items-center mx-auto w-max">
            <img
              src="/assets/logo.png"
              alt=""
              className="h-[40px] md:w-[40px] md:h-auto"
            />
            <h1 className="text-xl">ieducate</h1>
          </div>
          <p className="mt-[10px] md:mt-[60px] text-center text-[16px] md:text-[28px]">
            Login to your account
          </p>

          <form
            onSubmit={onSubmit}
            className="mt-[24px] md:mt-[82px] md:px-[107px]">
            <div className="space-y-2">
              <label htmlFor="">Email</label>
              <Input
                type="email"
                placeholder="Enter Email"
                className="rounded-md py-[10px] px-[10px]"
                value={login.email}
                onChange={onChange}
                name="email"
              />
            </div>
            <div className="mt-[22px]">
              <label htmlFor="">Password</label>
              <Input.Password
                type="Password"
                value={login.password}
                placeholder="Enter password"
                className="rounded-md py-[10px] px-[10px]"
                name="password"
                onChange={onChange}
              />
            </div>

            <p className="text-[12px] text-blue-700 py-4">
              *Credentials are pre-filled*
            </p>

            <Button
              htmlType="submit"
              loading={loading}
              type="default"
              className="bg-main text-white w-full mt-[20px] md:mt-[150px] h-auto py-[10px] text-[18px] hover:bg-transparent hover:border-main hover:text-main">
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
