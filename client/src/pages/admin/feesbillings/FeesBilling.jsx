import React, { useEffect } from "react";
import Container from "../../../components/Container";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, Tag } from "antd";
import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useAxios } from "../../../hooks/useAxios";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const FeesBilling = () => {
    const [fees, setFees] = useState([]);
    const { loading, error, response } = useAxios({
        method: "get",
        url: "/fees",
    });
    useEffect(() => {
        if (response) {
            setFees(response.fees);
        }
    }, [response, error, loading]);

    return (
        <Container>
            <div className="bg-white p-8 rounded-lg">
                <div className="border-b pb-5">
                    <h1 className="text-[24px]">Fees / Billing</h1>
                    <p className="text-[13px]">
                        View all the fees and billing.
                    </p>
                </div>
                <div className="mt-7">
                    <FeesTable data={fees} />
                </div>
            </div>
        </Container>
    );
};

export default FeesBilling;

const FeesTable = ({ data }) => {
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
            title: "Name",
            dataIndex: "name",
            key: "name",
            width: "30%",
            ...getColumnSearchProps("name"),
        },
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
            ...getColumnSearchProps("payment_reminder"),
        },
        {
            title: "Due Date",
            dataIndex: "due_date",
            key: "due_date",
            ...getColumnSearchProps("due_date"),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space
                    onClick={() => {
                        navigate(`${record.id}`);
                    }}
                    size="middle"
                >
                    <Button type="dashed">View</Button>
                </Space>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={data.map((d) => {
                return {
                    key: d._id,
                    id: d._id,
                    name: d.student.student_name,
                    subjects: d.subjects.map((s) => s.subject_name).join(", "),
                    payment_reminder: dayjs(d.payment_reminder).format(
                        "DD/MM/YYYY"
                    ),
                    due_date: dayjs(d.due_date).format("DD/MM/YYYY"),
                };
            })}
            pagination={{
                pageSize: 7,
            }}
        />
    );
};
