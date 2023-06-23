import Container from '../../../components/Container';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, message, Modal, Space, Table, Tag } from 'antd';
import { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { useAxios } from '../../../hooks/useAxios';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const Students = () => {
  const [students, setStudents] = useState([]);
  const { loading, error, response } = useAxios({
    method: 'get',
    url: '/students',
  });

  useEffect(() => {
    if (response) {
      setStudents(response.students);
    }
  }, [response, error, loading]);

  return (
    <Container>
      <div className="bg-white p-8 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-end gap-5">
            <div>
              <h1 className="text-[24px]">Fees / Billings</h1>
              <p className="text-[13px]">
                You can view the fees of a student by clicking on the{' '}
                <b>View Fees</b> button.
              </p>
            </div>
          </div>
          {/* <Link to="view">
                        <MainButton
                            text="All Fees"
                            className="py-4"
                            textClass="text-[15px]"
                        />
                    </Link> */}
        </div>
        <div className="mt-10 border">
          <ActiveInvoiceTable loading={loading} data={students} />
        </div>
      </div>
    </Container>
  );
};

export default Students;

const ActiveInvoiceTable = ({ data, loading }) => {
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
      title: 'Roll No',
      dataIndex: 'student_roll_no',
      key: 'student_roll_no',
      // width: "20%",
      ...getColumnSearchProps('student_roll_no'),
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      // width: "20%",
      ...getColumnSearchProps('year'),
    },
    {
      title: 'Student Name',
      dataIndex: 'student_name',
      key: 'student_name',
      // width: "30%",
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
      title: 'Due Date',
      dataIndex: 'due_date',
      key: 'due_date',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => Date.parse(b.due_date_iso) - Date.parse(a.due_date_iso),
    },
    {
      title: 'Is Paid',
      dataIndex: 'is_paid',
      key: 'is_paid',
      filters: [
        {
          text: 'Paid',
          value: 'Paid',
        },
        {
          text: 'Not Paid',
          value: 'Not Paid',
        },
      ],
      filterMultiple: false,
      onFilter: (value, record) => record.is_paid === value,
    },
    {
      title: 'Active',
      dataIndex: 'active',
      key: 'active',
      render: (_, record) =>
        record.active === 'Active' ? (
          <Space size="middle">
            <Tag className="bg-green-500 text-white">{record.active}</Tag>
          </Space>
        ) : null,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="dashed"
            onClick={() => {
              navigate(`${record._id}`);
            }}
          >
            View Fees
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <Table
      loading={loading}
      columns={columns}
      dataSource={data
        .filter((d) => d.active_invoice !== null)
        .map((d) => {
          return {
            ...d,
            due_date_iso: d.active_invoice.due_date,
            payment_reminder_iso: d.active_invoice.payment_reminder,
            due_date: dayjs(d.active_invoice.due_date).format('DD/MM/YYYY'),
            active: d.active_invoice.isActive ? 'Active' : 'Not Active',
            is_paid: d.active_invoice.isPaid,
          };
        })}
      pagination={{
        pageSize: 7,
      }}
    />
  );
};
