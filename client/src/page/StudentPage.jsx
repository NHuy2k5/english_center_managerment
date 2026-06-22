import React from "react";
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
  InboxOutlined
} from "@ant-design/icons";
import MainLayout from "../layout/MainLayout";
import { mockStudents } from "../mockData";

const { Title, Text } = Typography;
const { Option } = Select;

const StudentPage = () => {
  const columns = [
    {
      title: "Học viên",
      dataIndex: "name",
      key: "name",
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
            {record.name.split(" ").pop()[0]}
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
      title: "Lớp",
      key: "classes",
      dataIndex: "classCode",
      align: "center",
      render: (classCode) => (
        <Tag color="geekblue" style={{ borderRadius: 6, fontWeight: 600 }}>
          {classCode}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      render: (status) => (
        <Tag
          color={status === "active" ? "success" : "warning"}
          style={{
            borderRadius: 6,
            fontWeight: 600,
          }}
        >
          {status === "active" ? "Đang học" : "Bảo lưu"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      render: (_, record) => {
        const moreMenu = {
          items: [
            {
              key: "edit",
              icon: <EditOutlined />,
              label: "Chỉnh sửa",
              onClick: () => antMessage.info(`Chỉnh sửa: ${record.name}`),
            },
            { type: "divider" },
            {
              key: "delete",
              icon: <DeleteOutlined />,
              label: (
                <Popconfirm
                  title="Xóa học viên này?"
                  description="Hành động này không thể hoàn tác."
                  onConfirm={() => antMessage.success("Đã xóa học viên")}
                  okText="Xóa"
                  cancelText="Hủy"
                  okButtonProps={{ danger: true }}
                >
                  <Text type="danger">Xóa</Text>
                </Popconfirm>
              ),
            },
          ],
        };
        return (
          <Space size={2}>
            <Tooltip title="Liên lạc với phụ huynh/học sinh">
              <Button type="text" icon={<PhoneOutlined />} shape="circle" style={{ color: "#52c41a" }}
                onClick={() => antMessage.info(`Liên lạc: ${record.name}`)} />
            </Tooltip>
            <Tooltip title="Xem thông tin">
              <Button type="text" icon={<InfoCircleOutlined />} shape="circle" style={{ color: "#1677ff" }}
                onClick={() => antMessage.info(`Thông tin chi tiết: ${record.name}`)} />
            </Tooltip>
            <Tooltip title="Chỉnh sửa">
              <Button type="text" icon={<EditOutlined />} shape="circle" style={{ color: "#faad14" }}
                onClick={() => antMessage.info(`Chỉnh sửa: ${record.name}`)} />
            </Tooltip>
            <Tooltip title="Lưu trữ">
              <Button type="text" icon={<InboxOutlined />} shape="circle" style={{ color: "#722ed1" }}
                onClick={() => antMessage.info(`Lưu trữ: ${record.name}`)} />
            </Tooltip>
            <Dropdown menu={moreMenu} trigger={["click"]} placement="bottomRight">
              <Button type="text" icon={<MoreOutlined style={{ fontSize: 18 }} />} shape="circle" style={{ color: "#8c8c8c" }} />
            </Dropdown>
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
            <Select placeholder="Phân loại lớp" style={{ width: 140 }} allowClear>
              <Option value="primary">Tiểu học</Option>
              <Option value="secondary">THCS</Option>
              <Option value="highschool">THPT</Option>
              <Option value="ielts">IELTS</Option>
            </Select>
            <Select placeholder="Trạng thái" style={{ width: 140 }} allowClear>
              <Option value="active">Đang học</Option>
              <Option value="reserved">Bảo lưu</Option>
            </Select>
          </Space>
          <Space>
            <Button
              icon={<EditOutlined />}
              type="primary"
              ghost
              size="small"
              style={{ borderRadius: 8, padding: "0 16px", height: 32 }}
              onClick={() => antMessage.info("Chỉnh sửa danh sách")}
            >
              Chỉnh sửa
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              size="small"
              style={{ borderRadius: 8, padding: "0 16px", height: 32 }}
            >
              Thêm Học viên
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={mockStudents}
          pagination={{ pageSize: 5, showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} của ${total} học viên` }}
          rowKey="key"
          style={{ fontSize: 13 }}
        />
      </Card>
    </MainLayout>
  );
};

export default StudentPage;
