import Container from "../../../components/Container";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table } from "antd";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { Link } from "react-router-dom";
import { useAxios } from "../../../hooks/useAxios";
import MainButton from "../../../components/MainButton";

const Announcements = () => {
    const { loading, error, response } = useAxios({
        url: "/announcements",
        method: "get",
    });
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        if (response) {
            setAnnouncements(response.announcements);
        }
    }, [response]);

    return (
        <Container>
            <div className="bg-white p-8 rounded-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-[24px]">Announcements</h1>
                        <p className="text-[13px]">
                            View all the announcements.
                        </p>
                    </div>
                    <Link to="/admin/dashboard/announcements/add">
                        <MainButton
                            text="Add Announcement"
                            className="py-4"
                            textClass="text-[15px]"
                        />
                    </Link>
                </div>
                <div className="mt-10 border">
                    <AnnouncementsTable
                        loading={loading}
                        data={announcements}
                    />
                </div>
            </div>
        </Container>
    );
};

export default Announcements;

const AnnouncementsTable = ({ data, loading }) => {
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
            title: "Title",
            dataIndex: "title",
            key: "title",
            width: "30%",
            ...getColumnSearchProps("title"),
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: "20%",
            ...getColumnSearchProps("description"),
        },
        {
            title: "Created By",
            dataIndex: "created_by",
            key: "created_by",
            ...getColumnSearchProps("created_by"),
        },
        // {
        //     title: "Action",
        //     key: "action",
        //     render: (_, record) => (
        //         <Space size="middle">
        //             <Button type="dashed">Edit</Button>
        //             <Button danger type="dashed">
        //                 Delete
        //             </Button>
        //         </Space>
        //     ),
        // },
    ];

    return (
        <Table
            loading={loading}
            columns={columns}
            dataSource={data.map((d) => {
                return {
                    ...d,
                    key: d?._id,
                    created_by: d.created_by?.name ?? "Deleted Admin",
                };
            })}
            pagination={{
                pageSize: 7,
            }}
        />
    );
};
