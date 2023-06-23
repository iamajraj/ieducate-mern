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
  HomeOutlined,
  GroupOutlined,
  FileOutlined,
} from '@ant-design/icons';
import { Button, Menu } from 'antd';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authContext } from '../context/AuthProvider';

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
  getItem('Dashboard', '', <AppstoreOutlined />),
  getItem('Admin Management', 'admins', <UserOutlined />),
  getItem('Teacher Management', 'teachers', <TeamOutlined />),
  getItem('Student Management', 'students', <TeamOutlined />),
  getItem('Fees / Billing', 'fees-billings', <PoundOutlined />),
  getItem('Teachers Attendance', 'teachers-attendance', <CalendarOutlined />),
  getItem('Announcements', 'announcements', <SolutionOutlined />),
];

const teacherItems = [
  getItem('Dashboard', '', <AppstoreOutlined />),
  getItem('Report', 'reports', <BookOutlined />),
  getItem('Track Attendance', 'track-attendance', <CalendarOutlined />),
  getItem('Credentials Update', 'update', <SettingOutlined />),
];

const studentItems = [
  getItem('Dashboard', '', <HomeOutlined />),
  getItem('Announcements', 'announcements', <SolutionOutlined />),
  getItem('Class Activity', 'class-activity', <GroupOutlined />),
  getItem('Terms Report', 'terms-report', <FileOutlined />),
  getItem('Invoices', 'invoices', <PoundOutlined />),
  getItem('Profile Setting', 'setting', <SettingOutlined />),
];

const items = {
  admin: adminItems,
  teacher: teacherItems,
  student: studentItems,
};

const Sidebar = ({ className, collapsed, setCollapsed }) => {
  const { user } = useContext(authContext);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const navigate = useNavigate();

  return (
    <div
      className={`${
        collapsed ? 'w-[85px]' : 'w-[250px]'
      } h-full transition-all border-r bg-main text-white ${className}`}
    >
      <div className="flex items-center justify-between py-7 px-5 ">
        {!collapsed && (
          <div className="flex items-end">
            {/* <h1 className="text-[24px] relative w-max">
                            iEducate
                            <p className="absolute -top-3 right-0 text-[14px] capitalize">
                                {user?.user_type}
                            </p>
                        </h1> */}
            <img
              src="/assets/header_logo.png"
              alt=""
              className="h-[70px] object-contain"
            />
            {/* <h1 className="text-[24px]">Educate</h1> */}
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
          style={{ border: 'none' }}
          onClick={(info) => {
            navigate(`${info.key}`);
          }}
        />
      )}
    </div>
  );
};

export default Sidebar;
