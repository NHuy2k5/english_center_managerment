import React, { useState, useEffect } from "react";
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
  FilterOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  WarningFilled,
  PhoneOutlined,
  MailOutlined,
  InfoCircleOutlined,
  InboxOutlined,
  BookOutlined,
  DollarOutlined,
  UserAddOutlined
} from "@ant-design/icons";
import MainLayout from "../layout/MainLayout";
import { mockStudents } from "../mockData";
import AddStudentDrawer from "../components/AddStudentDrawer";
import AddParentDrawer from "../components/AddParentDrawer";
import StudentInfoModal from "../components/StudentInfoModal";
import TuitionHistoryModal from "../components/TuitionHistoryModal";

const { Title, Text } = Typography;
const { Option } = Select;

const StudentPage = () => {
  const [isAddDrawerVisible, setIsAddDrawerVisible] = useState(false);
  const [isAddParentVisible, setIsAddParentVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [tuitionModalVisible, setTuitionModalVisible] = useState(false);
  const [selectedTuitionStudent, setSelectedTuitionStudent] = useState(null);

  const [selectedEditStudent, setSelectedEditStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch("http://localhost:5002/api/v1/students", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const json = await res.json();
        if (res.ok && json.data) {
          const formattedData = json.data.map((student, index) => {
            const mockParent = mockStudents[index % mockStudents.length] || {};
            return {
              key: student.id,
              ...student,
              parentName: student.parent?.full_name || mockParent.parentName || "Chưa cập nhật",
              parentPhone: mockParent.parentPhone || "N/A",
              tuitionOwed: mockParent.tuitionOwed
            };
          });
          setStudents(formattedData);
        } else {
          antMessage.error(json.message || "Không thể tải danh sách học viên");
        }
      } catch (err) {
        antMessage.error("Lỗi kết nối máy chủ");
      }
      setLoading(false);
    };
    fetchStudents();
  }, []);

  const columns = [
    {
      title: "Học viên",
      dataIndex: "full_name",
      key: "full_name",
      render: (text, record) => (
        <Space>
          <Avatar
            size={34}
            style={{
              background: "linear-gradient(135deg, #1677ff, #4096ff)",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            {record.full_name ? record.full_name.split(" ").pop()[0] : "H"}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600, color: "#0f1c3f", fontSize: 13 }}>
              {text}
              {record.tuitionOwed && (
                <Tooltip title="Cần nhắc nhở đóng học phí">
                  <WarningFilled style={{ color: "#ff4d4f", marginLeft: 6, fontSize: 12 }} />
                </Tooltip>
              )}
            </div>
            <div style={{ color: "#1677ff", fontWeight: 500, fontSize: 12 }}>{record.id}</div>
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
            <PhoneOutlined style={{ marginRight: 6, color: "#1677ff" }} />
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
      title: "Phụ huynh",
      key: "parent",
      render: (_, record) => (
        <div style={{ fontSize: 13 }}>
          <div style={{ fontWeight: 500, color: "#0f1c3f" }}>{record.parentName}</div>
          <div style={{ color: "#8c8c8c" }}>{record.parentPhone}</div>
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
                onClick={() => { setSelectedStudent(record); setInfoModalVisible(true); }} />
            </Tooltip>
            <Tooltip title="Lịch sử học phí">
              <Button type="text" icon={<DollarOutlined />} shape="circle" style={{ color: "#eb2f96" }}
                onClick={() => {
                  setSelectedTuitionStudent(record);
                  setTuitionModalVisible(true);
                }} />
            </Tooltip>
            <Tooltip title="Chỉnh sửa (Bao gồm quản lý lớp)">
              <Button type="text" icon={<EditOutlined />} shape="circle" style={{ color: "#faad14" }}
                onClick={() => {
                  setSelectedEditStudent(record);
                  setIsAddDrawerVisible(true);
                }} />
            </Tooltip>
            <Tooltip title="Lưu trữ">
              <Button type="text" icon={<InboxOutlined />} shape="circle" style={{ color: "#722ed1" }}
                onClick={() => antMessage.info(`Lưu trữ: ${record.full_name}`)} />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <MainLayout selectedKey="student" title="Quản lý Học viên">
      {/* ── MINI STATS ──────────────────────────────────────── */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Avatar size={54} style={{ background: "#e6f4ff", color: "#1677ff" }} icon={<TeamOutlined />} />
              <div>
                <Text type="secondary" style={{ fontSize: 13 }}>Tổng số học viên</Text>
                <Title level={3} style={{ margin: 0, color: "#0f1c3f" }}>1,284</Title>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Avatar size={54} style={{ background: "#f6ffed", color: "#52c41a" }} icon={<PlusOutlined />} />
              <div>
                <Text type="secondary" style={{ fontSize: 13 }}>Học viên mới (tháng này)</Text>
                <Title level={3} style={{ margin: 0, color: "#0f1c3f" }}>+45</Title>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Avatar size={54} style={{ background: "#fffbe6", color: "#faad14" }} icon={<UserOutlined />} />
              <div>
                <Text type="secondary" style={{ fontSize: 13 }}>Đang bảo lưu</Text>
                <Title level={3} style={{ margin: 0, color: "#0f1c3f" }}>23</Title>
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
              placeholder="Tìm theo tên, SĐT, Mã HV..."
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
              style={{ borderRadius: 8, padding: "0 16px", height: 32, background: "#1677ff" }}
              onClick={() => {
                setSelectedEditStudent(null);
                setIsAddDrawerVisible(true);
              }}
            >
              Thêm Học viên
            </Button>
            <Button 
              type="primary" 
              icon={<UserAddOutlined />} 
              size="small"
              style={{ borderRadius: 8, padding: "0 16px", height: 32, background: "#52c41a", borderColor: "#52c41a" }}
              onClick={() => setIsAddParentVisible(true)}
            >
              Thêm Phụ huynh
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={students}
          loading={loading}
          pagination={{ pageSize: 5, showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} của ${total} học viên` }}
          rowKey="key"
          style={{ fontSize: 13 }}
        />
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Button type="link" style={{ fontSize: 13 }} onClick={() => antMessage.info("Đang mở danh sách toàn bộ học sinh (bao gồm lưu trữ, thôi học)...")}>
            Xem toàn bộ danh sách học sinh (bao gồm lưu trữ, thôi học)
          </Button>
        </div>
      </Card>
      <AddStudentDrawer open={isAddDrawerVisible} onClose={() => setIsAddDrawerVisible(false)} />
      <AddParentDrawer open={isAddParentVisible} onClose={() => setIsAddParentVisible(false)} />
      <StudentInfoModal open={infoModalVisible} onClose={() => setInfoModalVisible(false)} student={selectedStudent} />
      <TuitionHistoryModal open={tuitionModalVisible} onClose={() => setTuitionModalVisible(false)} student={selectedTuitionStudent} />
      <AddStudentDrawer open={isAddDrawerVisible} onClose={() => setIsAddDrawerVisible(false)} editRecord={selectedEditStudent} />
    </MainLayout>
  );
};

export default StudentPage;
