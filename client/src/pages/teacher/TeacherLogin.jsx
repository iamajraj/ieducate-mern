import React, { useContext, useState } from 'react';
import Login from '../../components/Login';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import validateEmail from '../../utils/validateEmail';
import { authContext } from '../../context/AuthProvider';

const TeacherLogin = () => {
  const [loading, setLoading] = useState(false);

  const [loginInfo, setLoginInfo] = useState({
    email: 'teacher@gmail.com',
    password: 'teacher',
  });

  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const { setUser } = useContext(authContext);

  const onChange = (e) => {
    setLoginInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = loginInfo;

    if (!email || !password) return setMessage('All fields are required');

    if (!validateEmail(email))
      return setMessage('Please enter a valid email address');

    setMessage('');
    setLoading(true);
    try {
      const res = await axiosInstance.post('/auth/teacher/login', {
        email: email.toLowerCase(),
        password: password,
      });
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('token', JSON.stringify(res.data.token));
      setUser(res.data.user);
      navigate('/teacher/dashboard');
    } catch (err) {
      setMessage(err.response.data?.message);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Login
      usertype="Teacher"
      onChange={onChange}
      values={loginInfo}
      loading={loading}
      onSubmit={handleSubmit}
      message={message}
    />
  );
};

export default TeacherLogin;
