import {
  PoundOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SolutionOutlined,
  SettingOutlined,
  HomeOutlined,
  GroupOutlined,
  FileOutlined,
} from '@ant-design/icons';
import { Button, Menu } from 'antd';
import { useContext, useEffect, useState } from 'react';
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

const studentItems = [
  getItem('Dashboard', '', <HomeOutlined />),
  getItem('Announcements', 'announcements', <SolutionOutlined />),
  getItem('Class Activity', 'class-activity', <GroupOutlined />),
  getItem('Term Reports', 'term-reports', <FileOutlined />),
  getItem('Invoices', 'invoices', <PoundOutlined />),
  getItem('Profile Setting', 'setting', <SettingOutlined />),
];

const MenuItems = {
  '': 'Dashboard',
  announcements: 'Announcements',
  'class-activity': 'Class Activity',
  'term-reports': 'Term Reports',
  invoices: 'Invoices',
  setting: 'Change Password',
};

const StudentSidebar = ({
  className,
  collapsed,
  setCollapsed,
  mobile,
  setCurrentMenu = () => {},
}) => {
  const { user } = useContext(authContext);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const navigate = useNavigate();

  return (
    <div
      className={`${
        collapsed
          ? `${mobile ? 'left-[-100%]' : 'w-[85px]'}`
          : `${mobile ? 'left-0' : 'w-[250px]'}`
      } h-full transition-all border-r bg-main text-white ${className}`}
    >
      <div className="flex items-center justify-between py-7 px-5 ">
        {!collapsed && (
          <div className="flex items-end">
            <img
              src="/assets/header_logo.png"
              alt=""
              className="h-[70px] object-contain"
            />
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
          defaultSelectedKeys={[studentItems.key]}
          defaultOpenKeys={[studentItems.key]}
          mode="inline"
          theme="light"
          inlineCollapsed={collapsed}
          items={studentItems}
          className="bg-main text-white"
          style={{ border: 'none' }}
          onClick={(info) => {
            setCurrentMenu(MenuItems[info.key]);
            setCollapsed((prev) => (mobile ? true : prev));
            navigate(`${info.key}`);
          }}
        />
      )}
    </div>
  );
};

export default StudentSidebar;
