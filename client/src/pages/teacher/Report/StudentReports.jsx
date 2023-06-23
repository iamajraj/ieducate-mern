import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Container from '../../../components/Container';
import axiosInstance from '../../../services/axiosInstance';
import { Tabs } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import TestReports from './TestReports';
import MainButton from '../../../components/MainButton';
import ClassActivity from './ClassActivity/ClassActivity';

const StudentReports = () => {
  const [student, setStudent] = useState(null);
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('general_reports');

  const { id } = useParams();
  const navigate = useNavigate();

  const fetchReports = async (id) => {
    try {
      const res = await axiosInstance.get(`/students/${id}/reports`);
      setReports(res.data);
      console.log(res);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const fetchStudent = async () => {
    try {
      const res = await axiosInstance.get(`/students/${id}`);
      setStudent(res.data.student);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchStudent(id);
      fetchReports(id);
    }
  }, [id]);

  useEffect(() => {
    if (location.hash) {
      setSelectedTab(location.hash.slice(1));
    } else {
      setSelectedTab('class_activity');
    }
  }, [location.hash]);

  console.log(reports);

  return (
    <Container>
      <div className="bg-white p-8 rounded-lg flex flex-col">
        {loading ? (
          <p>Loading...</p>
        ) : !student ? (
          <p>Student doesn't exists</p>
        ) : (
          <div className="">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ArrowLeftOutlined
                  onClick={() => {
                    navigate('/teacher/dashboard/reports');
                  }}
                />
                <h1 className="text-[22px]">
                  Reports of {student.student_name}
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <MainButton
                  onClick={() => {
                    navigate(`class-activity`);
                  }}
                  text="Create Class Activity"
                />
                <MainButton
                  onClick={() => {
                    navigate(`test-report`);
                  }}
                  text="Create Term Report"
                />
              </div>
            </div>
            <div className="my-5 border-b"></div>
            <Tabs
              onChange={(key) => {
                navigate(`#${key}`);
              }}
              type="card"
              defaultActiveKey={selectedTab}
              items={[
                {
                  label: 'Class Activity',
                  key: 'class_activity',

                  children: (
                    <ClassActivity
                      classActivity={reports?.class_activity}
                      fetchReports={fetchReports}
                    />
                  ),
                },
                {
                  label: 'Term Reports',
                  key: 'term_reports',
                  children: (
                    <TestReports
                      reports={reports?.term_reports}
                      fetchReports={fetchReports}
                    />
                  ),
                },
              ]}
            />
          </div>
        )}
      </div>
    </Container>
  );
};

export default StudentReports;
