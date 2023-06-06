import { Input, Select, message } from 'antd';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Container from '../../../components/Container';
import InputField from '../../../components/InputField';
import MainButton from '../../../components/MainButton';
import axiosInstance from '../../../services/axiosInstance';

const SendAnnouncement = () => {
  const [announcement, setAnnouncement] = useState({
    title: '',
    description: '',
  });
  const [studentEmails, setStudentEmails] = useState([]);
  const [students, setStudents] = useState([]);
  const fetchStudents = async () => {
    try {
      const res = await axiosInstance.get('/students');
      setStudents(res.data.students);
    } catch (err) {}
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, description } = announcement;

    if (!title || !description) {
      return message.error('All fields are required', 2);
    }

    if (studentEmails.length == 0) {
      return message.error('Please select atleast one student');
    }

    setLoading(true);

    try {
      const res = await axiosInstance.post(
        '/announcements/to-particular-students',
        {
          title,
          description,
          emails: studentEmails,
        }
      );

      message.success('Announcement has been sent !', 2);
      setAnnouncement({
        title: '',
        description: '',
      });
    } catch (err) {
      message.error(err.response.data?.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setAnnouncement((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleStudentEmails = (s) => {
    setStudentEmails(s);
  };

  return (
    <Container>
      <div className="bg-white p-8 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[24px]">Send Announcement</h1>
            <p className="text-[13px]">
              Send announcements to particular students
            </p>
          </div>
          <Link to="/admin/dashboard/announcements">
            <MainButton
              text="View Announcement"
              className="py-4"
              textClass="text-[15px]"
            />
          </Link>
        </div>

        <div className="border-b my-7"></div>

        <div className="my-4 space-y-4">
          <h2>Select the students</h2>
          <Select
            mode="multiple"
            size="middle"
            placeholder="Please select"
            onChange={handleStudentEmails}
            style={{ width: '100%' }}
            options={students.map((student) => ({
              label: student.student_name,
              value: student.email,
            }))}
          />
        </div>

        <div className="">
          <form onSubmit={handleSubmit} className="flex flex-col gap-7">
            <InputField
              label="Title"
              placeholder="Enter the title"
              name="title"
              value={announcement.title}
              onChange={handleChange}
            />
            <div className="flex flex-col gap-3">
              <label>Description</label>
              <Input.TextArea
                rows={4}
                value={announcement.description}
                name="description"
                onChange={handleChange}
              />
            </div>

            <MainButton loading={loading} type="submit" text="Send" />
          </form>
        </div>
      </div>
    </Container>
  );
};

export default SendAnnouncement;
