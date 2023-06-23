import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Container from '../../../components/Container';
import axiosInstance from '../../../services/axiosInstance';
import { Button, DatePicker, Input, message, Select } from 'antd';
import MainButton from '../../../components/MainButton';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftOutlined,
  InboxOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Upload } from 'antd';

const CreateTermReport = () => {
  const [student, setStudent] = useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [report, setReport] = useState({
    feedback_files: [],
    date: '',
    summary: '',
    comment: '',
    progress: '',
    attainment: '',
    effort: '',
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const fetchStudent = async () => {
    try {
      const res = await axiosInstance.get(`/students/${id}`);
      setStudent(res.data.student);
    } catch (err) {}
  };

  useEffect(() => {
    if (id) {
      fetchStudent();
    }
  }, [id]);

  const handleSubjectChange = (value) => {
    setSelectedSubjectId(value);
  };

  const handleChange = (e) => {
    setReport((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(report);

    const { date, comment, summary, progress, attainment, effort } = report;

    if (!selectedSubjectId || !student) return;

    if (!date || !comment || !summary)
      return message.error('Please provide all fields');

    setLoading(true);

    const formData = new FormData();

    formData.append('subject_id', selectedSubjectId);
    formData.append('student_id', id);
    formData.append('comment', comment);
    formData.append('date', date);
    formData.append('summary', summary);
    formData.append('progress', progress);
    formData.append('attainment', attainment);
    formData.append('effort', effort);

    files.forEach((file) => {
      formData.append('feedback_files[]', file);
    });

    try {
      await axiosInstance.post('/students/test-report', formData);
      message.success('Report has been created !');
      navigate(-1);
      navigate('#term_reports');
    } catch (err) {
      message.error(err.response?.data?.message ?? 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setReport((prev) => ({ ...prev, feedback_files: files }));
  }, [files]);

  const props = {
    onRemove: (file) => {
      const index = files.indexOf(file);
      const newFileList = files.slice();
      newFileList.splice(index, 1);
      setFiles(newFileList);
    },
    files,
  };

  return (
    <Container>
      <div className="bg-white p-8 rounded-lg flex flex-col">
        <div className="flex items-start gap-3">
          <ArrowLeftOutlined
            className="mt-2"
            onClick={() => {
              navigate(-1);
            }}
          />
          <div>
            <h1 className="text-[22px]">
              Create Term Report for {student?.student_name}
            </h1>
            <p className="text-[13px]">
              Select a subject of the student to create term report
            </p>
          </div>
        </div>

        <div className="my-6 border-b"></div>
        {student && (
          <>
            <Select
              placeholder="Select subject"
              className="w-[170px]"
              onChange={handleSubjectChange}
              options={student.subjects.map((subject) => {
                return {
                  value: subject._id,
                  label: subject.subject_name,
                };
              })}
            />

            <div className="my-7 border-b"></div>

            {selectedSubjectId ? (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
                key={selectedSubjectId}
              >
                <div className="flex items-center gap-5">
                  <p className="text-[14px]">Date:</p>
                  <DatePicker
                    onChange={(value) => {
                      handleChange({
                        target: {
                          name: 'date',
                          value: value.toISOString(),
                        },
                      });
                    }}
                  />
                </div>

                <div className="flex items-start gap-5">
                  <p className="text-[14px]">Comment:</p>
                  <Input.TextArea
                    name="comment"
                    onChange={handleChange}
                    placeholder="Add feedback"
                  />
                </div>
                <div className="flex items-start gap-5">
                  <p className="text-[14px]">Summary:</p>
                  <Input.TextArea
                    name="summary"
                    placeholder="Add Summary"
                    onChange={handleChange}
                  />
                </div>

                <div className="flex items-center gap-5">
                  <p className="text-[14px]">Progress:</p>
                  <Select
                    placeholder="Select Progress"
                    className="min-w-[200px]"
                    options={[
                      {
                        value: 'Below Expected Progress',
                        label: 'Below Expected Progress',
                      },
                      {
                        value: 'Making Expected Progress',
                        label: 'Making Expected Progress',
                      },
                      {
                        value: 'Above Expected Progress',
                        label: 'Above Expected Progress',
                      },
                    ]}
                    onChange={(value) => {
                      handleChange({
                        target: {
                          name: 'progress',
                          value: value,
                        },
                      });
                    }}
                  />
                </div>
                <div className="flex items-center gap-5">
                  <p className="text-[14px]">Attainment:</p>
                  <Select
                    placeholder="Select Attainment"
                    className="min-w-[200px]"
                    options={[
                      {
                        value: 'Working towards the national standard',
                        label: 'Working towards the national standard',
                      },
                      {
                        value: 'Working at the National Standard',
                        label: 'Working at the National Standard',
                      },
                      {
                        value:
                          'Working at greater depth than the national standard',
                        label:
                          'Working at greater depth than the national standard',
                      },
                    ]}
                    onChange={(value) => {
                      handleChange({
                        target: {
                          name: 'attainment',
                          value: value,
                        },
                      });
                    }}
                  />
                </div>
                <div className="flex items-center gap-5">
                  <p className="text-[14px]">Effort:</p>
                  <Select
                    placeholder="Select Attainment"
                    className="min-w-[150px]"
                    options={[
                      {
                        value: 'Sometimes tried hard',
                        label: 'Sometimes tried hard',
                      },
                      {
                        value: 'Tries hard most of the time',
                        label: 'Tries hard most of the time',
                      },
                      {
                        value: 'Always tries hard',
                        label: 'Always tries hard',
                      },
                    ]}
                    onChange={(value) => {
                      handleChange({
                        target: {
                          name: 'effort',
                          value: value,
                        },
                      });
                    }}
                  />
                </div>

                <div className="flex gap-5">
                  <p className="">Feedback Files:</p>
                  <Upload
                    {...props}
                    accept=".pdf"
                    listType="picture"
                    beforeUpload={(file) => {
                      setFiles((prev) => [...prev, file]);
                      return false;
                    }}
                  >
                    <Button icon={<UploadOutlined />}>Select File</Button>
                  </Upload>
                </div>
                <MainButton
                  loading={loading}
                  text="Create Report"
                  type="submit"
                />
              </form>
            ) : (
              <p className="text-gray-400 font-light">
                *Select select a subject*
              </p>
            )}
          </>
        )}
      </div>
    </Container>
  );
};

export default CreateTermReport;
