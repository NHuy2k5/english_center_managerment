import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Avatar,
  Typography,
  Space,
  Tag,
  Table,
  Tooltip,
  Select,
  Input,
  Button,
  Dropdown,
  Popconfirm,
  message as antMessage
} from "antd";
import {
  TeamOutlined,
  PlusOutlined,
  UserOutlined,
  SearchOutlined,
  EditOutlined,
  InboxOutlined,
  WarningFilled,
  PhoneOutlined,
  MailOutlined,
  InfoCircleOutlined,
  DollarOutlined
} from "@ant-design/icons";
import MainLayout from "../layout/MainLayout";
import TeacherInfoModal from "../components/TeacherInfoModal";
import AddTeacherDrawer from "../components/AddTeacherDrawer";

const { Title, Text } = Typography;

const mockTeachers = [
  { 
    key: "1", id: "GV001", name: "Nguyễn Văn A", phone: "0901234567", email: "nguyenvana@gmail.com", salaryPending: false,
    username: "a123", password: "AB123", dob: "12/04/1990",
    classes: [
      { category: "THCS", names: ["7A", "8A"] },
      { category: "IELTS", names: ["5.5-6.5"] }
    ]
  },
  { 
    key: "2", id: "GV002", name: "Trần Thị B", phone: "0902345678", email: "tranthib@gmail.com", salaryPending: true,
    username: "b456", password: "CD456", dob: "25/08/1992",
    classes: [
      { category: "Tiểu học", names: ["5A1", "4B"] }
    ]
  },
  { 
    key: "3", id: "GV003", name: "Lê Minh C", phone: "0903456789", email: "leminhc@gmail.com", salaryPending: false,
    username: "c789", password: "EF789", dob: "05/11/1988",
    classes: [
      { category: "THPT", names: ["10A", "11B", "12C"] },
      { category: "IELTS", names: ["6.5+"] }
    ]
  },
  { 
    key: "4", id: "GV004", name: "Phạm Thu D", phone: "0904567890", email: "phamthud@gmail.com", salaryPending: false,
    username: "d101", password: "GH101", dob: "18/02/1995",
    classes: [
      { category: "IELTS", names: ["Pre IELTS", "4.5-5.5"] }
    ]
  },
  { 
    key: "5", id: "GV005", name: "Hoàng Đức E", phone: "0905678901", email: "hoangduce@gmail.com", salaryPending: false,
    username: "e202", password: "IK202", dob: "30/09/1991",
    classes: [
      { category: "THCS", names: ["9A", "9B"] }
    ]
  },
];

const TeacherPage = () => {
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedEditTeacher, setSelectedEditTeacher] = useState(null);
  const columns = [
    {
      title: "Giáo viên",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          <Avatar
            size={34}
            style={{
              background: "linear-gradient(135deg, #52c41a, #73d13d)",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            {record.name.split(" ").pop()[0]}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600, color: "#0f1c3f", fontSize: 13 }}>
              {text}
            </div>
            <div style={{ color: "#52c41a", fontWeight: 500, fontSize: 12 }}>{record.id}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "Liên lạc",
      key: "contact",
      render: (_, record) => (
        <div style={{ fontSize: 13 }}>
          <div style={{ color: "#595959", marginBottom: 2 }}>
            <PhoneOutlined style={{ marginRight: 6, color: "#52c41a" }} />
            {record.phone}
          </div>
          <div style={{ color: "#8c8c8c" }}>
            <MailOutlined style={{ marginRight: 6 }} />
            {record.email}
          </div>
        </div>
      ),
    },
    {
      title: "Các lớp đang dạy",
      key: "classes",
      render: (_, record) => (
        <div style={{ fontSize: 13, color: "#595959" }}>
          {record.classes && record.classes.map((cls, idx) => (
            <div key={idx} style={{ marginBottom: 4 }}>
              <span style={{ fontWeight: 600, color: "#0f1c3f" }}>{cls.category}: </span>
              <span>{cls.names.join(", ")}</span>
            </div>
          ))}
          {(!record.classes || record.classes.length === 0) && <span style={{ color: "#bfbfbf", fontStyle: "italic" }}>Chưa phân lớp</span>}
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      render: (_, record) => {
        return (
          <Space size={2}>
            <Tooltip title="Xem thông tin">
              <Button type="text" icon={<InfoCircleOutlined />} shape="circle" style={{ color: "#1677ff" }}
                onClick={() => { setSelectedTeacher(record); setInfoModalVisible(true); }} />
            </Tooltip>
            <Tooltip title="Chỉnh sửa (Bao gồm quản lý lớp)">
              <Button type="text" icon={<EditOutlined />} shape="circle" style={{ color: "#faad14" }}
                onClick={() => {
                  setSelectedEditTeacher(record);
                  setAddModalVisible(true);
                }} />
            </Tooltip>
            <Tooltip title="Lưu trữ">
              <Button type="text" icon={<InboxOutlined />} shape="circle" style={{ color: "#722ed1" }}
                onClick={() => antMessage.info(`Lưu trữ: ${record.name}`)} />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <MainLayout selectedKey="teacher" title="Quản lý Giáo viên">
      {/* ── MINI STATS ──────────────────────────────────────── */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Avatar size={54} style={{ background: "#f6ffed", color: "#52c41a" }} icon={<TeamOutlined />} />
              <div>
                <Text type="secondary" style={{ fontSize: 13 }}>Tổng số giáo viên</Text>
                <Title level={3} style={{ margin: 0, color: "#0f1c3f" }}>45</Title>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Avatar size={54} style={{ background: "#fffbe6", color: "#faad14" }} icon={<PlusOutlined />} />
              <div>
                <Text type="secondary" style={{ fontSize: 13 }}>Giáo viên mới (tháng này)</Text>
                <Title level={3} style={{ margin: 0, color: "#0f1c3f" }}>+2</Title>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Avatar size={54} style={{ background: "#f9f0ff", color: "#722ed1" }} icon={<UserOutlined />} />
              <div>
                <Text type="secondary" style={{ fontSize: 13 }}>Đang tạm nghỉ</Text>
                <Title level={3} style={{ margin: 0, color: "#0f1c3f" }}>3</Title>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* ── TOOLBAR & TABLE ─────────────────────────────────── */}
      <Card bordered={false} style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 16 }}>
          <Space size="middle" wrap>
            <Input
              placeholder="Tìm theo tên, SĐT, Mã GV..."
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              style={{ width: 280, borderRadius: 8 }}
              allowClear
            />
          </Space>
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              size="small"
              style={{ borderRadius: 8, padding: "0 16px", height: 32, background: "#52c41a", borderColor: "#52c41a" }}
              onClick={() => {
                setSelectedEditTeacher(null);
                setAddModalVisible(true);
              }}
            >
              Thêm Giáo viên
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={mockTeachers}
          pagination={{ pageSize: 5, showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} của ${total} giáo viên` }}
          rowKey="key"
          style={{ fontSize: 13 }}
        />
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Button type="link" style={{ fontSize: 13 }} onClick={() => antMessage.info("Đang mở danh sách toàn bộ giáo viên...")}>
            Xem toàn bộ danh sách giáo viên
          </Button>
        </div>
      </Card>
      <TeacherInfoModal open={infoModalVisible} onClose={() => setInfoModalVisible(false)} teacher={selectedTeacher} />
      <AddTeacherDrawer open={addModalVisible} onClose={() => setAddModalVisible(false)} editRecord={selectedEditTeacher} />
    </MainLayout>
  );
};

export default TeacherPage;
