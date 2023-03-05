import { DatePicker, message, Modal } from "antd";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../../services/axiosInstance";
import dayjs from "dayjs";

const EditDueDate = ({ open, setOpen, editData, fetchFees }) => {
    const [dueDate, setDueDate] = useState(null);

    const handleSubmit = async (e) => {
        if (!dueDate) return message.error("Due date field can't be empty", 2);

        try {
            await axiosInstance.patch(`/fees/change-due-date/${editData.id}`, {
                due_date: dueDate,
            });
            message.success("Due Date has been changed !", 1.2);
            setDueDate({});
            setOpen(null);
            await fetchFees();
        } catch (err) {
            message.error(
                err.response?.data?.message ?? "Something went wrong"
            );
        }
    };

    useEffect(() => {
        setDueDate(editData?.due_date_iso);
    }, [open]);

    return (
        <Modal
            open={open}
            destroyOnClose
            onCancel={() => setOpen(null)}
            okButtonProps={{
                className: "bg-main",
            }}
            onOk={handleSubmit}
        >
            <div className="p-5 ">
                <h1 className="text-[20px]">
                    Edit the Due Date for {editData?.name}
                </h1>
                {editData && (
                    <div className="mt-4 flex flex-col gap-5">
                        <div className="flex flex-col gap-3">
                            <label htmlFor="">Due Date *</label>
                            <DatePicker
                                onChange={(value) => {
                                    setDueDate(value.toISOString());
                                }}
                                defaultValue={dayjs(editData.due_date_iso)}
                            />
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default EditDueDate;
