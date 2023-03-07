import React, { useEffect } from "react";
import Container from "../../../components/Container";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, Tag } from "antd";
import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import MainButton from "../../../components/MainButton";
import axiosInstance from "../../../services/axiosInstance";
import EditDueDate from "./EditDueDate";

const AllFees = () => {
    const [fees, setFees] = useState([]);
    const [editDue, setEditDue] = useState(null);
    const [loading, setLoading] = useState(false);
    const { student_id } = useParams();

    const navigate = useNavigate();

    const fetchFees = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/active-fees`);
            setFees(res.data.fees);
        } catch (err) {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFees();
    }, []);

    // const exportToCSV = async () => {
    //     try {
    //         const res = await axiosInstance.get(
    //             `/fees/export-to-csv/${student_id}`
    //         );
    //         const a = document.createElement("a");
    //         a.download = "fees.csv";
    //         a.href = "data:text/csv;charset=utf-8," + res.data.exported;
    //         a.click();
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };

    return (
        <Container>
            <div className="bg-white p-8 rounded-lg">
                <div className="border-b pb-5">
                    <div className="flex items-end gap-5">
                        <div>
                            <h1 className="text-[24px]">Fees / Billing</h1>
                            <p className="text-[13px]">
                                View all the active fees and billings.
                            </p>
                        </div>
                        {/* <MainButton
                            onClick={exportToCSV}
                            text="Export to CSV"
                        /> */}
                        <MainButton
                            onClick={() => {
                                navigate("students");
                            }}
                            text="Students"
                        />
                    </div>
                </div>
                <div className="mt-7">
                    <FeesTable
                        data={fees}
                        loading={loading}
                        onEditDue={setEditDue}
                    />
                </div>
            </div>
            <EditDueDate
                open={editDue}
                setOpen={setEditDue}
                editData={editDue}
                fetchFees={fetchFees}
            />
        </Container>
    );
};

export default AllFees;

const FeesTable = ({ data, loading, onEditDue }) => {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);

    const navigate = useNavigate();

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
            title: "Subjects",
            dataIndex: "subjects",
            key: "subjects",
            width: "20%",
            render: (_, record) => (
                <Tag color={"geekblue"} key={record.subjects}>
                    {record.subjects}
                </Tag>
            ),
            ...getColumnSearchProps("subjects"),
        },
        {
            title: "Payment Reminder Date",
            dataIndex: "payment_reminder",
            key: "payment_reminder",
            sorter: (a, b) =>
                Date.parse(b.payment_reminder_iso) -
                Date.parse(a.payment_reminder_iso),
        },
        {
            title: "Due Date",
            dataIndex: "due_date",
            key: "due_date",
            defaultSortOrder: "ascend",
            sorter: (a, b) =>
                Date.parse(b.due_date_iso) - Date.parse(a.due_date_iso),
        },
        {
            title: "Is Paid",
            dataIndex: "is_paid",
            key: "is_paid",
            filters: [
                {
                    text: "Paid",
                    value: "Paid",
                },
                {
                    text: "Not Paid",
                    value: "Not Paid",
                },
            ],
            filterMultiple: false,
            onFilter: (value, record) => record.is_paid === value,
        },
        {
            title: "Active",
            dataIndex: "active",
            key: "active",
            render: (_, record) =>
                record.active === "Active" ? (
                    <Space size="middle">
                        <Tag className="bg-green-500 text-white">
                            {record.active}
                        </Tag>
                    </Space>
                ) : null,
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="dashed"
                        onClick={() => {
                            onEditDue(record);
                        }}
                    >
                        Edit Due date
                    </Button>
                    <Button
                        type="dashed"
                        onClick={() => {
                            navigate(
                                `students/${record.student_id}/view/${record.id}`
                            );
                        }}
                    >
                        View
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
                .map((d) => {
                    return {
                        key: d._id,
                        id: d._id,
                        name: d.student.student_name,
                        subjects: d.subjects
                            .map((s) => s.subject_name)
                            .join(", "),
                        payment_reminder: dayjs(d.payment_reminder).format(
                            "DD/MM/YYYY"
                        ),
                        student_id: d.student._id,
                        payment_reminder_iso: d.payment_reminder,
                        due_date: dayjs(d.due_date).format("DD/MM/YYYY"),
                        due_date_iso: d.due_date,
                        active: d.isActive ? "Active" : "Not Active",
                        is_paid: d.isPaid,
                    };
                })
                .reverse()}
            pagination={{
                pageSize: 7,
            }}
        />
    );
};
