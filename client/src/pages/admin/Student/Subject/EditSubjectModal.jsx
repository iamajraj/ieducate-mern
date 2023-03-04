import { DatePicker, InputNumber, message, Modal } from "antd";
import React, { useEffect, useState } from "react";
import InputField from "../../../../components/InputField";
import dayjs from "dayjs";

const EditSubjectModal = ({
    open,
    setOpen,
    setSubjectData,
    editSubject,
    subjectData,
}) => {
    const [subject, setSubject] = useState(null);

    const handleSubmit = (e) => {
        const { first_lesson_date, monthly_payment, subject_name, timetable } =
            subject;

        if (
            !subject_name ||
            !first_lesson_date ||
            !monthly_payment ||
            !timetable
        )
            return message.error("Required fields can't be empty", 2);

        if (subject._id) {
            subject.isModified = true;
        }
        let filteredSubjects = subjectData.filter((sub) => {
            if (sub._id) {
                if (sub._id !== subject._id) {
                    return true;
                } else {
                    return false;
                }
            } else if (sub.local_id) {
                if (sub.local_id !== subject.local_id) {
                    return true;
                } else {
                    return false;
                }
            }
        });
        setSubjectData([...filteredSubjects, subject]);
        // message.success("Subject is modified !", 1.2);
        setSubject({});
        setOpen(false);
    };

    useEffect(() => {
        setSubject(editSubject);
    }, [editSubject]);

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
                <h1 className="text-[23px]">Edit Subject</h1>
                {subject && (
                    <div className="mt-4 flex flex-col gap-5">
                        <InputField
                            label="Name *"
                            value={subject?.subject_name}
                            onChange={onChange}
                            placeholder="Enter the subject name"
                            name="subject_name"
                        />
                        <InputField
                            label="Timetable *"
                            value={subject.timetable}
                            onChange={onChange}
                            name="timetable"
                            placeholder="Ex: Every Tuesday 1-2PM"
                        />
                        <div className="w-full flex flex-col">
                            <label className="text-[16px]">
                                First Lesson Date *
                            </label>
                            <DatePicker
                                className="py-3 mt-2 text-[18px]"
                                onSelect={(value) =>
                                    onChange({
                                        target: {
                                            name: "first_lesson_date",
                                            value: value?.toISOString(),
                                        },
                                    })
                                }
                                defaultValue={dayjs(
                                    subject.first_lesson_date,
                                    "YYYY-MM-DD"
                                )}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <label htmlFor="">Monthly Payment*</label>
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
                                value={subject.monthly_payment}
                            />
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default EditSubjectModal;
