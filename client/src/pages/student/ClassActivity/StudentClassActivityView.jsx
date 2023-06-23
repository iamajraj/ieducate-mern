import { ArrowLeftOutlined, CalendarOutlined } from '@ant-design/icons';
import QuoteLeft from '../../../svgassets/QuoteLeft';
import QuoteRight from '../../../svgassets/QuoteRight';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../services/axiosInstance';
import dayjs from 'dayjs';
import { BACKEND_URL, BASE_URL } from '../../../constant';

const StudentClassActivityView = () => {
  const [classActivity, setClassActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();

  const getReport = async (id) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `/students/class-activity/single/${id}`
      );
      const data = res.data;
      setClassActivity(data.classActivity);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getReport(id);
    }
  }, [id]);

  return (
    <div className="px-[15px] md:px-[48px] md:py-[32px] h-full flex flex-col">
      <div className="h-full w-full bg-white px-[38px] pt-[43px] pb-[20px] rounded-[14px] overflow-hidden flex flex-col">
        {!loading ? (
          <>
            <div className="flex items-center gap-5 border-b pb-5 border-b-[#D9D9D9]">
              <div
                onClick={() => {
                  navigate(-1);
                }}
                className="w-[30px] h-[30px] rounded-full bg-[#CFF0FF] flex items-center justify-center text-[#199FDA] cursor-pointer"
              >
                <ArrowLeftOutlined />
              </div>
              <p className="text-[15px] md:text-[18px] font-medium">
                {classActivity
                  ? `${classActivity.subject.subject_name} Class Activity`
                  : "Class Activity doesn't exists"}
              </p>
            </div>

            {classActivity && (
              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-[22px] font-medium">
                    {classActivity.subject.subject_name}
                  </h2>
                  <div className="flex items-center gap-2 text-[13px] md:text-[16px]">
                    <CalendarOutlined />
                    <p>
                      {dayjs(classActivity.createdAt).format('DD MMM YYYY')}
                    </p>
                  </div>
                </div>
                <p className="mt-4 font-medium text-[14px] md:text-[16px]">
                  Teacher name:{' '}
                  <span className="font-normal">
                    {classActivity.report_by.name}
                  </span>
                </p>

                <p className="mt-4 font-medium text-[14px] md:text-[16px]">
                  Homework:
                </p>
                <p className="text-[13px] md:text-[14px]">
                  {classActivity.homework}
                </p>
                <p className="mt-5 font-medium text-[14px] md:text-[16px]">
                  Teacher Comment:
                </p>

                <p className="text-[13px] md:text-[14px] relative ml-3 mt-3">
                  <QuoteLeft className="absolute -left-3" />
                  {classActivity.comment}
                  <span className="text-blue-500 ml-6 cursor-pointer relative">
                    <QuoteRight className="absolute top-0 -left-5" />
                  </span>
                </p>
                <p className="mt-5 font-medium text-[14px] md:text-[16px]">
                  Attachments files:
                </p>
                {classActivity.attachments?.length > 0 ? (
                  classActivity.attachments?.map((file) => {
                    return (
                      <a
                        href={`${BACKEND_URL}${file.url}`}
                        className="block mt-2 md:mt-4 w-max"
                        key={file._id}
                      >
                        <button className="flex items-center px-3 py-2 rounded-lg gap-2 cursor-pointer bg-main text-white">
                          <img
                            src="/assets/pdf.png"
                            className="w-[20px] object-cover"
                            alt=""
                          />{' '}
                          {file.originalname}
                        </button>
                      </a>
                    );
                  })
                ) : (
                  <p className="text-[13px]">*No attachments files attached*</p>
                )}
              </div>
            )}
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default StudentClassActivityView;
