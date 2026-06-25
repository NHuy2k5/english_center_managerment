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
  Dropdown,
  message as antMessage
} from "antd";
import {
  SearchOutlined,
  DollarOutlined,
  PrinterOutlined,
  BellOutlined,
  EditOutlined,
  MoreOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import MainLayout from "../layout/MainLayout";
import { mockPayments, mockStudents } from "../mockData";
import PaymentConfirmModal from "../components/PaymentConfirmModal";
import StudentInfoModal from "../components/StudentInfoModal";
import EditPaymentModal from "../components/EditPaymentModal";

const { Title, Text } = Typography;
const { Option } = Select;

const formatVND = (amount) => amount.toLocaleString("vi-VN") + " ₫";

const formatDate = (dateStr) => {
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
};

const PaymentPage = () => {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedEditRecord, setSelectedEditRecord] = useState(null);

  const handlePayment = (record) => {
    setSelectedPayment(record);
    setConfirmModalVisible(true);
  };

  const columns = [
    {
      title: "Học viên",
      dataIndex: "student_name",
      key: "student_name",
      render: (name) => (
        <Space>
          <Avatar
            size={34}
            style={{
              background: "linear-gradient(135deg, #1677ff, #4096ff)",
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
      title: "Lớp",
      dataIndex: "class_name",
      key: "class_name",
      align: "center",
      render: (code) => <Tag color="geekblue" style={{ borderRadius: 6, fontWeight: 600 }}>{code}</Tag>,
    },
    {
      title: "Chu kỳ thu",
      key: "period",
      render: (_, record) => (
        <Text style={{ fontSize: 13 }}>
          {formatDate(record.the_first_of_the_month)} - {formatDate(record.the_end_of_the_month)}
        </Text>
      ),
    },
    {
      title: "Số buổi",
      dataIndex: "total_reality_lessons",
      key: "total_reality_lessons",
      align: "center",
      render: (lessons) => <Text style={{ fontSize: 13 }}>{lessons}</Text>,
    },
    {
      title: "Học phí gốc (₫)",
      dataIndex: "actual_listed_tuition_fee",
      key: "actual_listed_tuition_fee",
      render: (fee) => <Text style={{ fontSize: 13, color: "#8c8c8c" }}>{formatVND(fee)}</Text>,
    },
    {
      title: "Mã giảm giá",
      dataIndex: "coupon",
      key: "coupon",
      align: "center",
      render: (coupon) => (
        coupon ? (
          <Tooltip title={`Giảm ${formatVND(coupon.discount)}`}>
            <Tag color="purple" style={{ borderRadius: 6 }}>{coupon.code}</Tag>
          </Tooltip>
        ) : <Text type="secondary">-</Text>
      ),
    },
    {
      title: "Thực thu (₫)",
      key: "actual_fee",
      render: (_, record) => {
        const discount = record.coupon ? record.coupon.discount : 0;
        const actual = record.actual_listed_tuition_fee - discount;
        return (
          <Text strong style={{ color: "#ff4d4f", fontSize: 14 }}>
            {formatVND(actual)}
          </Text>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "have_student_paid",
      key: "have_student_paid",
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
            {!record.have_student_paid && (
              <Tooltip title="Thanh toán ngay">
                <Button type="text" icon={<DollarOutlined />} shape="circle" style={{ color: "#52c41a" }} onClick={() => handlePayment(record)} />
              </Tooltip>
            )}
            {!record.have_student_paid && (
              <Tooltip title="Gửi nhắc nhở">
                <Button type="text" icon={<BellOutlined />} shape="circle" style={{ color: "#faad14" }} onClick={() => antMessage.info(`Đã gửi nhắc nhở đến ${record.student_name}`)} />
              </Tooltip>
            )}
            <Tooltip title="Xem thông tin học viên">
              <Button 
                type="text" 
                icon={<InfoCircleOutlined />} 
                shape="circle" 
                style={{ color: "#1677ff" }} 
                onClick={() => {
                  // Find the full student data from mockStudents by name or use a mock fallback
                  const studentData = mockStudents.find(s => s.name === record.student_name) || {
                    id: `SV00${record.key}`,
                    name: record.student_name,
                    classCode: record.class_name,
                    parentName: record.parent_name
                  };
                  setSelectedStudent(studentData);
                  setInfoModalVisible(true);
                }} 
              />
            </Tooltip>
            <Dropdown menu={moreMenu} trigger={["click"]} placement="bottomRight">
              <Button type="text" icon={<MoreOutlined style={{ fontSize: 18 }} />} shape="circle" style={{ color: "#8c8c8c" }} />
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  const filteredData = mockPayments.filter((item) => {
    const matchesSearch = item.student_name.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "paid" && item.have_student_paid) ||
      (statusFilter === "unpaid" && !item.have_student_paid);
    return matchesSearch && matchesStatus;
  });

  return (
    <MainLayout selectedKey="payment" title="Quản lý Học phí">
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
            Học phí & Thanh toán
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>
            Quản lý hóa đơn và theo dõi trạng thái đóng học phí của học viên
          </Text>
        </div>
      </div>

      {/* Filter and Table */}
      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 16,
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          <Space size={16}>
            <Input
              placeholder="Tìm kiếm học viên..."
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 280, borderRadius: 8 }}
              allowClear
            />
            <Select
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
              style={{ width: 160 }}
              options={[
                { value: "all", label: "Tất cả trạng thái" },
                { value: "paid", label: "Đã thanh toán" },
                { value: "unpaid", label: "Chưa thanh toán" },
              ]}
            />
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="key"
          pagination={{
            pageSize: 10,
            showTotal: (total, range) => `Hiển thị ${range[0]}–${range[1]} trong ${total} hóa đơn`,
          }}
        />
      </div>

      <PaymentConfirmModal open={confirmModalVisible} onClose={() => setConfirmModalVisible(false)} paymentRecord={selectedPayment} onSuccess={() => setConfirmModalVisible(false)} />
      <StudentInfoModal open={infoModalVisible} onClose={() => setInfoModalVisible(false)} student={selectedStudent} />
      <EditPaymentModal open={editModalVisible} onClose={() => setEditModalVisible(false)} paymentRecord={selectedEditRecord} />
    </MainLayout>
  );
};

export default PaymentPage;
