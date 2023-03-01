import { InputNumber, message, Modal } from "antd";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../services/axiosInstance";

const initialSubjectData = {
    id: "",
    subject_name: "",
    timetable: "",
    monthly_payment: "",
    first_lesson_date: "",
};

const EditMonthlyPayment = ({
    open,
    setOpen,
    setSubjectData,
    editSubject,
    subjectData,
}) => {
    const [subject, setSubject] = useState(initialSubjectData);

    const handleSubmit = async (e) => {
        const { monthly_payment } = subject;

        if (!monthly_payment)
            return message.error("Monthly payment field can't be empty", 2);

        if (subject._id) {
            try {
                await axiosInstance.post(
                    `/subject/change-monthly-payment/${subject._id}`,
                    {
                        monthly_payment,
                    }
                );
                let uneditedSubjects = subjectData.filter((sub) => {
                    if (sub._id) {
                        if (sub._id !== subject._id) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return true;
                    }
                });
                setSubjectData((prev) => [...uneditedSubjects, subject]);
                message.success("Monthly payment changed !", 1.2);
                setSubject({});
                setOpen(false);
            } catch (err) {
                message.error(
                    err.response?.data?.message ?? "Something went wrong"
                );
            }
        } else {
            let uneditedSubjects = subjectData.filter((sub) => {
                if (sub.local_id) {
                    if (sub.local_id !== subject.local_id) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            });
            setSubjectData((prev) => [...uneditedSubjects, subject]);
            message.success("Monthly payment changed !", 1.2);
            setSubject({});
            setOpen(false);
        }
    };

    useEffect(() => {
        setSubject(editSubject);
    }, [open]);

    const onChange = (e) => {
        setSubject((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <Modal
            open={open}
            destroyOnClose
            onCancel={() => setOpen(false)}
            okButtonProps={{
                className: "bg-main",
            }}
            onOk={handleSubmit}
        >
            <div className="p-5 ">
                <h1 className="text-[20px]">
                    Edit Monthly Payment of {editSubject?.subject_name}
                </h1>
                <div className="mt-4 flex flex-col gap-5">
                    <div className="flex flex-col gap-3">
                        <label htmlFor="">Monthly Payment (in GBP)*</label>
                        <InputNumber
                            defaultValue={0}
                            formatter={(value) => `£ ${value}`}
                            className="w-full py-2 text-[17px]"
                            name="monthly_payment"
                            onChange={(value) => {
                                onChange({
                                    target: {
                                        name: "monthly_payment",
                                        value: value,
                                    },
                                });
                            }}
                            value={subject?.monthly_payment}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default EditMonthlyPayment;
