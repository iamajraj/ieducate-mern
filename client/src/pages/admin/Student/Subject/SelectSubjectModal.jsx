import { DatePicker, InputNumber, message, Modal } from "antd";
import React, { useEffect, useState } from "react";
import InputField from "../../../../components/InputField";

const initialSubjectData = {
    subject_name: "",
    timetable: "",
    monthly_payment: "",
    first_lesson_date: "",
};

const SelectSubjectModal = ({
    open,
    setOpen,
    setSubjectData,
    setStudentData,
    forEdit,
}) => {
    const [subject, setSubject] = useState(initialSubjectData);

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

        if (forEdit) {
            setStudentData((prev) => ({
                ...prev,
                new_subject_local_ids: [
                    ...(prev?.new_subject_local_ids ?? []),
                    subject.local_id,
                ],
            }));
        }

        setSubjectData((prev) => [...prev, subject]);
        message.success("Subject is added !", 1.2);
        setSubject({});
        setOpen(false);
    };

    useEffect(() => {
        setSubject((prev) => ({ ...prev, local_id: Date.now() }));
    }, []);

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
                <h1 className="text-[23px]">Add Subject</h1>
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
                            onChange={(value) =>
                                onChange({
                                    target: {
                                        name: "first_lesson_date",
                                        value: value?.toISOString(),
                                    },
                                })
                            }
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
            </div>
        </Modal>
    );
};

export default SelectSubjectModal;
