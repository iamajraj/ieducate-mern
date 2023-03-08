import { Calendar, DatePicker } from "antd";
import dayjs from "dayjs";
import React, { useContext, useEffect, useMemo, useState } from "react";
import Container from "../../components/Container";
import axiosInstance from "../../services/axiosInstance";
import { authContext } from "../../context/AuthProvider";

const TrackAttendance = () => {
    const { user } = useContext(authContext);
    const [selectedDate, setSelectedDate] = useState(Date.now());
    const [teacher, setTeacher] = useState(null);

    const fetchTeacher = async (id) => {
        try {
            const res = await axiosInstance.get(`/teachers/${id}`);
            setTeacher(res.data.teacher);
        } catch (err) {}
    };

    const total_hour_worked = useMemo(() => {
        let total_hour = 0;
        teacher?.attendance.forEach((attendance) => {
            if (
                dayjs(attendance.date).month() ===
                    dayjs(selectedDate).month() &&
                dayjs(attendance.date).year() === dayjs(selectedDate).year()
            ) {
                total_hour += attendance.total_hour;
            }
        });
        return total_hour;
    }, [selectedDate, teacher]);

    useEffect(() => {
        if (user) {
            fetchTeacher(user.id);
        }
    }, [user]);

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

            return condition;
        });

        if (isAttend) {
            const fromTime = dayjs(isAttend.fromTime).format("hh:mm:a");
            const toTime = dayjs(isAttend.toTime).format("hh:mm:a");
            return (
                <div className="bg-green-600 text-white text-center rounded-lg py-2">
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
                        <h1 className="text-[24px]">Your Attendance</h1>
                        {/* <DatePicker
                            className="mt-2"
                            defaultValue={dayjs(selectedDate)}
                            format="MMMM - YYYY"
                            picker="month"
                            onChange={(value) => {
                                setSelectedDate(value.toISOString());
                            }}
                        /> */}
                        <p className="mt-2">
                            Total Hour Worked on{" "}
                            {dayjs(selectedDate).format("MMMM")}:{" "}
                            {total_hour_worked}h
                        </p>
                    </div>
                </div>
                <div className="mt-5">
                    <Calendar
                        onChange={(value) => {
                            setSelectedDate(value.toISOString());
                        }}
                        dateCellRender={renderDataCell}
                    />
                </div>
            </div>
        </Container>
    );
};

export default TrackAttendance;
