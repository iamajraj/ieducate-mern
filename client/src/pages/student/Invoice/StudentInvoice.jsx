import React, { useContext, useEffect } from "react";
import Container from "../../../components/Container";
import { EyeFilled, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, Tag } from "antd";
import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import axiosInstance from "../../../services/axiosInstance";
import { authContext } from "../../../context/AuthProvider";

const StudentInvoice = () => {
    const { user } = useContext(authContext);
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);

    const getFees = async (id) => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(`/students/invoices/${id}`);
            const { invoices } = res.data;
            setFees(invoices ?? []);
        } catch (err) {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            getFees(user?.id);
        }
    }, [user]);

    return (
        <div className="px-[15px] md:px-[48px] md:py-[32px] h-full flex flex-col">
            <h1 className="text-[28px] font-medium hidden md:block">
                Invoices
            </h1>

            <div className="md:py-2 bg-white rounded-[10px] md:px-5 mt-6 w-full ">
                <FeesTable loading={loading} data={fees} />
            </div>
        </div>
    );
};

const FeesTable = ({ data, loading }) => {
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
            title: "Invoice",
            dataIndex: "invoice",
            key: "invoice",
            width: "30%",
            render: (_, record) => (
                <div className="flex items-center gap-2">
                    <img
                        src="/assets/payment.png"
                        alt=""
                        className="w-[30px]"
                    />
                    <p className="font-semibold">{record.invoice}</p>
                </div>
            ),
        },
        {
            title: "Due date",
            dataIndex: "due_date",
            key: "due_date",
            width: "30%",
            responsive: ["md"],
            sorter: (a, b) =>
                Date.parse(b.due_date_iso) - Date.parse(a.due_date_iso),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: "30%",
            render: (_, record) => {
                return record.status === "Paid" ? (
                    <p className="bg-[#EFF6E5] text-[#78B72B] font-medium rounded-md w-max px-2">
                        {record.status}
                    </p>
                ) : (
                    <p className="bg-[#FCE4EF] text-[#E5247D] font-medium rounded-md w-max px-2">
                        {record.status}
                    </p>
                );
            },
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <button
                    className="px-4 flex items-center gap-2 py-2 bg-main text-white rounded-lg text-[16px] cursor-pointer"
                    onClick={() => {
                        navigate(`${record.id}`);
                    }}
                >
                    <EyeFilled />
                    View
                </button>
            ),
        },
    ];

    return (
        <Table
            className="rounded-[10px]"
            loading={loading}
            columns={columns}
            dataSource={data
                .map((d) => {
                    return {
                        key: d._id,
                        id: d._id,
                        invoice:
                            dayjs(d.due_date).format("DD/MM/YYYY") + " Invoice",
                        due_date_iso: d.due_date,
                        due_date: dayjs(d.due_date).format("DD/MM/YYYY"),
                        status: d.isPaid === "Paid" ? "Paid" : "Pending",
                    };
                })
                .reverse()}
            pagination={{
                pageSize: 7,
            }}
        />
    );
};

export default StudentInvoice;
