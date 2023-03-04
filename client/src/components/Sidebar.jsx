import {
    PoundOutlined,
    MenuFoldOutlined,
    TeamOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    SolutionOutlined,
    CalendarOutlined,
    SettingOutlined,
    BookOutlined,
    AppstoreOutlined,
} from "@ant-design/icons";
import { Button, Menu } from "antd";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authContext } from "../context/AuthProvider";

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}

const adminItems = [
    getItem("Dashboard", "", <AppstoreOutlined />),
    getItem("Admin", "admin", <UserOutlined />, [
        getItem("All Admins", "admins"),
        getItem("Register Admin", "admins/register"),
    ]),
    getItem("Teacher", "teacher", <TeamOutlined />, [
        getItem("All Teachers", "teachers"),
        getItem("Register Teacher", "teachers/register"),
    ]),
    getItem("Student", "student", <TeamOutlined />, [
        getItem("All Students", "students"),
        getItem("Register Student", "students/register"),
    ]),
    getItem("Fees / Billing", "fees-billings", <PoundOutlined />),
    getItem("Teachers Attendance", "teachers-attendance", <CalendarOutlined />),
    getItem("Announcements", "announcements-menu", <SolutionOutlined />, [
        getItem("All Announcements", "announcements"),
        getItem("Add Announcement", "announcements/add"),
    ]),
];

const teacherItems = [
    getItem("Report", "", <BookOutlined />),
    getItem("Track Attendance", "track-attendance", <CalendarOutlined />),
    getItem("Credentials Update", "update", <SettingOutlined />),
];

const items = {
    admin: adminItems,
    teacher: teacherItems,
};

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { user } = useContext(authContext);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };
    const navigate = useNavigate();

    return (
        <div
            className={`${
                collapsed ? "w-[85px]" : "w-[250px]"
            } h-full transition-all border-r bg-main text-white`}
        >
            <div className="flex items-center justify-between py-7 px-5 ">
                {!collapsed && (
                    <div className="">
                        <h1 className="text-[24px] relative w-max">
                            iEducate
                            <p className="absolute -top-3 right-0 text-[14px] capitalize">
                                {user?.user_type}
                            </p>
                        </h1>
                    </div>
                )}
                <Button
                    type="ghost"
                    className="flex items-center justify-center text-white text-[20px]"
                    onClick={toggleCollapsed}
                >
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </Button>
            </div>
            {user && (
                <Menu
                    defaultSelectedKeys={[items[user.user_type][0].key]}
                    defaultOpenKeys={[items[user.user_type][0].key]}
                    mode="inline"
                    theme="light"
                    inlineCollapsed={collapsed}
                    items={items[user.user_type]}
                    className="bg-main text-white"
                    style={{ border: "none" }}
                    onSelect={(info) => {
                        navigate(`${info.key}`);
                    }}
                />
            )}
        </div>
    );
};

export default Sidebar;
