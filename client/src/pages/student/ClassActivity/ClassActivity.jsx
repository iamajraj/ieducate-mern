import React, { useContext, useEffect, useState } from 'react';
import TermsReportCard from './component/ClassActivityCard';
import { authContext } from '../../../context/AuthProvider';
import axiosInstance from '../../../services/axiosInstance';

const StudentClassActivity = () => {
  const { user } = useContext(authContext);
  const [classActivity, setClassActivity] = useState([]);

  const getClassActivity = async (id) => {
    try {
      const res = await axiosInstance.get(
        `/students/class-activity/student/${id}`
      );
      const data = res.data;
      setClassActivity(data.classActivity);
    } catch (err) {}
  };

  console.log(classActivity);

  useEffect(() => {
    if (user) {
      getClassActivity(user?.id);
    }
  }, [user]);

  return (
    <div className="px-[15px] md:px-[48px] mt-[15px] md:py-[32px] h-full flex flex-col">
      <div className="h-full w-full bg-[#CFF0FF] px-[10px] pt-[15px] md:px-[38px] md:pt-[43px] pb-[20px] rounded-[14px] overflow-hidden flex flex-col">
        <h1 className="text-[18px] md:text-[28px] font-medium">
          Class Activities
        </h1>

        <div className="overflow-y-scroll mt-[32px] no-scrollbar h-full flex flex-col gap-[32px]">
          {classActivity?.length > 0 ? (
            classActivity
              ?.map((report) => (
                <TermsReportCard report={report} key={report?._id} />
              ))
              .reverse()
          ) : (
            <p className="text-[14px]">
              Your class activities report will show here once available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentClassActivity;
