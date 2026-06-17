import { useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Layout,
  Row,
  Col,
  Breadcrumb,
  Tag,
  Card,
  Avatar,
  Progress,
  Statistic,
  List,
  Timeline,
  Divider,
  Button,
  Space,
  Badge,
} from "antd";

import {
  HomeOutlined,
  CalendarOutlined,
  TeamOutlined,
  UserOutlined,
  DollarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const { Content } = Layout;

const CourseDetailsPage = () => {
  const { courseId } = useParams();
  // Mock data — replace with real API data later
  const course = useMemo(
    () => ({
      code: "PRE102084",
      title: "TOEIC PRE_03 offline",
      status: "Đang học",
      address: "12 Phố Nguyễn Văn Lộc, Làng Việt kiều Châu Âu, Mộ Lao, Hà Đông, Hanoi, Vietnam",
      startDate: "24/04/2026",
      teachers: ["Trần Ngọc Loan"],
      sessionsDone: 20,
      sessionsTotal: 24,
      attendancePresent: 19,
      attendanceAbsent: 1,
      practice: { total: 22, done: 7, notDone: 12, locked: 3 },
      tests: { total: 31, done: 2, notDone: 24, locked: 5 },
      progressCards: [
        { title: "Lớp học", value: "20 / 24", percent: Math.round((20 / 24) * 100) },
        { title: "Chuyên cần", value: "19 / 24", percent: Math.round((19 / 24) * 100) },
        { title: "Bài tập", value: "7 / 22", percent: Math.round((7 / 22) * 100) },
        { title: "Bài tập thêm", value: "0 / 0", percent: 0 },
      ],
      pastLessons: new Array(4).fill(0).map((_, i) => ({
        id: i + 1,
        title: `Buổi học ${20 + i}`,
        topic:
          i % 2 === 0
            ? "Reading - UNIT 11: Parts 5, 6, 7 - Subjunctive Mood"
            : "Listening - UNIT 10,11: Part 4 - Telephone Messages",
        teacher: "Trần Ngọc Loan",
        date: i === 0 ? "15/06/2026, 18:25 - 19:25" : "17/06/2026, 18:25 - 19:25",
      })),
    }),
    []
  );

  return (
    <Layout style={{ background: "transparent" }}>
      <Content style={{ padding: 24 }}>
        <Card bodyStyle={{ padding: 24 }}>
          <Breadcrumb style={{ marginBottom: 12 }}>
            <Breadcrumb.Item>Khóa học</Breadcrumb.Item>
            <Breadcrumb.Item>TOEIC PRE_03</Breadcrumb.Item>
            <Breadcrumb.Item>Lớp học</Breadcrumb.Item>
          </Breadcrumb>

          <Row gutter={16} align="middle">
            <Col flex="auto">
              <div style={{ padding: "20px 24px", borderRadius: 24, background: "#f5f7ff", marginBottom: 12 }}>
                <h2 style={{ margin: 0 }}>{`${course.code} _ ${course.title}`}</h2>
                <div style={{ marginTop: 8, color: "#888" }}>{course.address}</div>
              </div>
            </Col>

            <Col>
              <Space direction="vertical" align="end">
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#888", fontSize: 12 }}>Trạng thái:</div>
                  <div style={{ color: "#1890ff", fontWeight: 600 }}>Đang diễn ra</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#888", fontSize: 12 }}>Đã học:</div>
                  <div style={{ fontWeight: 600 }}>{`${course.sessionsDone}/${course.sessionsTotal} buổi`}</div>
                </div>
              </Space>
            </Col>
          </Row>

          <Divider />

          <Row gutter={[16, 16]}>
            {course.progressCards.map((c, idx) => (
              <Col key={idx} xs={24} sm={12} md={6}>
                <Card hoverable>
                  <Row align="middle">
                    <Col flex="none" style={{ paddingRight: 12 }}>
                      <Progress type="circle" percent={c.percent} width={84} />
                    </Col>
                    <Col flex="auto">
                      <h4 style={{ margin: 0 }}>{c.value}</h4>
                      <div style={{ color: "#888" }}>{c.title}</div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>

          <Divider />

          <Row gutter={24} style={{ alignItems: "stretch" }}>
            <Col xs={24} lg={16} style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
              <Card
                style={{ borderRadius: 18, flex: 1, minHeight: 0 }}
                bodyStyle={{ padding: 24, display: "flex", flexDirection: "column", minHeight: 0 }}
              >
                <div style={{ padding: "12px 18px", borderRadius: 16, background: "#f5f7ff", marginBottom: 16, display: "inline-block" }}>
                  <h3 style={{ margin: 0 }}>Quá trình học</h3>
                </div>

                <div style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
                  <List
                    itemLayout="vertical"
                    dataSource={course.pastLessons}
                    renderItem={(item) => (
                      <List.Item>
                        <Card>
                          <Row>
                            <Col xs={24} md={16}>
                              <div style={{ fontWeight: 700 }}>{item.title}</div>
                              <div style={{ color: "#444" }}>{item.topic}</div>
                            </Col>
                            <Col xs={24} md={8} style={{ textAlign: "right" }}>
                              <div style={{ color: "#888" }}>Giáo viên</div>
                              <div style={{ fontWeight: 600 }}>{item.teacher}</div>
                              <div style={{ color: "#888", marginTop: 8 }}>{item.date}</div>
                            </Col>
                          </Row>
                        </Card>
                      </List.Item>
                    )}
                  />
                </div>

                <div style={{ marginTop: 16 }}>
                  <Card style={{ borderRadius: 16 }}>
                    <Row gutter={[12, 12]}>
                      <Col xs={24} md={12}>
                        <div style={{ fontWeight: 700 }}>Buổi học đã diễn ra</div>
                        <div style={{ marginTop: 8 }}>
                          <Badge color="#52c41a" text={`P ${Math.round((course.attendancePresent / course.sessionsTotal) * 100)}%`} />
                        </div>
                        <div style={{ marginTop: 8 }}>{`${course.attendancePresent} buổi có mặt`}</div>
                      </Col>
                      <Col xs={24} md={12} style={{ textAlign: "right" }}>
                        <div style={{ color: "#888" }}>Tổng buổi</div>
                        <div style={{ fontWeight: 700 }}>{course.sessionsTotal} buổi</div>
                        <div style={{ marginTop: 8 }}>
                          <Badge color="#fa8c16" text={`A ${Math.round((course.attendanceAbsent / course.sessionsTotal) * 100)}%`} />
                        </div>
                        <div style={{ marginTop: 8 }}>{`${course.attendanceAbsent} buổi vắng mặt`}</div>
                      </Col>
                    </Row>
                  </Card>
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={8} style={{ display: "flex", flexDirection: "column", gap: 12, minHeight: 0 }}>
              <Card
                style={{
                  borderRadius: 18,
                  borderColor: "#d9e7ff",
                  background: "#f5f8ff",
                  flex: 1,
                  minHeight: 0,
                }}
                bodyStyle={{ padding: 24 }}
                title={
                  <div style={{ background: "#e8f0ff", padding: "10px 16px", borderRadius: 20, display: "inline-block" }}>
                    <span style={{ fontWeight: 700, color: "#1d39c4" }}>Thông tin lớp</span>
                  </div>
                }
              >
                <Row align="middle" gutter={[12, 12]}>
                  <Col>
                    <Avatar size={54} icon={<UserOutlined />} />
                  </Col>
                  <Col flex="auto" style={{ paddingLeft: 12 }}>
                    <div style={{ fontWeight: 700 }}>{course.teachers.join(", ")}</div>
                    <div style={{ color: "#888" }}>Giáo viên</div>
                  </Col>
                </Row>

                <Divider />

                <div style={{ marginTop: 12 }}>
                  <Row gutter={[12, 12]}>
                    <Col span={24}>
                      <Card type="inner" style={{ borderRadius: 14, background: "#ffffff", textAlign: "center" }}>
                        <div style={{ color: "#888", fontSize: 12 }}>Số học sinh</div>
                        <div style={{ fontSize: 28, fontWeight: 700 }}>24</div>
                      </Card>
                    </Col>
                  </Row>
                </div>
              </Card>

              <Card
                style={{
                  borderRadius: 18,
                  background: "#fff7e6",
                  borderColor: "#ffe7ba",
                }}
                bodyStyle={{ padding: 24 }}
                title={
                  <div style={{ background: "#fff1b8", padding: "10px 16px", borderRadius: 20, display: "inline-block" }}>
                    <span style={{ fontWeight: 700, color: "#ad8b00" }}>Bài luyện tập</span>
                  </div>
                }
              >
                <div style={{ marginBottom: 16, background: "#fff9db", padding: "14px 18px", borderRadius: 16 }}>
                  <div style={{ color: "#ad8b00", fontWeight: 700 }}>Tổng số bài</div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{course.practice.total}</div>
                </div>
                <Row gutter={[12, 12]}>
                  <Col xs={24} sm={8}>
                    <Card type="inner" style={{ borderRadius: 14, textAlign: "center", background: "#ffffff" }}>
                      <div style={{ color: "#888", fontSize: 12 }}>Đã làm</div>
                      <div style={{ fontWeight: 700 }}>{course.practice.done}</div>
                    </Card>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Card type="inner" style={{ borderRadius: 14, textAlign: "center", background: "#ffffff" }}>
                      <div style={{ color: "#888", fontSize: 12 }}>Chưa làm</div>
                      <div style={{ fontWeight: 700 }}>{course.practice.notDone}</div>
                    </Card>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Card type="inner" style={{ borderRadius: 14, textAlign: "center", background: "#ffffff" }}>
                      <div style={{ color: "#888", fontSize: 12 }}>Chưa mở</div>
                      <div style={{ fontWeight: 700 }}>{course.practice.locked}</div>
                    </Card>
                  </Col>
                </Row>
              </Card>

              <Card
                style={{
                  borderRadius: 18,
                  background: "#e6f7ff",
                  borderColor: "#91d5ff",
                }}
                bodyStyle={{ padding: 24 }}
                title={
                  <div style={{ background: "#d6e4ff", padding: "10px 16px", borderRadius: 20, display: "inline-block" }}>
                    <span style={{ fontWeight: 700, color: "#1d39c4" }}>Bài test</span>
                  </div>
                }
              >
                <div style={{ marginBottom: 16, background: "#f0f5ff", padding: "14px 18px", borderRadius: 16 }}>
                  <div style={{ color: "#1d39c4", fontWeight: 700 }}>Tổng số bài</div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{course.tests.total}</div>
                </div>
                <Row gutter={[12, 12]}>
                  <Col xs={24} sm={8}>
                    <Card type="inner" style={{ borderRadius: 14, textAlign: "center", background: "#ffffff" }}>
                      <div style={{ color: "#888", fontSize: 12 }}>Đã làm</div>
                      <div style={{ fontWeight: 700 }}>{course.tests.done}</div>
                    </Card>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Card type="inner" style={{ borderRadius: 14, textAlign: "center", background: "#ffffff" }}>
                      <div style={{ color: "#888", fontSize: 12 }}>Chưa làm</div>
                      <div style={{ fontWeight: 700 }}>{course.tests.notDone}</div>
                    </Card>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Card type="inner" style={{ borderRadius: 14, textAlign: "center", background: "#ffffff" }}>
                      <div style={{ color: "#888", fontSize: 12 }}>Chưa mở</div>
                      <div style={{ fontWeight: 700 }}>{course.tests.locked}</div>
                    </Card>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Card>
      </Content>
    </Layout>
  );
};

export default CourseDetailsPage;
