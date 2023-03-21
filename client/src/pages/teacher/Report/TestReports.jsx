import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, message, Modal, Space, Table, Tag } from "antd";
import { useContext, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { authContext } from "../../../context/AuthProvider";
import dayjs from "dayjs";
import { ExclamationCircleFilled } from "@ant-design/icons";
import axiosInstance from "../../../services/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";

const TestReports = ({ loading, reports, fetchReports, dashboard }) => {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);

    const navigate = useNavigate();

    const { user } = useContext(authContext);
    const { id } = useParams();

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

    const onDelete = async (report_id, student_id) => {
        if (!report_id || !student_id) return;

        try {
            await axiosInstance.delete(`/students/test-report/${report_id}`, {
                data: {
                    student_id,
                },
            });
            message.success("Report has been deleted.");
            await fetchReports(id);
        } catch (err) {
            message.error(
                err.response?.data.message ?? "Something went wrong."
            );
        }
    };

    const { confirm } = Modal;

    const showConfirm = (report_id, student_id) => {
        confirm({
            title: `Do you want to delete this report?`,
            icon: <ExclamationCircleFilled />,
            onOk() {
                onDelete(report_id, student_id);
            },
            okButtonProps: { className: "bg-main text-white" },
            onCancel() {},
        });
    };

    const columns = [
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            ...getColumnSearchProps("date"),
        },
        {
            title: "Subject",
            dataIndex: "subject",
            key: "subject",
            ...getColumnSearchProps("subject"),
        },
        {
            title: "Comment",
            dataIndex: "comment",
            key: "comment",
            ellipsis: true,
            ...getColumnSearchProps("comment"),
        },
        {
            title: "Summary",
            dataIndex: "summary",
            key: "summary",
            ellipsis: true,
            ...getColumnSearchProps("summary"),
        },
        {
            title: "Feedback Files",
            dataIndex: "feedback_files",
            key: "feedback_files",
            render: (_, record) => {
                return record.feedback_files.length > 0 ? (
                    <Space size="middle">
                        {record.feedback_files?.map((file) => (
                            <Tag color="blue" key={file?._id}>
                                {file.originalname}
                            </Tag>
                        ))}
                    </Space>
                ) : null;
            },
        },
        {
            title: "Teacher",
            dataIndex: "report_by",
            key: "report_by",
            ...getColumnSearchProps("report_by"),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="dashed"
                        onClick={() =>
                            navigate(`test-report/edit/${record.id}`)
                        }
                    >
                        Edit
                    </Button>

                    <Button
                        onClick={() => {
                            showConfirm(record.id, record.student_id);
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

    const dashboard_columns = [
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            ...getColumnSearchProps("date"),
        },
        {
            title: "Subject",
            dataIndex: "subject",
            key: "subject",
            ...getColumnSearchProps("subject"),
        },
        {
            title: "Student",
            dataIndex: "student",
            key: "student",
            ...getColumnSearchProps("student"),
        },
        {
            title: "Feedback Files",
            dataIndex: "feedback_files",
            key: "feedback_files",
            render: (_, record) => {
                return record.feedback_files.length > 0 ? (
                    <Space size="middle">
                        {record.feedback_files?.map((file) => (
                            <Tag color="blue" key={file?._id}>
                                {file.originalname}
                            </Tag>
                        ))}
                    </Space>
                ) : null;
            },
        },
        {
            title: "Teacher",
            dataIndex: "report_by",
            key: "report_by",
            ...getColumnSearchProps("report_by"),
        },
    ];

    return (
        <Table
            loading={loading}
            columns={dashboard ? dashboard_columns : columns}
            dataSource={reports
                ?.map((report, i) => {
                    return {
                        key: report._id,
                        id: report._id,
                        subject: report.subject.subject_name,
                        student: report.student.student_name,
                        student_id: report.student._id,
                        date: dayjs(report.date).format("DD/MM/YYYY"),
                        comment: report.comment,
                        summary: report.summary,
                        feedback_files: report.feedback_files,
                        report_by: report.report_by.name,
                        teacher_id: report.report_by._id,
                    };
                })
                .reverse()}
            pagination={{
                pageSize: 7,
            }}
        />
    );
};

export default TestReports;
