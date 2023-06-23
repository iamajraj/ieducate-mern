import MainButton from '../../../../components/MainButton';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Container from '../../../../components/Container';
import axiosInstance from '../../../../services/axiosInstance';
import { Button, DatePicker, Input, Select, message } from 'antd';
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const EditClassActivity = () => {
  const [report, setClassActivity] = useState({
    date: '',
    comment: '',
    homework: '',
    feedback_files: [],
    removed_files: [],
  });
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const { id, classActivityId } = useParams();
  const navigate = useNavigate();

  console.log(report);

  const fetchClassActivity = async () => {
    try {
      const res = await axiosInstance.get(
        `/students/class-activity/${classActivityId}`
      );
      setClassActivity(res.data.classActivity);
      setFiles(
        res.data.classActivity.attachments?.map((file) => {
          return {
            uid: file._id,
            name: file.originalname,
            old: true,
            type: 'pdf',
          };
        })
      );
    } catch (err) {
      setClassActivity(null);
    }
  };

  useEffect(() => {
    if (classActivityId) {
      fetchClassActivity();
    }
  }, [classActivityId]);

  const handleChange = (e) => {
    setClassActivity((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { date, comment, homework } = report;

    if (!date || !comment || !homework)
      return message.error('Please provide all fields');

    setLoading(true);

    const formData = new FormData();

    formData.append('date', date);
    formData.append('comment', comment);
    formData.append('homework', homework);

    if (report.removed_files?.length > 0) {
      formData.append('removed_files', JSON.stringify(report.removed_files));
    }

    files.forEach((file) => {
      if (file instanceof File) {
        formData.append('attachments[]', file);
      }
    });

    try {
      await axiosInstance.put(
        `/students/class-activity/${classActivityId}`,
        formData
      );
      message.success('Class Activity has been updated !');
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
        setClassActivity((prev) => ({
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
    setClassActivity((prev) => ({ ...prev, feedback_files: [files] }));
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
            <h1 className="text-[22px]">Edit the Class Activity</h1>
            <p className="text-[13px]">
              Edit the class activity and click on the save button to save it !
            </p>
          </div>
        </div>

        <div className="my-6 border-b"></div>

        {!report ? (
          <p>Class Activity doesn't Exists</p>
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
              <p className="text-[14px]">Homework:</p>
              <Input.TextArea
                value={report.homework}
                name="homework"
                placeholder="Add Homework"
                onChange={handleChange}
              />
            </div>

            <div className="flex gap-5">
              <p className="">Attachments:</p>
              <Upload
                {...props}
                accept=".pdf,.doc,.docx,.txt"
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

export default EditClassActivity;
