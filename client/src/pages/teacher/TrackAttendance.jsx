import { Calendar } from "antd";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import Container from "../../components/Container";
import axiosInstance from "../../services/axiosInstance";
import { authContext } from "../../context/AuthProvider";

const TrackAttendance = () => {
    const { user } = useContext(authContext);
    const [teacher, setTeacher] = useState(null);

    const fetchTeacher = async (id) => {
        try {
            const res = await axiosInstance.get(`/teachers/${id}`);
            setTeacher(res.data.teacher);
        } catch (err) {}
    };

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
                        <h1 className="text-[24px]">
                            Attendance of {teacher?.name}
                        </h1>
                    </div>
                </div>
                <div className="mt-5">
                    <Calendar dateCellRender={renderDataCell} />
                </div>
            </div>
        </Container>
    );
};

export default TrackAttendance;
