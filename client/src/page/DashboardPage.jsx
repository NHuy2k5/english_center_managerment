import React from "react";
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
  Select
} from "antd";
const { Option } = Select;
import {
  TeamOutlined,
  UserOutlined,
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

const { Title, Text } = Typography;

const recentActivities = [
  { title: "Trần Minh Khoa đăng ký lớp THCS cơ bản", time: "5 phút trước", icon: "🎓" },
  { title: "Cô Nguyễn Thu Hà cập nhật lịch dạy", time: "20 phút trước", icon: "📅" },
  { title: "Lớp THPT Nâng cao đã đủ học viên", time: "1 giờ trước", icon: "✅" },
  { title: "Học phí tháng 6 được xác nhận (12 học viên)", time: "2 giờ trước", icon: "💳" },
  { title: "Phụ huynh Lê Văn Thành gửi yêu cầu tư vấn", time: "3 giờ trước", icon: "💬" },
];

const formatVND = (amount) => amount.toLocaleString("vi-VN") + " ₫";

const formatDate = (dateStr) => {
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
};

const UnpaidFeesTable = () => {
  // Filter only students who owe tuition
  const [dataSource, setDataSource] = React.useState(mockStudents.filter(s => s.tuitionOwed));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleDelete = (key) => {
    setDataSource((prev) => prev.filter((r) => r.key !== key));
    antMessage.success("Đã xóa học viên khỏi danh sách");
  };

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name) => (
        <Space>
          <Avatar
            size={34}
            style={{
              background: "linear-gradient(135deg, #1677ff, #4096ff)",
              fontWeight: 700,
              fontSize: 13,
              flexShrink: 0,
            }}
          >
            {name.split(" ").pop()[0]}
          </Avatar>
          <Text strong style={{ fontSize: 13 }}>{name}</Text>
        </Space>
      ),
    },
    {
      title: "Mã học viên",
      dataIndex: "id",
      key: "id",
      render: (id) => (
        <Text style={{ color: "#1677ff", fontWeight: 500, fontSize: 13 }}>{id}</Text>
      ),
    },
    {
      title: "Lớp",
      dataIndex: "classCode",
      key: "classCode",
      align: "center",
      render: (code) => (
        <Tag color="geekblue" style={{ borderRadius: 6, fontWeight: 600 }}>{code}</Tag>
      ),
    },
    {
      title: "Học phí (₫)",
      dataIndex: "fee",
      key: "fee",
      sorter: (a, b) => a.fee - b.fee,
      render: (fee) => (
        <Text strong style={{ color: "#ff4d4f", fontSize: 13 }}>
          {formatVND(fee)}
        </Text>
      ),
    },
    {
      title: "Hạn nộp",
      dataIndex: "deadline",
      key: "deadline",
      sorter: (a, b) => new Date(a.deadline) - new Date(b.deadline),
      render: (deadline) => {
        const due = new Date(deadline);
        due.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
        const isOverdue = diffDays < 0;

        if (isOverdue) {
          return (
            <Space direction="vertical" size={2}>
              <Tag color="error" style={{ borderRadius: 6, fontWeight: 600, margin: 0 }}>
                Quá hạn {Math.abs(diffDays)} ngày
              </Tag>
              <Text strong style={{ fontSize: 12 }}>
                {formatDate(deadline)}
              </Text>
            </Space>
          );
        }

        const tagColor   = diffDays === 0 ? "warning" : diffDays <= 5 ? "warning" : "success";
        const tagLabel   = diffDays === 0 ? "Hết hạn hôm nay" : `Còn ${diffDays} ngày`;

        return (
          <Space direction="vertical" size={2}>
            <Tag color={tagColor} style={{ borderRadius: 6, fontWeight: 600, margin: 0 }}>
              {tagLabel}
            </Tag>
            <Text strong style={{ fontSize: 12 }}>
              {formatDate(deadline)}
            </Text>
          </Space>
        );
      },
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
                  onConfirm={() => handleDelete(record.key)}
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
                onClick={() => antMessage.info(`Thông tin: ${record.name}`)} />
            </Tooltip>
            <Tooltip title="In phiếu thu">
              <Button type="text" icon={<PrinterOutlined />} shape="circle" style={{ color: "#8c8c8c" }}
                onClick={() => antMessage.info(`In phiếu: ${record.name}`)} />
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
    <Card
      bordered={false}
      style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
      title={
        <Space>
          <DollarOutlined style={{ color: "#ff4d4f" }} />
          <span style={{ fontWeight: 700, fontSize: 15 }}>Học phí chưa thanh toán</span>
          <Tag color="red" style={{ borderRadius: 6, fontWeight: 600 }}>
            {dataSource.length} học viên
          </Tag>
        </Space>
      }
      extra={
        <Space>
          <Select placeholder="Trạng thái" style={{ width: 140 }} allowClear>
            <Option value="overdue">Quá hạn</Option>
            <Option value="near_due">Gần/chưa tới hạn</Option>
          </Select>
          <Button
            icon={<BellOutlined />}
            size="small"
            style={{ borderRadius: 8 }}
            onClick={() => antMessage.info("Đã gửi nhắc nhở đến tất cả học viên quá hạn")}
          >
            Gửi nhắc nhở
          </Button>
          <Button
            icon={<EditOutlined />}
            type="primary"
            ghost
            size="small"
            style={{ borderRadius: 8 }}
            onClick={() => antMessage.info("Chỉnh sửa danh sách")}
          >
            Chỉnh sửa
          </Button>
        </Space>
      }
    >
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey="key"
        tableLayout="fixed"
        pagination={{
          pageSize: 5,
          showTotal: (total, range) =>
            `Hiển thị ${range[0]}–${range[1]} trong ${total} học viên`,
          style: { marginBottom: 0 },
        }}
        style={{ fontSize: 13 }}
      />
    </Card>
  );
};

const DashboardPage = () => {
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
            title: "Lớp học đang mở",
            value: "45",
            prefix: <BookOutlined style={{ color: "#faad14" }} />,
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

      {/* ── UNPAID FEES TABLE ──────────────────────────────── */}
      <Row gutter={[20, 20]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <UnpaidFeesTable />
        </Col>
      </Row>
    </MainLayout>
  );
};

export default DashboardPage;
