import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Card, Typography, Button, Input, Select, Table, Tag, Space, Progress, Tooltip, Avatar, Segmented } from "antd";
import { SearchOutlined, ArrowLeftOutlined, PlusOutlined, UnorderedListOutlined, AppstoreOutlined, ClockCircleOutlined, UserOutlined, EnvironmentOutlined } from "@ant-design/icons";
import MainLayout from "../layout/MainLayout";
import { mockClasses } from "../mockData";

const { Title, Text } = Typography;
const { Option } = Select;

const categoryInfo = {
  primary: { title: "Tiếng Anh Tiểu Học", color: "#ff7875" },
  secondary: { title: "Tiếng Anh THCS", color: "#69b1ff" },
  high: { title: "Tiếng Anh THPT", color: "#ffc069" },
  ielts: { title: "Luyện thi IELTS", color: "#b37feb" }
};

const ClassListPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const catInfo = categoryInfo[categoryId] || { title: "Danh sách lớp", color: "#1677ff" };
  
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table");

  // Lọc dữ liệu lớp học
  const filteredClasses = useMemo(() => {
    return mockClasses
      .filter(c => c.categoryId === categoryId)
      .filter(c => {
        const matchSearch = c.name.toLowerCase().includes(searchText.toLowerCase()) || c.teacher.toLowerCase().includes(searchText.toLowerCase());
        const matchStatus = statusFilter === "all" || c.status === statusFilter;
        return matchSearch && matchStatus;
      });
  }, [categoryId, searchText, statusFilter]);

  // Cấu hình Table columns
  const columns = [
    {
      title: "Tên lớp",
      dataIndex: "name",
      key: "name",
      render: (text) => <Text strong style={{ color: "#0f1c3f" }}>{text}</Text>
    },
    {
      title: "Sĩ số",
      key: "students",
      render: (_, record) => {
        const percent = Math.round((record.currentStudents / record.maxStudents) * 100);
        return (
          <div style={{ width: 120 }}>
            <Progress percent={percent} size="small" showInfo={false} strokeColor={percent >= 100 ? "#ff4d4f" : "#52c41a"} />
            <Text type="secondary" style={{ fontSize: 12 }}>{record.currentStudents} / {record.maxStudents} Học viên</Text>
          </div>
        );
      }
    },
    {
      title: "Lịch học",
      dataIndex: "schedule",
      key: "schedule",
      render: (text) => (
        <Space>
          <ClockCircleOutlined style={{ color: "#8c8c8c" }} />
          <Text>{text}</Text>
        </Space>
      )
    },
    {
      title: "Giáo viên",
      dataIndex: "teacher",
      key: "teacher",
      render: (text) => (
        <Space>
          <Avatar icon={<UserOutlined />} size="small" style={{ backgroundColor: "#d9d9d9" }} />
          <Text>{text}</Text>
        </Space>
      )
    },
    {
      title: "Phòng",
      dataIndex: "room",
      key: "room",
      render: (text) => (
        <Space>
          <EnvironmentOutlined style={{ color: "#8c8c8c" }} />
          <Text>{text}</Text>
        </Space>
      )
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color = status === "active" ? "success" : "warning";
        const label = status === "active" ? "Đang học" : "Ẩn";
        return <Tag color={color}>{label}</Tag>;
      }
    },
    {
      title: "Hành động",
      key: "action",
      render: () => (
        <Button type="link" size="small">Chi tiết</Button>
      )
    }
  ];

  // Component Card View
  const renderCards = () => (
    <Row gutter={[16, 16]}>
      {filteredClasses.map(c => {
        const percent = Math.round((c.currentStudents / c.maxStudents) * 100);
        return (
          <Col xs={24} sm={12} lg={8} xl={6} key={c.id}>
            <Card hoverable style={{ borderRadius: 12, overflow: "hidden" }} bodyStyle={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <Title level={5} style={{ margin: 0, color: "#0f1c3f" }}>{c.name}</Title>
                <Tag color={c.status === "active" ? "success" : "warning"} style={{ margin: 0 }}>
                  {c.status === "active" ? "Đang học" : "Ẩn"}
                </Tag>
              </div>
              
              <div style={{ marginBottom: 16 }}>
                <Progress percent={percent} size="small" showInfo={false} strokeColor={percent >= 100 ? "#ff4d4f" : "#52c41a"} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>Sĩ số</Text>
                  <Text strong style={{ fontSize: 12 }}>{c.currentStudents} / {c.maxStudents}</Text>
                </div>
              </div>

              <Space direction="vertical" size="small" style={{ width: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <ClockCircleOutlined style={{ color: "#8c8c8c" }} />
                  <Text style={{ fontSize: 13 }}>{c.schedule}</Text>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <UserOutlined style={{ color: "#8c8c8c" }} />
                  <Text style={{ fontSize: 13 }}>GV: {c.teacher}</Text>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <EnvironmentOutlined style={{ color: "#8c8c8c" }} />
                  <Text style={{ fontSize: 13 }}>Phòng: {c.room}</Text>
                </div>
              </Space>

              <Button type="dashed" block style={{ marginTop: 16, borderRadius: 8 }}>
                Xem chi tiết
              </Button>
            </Card>
          </Col>
        );
      })}
    </Row>
  );

  return (
    <MainLayout selectedKey="class" title={`Danh sách lớp - ${catInfo.title}`}>
      <div style={{ padding: "0 10px" }}>
        
        {/* HEADER */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 24, gap: 16 }}>
          <Button icon={<ArrowLeftOutlined />} shape="circle" onClick={() => navigate("/class")} />
          <div style={{ flex: 1 }}>
            <Title level={3} style={{ margin: 0, color: "#0f1c3f" }}>{catInfo.title}</Title>
            <Text type="secondary">Quản lý và theo dõi danh sách lớp học thuộc chương trình này.</Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />} size="large" style={{ borderRadius: 8 }}>
            Tạo lớp mới
          </Button>
        </div>

        {/* FILTER BAR */}
        <Card style={{ borderRadius: 12, marginBottom: 24 }} bodyStyle={{ padding: 16 }}>
          <Row gutter={16} align="middle" justify="space-between">
            <Col>
              <Space size="middle">
                <Input
                  placeholder="Tìm theo tên lớp, giáo viên..."
                  prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 280, borderRadius: 8 }}
                  allowClear
                />
                <Select
                  value={statusFilter}
                  onChange={setStatusFilter}
                  style={{ width: 160 }}
                  options={[
                    { value: "all", label: "Tất cả trạng thái" },
                    { value: "active", label: "Đang học" },
                    { value: "upcoming", label: "Ẩn" }
                  ]}
                />
              </Space>
            </Col>
            <Col>
              <Segmented
                options={[
                  { value: "table", icon: <UnorderedListOutlined /> },
                  { value: "card", icon: <AppstoreOutlined /> }
                ]}
                value={viewMode}
                onChange={setViewMode}
              />
            </Col>
          </Row>
        </Card>

        {/* CONTENT */}
        {viewMode === "table" ? (
          <Table 
            columns={columns} 
            dataSource={filteredClasses} 
            rowKey="id" 
            pagination={{ pageSize: 10 }}
            style={{ 
              background: "#fff", 
              borderRadius: 12, 
              overflow: "hidden",
              border: "1px solid #f0f0f0"
            }}
          />
        ) : (
          renderCards()
        )}
      </div>
    </MainLayout>
  );
};

export default ClassListPage;
