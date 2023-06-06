import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import axiosInstance from '../../../services/axiosInstance';
import AnnouncementCard from './component/AnnouncementCard';
import { authContext } from '../../../context/AuthProvider';

const StudentAnnouncement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const { user } = useContext(authContext);

  console.log(announcements);

  const getAnnouncements = async () => {
    try {
      const res = await axiosInstance.get('/announcements');
      setAnnouncements(res.data.announcements);
    } catch (err) {}
  };

  useEffect(() => {
    getAnnouncements();
  }, []);

  return (
    <div className="px-[15px] md:px-[48px] md:py-[32px] h-full flex flex-col">
      <h1 className="text-[28px] font-medium hidden md:block">Announcement</h1>
      <div className="overflow-y-scroll mt-[32px] no-scrollbar h-full flex flex-col gap-[32px]">
        {announcements && announcements?.length > 0 ? (
          announcements
            ?.map((item) => <AnnouncementCard item={item} key={item?._id} />)
            .reverse()
        ) : (
          <p className="text-[14px]">No unseen announcements</p>
        )}
      </div>
    </div>
  );
};

export default StudentAnnouncement;
