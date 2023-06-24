import Container from '../../../components/Container';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, message, Modal, Space, Table } from 'antd';
import { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import MainButton from '../../../components/MainButton';
import { useAxios } from '../../../hooks/useAxios';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../services/axiosInstance';
import SortIcon from '../../../assets/SortIcon';
import { ExclamationCircleFilled } from '@ant-design/icons';
import AssignTeachersModal from './AssignTeachersModal';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [assignTeacher, setAssignTeacher] = useState(null);
  const { loading, error, response } = useAxios({
    method: 'get',
    url: '/students',
  });

  const fetchStudents = async () => {
    try {
      const res = await axiosInstance.get('/students');
      setStudents(res.data.students);
    } catch (err) {}
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/students/delete/${id}`);
      message.success('Student has been deleted');
      await fetchStudents();
    } catch (err) {
      message.error(err.response.data?.message);
    }
  };

  const { confirm } = Modal;

  const showConfirm = (student) => {
    confirm({
      title: `Do you want to delete ${student.student_name}?`,
      icon: <ExclamationCircleFilled />,
      onOk() {
        handleDelete(student._id);
      },
      okButtonProps: { className: 'bg-main text-white' },
      onCancel() {},
    });
  };

  useEffect(() => {
    if (response) {
      setStudents(response.students);
    }
  }, [response, error, loading]);

  const exportToCSV = async () => {
    try {
      const res = await axiosInstance.get('/students/export-to-csv');
      const a = document.createElement('a');
      a.download = 'students.csv';
      a.href = 'data:text/csv;charset=utf-8,' + res.data.exported;
      a.click();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container>
      <div className="bg-white p-8 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-end gap-5">
            <div>
              <h1 className="text-[24px]">Students</h1>
              <p className="text-[13px]">
                View all the students that you have added.
              </p>
            </div>
            <MainButton onClick={exportToCSV} text="Export to CSV" />
          </div>
          <Link to="/admin/dashboard/students/register">
            <MainButton
              text="Add Student"
              className="py-4"
              textClass="text-[15px]"
            />
          </Link>
        </div>
        <div className="mt-10 border">
          <StudentsTable
            loading={loading}
            data={students}
            onDelete={showConfirm}
            onAssign={(record) => {
              setAssignTeacher(record);
            }}
          />
        </div>
      </div>
      {assignTeacher && (
        <AssignTeachersModal
          open={assignTeacher}
          student={assignTeacher}
          fetchStudent={fetchStudents}
          handleCancel={() => setAssignTeacher(null)}
        />
      )}
    </Container>
  );
};

export default Students;

const StudentsTable = ({ data, onDelete, loading, onAssign }) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const navigate = useNavigate();

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="dashed"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: (
        <div className="flex items-center justify-center relative ">
          <p className="shrink-0">Roll No </p>
          <SortIcon
            style={{ marginLeft: '8px' }}
            className="absolute -right-5 top-1 pointer-events-none bg-[#FAFAFA]"
          />
        </div>
      ),
      dataIndex: 'student_roll_no',
      key: 'student_roll_no',
      ...getColumnSearchProps('student_roll_no'),
    },
    {
      title: (
        <div className="flex items-center justify-center relative ">
          <p className="shrink-0">Year </p>
          <SortIcon
            style={{ marginLeft: '8px' }}
            className="absolute -right-5 top-1 pointer-events-none bg-[#FAFAFA]"
          />
        </div>
      ),
      dataIndex: 'year',
      key: 'year',
      ...getColumnSearchProps('year'),
    },
    {
      title: 'Student Name',
      dataIndex: 'student_name',
      key: 'student_name',
      ...getColumnSearchProps('student_name'),
    },
    {
      title: 'Email Address',
      dataIndex: 'email',
      key: 'email',
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Student Telephone',
      dataIndex: 'student_telephone',
      key: 'student_telephone',
      ...getColumnSearchProps('student_telephone'),
    },
    {
      title: 'Student Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        {
          text: 'Active',
          value: 'Active',
        },
        {
          text: 'Suspended',
          value: 'Suspended',
        },
        {
          text: 'Left',
          value: 'Left',
        },
      ],
      filterMultiple: false,
      onFilter: (value, record) => record.status === value,
      // ...getColumnSearchProps("status"),
    },
    {
      title: 'Assign Teachers',
      key: 'assign_teachers',
      render: (_, record) => (
        <Space size="middle">
          <Button
            className={`${
              record.assigned_teachers.length > 0
                ? 'border-green-500 bg-green-200'
                : ''
            }`}
            onClick={() => {
              onAssign(record);
            }}
            type="dashed"
          >
            Assign/Remove
          </Button>
        </Space>
      ),
      filters: [
        {
          text: 'Assigned',
          value: 1,
        },
        {
          text: 'Not Assigned',
          value: 0,
        },
      ],
      filterMultiple: false,
      onFilter: (value, record) => {
        return Boolean(value)
          ? record.assigned_teachers.length > 0
          : record.assigned_teachers.length === 0;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="dashed"
            onClick={() => {
              navigate(`edit/${record._id}`);
            }}
          >
            Edit
          </Button>

          <Button
            onClick={() => {
              onDelete(record);
            }}
            danger
            type="dashed"
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      loading={loading}
      columns={columns}
      dataSource={data}
      pagination={{
        pageSize: 7,
      }}
    />
  );
};
