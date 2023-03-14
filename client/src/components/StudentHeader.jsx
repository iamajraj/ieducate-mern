import { Avatar, Dropdown, Space } from "antd";
import {
    DownOutlined,
    LogoutOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
} from "@ant-design/icons";
import React, { useContext } from "react";
import { authContext } from "../context/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";

const StudentHeader = ({ setCollapsed, title }) => {
    const { user, setUser } = useContext(authContext);

    const navigate = useNavigate();

    const path = useLocation().pathname.split("-").join(" ");

    const logout = (user_type) => {
        setUser(null);
        localStorage.clear();
        navigate(`/${user_type}`);
    };

    return (
        <div className="min-h-[70px] px-[15px] md:px-10 flex items-center justify-between md:shadow-md md:shadow-gray-200 relative z-50 w-full bg-[#F3F3F9] md:bg-white">
            {user?.user_type !== "student" ? (
                <h1 className="capitalize text-[15px]">
                    Welcome {user?.user_type === "admin" ? "Admin" : user?.name}{" "}
                    !
                </h1>
            ) : (
                <>
                    <div
                        className="md:hidden"
                        onClick={() => setCollapsed(false)}
                    >
                        <MenuUnfoldOutlined className="text-[24px] text-main" />
                    </div>
                    <div className="font-medium">{title}</div>
                </>
            )}

            <div className="flex gap-4 group items-center cursor-pointer relative">
                <div className="gap-4 group items-center cursor-pointer relative hidden md:flex">
                    <div className="">
                        <p className="text-[12px] text-end">{user?.name}</p>
                        <p className="text-[12px]">{user?.email}</p>
                    </div>
                    <DownOutlined className="text-[16px]" />
                </div>
                <div className="md:hidden border border-main rounded-full px-3 py-3 flex items-center justify-center">
                    <UserOutlined className="text-main" />
                </div>
                <div className="absolute top-10 border right-0 scale-0 group-hover:scale-100 bg-[#E3F6FF] md:bg-white rounded-lg py-1 shadow-md transition-all origin-top-right">
                    <div className="flex items-center gap-2 hover:bg-gray-100 px-3 py-1 border-b pb-2 mb-2 text-[#199FDA] md:text-black">
                        <UserOutlined className="text-[13px]" />
                        <p className="text-[13px]">{user?.name}</p>
                    </div>
                    <div
                        onClick={() => {
                            logout(user?.user_type);
                        }}
                        className="flex items-center gap-2 hover:bg-gray-100 px-3 py-1 text-[#199FDA] md:text-black"
                    >
                        <LogoutOutlined className="text-[13px]" />
                        <p className="text-[13px]">Logout</p>
                    </div>
                </div>
                {/* <div className="flex items-center gap-2">
                    <Dropdown
                        menu={{
                            items: [
                                {
                                    label: "Logout",
                                    key: "1",
                                    icon: <LogoutOutlined />,
                                    onClick: () => {
                                        logout(user?.user_type);
                                    },
                                },
                            ],
                        }}
                    >
                        <Space>
                            <DownOutlined className="text-[16px]" />
                        </Space>
                    </Dropdown>
                </div> */}
            </div>
        </div>
    );
};

export default StudentHeader;
