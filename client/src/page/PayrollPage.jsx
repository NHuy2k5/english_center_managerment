import React, { useState } from "react";
import {
  Table,
  Space,
  Button,
  Input,
  Select,
  Typography,
  Tag,
  Avatar,
  Tooltip,
  Row,
  Col,
  Card,
  Dropdown,
  message as antMessage
} from "antd";
import {
  SearchOutlined,
  DollarOutlined,
  PrinterOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  BankOutlined,
  AccountBookOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  MoreOutlined
} from "@ant-design/icons";
import MainLayout from "../layout/MainLayout";
import { mockSalaries } from "../mockData";
import PayslipModal from "../components/PayslipModal";
import EditSalaryModal from "../components/EditSalaryModal";

const { Title, Text } = Typography;
const { Option } = Select;

const formatVND = (amount) => amount.toLocaleString("vi-VN") + " ₫";

const PayrollPage = () => {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [payslipModalVisible, setPayslipModalVisible] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedEditRecord, setSelectedEditRecord] = useState(null);

  const handlePaySalary = (record) => {
    setSelectedSalary(record);
    setPayslipModalVisible(true);
  };

  const columns = [
    {
      title: "Giáo viên",
      dataIndex: "teacher_name",
      key: "teacher_name",
      render: (name) => (
        <Space>
          <Avatar
            size={34}
            style={{
              background: "linear-gradient(135deg, #722ed1, #b37feb)",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            {name.split(" ").pop()[0]}
          </Avatar>
          <Text strong style={{ fontSize: 13 }}>{name}</Text>
        </Space>
      ),
    },
    {
      title: "Kỳ lương",
      key: "period",
      align: "center",
      render: (_, record) => {
        const parts = record.the_first_of_the_month.split("-");
        return (
          <Tag color="purple" style={{ borderRadius: 6, fontWeight: 600 }}>
            Tháng {parts[1]}/{parts[0]}
          </Tag>
        );
      },
    },
    {
      title: "Số buổi dạy",
      dataIndex: "total_lessons_teached",
      key: "total_lessons_teached",
      align: "center",
      render: (lessons) => <Text style={{ fontSize: 13 }}>{lessons} buổi</Text>,
    },
    {
      title: "Tổng lương (₫)",
      dataIndex: "monthly_salary",
      key: "monthly_salary",
      render: (fee) => <Text strong style={{ fontSize: 14, color: "#eb2f96" }}>{formatVND(fee)}</Text>,
    },
    {
      title: "Trạng thái",
      dataIndex: "is_teacher_paid",
      key: "is_teacher_paid",
      align: "center",
      render: (paid) => (
        paid ? (
          <Tag color="success" icon={<CheckCircleOutlined />} style={{ borderRadius: 6, margin: 0 }}>Đã thanh toán</Tag>
        ) : (
          <Tag color="error" icon={<WarningOutlined />} style={{ borderRadius: 6, margin: 0 }}>Chưa thanh toán</Tag>
        )
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
              label: "Chỉnh sửa hóa đơn",
              onClick: () => {
                setSelectedEditRecord(record);
                setEditModalVisible(true);
              },
            },
          ],
        };
        return (
          <Space size={2}>
            {!record.is_teacher_paid && (
              <Tooltip title="Thanh toán lương">
                <Button type="text" icon={<DollarOutlined />} shape="circle" style={{ color: "#eb2f96" }} onClick={() => handlePaySalary(record)} />
              </Tooltip>
            )}
            <Dropdown menu={moreMenu} trigger={["click"]} placement="bottomRight">
              <Button type="text" icon={<MoreOutlined style={{ fontSize: 18 }} />} shape="circle" style={{ color: "#8c8c8c" }} />
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  const filteredData = mockSalaries.filter((item) => {
    const matchesSearch = item.teacher_name.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "paid" && item.is_teacher_paid) ||
      (statusFilter === "unpaid" && !item.is_teacher_paid);
    return matchesSearch && matchesStatus;
  });

  // Calculate totals for dashboard
  const totalFund = mockSalaries.reduce((sum, item) => sum + item.monthly_salary, 0);
  const paidFund = mockSalaries.filter(i => i.is_teacher_paid).reduce((sum, item) => sum + item.monthly_salary, 0);
  const unpaidFund = totalFund - paidFund;

  return (
    <MainLayout selectedKey="payroll" title="Lương bổng">
      {/* ── MINI STATS ──────────────────────────────────────── */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Avatar size={54} style={{ background: "#f0f5ff", color: "#2f54eb" }} icon={<AccountBookOutlined />} />
              <div>
                <Text type="secondary" style={{ fontSize: 13 }}>Tổng quỹ lương tháng</Text>
                <Title level={3} style={{ margin: 0, color: "#0f1c3f" }}>{formatVND(totalFund)}</Title>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Avatar size={54} style={{ background: "#f6ffed", color: "#52c41a" }} icon={<BankOutlined />} />
              <div>
                <Text type="secondary" style={{ fontSize: 13 }}>Đã chi trả</Text>
                <Title level={3} style={{ margin: 0, color: "#52c41a" }}>{formatVND(paidFund)}</Title>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Avatar size={54} style={{ background: "#fff1f0", color: "#f5222d" }} icon={<ExclamationCircleOutlined />} />
              <div>
                <Text type="secondary" style={{ fontSize: 13 }}>Còn nợ</Text>
                <Title level={3} style={{ margin: 0, color: "#f5222d" }}>{formatVND(unpaidFund)}</Title>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Header Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 700, color: "#0f1c3f" }}>
            Bảng lương giáo viên
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>
            Quản lý và thanh toán lương cho đội ngũ giáo viên
          </Text>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div
        style={{
          background: "#fff",
          padding: "16px 24px",
          borderRadius: 12,
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          alignItems: "center",
          marginBottom: 16,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <Input
          placeholder="Tìm tên giáo viên..."
          prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 280, borderRadius: 8 }}
          size="large"
        />
        <Select
          defaultValue="all"
          size="large"
          style={{ width: 180 }}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "Tất cả trạng thái" },
            { value: "paid", label: "Đã thanh toán" },
            { value: "unpaid", label: "Chưa thanh toán" },
          ]}
        />
      </div>

      {/* Table Section */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: "24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="key"
          pagination={{
            pageSize: 10,
            showTotal: (total, range) => `Hiển thị ${range[0]}–${range[1]} trong ${total} bản ghi`,
          }}
        />
      </div>

      {/* Payslip Modal */}
      <PayslipModal 
        open={payslipModalVisible} 
        onClose={() => setPayslipModalVisible(false)} 
        salaryRecord={selectedSalary} 
        onSuccess={() => setPayslipModalVisible(false)}
      />
      <EditSalaryModal 
        open={editModalVisible} 
        onClose={() => setEditModalVisible(false)} 
        salaryRecord={selectedEditRecord} 
      />
    </MainLayout>
  );
};

export default PayrollPage;
