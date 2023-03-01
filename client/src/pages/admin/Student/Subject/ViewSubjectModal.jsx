import { Modal } from "antd";
import dayjs from "dayjs";
import React from "react";

const ViewSubjectModal = ({ subject, open, setOpen, removeSubject }) => {
    return (
        <Modal
            open={open}
            destroyOnClose
            okText="Remove"
            onOk={() => {
                removeSubject(subject);
                setOpen(null);
            }}
            onCancel={() => setOpen(null)}
            okButtonProps={{ className: "bg-red-500" }}
        >
            <div className="p-5">
                <h1 className="text-[23px]">View Subject</h1>
                <div className="border-b mt-2 mb-6"></div>
                <div className="flex flex-col gap-4">
                    <h1 className="flex items-center gap-4 text-[16px]">
                        Subject Name: <span>{subject?.subject_name}</span>
                    </h1>
                    <h1 className="flex items-center gap-4 text-[16px]">
                        Timetable: <span>{subject?.timetable}</span>
                    </h1>
                    <h1 className="flex items-center gap-4 text-[16px]">
                        Monthly Payment:{" "}
                        <span>£ {subject?.monthly_payment}</span>
                    </h1>
                    <h1 className="flex items-center gap-4 text-[16px]">
                        First Lesson Date:{" "}
                        <span>
                            {dayjs(subject?.first_lesson_date).format(
                                "DD/MM/YYYY"
                            )}
                        </span>
                    </h1>
                </div>
            </div>
        </Modal>
    );
};

export default ViewSubjectModal;
