import {
    AppstoreOutlined,
    MenuFoldOutlined,
    MailOutlined,
    MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Button, Menu } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}
const items = [
    getItem("Admin", "admin", <MailOutlined />, [
        getItem("All Admins", "admins"),
        getItem("Register Admin", "admins/register"),
    ]),
    getItem("Teacher", "teacher", <AppstoreOutlined />, [
        getItem("All Teachers", "teachers"),
        getItem("Register Teacher", "teachers/register"),
    ]),
    getItem("Student", "student", <AppstoreOutlined />, [
        getItem("All Students", "students"),
        getItem("Register Student", "students/register"),
    ]),
    getItem("Fees / Billing", "fees-billings", <AppstoreOutlined />),
    getItem("Teachers Attendance", "teachers-attendance", <AppstoreOutlined />),
    getItem("Announcements", "announcements", <AppstoreOutlined />),
];

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };
    const navigate = useNavigate();
    return (
        <div
            className={`${
                collapsed ? "w-[85px]" : "w-[250px]"
            } h-full transition-all c-shadow`}
        >
            <div className="flex items-center justify-between py-7 px-5">
                {!collapsed && (
                    <div className="">
                        <h1 className="text-[24px] relative w-max">
                            iEducate
                            <p className="absolute -top-3 right-0 text-[14px]">
                                Admin
                            </p>
                        </h1>
                    </div>
                )}
                <Button
                    type="ghost"
                    className="flex items-center justify-center"
                    onClick={toggleCollapsed}
                >
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </Button>
            </div>
            <Menu
                defaultSelectedKeys={["1"]}
                defaultOpenKeys={["sub1"]}
                mode="inline"
                theme="light"
                inlineCollapsed={collapsed}
                items={items}
                style={{ border: "none" }}
                onSelect={(info) => {
                    console.log(info);
                    navigate(`${info.key}`);
                }}
            />
        </div>
    );
};
export default Sidebar;
