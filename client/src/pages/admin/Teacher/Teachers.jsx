import Container from "../../../components/Container";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, message, Modal, Space, Table } from "antd";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useAxios } from "../../../hooks/useAxios";
import { ExclamationCircleFilled } from "@ant-design/icons";
import axiosInstance from "../../../services/axiosInstance";
import MainButton from "../../../components/MainButton";
import { Link } from "react-router-dom";
import InputField from "../../../components/InputField";
import isValidEmail from "../../../utils/validateEmail";

const Teachers = () => {
    const [teachers, setTeachers] = useState([]);
    const { loading, error, response } = useAxios({
        method: "get",
        url: "/teachers",
    });
    const [editInfo, setEditInfo] = useState(null);

    const fetchTeachers = async () => {
        try {
            const res = await axiosInstance.get("/teachers");
            setTeachers(res.data.teachers);
        } catch (err) {}
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/teachers/${id}`);
            message.success("Teacher has been deleted");
            await fetchTeachers();
        } catch (err) {
            message.error(
                err.response?.data?.message ?? "Something went wrong."
            );
        }
    };

    const { confirm } = Modal;

    const showConfirm = (teacher) => {
        confirm({
            title: `Do you want to delete ${teacher.name}?`,
            icon: <ExclamationCircleFilled />,
            onOk() {
                handleDelete(teacher._id);
            },
            okButtonProps: { className: "bg-main text-white" },
            onCancel() {},
        });
    };

    useEffect(() => {
        if (response) {
            setTeachers(response.teachers);
        }
    }, [response, error, loading]);

    const exportToCSV = async () => {
        try {
            const res = await axiosInstance.get("/teachers/export-to-csv");
            const a = document.createElement("a");
            a.download = "teachers.csv";
            a.href = "data:text/csv;charset=utf-8," + res.data.exported;
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
                            <h1 className="text-[24px]">Teachers</h1>
                            <p className="text-[13px]">
                                View all the teachers that you have added.
                            </p>
                        </div>
                        <MainButton
                            onClick={exportToCSV}
                            text="Export to CSV"
                        />
                    </div>
                    <Link to="/admin/dashboard/teachers/register">
                        <MainButton
                            text="Add Teacher"
                            className="py-4"
                            textClass="text-[15px]"
                        />
                    </Link>
                </div>
                <div className="mt-10 border">
                    <TeachersTable
                        data={teachers}
                        loading={loading}
                        onDelete={showConfirm}
                        onEdit={setEditInfo}
                    />
                </div>
            </div>

            <EditTeacherModal
                editInfo={editInfo}
                setEditInfo={setEditInfo}
                open={editInfo}
                fetchTeachers={fetchTeachers}
                cancel={() => {
                    setEditInfo(null);
                }}
            />
        </Container>
    );
};

export default Teachers;

const TeachersTable = ({ data, loading, onDelete, onEdit }) => {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
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
                    onPressEnter={() =>
                        handleSearch(selectedKeys, confirm, dataIndex)
                    }
                    style={{
                        marginBottom: 8,
                        display: "block",
                    }}
                />
                <Space>
                    <Button
                        type="dashed"
                        onClick={() =>
                            handleSearch(selectedKeys, confirm, dataIndex)
                        }
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() =>
                            clearFilters && handleReset(clearFilters)
                        }
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
                    color: filtered ? "#1890ff" : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: "#ffc069",
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            ),
    });

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            width: "30%",
            ...getColumnSearchProps("name"),
        },
        {
            title: "Username",
            dataIndex: "username",
            key: "username",
            width: "20%",
            ...getColumnSearchProps("username"),
        },
        {
            title: "Email Address",
            dataIndex: "email",
            key: "email",
            ...getColumnSearchProps("email"),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        onClick={() => {
                            onEdit(record);
                        }}
                        type="dashed"
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
            dataSource={data.map((d) => ({
                ...d,
                key: d._id,
            }))}
            pagination={{
                pageSize: 7,
            }}
        />
    );
};

const EditTeacherModal = ({
    editInfo,
    open,
    cancel,
    setEditInfo,
    fetchTeachers,
}) => {
    const [loading, setLoading] = useState(false);

    const onEditChange = (e) => {
        setEditInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { email, name, username } = editInfo;

        if (!email || !username || !name)
            return message.error("Input fields marked with (*) can't be empty");

        if (!isValidEmail(email))
            return message.error("Email address is not valid");

        setLoading(true);

        try {
            await axiosInstance.put(`/teachers/${editInfo._id}`, editInfo);
            message.success("Teacher info has been updated");
            await fetchTeachers();
            setEditInfo(null);
        } catch (err) {
            message.error(err.response.data?.message ?? "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            onCancel={cancel}
            okButtonProps={{
                type: "ghost",
                htmlType: "submit",
                className: "bg-main text-white",
                loading: loading,
            }}
            onOk={handleSubmit}
            open={Boolean(open)}
        >
            <div className="p-5">
                <h1 className="text-[20px] border-b pb-3">
                    Edit {editInfo?.name}
                </h1>
                <form
                    onSubmit={handleSubmit}
                    className="mt-4 flex flex-col gap-5"
                >
                    <InputField
                        label="Name *"
                        value={editInfo?.name}
                        onChange={onEditChange}
                        name="name"
                    />
                    <InputField
                        label="Email *"
                        value={editInfo?.email}
                        onChange={onEditChange}
                        name="email"
                    />
                    <InputField
                        label="Username *"
                        value={editInfo?.username}
                        onChange={onEditChange}
                        name="username"
                    />
                    <InputField
                        label="Speciality"
                        value={editInfo?.speciality}
                        onChange={onEditChange}
                        name="speciality"
                    />
                    <InputField
                        label="Password"
                        value={editInfo?.password ?? ""}
                        onChange={onEditChange}
                        name="password"
                        isPassword
                    />
                </form>
            </div>
        </Modal>
    );
};
