import React, { useContext, useEffect, useState } from 'react';
import Container from '../../components/Container';
import { authContext } from '../../context/AuthProvider';
import axiosInstance from '../../services/axiosInstance';
import dayjs from 'dayjs';

import { Tabs } from 'antd';
import ClassActivity from './Report/ClassActivity/ClassActivity';
import TestReports from './Report/TestReports';

const Dashboard = () => {
  const { user } = useContext(authContext);
  const [teacher, setTeacher] = useState(null);

  const fetchTeacher = async (id) => {
    try {
      const res = await axiosInstance.get(`/teachers/${id}`);
      setTeacher(res.data.teacher);
    } catch (err) {}
  };

  useEffect(() => {
    fetchTeacher();
  }, []);

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
      const fromTime = dayjs(isAttend.fromTime).format('hh:mm:a');
      const toTime = dayjs(isAttend.toTime).format('hh:mm:a');
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
      <div className="bg-white p-8 rounded-lg flex flex-col">
        <div className="">
          <h1 className="text-[22px] text-gray-800 font-semibold">
            Welcome {user?.name}!
          </h1>
          <p className="text-[14px]">Dashboard</p>
        </div>
        <div className="my-8 border-t"></div>

        <div className="flex flex-row">
          {/* <div className="flex flex-col w-[50%] h-full">
                        <h1 className="border-b pb-5">Your Attendance</h1>
                        <Calendar
                            className="h-full"
                            dateCellRender={renderDataCell}
                        />
                    </div> */}
          <div className="flex flex-col w-full">
            <h1>Recent Reports by You</h1>
            <Reports />
          </div>
        </div>
      </div>
    </Container>
  );
};

const Reports = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(authContext);

  const fetchReports = async (id) => {
    try {
      const res = await axiosInstance.get(
        `/students/single-teacher-reports/${id}`
      );
      setReports(res.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchReports(user.id);
    }
  }, [user]);

  console.log(reports);

  return (
    <div className="">
      <div className="my-5"></div>
      {user && (
        <Tabs
          type="card"
          items={[
            {
              label: 'Class Activity',
              key: 'class_activity',

              children: (
                <ClassActivity
                  dashboard
                  classActivity={reports?.classActivity}
                  fetchReports={fetchReports}
                  loading={loading}
                />
              ),
            },
            {
              label: 'Term Reports',
              key: 'term_reports',
              children: (
                <TestReports
                  dashboard
                  loading={loading}
                  reports={reports?.test_reports}
                  fetchReports={fetchReports}
                />
              ),
            },
          ]}
        />
      )}
    </div>
  );
};

export default Dashboard;
