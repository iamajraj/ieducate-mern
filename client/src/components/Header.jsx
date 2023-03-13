import { Avatar, Dropdown, Space } from "antd";
import { DownOutlined, LogoutOutlined } from "@ant-design/icons";
import React, { useContext } from "react";
import { authContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const { user, setUser } = useContext(authContext);

    const navigate = useNavigate();

    const logout = (user_type) => {
        setUser(null);
        localStorage.clear();
        navigate(`/${user_type}`);
    };

    return (
        <div className="min-h-[70px] px-10 flex items-center justify-between shadow-md shadow-gray-200 z-50 w-full">
            {user?.user_type !== "student" ? (
                <h1 className="capitalize text-[15px]">
                    Welcome {user?.user_type === "admin" ? "Admin" : user?.name}{" "}
                    !
                </h1>
            ) : (
                <div></div>
            )}
            <div className="flex gap-4 group items-center cursor-pointer relative">
                <div className="">
                    <p className="text-[12px] text-end">{user?.name}</p>
                    <p className="text-[12px]">{user?.email}</p>
                </div>
                <DownOutlined className="text-[16px]" />
                <div className="absolute top-10 border right-0 scale-0 group-hover:scale-100 bg-white rounded-lg py-1 shadow-md transition-all origin-top-right">
                    <div
                        onClick={() => {
                            logout(user?.user_type);
                        }}
                        className="flex items-center gap-2 hover:bg-gray-100 px-3 py-1"
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

export default Header;
