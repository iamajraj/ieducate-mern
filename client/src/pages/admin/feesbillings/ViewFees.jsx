import React, { createElement, useEffect, useState } from 'react';
import Container from '../../../components/Container';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../services/axiosInstance';
import dayjs from 'dayjs';
import { InputNumber, message, Modal, Select } from 'antd';
import {
  ArrowLeftOutlined,
  DownloadOutlined,
  EditOutlined,
} from '@ant-design/icons';
import InputField from '../../../components/InputField';
import MainButton from '../../../components/MainButton';

const ViewFees = () => {
  const [fee, setFee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateSubjectMonthlyPayment, setUpdateSubjectMonthlyPayment] =
    useState(null);

  const [internalComment, setInternalComment] = useState('');
  const [comment, setComment] = useState('');

  const { fee_id } = useParams();

  const fetchFee = async () => {
    try {
      const res = await axiosInstance(`/single-fee/${fee_id}`);
      setFee(res.data.fee);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const setPaid = async (value) => {
    try {
      await axiosInstance.patch('/fees/set-paid', {
        fee_id: fee_id,
        isPaid: value,
      });
      await fetchFee();
      message.success('Paid status changed');
    } catch (err) {
      message.error(err.response?.data?.message ?? 'Something went wrong');
    }
  };
  const updateInternalComment = async () => {
    try {
      await axiosInstance.patch('/fees/set-internal-comment', {
        fee_id: fee_id,
        internal_comment: internalComment,
      });
      await fetchFee();
      message.success('Internal comment has been updated');
    } catch (err) {
      message.error(err.response?.data?.message ?? 'Something went wrong');
    }
  };
  const updateComment = async () => {
    try {
      await axiosInstance.patch('/fees/set-comment', {
        fee_id: fee_id,
        comment: comment,
      });
      await fetchFee();
      message.success('Comment has been updated');
    } catch (err) {
      message.error(err.response?.data?.message ?? 'Something went wrong');
    }
  };

  const downloadInvoice = () => {
    const itemObj = {
      'Student Name': fee.student.student_name,
      Year: fee.student.year,
      'Number of Subjects': fee.student.number_of_subject,
      'Total Amount Paid': fee.subjects.reduce((acc, cur) => {
        return (acc += Number(cur.monthly_payment));
      }, 0),
      'Due Date': dayjs(fee.due_date).format('DD/MM/YYYY'),
    };

    const itemKey = [...Object.keys(itemObj)].join(',');
    const itemValue = [...Object.values(itemObj)].join(',');

    const subjectKey = [
      'Subject Name',
      'Last Payment Date',
      'Monthly Payment',
    ].join(',');
    const subjectValue = [
      ...fee.subjects.map((item) => [
        item.subject_name,
        dayjs(fee.student.last_payment_date).format('DD/MM/YYYY'),
        item.monthly_payment,
      ]),
    ]
      .map((e) => e.join(','))
      .join('\n');

    const csvString =
      itemKey + '\n' + itemValue + '\n' + subjectKey + '\n' + subjectValue;

    const fileReader = new FileReader();

    fileReader.onload = () => {};

    fileReader.readAs;

    const a = document.createElement('a');
    a.download = 'standard.csv';
    a.href = 'data:text/csv;charset=utf-8,' + csvString;
    a.click();
    a.remove();
  };
  const downloadStandardInvoice = () => {
    const itemObj = {
      'Payment Date': fee.subjects[0].last_payment_date,
      'Student Name': fee.student.student_name,
      Year: fee.student.year,
      'Number of Subjects': fee.student.number_of_subject,
      'Total Amount Paid': fee.subjects.reduce((acc, cur) => {
        return (acc += Number(cur.monthly_payment));
      }, 0),
    };

    const itemKey = [...Object.keys(itemObj)].join(',');
    const itemValue = [...Object.values(itemObj)].join(',');

    const subjectKey = [
      'Subject Name',
      // "Last Payment Date",
      'Monthly Payment',
    ].join(',');
    const subjectValue = [
      ...fee.subjects.map((item) => [
        item.subject_name,
        // dayjs(item.last_payment_date).format("DD/MM/YYYY"),
        item.monthly_payment,
      ]),
    ]
      .map((e) => e.join(','))
      .join('\n');

    const csvString =
      itemKey + '\n' + itemValue + '\n' + subjectKey + '\n' + subjectValue;

    const fileReader = new FileReader();

    fileReader.onload = () => {};

    fileReader.readAs;

    const a = document.createElement('a');
    a.download = 'standard.csv';
    a.href = 'data:text/csv;charset=utf-8,' + csvString;
    a.click();
    a.remove();
  };

  const issueInvoice = async (fee_id) => {
    try {
      if (!fee_id) return;
      // await axiosInstance.post("/students/issue-invoice", {
      //     student_id: fee.student._id,
      //     student_name: fee.student.student_name,
      //     year: fee.student.year,
      //     number_of_subject: fee.student.number_of_subject,
      //     last_payment_date: fee.student.last_payment_date,
      //     subjects: fee.subjects.map((sub) => ({
      //         subject_name: sub.subject_name,
      //         // last_payment_date: sub.last_payment_date,
      //         monthly_payment: sub.monthly_payment,
      //     })),
      //     total_amount: fee.subjects.reduce((acc, cur) => {
      //         return (acc += Number(cur.monthly_payment));
      //     }, 0),
      //     due_date: fee.due_date,
      // });
      await axiosInstance.post('/students/issue-invoice', {
        student_id: fee.student._id,
        invoice_id: fee_id,
      });
      await fetchFee();
      message.success('Invoice issued');
    } catch (err) {
      message.error(err.reponse?.data?.message ?? 'Something went wrong');
    }
  };

  useEffect(() => {
    if (fee) {
      setInternalComment(fee.internal_comment);
      setComment(fee.comment);
    }
  }, [fee]);

  useEffect(() => {
    fetchFee();
  }, [fee_id]);

  const navigate = useNavigate();

  console.log(fee);

  return (
    <Container>
      <div className="bg-white p-8 rounded-lg flex flex-col">
        {loading ? (
          <h1>Loading...</h1>
        ) : !fee ? (
          <h1>Fee not found</h1>
        ) : (
          <div className="flex flex-col">
            <div className="flex items-center gap-5">
              <ArrowLeftOutlined
                onClick={() => {
                  navigate(-1);
                }}
              />
              <h1 className="text-[23px]">
                View Fee for {fee?.student.student_name}
              </h1>
              <button
                onClick={downloadInvoice}
                className="flex items-center gap-2 border border-main rounded-lg px-4 bg-main text-white hover:bg-transparent hover:text-main transition-all py-2"
              >
                <p className="text-[13px]">Invoice CSV</p>
                <DownloadOutlined />
              </button>
              <button
                onClick={downloadStandardInvoice}
                className="flex items-center gap-2 border border-main rounded-lg px-4 bg-main text-white hover:bg-transparent hover:text-main transition-all py-2"
              >
                <p className="text-[13px]">Standard CSV</p>
                <DownloadOutlined />
              </button>
              {fee && fee.issued ? (
                <button className="flex items-center gap-2 border border-main rounded-lg px-4 bg-transparent text-main transition-all py-2">
                  <p className="text-[13px]">Invoice has been issued</p>
                </button>
              ) : (
                <button
                  onClick={() => {
                    issueInvoice(fee_id);
                  }}
                  className="cursor-pointer flex items-center gap-2 border border-main rounded-lg px-4 bg-main text-white hover:bg-transparent hover:text-main transition-all py-2"
                >
                  <p className="text-[13px]">Issue Invoice</p>
                </button>
              )}
            </div>

            <div className="border-b mt-3 mb-10"></div>

            <div className="flex w-full gap-10">
              <div className="flex flex-col gap-3 w-full">
                <div className="flex items-center gap-5">
                  <h1>Student Roll No: </h1>
                  <span>{fee.student.student_roll_no}</span>
                </div>
                <div className="flex items-center gap-5">
                  <h1>Student Name: </h1>
                  <span>{fee.student.student_name}</span>
                </div>
                <div className="flex items-center gap-5">
                  <h1>Student Telephone: </h1>
                  <span>{fee.student.student_telephone}</span>
                </div>
                <div className="flex items-center gap-4">
                  <h1>Last Month's Due Date:</h1>
                  <span>
                    {fee.previous_due_date
                      ? dayjs(fee.previous_due_date).format('DD/MM/YYYY')
                      : '_'}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <h1>Last Payment Date:</h1>
                  <span>
                    {fee.student.last_payment_date
                      ? dayjs(fee.student.last_payment_date).format(
                          'DD/MM/YYYY'
                        )
                      : '_'}
                  </span>
                </div>
                <div className="flex items-center gap-5">
                  <h1>Number of Subjects: </h1>
                  <span>{fee.subjects.length}</span>
                </div>
                <div className="flex flex-col gap-3">
                  <h1>Subjects: </h1>
                  <div className="ml-12 flex flex-col gap-2">
                    {fee.subjects.map((sub) => (
                      <div
                        key={sub?._id}
                        className="flex flex-col gap-4 border-b pb-3"
                      >
                        <div className="flex items-center gap-4">
                          <h1>Name:</h1>
                          <span>{sub.subject_name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <h1>Monthly Payment:</h1>
                          <span>£ {sub.monthly_payment}</span>
                          {fee.isActive && (
                            <div className="cursor-pointer">
                              <EditOutlined
                                onClick={() => {
                                  setUpdateSubjectMonthlyPayment(sub);
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <h1>Total Amount: </h1>
                  <span>
                    £{' '}
                    {fee.subjects.reduce((acc, cur) => {
                      return (acc += Number(cur.monthly_payment));
                    }, 0)}
                  </span>
                </div>
                <div className="flex items-center gap-5">
                  <h1>Due Date: </h1>
                  <span>{dayjs(fee.due_date).format('DD/MM/YYYY')}</span>
                </div>

                <Select
                  value={fee.isPaid}
                  onChange={(value) => {
                    setPaid(value);
                    return value;
                  }}
                  placeholder="Set Paid"
                  style={{ width: 120 }}
                  options={[
                    { value: 'Paid', label: 'Paid' },
                    { value: 'Not Paid', label: 'Not Paid' },
                  ]}
                />
              </div>

              <div className="w-full flex flex-col gap-10">
                <div className="space-y-2">
                  <InputField
                    label="Internal Comment (Private)"
                    value={internalComment}
                    onChange={(e) => setInternalComment(e.target.value)}
                  />
                  <MainButton text="Set" onClick={updateInternalComment} />
                </div>
                <div className="space-y-2">
                  <InputField
                    label="Comments (Visible to Student)"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <MainButton text="Set" onClick={updateComment} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <UpdateSubjectMonthlyPaymentModal
        open={updateSubjectMonthlyPayment}
        setOpen={setUpdateSubjectMonthlyPayment}
        updateSubjectMonthlyPayment={updateSubjectMonthlyPayment}
        setUpdateSubjectMonthlyPayment={setUpdateSubjectMonthlyPayment}
        fee_id={fee_id}
        fetchFee={fetchFee}
      />
    </Container>
  );
};

export default ViewFees;

const UpdateSubjectMonthlyPaymentModal = ({
  open,
  setOpen,
  updateSubjectMonthlyPayment,
  fee_id,
  fetchFee,
}) => {
  const [subject, setSubject] = useState(updateSubjectMonthlyPayment);
  const updateFee = async () => {
    if (!subject.monthly_payment)
      return message.error("Fee input can't be empty");
    try {
      await axiosInstance.patch('/fees/change-subject-fee', {
        fee_id: fee_id,
        subject_id: subject._id,
        fee_amount: subject.monthly_payment,
      });
      message.success('Fee amount has been updated');
      setOpen(null);
      await fetchFee();
    } catch (err) {
      message.error(err.response?.data?.message ?? 'Something went wrong');
    }
  };

  useEffect(() => {
    if (updateSubjectMonthlyPayment) {
      setSubject(updateSubjectMonthlyPayment);
    }
  }, [updateSubjectMonthlyPayment]);

  return (
    <Modal open={open} onCancel={() => setOpen(null)} onOk={updateFee}>
      <div className="p-5">
        <h1 className="text-[20px]">
          Edit the subject fee for {subject?.subject_name}
        </h1>

        <div className="my-5 border-b"></div>

        <InputNumber
          defaultValue={0}
          formatter={(value) => `£ ${value}`}
          className="w-full py-2 text-[17px]"
          name="monthly_payment"
          onChange={(value) => {
            setSubject((prev) => ({
              ...prev,
              monthly_payment: value,
            }));
          }}
          value={subject?.monthly_payment}
        />
      </div>
    </Modal>
  );
};
