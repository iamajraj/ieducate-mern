import { Avatar, Dropdown, Space } from "antd";
import { DownOutlined, LogoutOutlined } from "@ant-design/icons";
import React, { useContext } from "react";
import { authContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const { user, setUser } = useContext(authContext);

    const navigate = useNavigate();

    const logout = () => {
        setUser(null);
        localStorage.clear();
        navigate("/admin");
    };

    return (
        <div className="min-h-[70px] px-10 flex items-center justify-between shadow-md shadow-gray-200 z-50 w-full">
            <h1 className="capitalize text-[15px]">Welcome Admin !</h1>
            <div className="flex gap-4 items-center cursor-pointer relative">
                <div className="">
                    <p className="text-[14px] text-end">{user?.name}</p>
                    <p className="text-[13px]">{user?.email}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Dropdown
                        menu={{
                            items: [
                                {
                                    label: "Logout",
                                    key: "1",
                                    icon: <LogoutOutlined />,
                                    onClick: logout,
                                },
                            ],
                        }}
                    >
                        <Space>
                            <DownOutlined />
                        </Space>
                    </Dropdown>
                </div>
            </div>
        </div>
    );
};

export default Header;
