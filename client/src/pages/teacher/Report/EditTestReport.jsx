import MainButton from '../../../components/MainButton';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Container from '../../../components/Container';
import axiosInstance from '../../../services/axiosInstance';
import { Button, DatePicker, Input, Select, message } from 'antd';
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const EditTestReport = () => {
  const [report, setReport] = useState({
    date: '',
    comment: '',
    summary: '',
    progress: '',
    attainment: '',
    effort: '',
    feedback_files: [],
    removed_files: [],
  });
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const { id, reportId } = useParams();
  const navigate = useNavigate();

  const fetchReport = async () => {
    try {
      const res = await axiosInstance.get(`/students/test-report/${reportId}`);
      setReport(res.data.report);
      setFiles(
        res.data.report.feedback_files?.map((file) => {
          return {
            uid: file._id,
            name: file.originalname,
            old: true,
            type: 'pdf',
          };
        })
      );
    } catch (err) {
      setReport(null);
    }
  };

  useEffect(() => {
    if (reportId) {
      fetchReport();
    }
  }, [reportId]);

  const handleChange = (e) => {
    setReport((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { date, comment, summary, attainment, effort, progress } = report;

    if (!date || !comment || !summary)
      return message.error('Please provide all fields');

    setLoading(true);

    const formData = new FormData();

    formData.append('date', date);
    formData.append('comment', comment);
    formData.append('summary', summary);
    formData.append('attainment', attainment);
    formData.append('effort', effort);
    formData.append('progress', progress);

    if (report.removed_files?.length > 0) {
      formData.append('removed_files', JSON.stringify(report.removed_files));
    }

    files.forEach((file) => {
      if (file instanceof File) {
        formData.append('feedback_files[]', file);
      }
    });

    try {
      await axiosInstance.put(`/students/test-report/${reportId}`, formData);
      message.success('Report has been updated !');
      navigate(-1);
    } catch (err) {
      message.error(err.response?.data?.message ?? 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const props = {
    onRemove: (file) => {
      const index = files.indexOf(file);
      const removed_file = files[index];

      if (removed_file.old) {
        setReport((prev) => ({
          ...prev,
          removed_files: [...(prev.removed_files ?? []), removed_file],
        }));
      }

      const newFileList = files.slice();
      newFileList.splice(index, 1);
      setFiles(newFileList);
    },
    files,
  };

  useEffect(() => {
    setReport((prev) => ({ ...prev, feedback_files: [files] }));
  }, [files]);

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
            <h1 className="text-[22px]">Edit the report</h1>
            <p className="text-[13px]">
              Edit the report and click on the save button to save it !
            </p>
          </div>
        </div>

        <div className="my-6 border-b"></div>

        {!report ? (
          <p>Report doesn't Exists</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex items-center gap-5">
              <p className="text-[14px]">Date:</p>
              <DatePicker
                name="date"
                value={dayjs(report.date)}
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
                value={report.comment}
                name="comment"
                onChange={handleChange}
                placeholder="Add feedback"
              />
            </div>
            <div className="flex items-start gap-5">
              <p className="text-[14px]">Summary:</p>
              <Input.TextArea
                value={report.summary}
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
                value={report.progress}
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
                value={report.attainment}
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
                placeholder="Select Effort"
                className="min-w-[150px]"
                value={report.effort}
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
                fileList={files}
              >
                <Button icon={<UploadOutlined />}>Select File</Button>
              </Upload>
            </div>
            <MainButton loading={loading} text="Update Report" type="submit" />
          </form>
        )}
      </div>
    </Container>
  );
};

export default EditTestReport;
