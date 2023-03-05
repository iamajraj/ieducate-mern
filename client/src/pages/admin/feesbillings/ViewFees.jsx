import React, { createElement, useEffect, useState } from "react";
import Container from "../../../components/Container";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../services/axiosInstance";
import dayjs from "dayjs";
import { message, Select } from "antd";
import { ArrowLeftOutlined, DownloadOutlined } from "@ant-design/icons";

const ViewFees = () => {
    const [fee, setFee] = useState(null);
    const [loading, setLoading] = useState(true);

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
            await axiosInstance.patch("/fees/set-paid", {
                fee_id: fee_id,
                isPaid: value,
            });
            await fetchFee();
            message.success("Paid status changed");
        } catch (err) {
            message.error(
                err.response?.data?.message ?? "Something went wrong"
            );
        }
    };

    const downloadInvoice = () => {
        const itemObj = {
            "Student Name": fee.student.student_name,
            Year: fee.student.year,
            "Number of Subjects": fee.student.number_of_subject,
            "Total Amount Paid": fee.subjects.reduce((acc, cur) => {
                return (acc += Number(cur.monthly_payment));
            }, 0),
            "Due Date": dayjs(fee.due_date).format("DD/MM/YYYY"),
        };

        const itemKey = [...Object.keys(itemObj)].join(",");
        const itemValue = [...Object.values(itemObj)].join(",");

        const subjectKey = [
            "Subject Name",
            "Last Payment Date",
            "Monthly Payment",
        ].join(",");
        const subjectValue = [
            ...fee.subjects.map((item) => [
                item.subject_name,
                dayjs(fee.student.last_payment_date).format("DD/MM/YYYY"),
                item.monthly_payment,
            ]),
        ]
            .map((e) => e.join(","))
            .join("\n");

        const csvString =
            itemKey +
            "\n" +
            itemValue +
            "\n" +
            subjectKey +
            "\n" +
            subjectValue;

        const fileReader = new FileReader();

        fileReader.onload = () => {};

        fileReader.readAs;

        const a = document.createElement("a");
        a.download = "standard.csv";
        a.href = "data:text/csv;charset=utf-8," + csvString;
        a.click();
        a.remove();
    };
    const downloadStandardInvoice = () => {
        const itemObj = {
            "Payment Date": fee.subjects[0].last_payment_date,
            "Student Name": fee.student.student_name,
            Year: fee.student.year,
            "Number of Subjects": fee.student.number_of_subject,
            "Total Amount Paid": fee.subjects.reduce((acc, cur) => {
                return (acc += Number(cur.monthly_payment));
            }, 0),
        };

        const itemKey = [...Object.keys(itemObj)].join(",");
        const itemValue = [...Object.values(itemObj)].join(",");

        const subjectKey = [
            "Subject Name",
            // "Last Payment Date",
            "Monthly Payment",
        ].join(",");
        const subjectValue = [
            ...fee.subjects.map((item) => [
                item.subject_name,
                // dayjs(item.last_payment_date).format("DD/MM/YYYY"),
                item.monthly_payment,
            ]),
        ]
            .map((e) => e.join(","))
            .join("\n");

        const csvString =
            itemKey +
            "\n" +
            itemValue +
            "\n" +
            subjectKey +
            "\n" +
            subjectValue;

        const fileReader = new FileReader();

        fileReader.onload = () => {};

        fileReader.readAs;

        const a = document.createElement("a");
        a.download = "standard.csv";
        a.href = "data:text/csv;charset=utf-8," + csvString;
        a.click();
        a.remove();
    };

    const issueInvoice = async () => {
        try {
            await axiosInstance.post("/students/issue-invoice", {
                student_id: fee.student._id,
                student_name: fee.student.student_name,
                year: fee.student.year,
                number_of_subject: fee.student.number_of_subject,
                subjects: fee.subjects.map((sub) => ({
                    subject_name: sub.subject_name,
                    last_payment_date: sub.last_payment_date,
                    monthly_payment: sub.monthly_payment,
                })),
                total_amount: fee.subjects.reduce((acc, cur) => {
                    return (acc += Number(cur.monthly_payment));
                }, 0),
                due_date: fee.due_date,
            });
            message.success("Invoice issued");
        } catch (err) {
            message.error(err.reponse?.data?.message ?? "Something went wrong");
        }
    };

    useEffect(() => {
        fetchFee();
    }, [fee_id]);

    const navigate = useNavigate();

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
                            {/* <button
                                onClick={issueInvoice}
                                className="flex items-center gap-2 border border-main rounded-lg px-4 bg-main text-white hover:bg-transparent hover:text-main transition-all py-2"
                            >
                                <p className="text-[13px]">Issue Invoice</p>
                            </button> */}
                        </div>

                        <div className="border-b mt-3 mb-10"></div>

                        <div className="flex flex-col gap-3">
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
                                <h1>Last Payment:</h1>
                                <span>
                                    {fee.student.last_payment_date
                                        ? dayjs(
                                              fee.student.last_payment_date
                                          ).format("DD/MM/YYYY")
                                        : "_"}
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
                                        <div className="flex flex-col gap-4 border-b pb-3">
                                            <div className="flex items-center gap-4">
                                                <h1>Name:</h1>
                                                <span>{sub.subject_name}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <h1>Monthly Payment:</h1>
                                                <span>
                                                    £ {sub.monthly_payment}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-5">
                                <h1>Total Amount: </h1>
                                <span>
                                    £{" "}
                                    {fee.subjects.reduce((acc, cur) => {
                                        return (acc += Number(
                                            cur.monthly_payment
                                        ));
                                    }, 0)}
                                </span>
                            </div>
                            <div className="flex items-center gap-5">
                                <h1>Due Date: </h1>
                                <span>
                                    {dayjs(fee.due_date).format("DD/MM/YYYY")}
                                </span>
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
                                    { value: "Paid", label: "Paid" },
                                    { value: "Not Paid", label: "Not Paid" },
                                ]}
                            />
                        </div>
                    </div>
                )}
            </div>
        </Container>
    );
};

export default ViewFees;
