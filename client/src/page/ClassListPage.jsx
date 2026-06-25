import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Card, Typography, Button, Input, Select, Table, Tag, Space, Progress, Avatar, Segmented, Tabs, message as antMessage, Spin } from "antd";
import { SearchOutlined, ArrowLeftOutlined, PlusOutlined, UnorderedListOutlined, AppstoreOutlined, ClockCircleOutlined, UserOutlined, EnvironmentOutlined } from "@ant-design/icons";
import MainLayout from "../layout/MainLayout";

const { Title, Text } = Typography;
const { Option } = Select;

const ClassListPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  
  const [catInfo, setCatInfo] = useState({ title: "Danh sách lớp", color: "#1677ff" });
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [classes, setClasses] = useState([]);
  
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table");
  const [loading, setLoading] = useState(false);
  const [classesLoading, setClassesLoading] = useState(false);

  // Fetch category info and courses
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const headers = { "Authorization": `Bearer ${token}` };
        
        // Fetch category
        const catRes = await fetch(`http://localhost:5002/api/v1/category-courses/${categoryId}`, { headers });
        if (catRes.ok) {
          const catJson = await catRes.json();
          if (catJson.data) setCatInfo({ title: catJson.data.name, color: "#1677ff" });
        }
        
        // Fetch courses
        const coursesRes = await fetch(`http://localhost:5002/api/v1/courses`, { headers });
        if (coursesRes.ok) {
          const coursesJson = await coursesRes.json();
          if (coursesJson.data) {
             const filteredCourses = coursesJson.data.filter(c => c.category_course_id === Number(categoryId));
             setCourses(filteredCourses);
             if (filteredCourses.length > 0) {
               setSelectedCourseId(filteredCourses[0].id.toString());
             }
          }
        }
      } catch (err) {
        antMessage.error("Lỗi khi tải dữ liệu Khóa học");
      }
      setLoading(false);
    };
    fetchData();
  }, [categoryId]);

  // Fetch classes when selectedCourseId changes
  useEffect(() => {
    if (!selectedCourseId) {
      setClasses([]);
      return;
    }
    const fetchClasses = async () => {
      setClassesLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const headers = { "Authorization": `Bearer ${token}` };
        const res = await fetch(`http://localhost:5002/api/v1/courses/${selectedCourseId}/classes`, { headers });
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
             setClasses(json.data);
          } else {
             setClasses([]);
          }
        }
      } catch (err) {
        antMessage.error("Lỗi khi tải dữ liệu Lớp học");
      }
      setClassesLoading(false);
    };
    fetchClasses();
  }, [selectedCourseId]);

  // Lọc dữ liệu lớp học
  const filteredClasses = useMemo(() => {
    return classes.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(searchText.toLowerCase());
      const matchStatus = statusFilter === "all" || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [classes, searchText, statusFilter]);

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
        const current = 0; // Chưa có API trả về số học sinh hiện tại
        const max = record.total_students || 50;
        const percent = Math.round((current / max) * 100);
        return (
          <div style={{ width: 120 }}>
            <Progress percent={percent} size="small" showInfo={false} strokeColor={percent >= 100 ? "#ff4d4f" : "#52c41a"} />
            <Text type="secondary" style={{ fontSize: 12 }}>{current} / {max} Học viên</Text>
          </div>
        );
      }
    },
    {
      title: "Lịch học",
      key: "schedule",
      render: () => (
        <Space>
          <ClockCircleOutlined style={{ color: "#8c8c8c" }} />
          <Text type="secondary">Chưa phân công</Text>
        </Space>
      )
    },
    {
      title: "Giáo viên",
      key: "teacher",
      render: () => (
        <Space>
          <Avatar icon={<UserOutlined />} size="small" style={{ backgroundColor: "#d9d9d9" }} />
          <Text type="secondary">Chưa phân công</Text>
        </Space>
      )
    },
    {
      title: "Phòng",
      key: "room",
      render: () => (
        <Space>
          <EnvironmentOutlined style={{ color: "#8c8c8c" }} />
          <Text type="secondary">Chưa xếp phòng</Text>
        </Space>
      )
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color = status === "opened" ? "success" : "warning";
        const label = status === "opened" ? "Đang mở" : "Đã đóng";
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

  const renderCards = () => (
    <Row gutter={[16, 16]}>
      {filteredClasses.map(c => {
        const max = c.total_students || 50;
        const percent = 0;
        return (
          <Col xs={24} sm={12} lg={8} xl={6} key={c.id}>
            <Card hoverable style={{ borderRadius: 12, overflow: "hidden" }} bodyStyle={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <Title level={5} style={{ margin: 0, color: "#0f1c3f" }}>{c.name}</Title>
                <Tag color={c.status === "opened" ? "success" : "warning"} style={{ margin: 0 }}>
                  {c.status === "opened" ? "Đang mở" : "Đã đóng"}
                </Tag>
              </div>
              
              <div style={{ marginBottom: 16 }}>
                <Progress percent={percent} size="small" showInfo={false} strokeColor={percent >= 100 ? "#ff4d4f" : "#52c41a"} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>Sĩ số</Text>
                  <Text strong style={{ fontSize: 12 }}>0 / {max}</Text>
                </div>
              </div>

              <Space direction="vertical" size="small" style={{ width: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <ClockCircleOutlined style={{ color: "#8c8c8c" }} />
                  <Text type="secondary" style={{ fontSize: 13 }}>Chưa phân công</Text>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <UserOutlined style={{ color: "#8c8c8c" }} />
                  <Text type="secondary" style={{ fontSize: 13 }}>GV: Chưa phân công</Text>
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

  const courseTabItems = courses.map(course => ({
    key: course.id.toString(),
    label: `${course.name} (${course.year_course})`,
  }));

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

        {loading ? (
          <div style={{ textAlign: "center", padding: "50px 0" }}><Spin size="large" /></div>
        ) : (
          <>
            {/* TABS KHÓA HỌC */}
            {courses.length > 0 ? (
              <Card style={{ borderRadius: 12, marginBottom: 24, padding: "0 16px" }} bodyStyle={{ padding: "12px 0 0 0" }}>
                <Tabs 
                  activeKey={selectedCourseId} 
                  onChange={setSelectedCourseId} 
                  items={courseTabItems}
                  size="large"
                />
              </Card>
            ) : (
              <Card style={{ borderRadius: 12, marginBottom: 24, padding: "20px" }}>
                <Text type="secondary">Danh mục này hiện chưa có Khóa học nào.</Text>
              </Card>
            )}

            {/* FILTER BAR */}
            <Card style={{ borderRadius: 12, marginBottom: 24 }} bodyStyle={{ padding: 16 }}>
              <Row gutter={16} align="middle" justify="space-between">
                <Col>
                  <Space size="middle">
                    <Input
                      placeholder="Tìm theo tên lớp..."
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
                        { value: "opened", label: "Đang mở" },
                        { value: "closed", label: "Đã đóng" }
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
            {classesLoading ? (
              <div style={{ textAlign: "center", padding: "50px 0" }}><Spin /></div>
            ) : viewMode === "table" ? (
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
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default ClassListPage;
