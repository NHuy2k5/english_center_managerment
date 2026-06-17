import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Row, Col, Input, Card, Tag, Space, Typography, Select, Divider, Button } from "antd";
import { SearchOutlined, EnvironmentOutlined, ClockCircleOutlined, TeamOutlined, BookOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Title, Text } = Typography;

const CourseListPage = () => {
  const navigate = useNavigate();
  const courses = useMemo(
    () => ({
      mine: [
        {
          code: "A106466",
          title: "TOEIC/GT - Ca 9 (18h00-19h30, thứ 2,4,6)",
          address: "12 Phố Nguyễn Văn Lộc, Làng Việt kiều Châu Âu, Mộ Lao, Hà Đông, Hanoi",
          status: "Đang học",
          progress: { class: 0, attendance: 0, homework: 0 },
        },
        {
          code: "PRE102084",
          title: "TOEIC/GT - Ca 9 (18h00-19h30, thứ 2,4,6)",
          address: "12 Phố Nguyễn Văn Lộc, Làng Việt kiều Châu Âu, Mộ Lao, Hà Đông, Hanoi",
          status: "Đang học",
          progress: { class: 20, attendance: 19, homework: 7 },
        },
      ],
      suggested: [
        {
          id: "suggest-1",
          title: "Khóa học cho người bắt đầu 0-350",
          author: "HN TOEIC",
          sessions: "5 buổi",
          duration: "2h 20m",
          badge: "FREE",
          cover:
            "https://images.unsplash.com/photo-1537432376769-00a4b8f10b33?auto=format&fit=crop&w=800&q=80",
        },
        {
          id: "suggest-2",
          title: "10 buổi thông thạo từ vựng chuyên ngành",
          author: "Lê Minh Đông",
          sessions: "10 buổi",
          duration: "2h 24m",
          badge: "FREE",
          cover:
            "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
        },
        {
          id: "suggest-3",
          title: "Từ vựng và ngữ pháp TOEIC cho người mới bắt đầu",
          author: "MS Nhật Nguyên",
          sessions: "8 buổi",
          duration: "3h 2m",
          badge: "FREE",
          cover:
            "https://images.unsplash.com/photo-1544717305-996b815c338c?auto=format&fit=crop&w=800&q=80",
        },
        {
          id: "suggest-4",
          title: "Học từ vựng theo chủ đề cùng giáo viên 990/990 TOEIC",
          author: "MR. Phạm Lê Phượng",
          sessions: "6 buổi",
          duration: "0h 24m",
          badge: "FREE",
          cover:
            "https://images.unsplash.com/photo-1517430816045-df4b7de1655b?auto=format&fit=crop&w=800&q=80",
        },
      ],
    }),
    []
  );

  return (
    <Layout style={{ background: "transparent" }}>
      <Content style={{ padding: 24 }}>
        <style>{`
          .course-card:hover {
            background: #fafafa;
            border-color: #d9d9d9;
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
          }
        `}</style>
        <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 24 }}>
          <Col xs={24} md={12}>
            <Input size="large" placeholder="Tìm kiếm khóa học" prefix={<SearchOutlined />} allowClear />
          </Col>
          <Col xs={12} md={6}>
            <Select size="large" defaultValue="all" style={{ width: "100%" }}>
              <Select.Option value="all">Trạng thái</Select.Option>
              <Select.Option value="ongoing">Đang học</Select.Option>
              <Select.Option value="finished">Đã kết thúc</Select.Option>
            </Select>
          </Col>
          <Col xs={12} md={6}>
            <Select size="large" defaultValue="all" style={{ width: "100%" }}>
              <Select.Option value="all">Phân loại</Select.Option>
              <Select.Option value="toeic">TOEIC</Select.Option>
              <Select.Option value="grammar">Ngữ pháp</Select.Option>
            </Select>
          </Col>
        </Row>

        <Title level={4} style={{ marginBottom: 24 }}>
          Khóa học của tôi
        </Title>

        <Row gutter={[16, 16]}>
          {courses.mine.map((course) => (
            <Col key={course.code} xs={24} sm={12} md={12} lg={8}>
              <Card
                hoverable
                bordered
                onClick={() => navigate(`/course/${course.code}`)}
                style={{
                  borderRadius: 16,
                  border: "1px solid #e8e8e8",
                  transition: "all 0.25s ease",
                  cursor: "pointer",
                }}
                bodyStyle={{ padding: 20 }}
                headStyle={{ borderBottom: "none" }}
                className="course-card"
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Title level={5} style={{ marginBottom: 4 }}>
                    {course.code}
                  </Title>
                  <Text type="secondary">{course.title}</Text>

                  <Space size="small" style={{ flexWrap: "wrap" }}>
                    <Tag icon={<ClockCircleOutlined />} color="default">
                      {course.title.includes("Ca") ? "Ca 9" : "Ca học"}
                    </Tag>
                    <Tag icon={<TeamOutlined />} color="processing">
                      {course.status}
                    </Tag>
                  </Space>

                  <Space size="small" align="center" style={{ fontSize: 12, color: "#555" }}>
                    <EnvironmentOutlined />
                    <Text type="secondary">{course.address}</Text>
                  </Space>

                  <Divider style={{ margin: "12px 0" }} />

                  <Row gutter={8} justify="space-between" style={{ textAlign: "center" }}>
                    <Col span={8}>
                      <Text type="secondary">LỚP HỌC</Text>
                      <div style={{ fontWeight: 700 }}>{course.progress.class} / 24</div>
                    </Col>
                    <Col span={8}>
                      <Text type="secondary">CHUYÊN CẦN</Text>
                      <div style={{ fontWeight: 700 }}>{course.progress.attendance} / 24</div>
                    </Col>
                    <Col span={8}>
                      <Text type="secondary">BÀI TẬP</Text>
                      <div style={{ fontWeight: 700 }}>{course.progress.homework} / 24</div>
                    </Col>
                  </Row>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>

        <Divider />

        <Title level={5} style={{ marginBottom: 16 }}>
          Khóa học đề xuất
        </Title>

        <Row gutter={[16, 16]}>
          {courses.suggested.map((course) => (
            <Col key={course.id} xs={24} sm={12} md={12} lg={6}>
              <Card
                hoverable
                cover={
                  <div style={{ position: "relative" }}>
                    <img
                  alt={course.title}
                  src={course.cover}
                  onError={(event) => {
                    event.currentTarget.src = "https://via.placeholder.com/400x240?text=Khóa+học";
                  }}
                  style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16, height: 180, objectFit: "cover", width: "100%" }}
                />
                    <Tag style={{ position: "absolute", top: 16, right: 16 }} color="cyan">
                      {course.badge}
                    </Tag>
                  </div>
                }
                style={{ borderRadius: 16 }}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Text strong>{course.title}</Text>
                  <Space size="small" direction="vertical">
                    <Text type="secondary">{course.author}</Text>
                    <Space size="small">
                      <BookOutlined />
                      <Text type="secondary">{course.sessions}</Text>
                    </Space>
                    <Space size="small">
                      <ClockCircleOutlined />
                      <Text type="secondary">{course.duration}</Text>
                    </Space>
                  </Space>
                  <Button type="default" block>
                    Tham gia khóa học
                  </Button>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  );
};

export default CourseListPage;
