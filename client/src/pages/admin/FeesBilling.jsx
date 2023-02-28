import React from "react";
import Container from "../../components/Container";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, Tag } from "antd";
import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";

const FeesBilling = () => {
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
                    <FeesTable />
                </div>
            </div>
        </Container>
    );
};

export default FeesBilling;

const data = Array(50)
    .fill(0)
    .map((v, i) => {
        return {
            key: i,
            name: "Akmal Raj",
            subject: ["Math", "English"],
            payment_reminder_date: `2022-10-4`,
            payment_due_date: `2022-10-14`,
        };
    });

const FeesTable = () => {
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
            title: "Subject",
            dataIndex: "subject",
            key: "subject",
            width: "20%",
            render: (_, { subject }) =>
                subject.map((sub) => {
                    return (
                        <Tag color={"geekblue"} key={sub}>
                            {sub.toUpperCase()}
                        </Tag>
                    );
                }),
        },
        {
            title: "Payment Reminder Date",
            dataIndex: "payment_reminder_date",
            key: "payment_reminder_date",
            ...getColumnSearchProps("payment_reminder_date"),
        },
        {
            title: "Payment Due Date",
            dataIndex: "payment_due_date",
            key: "payment_due_date",
            ...getColumnSearchProps("payment_due_date"),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button type="dashed">View</Button>
                </Space>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={data}
            pagination={{
                pageSize: 7,
            }}
        />
    );
};
