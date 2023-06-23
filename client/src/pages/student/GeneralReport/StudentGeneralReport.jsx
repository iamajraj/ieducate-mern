import React, { useContext, useEffect, useState } from 'react';
import FeedbackCard from '../../../components/FeedbackCard';
import { authContext } from '../../../context/AuthProvider';
import axiosInstance from '../../../services/axiosInstance';

const StudentGeneralReport = () => {
  const { user } = useContext(authContext);
  const [generalReports, setGeneralReports] = useState([]);

  const getGeneralReports = async (id) => {
    try {
      const res = await axiosInstance.get(`/students/general-reports/${id}`);
      const { reports } = res.data;
      setGeneralReports(reports);
    } catch (err) {}
  };

  useEffect(() => {
    if (user) {
      getGeneralReports(user?.id);
    }
  }, [user]);

  return (
    <div className="px-[15px] md:px-[48px] md:py-[32px] h-full flex flex-col">
      <h1 className="hidden md:block text-[28px] font-medium">
        General Feedback
      </h1>
      <div className="overflow-y-scroll mt-[20px] md:mt-[32px] no-scrollbar h-full flex flex-wrap gap-[32px]">
        {generalReports?.length > 0 ? (
          generalReports?.map((report) => {
            return <FeedbackCard report={report} key={report?._id} />;
          })
        ) : (
          <p className="text-[14px]">
            Feedback will be displayed here once we have evaluated your
            performance
          </p>
        )}
      </div>
    </div>
  );
};

export default StudentGeneralReport;
