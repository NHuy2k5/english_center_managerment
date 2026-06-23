import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Layout,
  Row,
  Col,
  Input,
  Card,
  Tag,
  Space,
  Typography,
  Select,
  Divider,
  Button,
  Badge,
} from "antd";
import {
  SearchOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  BookOutlined,
  DollarOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
const { Title, Text } = Typography;

// Mock dữ liệu theo đúng cấu trúc API
const mockApiResponse = {
  courses: [
    {
      course_id: 1,
      name: "Tiếng Anh lớp 3 - 2026",
      year_course: 2026,
      total_students_registered: 30,
      total_students_dropped_out: 2,
      total_lessons: 48,
      listed_price: 2800000,
      discount: 10,
      description: "Chương trình tiếng Anh cho học sinh lớp 3...",
      thumbnail_link: "https://via.placeholder.com/400x240?text=Grade+3",
      thumbnail_id: "thumb_3",
      category_course_id: 1,
      category_course_name: "Tiếng Anh cấp 1",
      status: "Đang mở",
    },
    {
      course_id: 2,
      name: "Tiếng Anh lớp 4 - 2026",
      year_course: 2026,
      total_students_registered: 28,
      total_students_dropped_out: 1,
      total_lessons: 48,
      listed_price: 2900000,
      discount: 5,
      description: "Chương trình tiếng Anh cho học sinh lớp 4...",
      thumbnail_link: "https://via.placeholder.com/400x240?text=Grade+4",
      thumbnail_id: "thumb_4",
      category_course_id: 1,
      category_course_name: "Tiếng Anh cấp 1",
      status: "Đang mở",
    },
    {
      course_id: 3,
      name: "Tiếng Anh lớp 5 - 2026",
      year_course: 2026,
      total_students_registered: 26,
      total_students_dropped_out: 3,
      total_lessons: 48,
      listed_price: 3000000,
      discount: 0,
      description: "Chương trình tiếng Anh cho học sinh lớp 5...",
      thumbnail_link: "https://via.placeholder.com/400x240?text=Grade+5",
      thumbnail_id: "thumb_5",
      category_course_id: 1,
      category_course_name: "Tiếng Anh cấp 1",
      status: "Sắp khai giảng",
    },
    {
      course_id: 4,
      name: "TOEIC PRE 03 - Offline",
      year_course: 2025,
      total_students_registered: 20,
      total_students_dropped_out: 0,
      total_lessons: 24,
      listed_price: 3500000,
      discount: 15,
      description: "Khóa học TOEIC dành cho người mất gốc...",
      thumbnail_link: "https://via.placeholder.com/400x240?text=TOEIC",
      thumbnail_id: "thumb_toeic",
      category_course_id: 2,
      category_course_name: "TOEIC",
      status: "Đã kết thúc",
    },
  ],
  "current-page": 1,
  "total-rows": 4,
};

const CourseListPage = () => {
  const navigate = useNavigate();
  // Giả sử lấy role từ context/auth (admin hoặc user/guest)
  const [isAdmin] = useState(true); // Đổi thành false để test guest

  // Lọc dữ liệu theo role: admin thấy hết, non-admin chỉ thấy công khai (status !== "Không công khai" - giả sử)
  const allCourses = useMemo(() => mockApiResponse.courses, []);
  const visibleCourses = useMemo(() => {
    if (isAdmin) return allCourses;
    // Nếu không phải admin, chỉ hiện khóa học có status != "Không công khai" (hoặc status === "Đang mở" / "Sắp khai giảng")
    return allCourses.filter(c => c.status !== "Không công khai");
  }, [allCourses, isAdmin]);

  // State cho tìm kiếm và bộ lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Lọc theo từ khóa, trạng thái, danh mục
  const filteredCourses = useMemo(() => {
    return visibleCourses.filter(course => {
      const matchSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.category_course_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === "all" || course.status === statusFilter;
      const matchCategory = categoryFilter === "all" || course.category_course_name === categoryFilter;
      return matchSearch && matchStatus && matchCategory;
    });
  }, [visibleCourses, searchTerm, statusFilter, categoryFilter]);

  // Lấy danh sách danh mục và trạng thái duy nhất cho bộ lọc
  const categories = useMemo(() => {
    const cats = new Set(visibleCourses.map(c => c.category_course_name));
    return ["all", ...Array.from(cats)];
  }, [visibleCourses]);

  const statuses = useMemo(() => {
    const stats = new Set(visibleCourses.map(c => c.status));
    return ["all", ...Array.from(stats)];
  }, [visibleCourses]);

  return (
    <Layout style={{ background: "transparent" }}>
      <Content style={{ padding: 24 }}>
        <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 24 }}>
          <Col xs={24} md={12}>
            <Input
              size="large"
              placeholder="Tìm kiếm khóa học theo tên hoặc danh mục"
              prefix={<SearchOutlined />}
              allowClear
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col xs={12} md={6}>
            <Select
              size="large"
              defaultValue="all"
              style={{ width: "100%" }}
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
            >
              {statuses.map(s => (
                <Select.Option key={s} value={s}>
                  {s === "all" ? "Tất cả trạng thái" : s}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} md={6}>
            <Select
              size="large"
              defaultValue="all"
              style={{ width: "100%" }}
              value={categoryFilter}
              onChange={(val) => setCategoryFilter(val)}
            >
              {categories.map(c => (
                <Select.Option key={c} value={c}>
                  {c === "all" ? "Tất cả danh mục" : c}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>

        <Title level={4} style={{ marginBottom: 24 }}>
          {isAdmin ? "Tất cả khóa học" : "Khóa học dành cho bạn"}
        </Title>

        <Row gutter={[16, 16]}>
          {filteredCourses.length === 0 ? (
            <Col span={24}>
              <div style={{ textAlign: "center", padding: 40 }}>
                <Text type="secondary">Không tìm thấy khóa học nào phù hợp.</Text>
              </div>
            </Col>
          ) : (
            filteredCourses.map((course) => (
              <Col key={course.course_id} xs={24} sm={12} md={12} lg={8}>
                <Card
                  hoverable
                  bordered
                  onClick={() => navigate(`/courses/${course.course_id}`)}
                  style={{
                    borderRadius: 16,
                    border: "1px solid #e8e8e8",
                    transition: "all 0.25s ease",
                    cursor: "pointer",
                    height: "100%",
                  }}
                  bodyStyle={{ padding: 20 }}
                >
                  <Space direction="vertical" style={{ width: "100%" }} size="small">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <Title level={5} style={{ marginBottom: 4, flex: 1 }}>
                        {course.name}
                      </Title>
                      {isAdmin && (
                        <Badge
                          status={
                            course.status === "Đang mở" ? "processing" :
                            course.status === "Sắp khai giảng" ? "warning" :
                            "default"
                          }
                          text={course.status}
                          style={{ marginLeft: 8 }}
                        />
                      )}
                    </div>

                    <Tag color="blue">{course.category_course_name}</Tag>
                    <Text type="secondary">Năm học: {course.year_course}</Text>

                    <Space size="small" style={{ flexWrap: "wrap", marginTop: 4 }}>
                      <Tag icon={<ClockCircleOutlined />} color="default">
                        {course.total_lessons} buổi
                      </Tag>
                      <Tag icon={<TeamOutlined />} color="processing">
                        {course.total_students_registered} học viên
                      </Tag>
                    </Space>

                    <Divider style={{ margin: "8px 0" }} />

                    <Row gutter={8} justify="space-between" style={{ textAlign: "center" }}>
                      <Col span={12}>
                        <Text type="secondary">Giá niêm yết</Text>
                        <div style={{ fontWeight: 700 }}>
                          {course.listed_price.toLocaleString()} ₫
                        </div>
                      </Col>
                      <Col span={12}>
                        <Text type="secondary">Giảm giá</Text>
                        <div style={{ fontWeight: 700, color: course.discount > 0 ? "#cf1322" : "#8c8c8c" }}>
                          {course.discount > 0 ? `${course.discount}%` : "0%"}
                        </div>
                      </Col>
                    </Row>

                    {course.discount > 0 && (
                      <div style={{ textAlign: "center", marginTop: 4 }}>
                        <Text strong style={{ color: "#52c41a" }}>
                          Giá sau giảm: {(course.listed_price * (1 - course.discount / 100)).toLocaleString()} ₫
                        </Text>
                      </div>
                    )}
                  </Space>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Content>
    </Layout>
  );
};

export default CourseListPage;