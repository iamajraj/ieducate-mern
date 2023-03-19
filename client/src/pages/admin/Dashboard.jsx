import React, { useContext, useEffect, useRef, useState } from "react";
import Container from "../../components/Container";
import { SearchOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { useAxios } from "../../hooks/useAxios";
import Highlighter from "react-highlight-words";
import { Button, Input, Space, Table } from "antd";
import { authContext } from "../../context/AuthProvider";

const Dashboard = () => {
    const [data, setData] = useState(null);
    const { loading, error, response } = useAxios({
        url: "/get-all",
        method: "get",
    });

    useEffect(() => {
        if (response) {
            setData(response);
        }
    }, [error, response, loading]);

    return (
        <Container>
            <div className="bg-white p-8 rounded-lg flex flex-col">
                <div>
                    <h1 className="text-[22px] text-gray-800 font-semibold">
                        Welcome Admin!
                    </h1>
                    <p className="text-[14px]">Dashboard</p>
                </div>

                <div className="flex flex-wrap gap-4 mt-7">
                    <div className="min-w-[150px] max-w-[300px] min-h-[220px] w-full border rounded-lg shadow-md p-5 flex flex-col justify-between gap-10">
                        <div className="flex items-center justify-between">
                            <div className="w-[50px] h-[50px] flex items-center justify-center border-[2px] border-main text-[22px] text-main rounded-full">
                                <UserOutlined />
                            </div>
                            <p className="font-semibold text-[22px]">
                                {data?.admins?.length ?? 0}
                            </p>
                        </div>
                        <div>
                            <div className="w-full h-2 bg-main rounded-lg"></div>
                            <p className="pt-3">Admins</p>
                        </div>
                    </div>
                    <div className="min-w-[150px] max-w-[300px] min-h-[220px] w-full border rounded-lg shadow-md p-5 flex flex-col justify-between gap-10">
                        <div className="flex items-center justify-between">
                            <div className="w-[50px] h-[50px] flex items-center justify-center border-[2px] border-main text-[22px] text-main rounded-full">
                                <TeamOutlined />
                            </div>
                            <p className="font-semibold text-[22px]">
                                {data?.teachers?.length ?? 0}
                            </p>
                        </div>
                        <div>
                            <div className="w-full h-2 bg-main rounded-lg"></div>
                            <p className="pt-3">Teachers</p>
                        </div>
                    </div>
                    <div className="min-w-[150px] max-w-[300px] min-h-[220px] w-full border rounded-lg shadow-md p-5 flex flex-col justify-between gap-10">
                        <div className="flex items-center justify-between">
                            <div className="w-[50px] h-[50px] flex items-center justify-center border-[2px] border-main text-[22px] text-main rounded-full">
                                <TeamOutlined />
                            </div>
                            <p className="font-semibold text-[22px]">
                                {data?.students?.length ?? 0}
                            </p>
                        </div>
                        <div>
                            <div className="w-full h-2 bg-main rounded-lg"></div>
                            <p className="pt-3">Students</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-start gap-10 mt-7">
                    <div className="flex flex-col gap-4 w-full">
                        <h1 className="text-[18px]">Admins</h1>
                        <AdminTable loading={loading} data={data?.admins} />
                    </div>
                    <div className="flex flex-col gap-4 w-full">
                        <h1 className="text-[18px]">Teachers</h1>
                        <TeachersTable
                            loading={loading}
                            data={data?.teachers}
                        />
                    </div>
                </div>
                <div className="mt-3 flex flex-col gap-4 w-full">
                    <h1 className="text-[18px]">Students</h1>
                    <StudentsTable loading={loading} data={data?.students} />
                </div>
            </div>
        </Container>
    );
};

export default Dashboard;

const AdminTable = ({ loading, data, className }) => {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);

    const { user } = useContext(authContext);

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
    ];

    return (
        <Table
            bordered
            loading={loading}
            columns={columns}
            dataSource={data?.map((user, i) => {
                return {
                    ...user,
                    key: user._id,
                };
            })}
            pagination={{
                pageSize: 4,
            }}
            className={className}
        />
    );
};

const TeachersTable = ({ data, loading }) => {
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
    ];

    return (
        <Table
            bordered
            loading={loading}
            columns={columns}
            dataSource={data?.map((d) => ({
                ...d,
                key: d._id,
            }))}
            pagination={{
                pageSize: 4,
            }}
        />
    );
};

const StudentsTable = ({ data, loading }) => {
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
            title: "Roll No",
            dataIndex: "student_roll_no",
            key: "student_roll_no",
            width: "20%",
            ...getColumnSearchProps("student_roll_no"),
        },
        {
            title: "Student Name",
            dataIndex: "student_name",
            key: "student_name",
            width: "30%",
            ...getColumnSearchProps("student_name"),
        },
        {
            title: "Email Address",
            dataIndex: "email",
            key: "email",
            ...getColumnSearchProps("email"),
        },
        {
            title: "Student Telephone",
            dataIndex: "student_telephone",
            key: "student_telephone",
            ...getColumnSearchProps("student_telephone"),
        },
    ];

    return (
        <Table
            bordered
            loading={loading}
            columns={columns}
            dataSource={data}
            pagination={{
                pageSize: 4,
            }}
        />
    );
};
