import { Calendar, DatePicker, message, Modal, TimePicker } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { DeleteOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { useLocation, useParams } from "react-router-dom";
import Container from "../../../components/Container";
import MainButton from "../../../components/MainButton";
import axiosInstance from "../../../services/axiosInstance";

const SetTeacherAttendance = () => {
    const [teacher, setTeacher] = useState(null);
    const [attendanceData, setAttendanceData] = useState({
        fromTime: "",
        toTime: "",
        date: "",
    });
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const params = useParams();

    const handleClick = async (e) => {
        e.preventDefault();

        const { fromTime, toTime, date } = attendanceData;

        if (!fromTime || !toTime || !date)
            return message.error("Please first select the time", 2);

        setLoading(true);

        const total_hour =
            dayjs(attendanceData.toTime).hour() -
            dayjs(attendanceData.fromTime).hour();

        try {
            await axiosInstance.post("/teachers/set-attendance", {
                ...attendanceData,
                total_hour: total_hour,
                teacher_id: teacher._id,
            });

            message.success("Teacher Attendance has been added !");
            fetchTeacher(params.id);
        } catch (err) {
            message.error(
                err.response?.data?.message ?? "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    const onChange = (type, value) => {
        if (type === "date") {
            const date = value.toISOString();
            setAttendanceData((prev) => ({
                ...prev,
                date: date,
            }));
        } else {
            const start = value[0].toISOString();
            const end = value[1].toISOString();

            setAttendanceData((prev) => ({
                ...prev,
                fromTime: start,
                toTime: end,
            }));
        }
    };

    const fetchTeacher = async (id) => {
        try {
            const res = await axiosInstance.get(`/teachers/${id}`);
            setTeacher(res.data.teacher);
        } catch (err) {}
    };

    useEffect(() => {
        if (!location.state?.user) {
            fetchTeacher(params.id);
        } else {
            setTeacher(location.state?.user);
        }
    }, [location]);

    const deleteAttendance = async (id) => {
        try {
            await axiosInstance.delete("/teachers/delete-attendance", {
                data: {
                    teacher_id: teacher._id,
                    attendance_id: id,
                },
            });
            message.success("Attendance has been deleted");
            await fetchTeacher(params.id);
        } catch (err) {
            message.error(
                err.response?.data?.message ?? "Something went wrong"
            );
        }
    };

    const { confirm } = Modal;

    const showConfirm = (id) => {
        confirm({
            title: `Do you want to delete this attendance?`,
            icon: <ExclamationCircleFilled />,
            onOk() {
                deleteAttendance(id);
            },
            okButtonProps: { className: "bg-main text-white" },
            onCancel() {},
        });
    };

    const renderDataCell = (value) => {
        let month = value.month();
        let date = value.date();
        let year = value.year();

        const isAttend = teacher?.attendance.find((d) => {
            const attendDate = dayjs(d.date);

            const condition =
                attendDate.date() == date &&
                attendDate.month() == month &&
                attendDate.year() == year;

            console.log(attendDate.year(), year);
            console.log(condition);

            return condition;
        });

        if (isAttend) {
            const fromTime = dayjs(isAttend.fromTime).format("hh:mm:a");
            const toTime = dayjs(isAttend.toTime).format("hh:mm:a");
            return (
                <div className="bg-green-600 relative text-white text-center rounded-lg py-2">
                    <div
                        onClick={() => {
                            showConfirm(isAttend._id);
                        }}
                        className="text-red-500 bg-white w-[20px] h-[20px] rounded-full cursor-pointer absolute top-1 left-1 active:scale-110 transition-all flex items-center justify-center"
                    >
                        <DeleteOutlined />
                    </div>
                    <p>Worked</p>
                    <p>
                        {fromTime} - {toTime}
                    </p>
                </div>
            );
        }
    };

    return (
        <Container>
            <div className="bg-white p-8 rounded-lg">
                <div className="flex items-center justify-between border-b pb-3">
                    <div>
                        <h1 className="text-[24px]">
                            Attendance for {teacher?.name}
                        </h1>
                        <p className="text-[13px]">Set teacher attendance</p>
                    </div>
                </div>

                <div className="mt-5 flex gap-5">
                    <div className="flex items-center gap-5">
                        <DatePicker
                            className="py-3"
                            onChange={(value) => {
                                onChange("date", value);
                            }}
                            name="date"
                        />
                        <TimePicker.RangePicker
                            className="py-3"
                            onChange={(value) => {
                                onChange("time", value);
                            }}
                            name="time"
                            disabled={false}
                            use12Hours
                        />
                    </div>
                    <MainButton
                        loading={loading}
                        text="Set"
                        onClick={handleClick}
                        className="text-[15px] py-[22px] px-7"
                    />
                </div>

                <div className="mt-5">
                    <Calendar dateCellRender={renderDataCell} />
                </div>
            </div>
        </Container>
    );
};

export default SetTeacherAttendance;
