import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Space,
  Tag,
  List,
  Button,
  Avatar,
  Table,
  Tooltip,
  Dropdown,
  Popconfirm,
  message as antMessage,
  Select,
  Radio
} from "antd";
const { Option } = Select;
import { ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from "recharts";
import {
  TeamOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  BookOutlined,
  DollarOutlined,
  CalendarOutlined,
  FireOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  RiseOutlined,
  EditOutlined,
  DeleteOutlined,
  PhoneOutlined,
  InfoCircleOutlined,
  PrinterOutlined,
  MoreOutlined,
  BellOutlined
} from "@ant-design/icons";
import MainLayout from "../layout/MainLayout";
import { mockStudents } from "../mockData";
import AddStudentDrawer from "../components/AddStudentDrawer";
import StudentInfoModal from "../components/StudentInfoModal";
import TuitionHistoryModal from "../components/TuitionHistoryModal";

const { Title, Text } = Typography;

const chartData = [
  { name: 'Th 1', student: 30, revenue: 40, teacher: 60 },
  { name: 'Th 2', student: 50, revenue: 30, teacher: 45 },
  { name: 'Th 3', student: 80, revenue: 85, teacher: 25 },
  { name: 'Th 4', student: 50, revenue: 50, teacher: 65 },
  { name: 'Th 5', student: 10, revenue: 85, teacher: 45 },
  { name: 'Th 6', student: 80, revenue: 40, teacher: 25 },
  { name: 'Th 7', student: 50, revenue: 95, teacher: 75 },
  { name: 'Th 8', student: 30, revenue: 65, teacher: 35 },
  { name: 'Th 9', student: 95, revenue: 45, teacher: 65 },
  { name: 'Th 10', student: 10, revenue: 45, teacher: 75 },
  { name: 'Th 11', student: 60, revenue: 20, teacher: 15 },
  { name: 'Th 12', student: 85, revenue: 12, teacher: 65 },
];

const recentActivities = [
  { title: "Trần Minh Khoa đăng ký lớp THCS cơ bản", time: "5 phút trước", icon: "🎓" },
  { title: "Cô Nguyễn Thu Hà cập nhật lịch dạy", time: "20 phút trước", icon: "📅" },
  { title: "Lớp THPT Nâng cao đã đủ học viên", time: "1 giờ trước", icon: "✅" },
  { title: "Học phí tháng 6 được xác nhận (12 học viên)", time: "2 giờ trước", icon: "💳" },
  { title: "Phụ huynh Lê Văn Thành gửi yêu cầu tư vấn", time: "3 giờ trước", icon: "💬" },
];

// UnpaidFeesTable has been moved to UnpaidFeesTable_draft_reserved.jsx

const DashboardPage = () => {
  const [isAddStudentVisible, setIsAddStudentVisible] = useState(false);
  return (
    <MainLayout selectedKey="dashboard" title="Dashboard">
      {/* Welcome banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #1677ff 0%, #0958d9 60%, #003eb3 100%)",
          borderRadius: 16,
          padding: "24px 32px",
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 8px 24px rgba(22,119,255,0.25)",
        }}
      >
        <div>
          <Title level={4} style={{ color: "#fff", margin: 0 }}>
            Chào buổi tối, Admin! 👋
          </Title>
          <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 14 }}>
            Hôm nay trung tâm có 3 lớp học và 2 học viên mới đăng ký.
          </Text>
        </div>
        <div style={{ textAlign: "right" }}>
          <Tag
            icon={<CalendarOutlined />}
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "#fff",
              fontSize: 13,
              padding: "4px 12px",
              borderRadius: 8,
            }}
          >
            Thứ Sáu, 20/06/2026
          </Tag>
        </div>
      </div>

      {/* ── OVERVIEW STATS ─────────────────────────────────── */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        {[
          {
            title: "Tổng học viên",
            value: "1,284",
            prefix: <TeamOutlined style={{ color: "#1677ff" }} />,
            accentColor: "#1677ff",
            bg: "#e6f4ff",
          },
          {
            title: "Giáo viên",
            value: "32",
            prefix: <UserOutlined style={{ color: "#52c41a" }} />,
            accentColor: "#52c41a",
            bg: "#f6ffed",
          },
          {
            title: "Tỉ lệ chuyên cần",
            value: "95%",
            prefix: <SafetyCertificateOutlined style={{ color: "#faad14" }} />,
            accentColor: "#faad14",
            bg: "#fffbe6",
          },
          {
            title: "Doanh thu tháng",
            value: "285tr",
            prefix: <DollarOutlined style={{ color: "#722ed1" }} />,
            accentColor: "#722ed1",
            bg: "#f9f0ff",
          },
        ].map((item, idx) => (
          <Col xs={24} sm={12} xl={6} key={idx}>
            <Card
              bordered={false}
              style={{
                borderRadius: 14,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                overflow: "hidden",
                position: "relative",
              }}
              bodyStyle={{ padding: "20px 24px" }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: item.accentColor }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <Text type="secondary" style={{ fontSize: 13 }}>{item.title}</Text>
                  <div style={{ fontSize: 32, fontWeight: 700, color: "#0f1c3f", lineHeight: 1.3, marginTop: 4 }}>
                    {item.value}
                  </div>
                  <Text type="secondary" style={{ fontSize: 12 }}>+5% so với tháng trước</Text>
                </div>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: item.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {React.cloneElement(item.prefix, { style: { fontSize: 22, color: item.accentColor } })}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ── OVERVIEW CHART ─────────────────────────────────── */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card
            title={<span style={{ fontWeight: 700, color: "#0f1c3f", fontSize: 18 }}>Tổng quan trung tâm</span>}
            extra={
              <Radio.Group defaultValue="month" size="middle" buttonStyle="solid">
                <Radio.Button value="week" style={{ borderRadius: "8px 0 0 8px" }}>Tuần</Radio.Button>
                <Radio.Button value="month">Tháng</Radio.Button>
                <Radio.Button value="year">Năm</Radio.Button>
                <Radio.Button value="all" style={{ borderRadius: "0 8px 8px 0" }}>Tất cả</Radio.Button>
              </Radio.Group>
            }
            bordered={false}
            style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
            bodyStyle={{ padding: "24px 24px 12px" }}
          >
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <ComposedChart
                  data={chartData}
                  margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
                >
                  <CartesianGrid stroke="#f0f0f0" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#8c8c8c', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#8c8c8c', fontSize: 12 }} 
                    dx={-10}
                  />
                  <RechartsTooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend 
                    iconType="circle" 
                    wrapperStyle={{ paddingTop: 20 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    name="Doanh thu" 
                    fill="#52c41a" 
                    stroke="#52c41a" 
                    fillOpacity={0.15} 
                  />
                  <Bar 
                    dataKey="student" 
                    name="Số lượng học viên" 
                    barSize={12} 
                    fill="#722ed1" 
                    radius={[4, 4, 0, 0]} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="teacher" 
                    name="Giáo viên hoạt động" 
                    stroke="#ff4d4f" 
                    strokeDasharray="5 5" 
                    strokeWidth={2}
                    dot={{ r: 0 }}
                    activeDot={{ r: 6 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* ── MIDDLE ROW ──────────────────────────────────────── */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={14}>
          <Card
            title={<Space><FireOutlined style={{ color: "#ff4d4f" }} /><span style={{ fontWeight: 700 }}>Hoạt động gần đây</span></Space>}
            extra={<Button type="primary" ghost size="small" style={{ borderRadius: 8 }}>Xem tất cả</Button>}
            bordered={false}
            style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", height: "100%" }}
          >
            <List
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item style={{ padding: "10px 0", border: "none" }}>
                  <Space align="start" style={{ width: "100%" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f5f7fa", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                      {item.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, display: "block" }}>{item.title}</Text>
                      <Text type="secondary" style={{ fontSize: 11 }}><ClockCircleOutlined style={{ marginRight: 4 }} />{item.time}</Text>
                    </div>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card
            title={<Space><RiseOutlined style={{ color: "#722ed1" }} /><span style={{ fontWeight: 700 }}>Thao tác nhanh</span></Space>}
            bordered={false}
            style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
          >
            <Row gutter={[12, 12]}>
              {[
                { label: "Thêm học viên", icon: <TeamOutlined />, color: "#1677ff", bg: "#e6f4ff" },
                { label: "Thêm giáo viên", icon: <UserOutlined />, color: "#52c41a", bg: "#f6ffed" },
                { label: "Tạo lớp mới", icon: <BookOutlined />, color: "#faad14", bg: "#fffbe6" },
                { label: "Xem lịch học", icon: <CalendarOutlined />, color: "#722ed1", bg: "#f9f0ff" },
                { label: "Báo cáo doanh thu", icon: <DollarOutlined />, color: "#ff4d4f", bg: "#fff1f0" },
                { label: "Cài đặt", icon: <SettingOutlined />, color: "#13c2c2", bg: "#e6fffb" },
              ].map((action, idx) => (
                <Col span={12} key={idx}>
                  <Button
                    block
                    style={{ height: 64, borderRadius: 10, border: `1.5px solid ${action.bg}`, background: action.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, transition: "all 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = action.color; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = action.bg; e.currentTarget.style.transform = "translateY(0)"; }}
                    onClick={() => {
                      if (action.label === "Thêm học viên") {
                        setIsAddStudentVisible(true);
                      } else {
                        antMessage.info(`Chức năng ${action.label} đang được phát triển!`);
                      }
                    }}
                  >
                    <span style={{ color: action.color, fontSize: 18 }}>{action.icon}</span>
                    <span style={{ color: action.color, fontSize: 11, fontWeight: 600 }}>{action.label}</span>
                  </Button>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      {/* UNPAID FEES TABLE SECTION REMOVED */}
      <AddStudentDrawer open={isAddStudentVisible} onClose={() => setIsAddStudentVisible(false)} />
    </MainLayout>
  );
};

export default DashboardPage;
