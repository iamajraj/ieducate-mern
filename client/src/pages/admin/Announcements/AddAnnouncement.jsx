import { Input, message } from 'antd';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import Container from '../../../components/Container';
import InputField from '../../../components/InputField';
import MainButton from '../../../components/MainButton';
import axiosInstance from '../../../services/axiosInstance';

const AddAnnouncement = () => {
  const [announcement, setAnnouncement] = useState({
    title: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, description } = announcement;

    if (!title || !description) {
      return message.error('All fields are required', 2);
    }

    setLoading(true);

    try {
      const res = await axiosInstance.post('/announcements', announcement);

      message.success('Announcement has been created !', 2);
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

  return (
    <Container>
      <div className="bg-white p-8 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[24px]">Announcements</h1>
            <p className="text-[13px]">
              Create announcements for every students.
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

            <MainButton loading={loading} type="submit" text="Create" />
          </form>
        </div>
      </div>
    </Container>
  );
};

export default AddAnnouncement;
