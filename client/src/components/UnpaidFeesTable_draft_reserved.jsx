import React, { useState } from "react";
import {
  Space,
  Tag,
  Button,
  Avatar,
  Table,
  Tooltip,
  Dropdown,
  Popconfirm,
  message as antMessage,
  Select,
  Card,
  Typography
} from "antd";
const { Option } = Select;
import {
  DollarOutlined,
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  PrinterOutlined,
  MoreOutlined,
  BellOutlined
} from "@ant-design/icons";
import { mockStudents } from "../mockData";
import StudentInfoModal from "./StudentInfoModal";
import TuitionHistoryModal from "./TuitionHistoryModal";

const { Text } = Typography;

const formatVND = (amount) => amount.toLocaleString("vi-VN") + " ₫";

const formatDate = (dateStr) => {
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
};

const UnpaidFeesTable = () => {
  // Filter only students who owe tuition
  const [dataSource, setDataSource] = React.useState(mockStudents.filter(s => s.tuitionOwed));
  const [infoModalVisible, setInfoModalVisible] = React.useState(false);
  const [selectedStudent, setSelectedStudent] = React.useState(null);
  const [tuitionModalVisible, setTuitionModalVisible] = React.useState(false);
  const [selectedTuitionStudent, setSelectedTuitionStudent] = React.useState(null);

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
            <Tooltip title="Lịch sử học phí">
              <Button type="text" icon={<DollarOutlined />} shape="circle" style={{ color: "#eb2f96" }}
                onClick={() => {
                  setSelectedTuitionStudent(record);
                  setTuitionModalVisible(true);
                }} />
            </Tooltip>
            <Tooltip title="Xem thông tin">
              <Button type="text" icon={<InfoCircleOutlined />} shape="circle" style={{ color: "#1677ff" }}
                onClick={() => {
                  setSelectedStudent(record);
                  setInfoModalVisible(true);
                }} />
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
      <StudentInfoModal 
        open={infoModalVisible} 
        onClose={() => setInfoModalVisible(false)} 
        student={selectedStudent} 
      />
      <TuitionHistoryModal
        open={tuitionModalVisible}
        onClose={() => setTuitionModalVisible(false)}
        student={selectedTuitionStudent}
      />
    </Card>
  );
};

export default UnpaidFeesTable;
