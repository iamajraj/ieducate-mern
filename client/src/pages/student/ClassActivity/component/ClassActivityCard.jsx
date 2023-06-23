import React from 'react';
import { CalendarOutlined, EyeFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const ClassActivityCard = ({ report }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white py-[10px] md:py-[20px] px-[5px] md:px-[30px] rounded-[16px] flex items-center justify-between">
      <div className="flex items-center gap-2 md:gap-7">
        <img src="/assets/report.png" alt="" className="w-[40px] md:w-auto" />
        <h1 className="text-[14px] md:text-[22px] font-medium">
          {report.subject.subject_name}
        </h1>
      </div>
      <div className="flex items-center gap-1 md:gap-3">
        <CalendarOutlined className="text-[14px] md:text-[16px]" />
        <p className="text-[12px] md:text-[16px]">
          {dayjs(report.date).format('DD MMM YYYY')}
        </p>
      </div>
      <button
        onClick={() => {
          navigate(`${report._id}`);
        }}
        className="md:px-6 px-2 py-2 md:py-3 rounded-lg bg-main text-white items-center flex gap-1 md:gap-2 text-[14px] md:text-[18px] cursor-pointer"
      >
        <EyeFilled /> View
      </button>
    </div>
  );
};

export default ClassActivityCard;
