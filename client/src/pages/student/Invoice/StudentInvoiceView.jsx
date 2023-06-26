import React, { useEffect, useState } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../services/axiosInstance';
import dayjs from 'dayjs';

const StudentInvoiceView = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [fee, setFee] = useState(null);
  const navigate = useNavigate();

  const getFee = async (id) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/single-fee/${id}`);
      const { fee } = res.data;
      setFee(fee);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getFee(id);
    }
  }, [id]);

  return (
    <div className="px-[15px] md:pt-[38px] md:px-[49px] h-full">
      <div className="bg-white h-full w-full rounded-lg px-[21px] py-[20px] md:py-[32px]">
        <div className="flex w-full gap-10">
          <div className="w-full">
            <div className="flex items-center gap-5 border-b pb-5 border-b-[#D9D9D9]">
              <div
                onClick={() => {
                  navigate(-1);
                }}
                className="w-[30px] h-[30px] rounded-full bg-[#CFF0FF] flex items-center justify-center text-[#199FDA] cursor-pointer"
              >
                <ArrowLeftOutlined />
              </div>
              <p className="text-[18px] font-medium">
                {!loading
                  ? fee === null
                    ? "Invoice doesn't exists"
                    : dayjs(fee.due_date).format('MMM Invoice')
                  : 'Loading...'}
              </p>
            </div>
            {!loading
              ? fee && (
                  <>
                    <div className="flex justify-between mt-5">
                      <div className="md:ml-[70px]">
                        <h1 className="text-[30px] text-[#78B72B] font-medium">
                          {fee.student.student_name}
                        </h1>
                        <p className="my-3">
                          Roll No. <span>{fee.student.student_roll_no}</span>
                        </p>
                        <p className="my-3">
                          Year. <span>{fee.student.year}</span>
                        </p>
                        <ul className="list-disc ml-5 mt-1">
                          <li>{fee.student.subjects.length} Subjects</li>
                        </ul>
                      </div>
                      {fee.isPaid === 'Paid' ? (
                        <p className="bg-[#E4F1D5] w-max px-5 md:px-10 py-3 rounded-lg text-[#78B72B] font-semibold h-max">
                          Paid
                        </p>
                      ) : (
                        <p className="bg-[#FCE4EF] w-max px-5 md:px-10 py-3 rounded-lg text-[#E5247D] font-semibold h-max">
                          Pending
                        </p>
                      )}
                    </div>

                    <div className="border border-[#199FDA] mt-4 rounded-[10px] overflow-hidden">
                      <div className="flex items-center justify-around py-4 bg-[#CFF0FF] border-b text-[12px] md:text-[16px]">
                        <p>Subject</p>
                        <p>Payment last date</p>
                        <p>Last Month's Due Date</p>
                        <p>Fees</p>
                      </div>
                      {fee.subjects.map((sub) => {
                        return (
                          <div
                            key={sub?._id}
                            className="border-b flex items-center justify-around py-5 text-[12px] md:text-[16px]"
                          >
                            <p>{sub.subject_name}</p>
                            <p>
                              {fee.student.last_payment_date
                                ? dayjs(fee.student.last_payment_date).format(
                                    'DD/MM/YYYY'
                                  )
                                : ''}
                            </p>
                            <p>
                              {fee.previous_due_date
                                ? dayjs(fee.previous_due_date).format(
                                    'DD/MM/YYYY'
                                  )
                                : ''}
                            </p>
                            <p className="font-semibold">
                              {sub.monthly_payment} <span>GBP</span>
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-10 flex flex-col gap-5">
                      <div className="flex items-center justify-between">
                        <p className="text-[14px] md:text-[24px] font-medium">
                          Total Amount
                        </p>
                        <p className="text-[14px] md:text-[24px] font-medium">
                          {fee.subjects.reduce((acc, curr) => {
                            return (acc += Number(curr.monthly_payment));
                          }, 0)}{' '}
                          GBP
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-[14px] md:text-[24px] font-medium">
                          Start Date for Next Payable Lesson
                        </p>
                        <p className="text-[14px] md:text-[24px] font-medium">
                          {dayjs(fee.due_date).format('DD/MM/YYYY')}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-[14px] md:text-[18px] font-medium">
                          {' '}
                        </p>
                      </div>
                      {/* <div className="flex items-center justify-between">
                        <p className="text-[14px] md:text-[18px] font-medium">
                          {' '}
                        </p>
                      </div> */}
                      {fee.comment && (
                        <div className="flex items-center justify-between">
                          <p className="text-[14px] md:text-[18px]">
                            Comment: <span>{fee?.comment}</span>
                          </p>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <p className="text-[14px] md:text-[18px] font-medium">
                          Note: Your new 1st lesson Payment and invoice will be
                          payable from the date mentioned as "Start Date for
                          Next Payable Lesson"
                        </p>
                      </div>
                    </div>
                  </>
                )
              : null}
          </div>
          <img
            src="/assets/invoice_img.png"
            alt=""
            className="hidden md:block"
          />
        </div>
      </div>
    </div>
  );
};

export default StudentInvoiceView;
