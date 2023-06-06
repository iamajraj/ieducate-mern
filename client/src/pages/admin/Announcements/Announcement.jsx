import Container from '../../../components/Container';
import { ExclamationCircleFilled, SearchOutlined } from '@ant-design/icons';
import { Button, Input, message, Modal, Space, Table } from 'antd';
import { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { Link } from 'react-router-dom';
import { useAxios } from '../../../hooks/useAxios';
import MainButton from '../../../components/MainButton';
import axiosInstance from '../../../services/axiosInstance';
import InputField from '../../../components/InputField';

const Announcements = () => {
  const { loading, error, response } = useAxios({
    url: '/announcements',
    method: 'get',
  });
  const [edit, onEdit] = useState(null);
  const [announcements, setAnnouncements] = useState([]);

  const fetchAnnouncements = async () => {
    try {
      const res = await axiosInstance.get('/announcements');
      setAnnouncements(res.data.announcements);
    } catch (err) {}
  };

  useEffect(() => {
    if (response) {
      setAnnouncements(response.announcements);
    }
  }, [response]);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/announcements/${id}`);
      message.success('Announcement has been deleted');
      await fetchAnnouncements();
    } catch (err) {
      message.error(err.response?.data?.message);
    }
  };

  const { confirm } = Modal;

  const showConfirm = (announcement) => {
    confirm({
      title: `Do you want to delete this announcement?`,
      icon: <ExclamationCircleFilled />,
      onOk() {
        handleDelete(announcement._id);
      },
      okButtonProps: { className: 'bg-main text-white' },
      onCancel() {},
    });
  };

  return (
    <Container>
      <div className="bg-white p-8 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[24px]">Announcements</h1>
            <p className="text-[13px]">View all the announcements.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin/dashboard/announcements/add">
              <MainButton
                text="Add Announcement"
                className="py-4"
                textClass="text-[15px]"
              />
            </Link>
            <Link to="/admin/dashboard/announcements/send">
              <MainButton
                text="Send Announcement"
                className="py-4"
                textClass="text-[15px]"
              />
            </Link>
          </div>
        </div>
        <div className="mt-10 border">
          <AnnouncementsTable
            loading={loading}
            data={announcements}
            onEdit={onEdit}
            onDelete={showConfirm}
          />
        </div>
      </div>

      <EditAdminModal
        editInfo={edit}
        setEditInfo={onEdit}
        open={edit}
        fetchAnnouncements={fetchAnnouncements}
        cancel={() => {
          onEdit(null);
        }}
      />
    </Container>
  );
};

export default Announcements;

const AnnouncementsTable = ({ data, loading, onEdit, onDelete }) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

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
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: '30%',
      ...getColumnSearchProps('title'),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '20%',
      ...getColumnSearchProps('description'),
    },
    {
      title: 'Created By',
      dataIndex: 'created_by',
      key: 'created_by',
      ...getColumnSearchProps('created_by'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="dashed"
            onClick={() => {
              onEdit(record);
            }}
          >
            Edit
          </Button>
          <Button
            danger
            type="dashed"
            onClick={() => {
              onDelete(record);
            }}
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
      dataSource={data.map((d) => {
        return {
          ...d,
          key: d?._id,
          created_by: d.created_by?.name ?? 'Deleted Admin',
        };
      })}
      pagination={{
        pageSize: 7,
      }}
    />
  );
};

const EditAdminModal = ({
  editInfo,
  open,
  cancel,
  setEditInfo,
  fetchAnnouncements,
}) => {
  const [loading, setLoading] = useState(false);

  const onEditChange = (e) => {
    setEditInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, description } = editInfo;

    if (!title || !description)
      return message.error("Input fields can't be empty");

    setLoading(true);

    try {
      await axiosInstance.put(`/announcements/${editInfo._id}`, editInfo);
      message.success('Announcement has been updated');
      await fetchAnnouncements();
      setEditInfo(null);
    } catch (err) {
      message.error(err.response.data?.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      onCancel={cancel}
      okButtonProps={{
        type: 'ghost',
        htmlType: 'submit',
        className: 'bg-main text-white',
        loading: loading,
      }}
      onOk={handleSubmit}
      open={Boolean(open)}
    >
      <div className="p-5">
        <h1 className="text-[20px] border-b pb-3">Edit Announcement</h1>
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-5">
          <InputField
            label="Title"
            value={editInfo?.title}
            onChange={onEditChange}
            name="title"
          />
          <div className="flex flex-col gap-3">
            <p className="text-[16px]">Description</p>
            <Input.TextArea
              name="description"
              value={editInfo?.description}
              onChange={onEditChange}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};
