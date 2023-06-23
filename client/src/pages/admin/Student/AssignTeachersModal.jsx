import { Button, Modal, Select, message } from 'antd';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../services/axiosInstance';

function AssignTeachersModal({ open, student, handleCancel, fetchStudent }) {
  const [teachers, setTeachers] = useState([]);
  const [teachersId, setTeachersId] = useState([]);
  const [loading, setLoading] = useState(false);

  const getTeachers = async () => {
    try {
      const res = await axiosInstance.get('/teachers');
      setTeachers(res.data.teachers);
    } catch (err) {}
  };

  useEffect(() => {
    if (student) {
      setTeachersId(student.assigned_teachers);
    }
  }, [student]);

  const onSubmit = async () => {
    if (!student) return;
    setLoading(true);
    try {
      await axiosInstance.put('/students/assign-teacher', {
        studentId: student._id,
        teacherIds: teachersId,
      });

      message.success('Teachers has been assigned !', 1.2);
      fetchStudent();
    } catch (err) {
      console.log(err);
      message.error(err.response.data?.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
      setTeachersId([]);
      handleCancel();
    }
  };

  useEffect(() => {
    getTeachers();
  }, []);

  const handleTeachersId = (id) => {
    setTeachersId(id);
  };

  return (
    <Modal
      open={open}
      title={`Assign/Remove Teacher for ${student.student_name}`}
      onCancel={handleCancel}
      maskClosable={false}
      onOk={onSubmit}
      okButtonProps={{
        loading: loading,
      }}
    >
      <div className="my-4 space-y-4">
        <h2>Select the students</h2>
        <Select
          mode="multiple"
          size="middle"
          placeholder="Please select"
          onChange={handleTeachersId}
          style={{ width: '100%' }}
          value={teachersId}
          options={teachers.map((teacher) => ({
            label: teacher.name,
            value: teacher._id,
          }))}
        />
      </div>
    </Modal>
  );
}

export default AssignTeachersModal;
