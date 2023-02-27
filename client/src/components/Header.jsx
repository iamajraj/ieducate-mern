import { Avatar, Dropdown, Space } from "antd";
import { DownOutlined, LogoutOutlined } from "@ant-design/icons";
import React from "react";

const Header = () => {
    const items = [
        {
            label: "Logout",
            key: "1",
            icon: <LogoutOutlined />,
        },
    ];
    return (
        <div className="min-h-[70px] px-10 flex items-center justify-between c-shadow shadow-gray-200 z-50 w-full">
            <h1 className="capitalize text-[15px]">Welcome Admin !</h1>
            <div className="flex gap-4 items-center cursor-pointer relative">
                <div className="">
                    <p className="text-[14px] text-end">Akmal Raj</p>
                    <p className="text-[13px]">akmalraj07@gmail.com</p>
                </div>
                <div className="flex items-center gap-2">
                    <Avatar
                        size={45}
                        src="https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=812"
                    />
                    <Dropdown menu={{ items }}>
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
