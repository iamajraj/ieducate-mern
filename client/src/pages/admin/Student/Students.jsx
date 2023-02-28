import Container from "../../../components/Container";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table } from "antd";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import CustomButton from "../../../components/CustomButton";
import { useAxios } from "../../../hooks/useAxios";

const Students = () => {
    const [students, setStudents] = useState([]);
    const { loading, error, response } = useAxios({
        method: "get",
        url: "/students",
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
                    <div>
                        <h1 className="text-[24px]">Students</h1>
                        <p className="text-[13px]">
                            View all the students that you have added.
                        </p>
                    </div>
                    <CustomButton
                        text="Add Student"
                        className="py-4"
                        textClass="text-[15px]"
                    />
                </div>
                <div className="mt-10 border">
                    <StudentsTable data={students} />
                </div>
            </div>
        </Container>
    );
};

export default Students;

const StudentsTable = ({ data }) => {
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
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button type="dashed">Edit</Button>
                    <Button danger type="dashed">
                        Delete
                    </Button>
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
