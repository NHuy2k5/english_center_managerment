import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Menu, Input, Badge, Avatar, Dropdown, Button, Typography, Tooltip, message as antMessage } from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  SettingOutlined,
  BellOutlined,
  SearchOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  IdcardOutlined,
  StarOutlined,
  DollarOutlined,
  BankOutlined,
} from "@ant-design/icons";

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

const menuItems = [
  { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
  { key: "student", icon: <TeamOutlined />, label: "Student" },
  { key: "payment", icon: <DollarOutlined />, label: "Payment" },
  { key: "teacher", icon: <UserOutlined />, label: "Teacher" },
  { key: "payroll", icon: <BankOutlined />, label: "Payroll" },
  { key: "class", icon: <BookOutlined />, label: "Class" }
];

const accountItems = [
  { key: "profile", icon: <UserOutlined />, label: "Thông tin tài khoản" },
  { key: "settings", icon: <SettingOutlined />, label: "Cài đặt" },
  { type: "divider" },
  { key: "logout", icon: <LogoutOutlined />, label: <Text type="danger">Đăng xuất</Text>, danger: true },
];

const MainLayout = ({ children, selectedKey, title = "Dashboard" }) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      {/* ── SIDEBAR ─────────────────────────────────────────────── */}
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={230}
        collapsedWidth={64}
        style={{
          background: "linear-gradient(180deg, #0f1c3f 0%, #162040 60%, #1a2952 100%)",
          boxShadow: "2px 0 12px rgba(0,0,0,0.15)",
          position: "fixed",
          height: "100vh",
          left: 0,
          top: 0,
          zIndex: 100,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: collapsed ? "20px 16px" : "20px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            marginBottom: 8,
            transition: "all 0.2s",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #1677ff, #4096ff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(22,119,255,0.4)",
            }}
          >
            <StarOutlined style={{ color: "#fff", fontSize: 18 }} />
          </div>
          {!collapsed && (
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 16, lineHeight: 1.2 }}>
                EngPro
              </div>
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11 }}>
                Admin Panel
              </div>
            </div>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => {
            // Because the keys match the route paths (except for some future ones maybe),
            // we can just navigate to /key. For specific ones, we can leave them.
            if (["dashboard", "student", "payment", "teacher", "payroll", "class"].includes(key)) {
              navigate(`/${key}`);
            } else {
              antMessage.info(`Tính năng ${key} đang được phát triển!`);
            }
          }}
          items={menuItems}
          style={{ background: "transparent", border: "none", padding: "4px 8px" }}
        />
        
        {!collapsed && (
          <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, textAlign: "center" }}>
            <Text style={{ color: "rgba(255,255,255,0.25)", fontSize: 11 }}>Version 1.0.0</Text>
          </div>
        )}
      </Sider>

      {/* ── MAIN LAYOUT ─────────────────────────────────────────── */}
      <Layout style={{ marginLeft: collapsed ? 64 : 230, transition: "margin-left 0.2s" }}>
        {/* ── HEADER ──────────────────────────────────────────────── */}
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            boxShadow: "0 1px 8px rgba(0,0,0,0.08)",
            position: "sticky",
            top: 0,
            zIndex: 99,
            height: 64,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined style={{ fontSize: 18 }} /> : <MenuFoldOutlined style={{ fontSize: 18 }} />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8 }}
          />
          <div style={{ flexShrink: 0 }}>
            <Text style={{ fontSize: 18, fontWeight: 700, color: "#0f1c3f" }}>{title}</Text>
          </div>
          
          <div style={{ flex: 1 }} />
          
          <Input
            placeholder="Tìm kiếm..."
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            allowClear
            style={{ width: 340, borderRadius: 8, background: "#f5f7fa", border: "1.5px solid #e8ecf0" }}
          />

          <Dropdown menu={{ items: accountItems }} trigger={["click"]} placement="bottomRight" arrow>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
                padding: "6px 10px",
                borderRadius: 10,
                border: "1.5px solid #e8ecf0",
              }}
            >
              <Avatar size={34} style={{ background: "linear-gradient(135deg, #1677ff, #4096ff)", fontWeight: 700 }}>A</Avatar>
              <div style={{ lineHeight: 1.3 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0f1c3f" }}>Admin</div>
                <div style={{ fontSize: 11, color: "#8c8c8c" }}>Quản trị viên</div>
              </div>
            </div>
          </Dropdown>
        </Header>

        {/* ── CONTENT ─────────────────────────────────────────────── */}
        <Content style={{ padding: "28px 28px 40px", minHeight: "calc(100vh - 64px)" }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
