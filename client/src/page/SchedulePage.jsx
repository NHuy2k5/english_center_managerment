import { useMemo, useState, useEffect } from "react";
import {
  Layout,
  Row,
  Col,
  Card,
  Typography,
  Select,
  Button,
  Space,
  Divider,
  Badge,
  Table,
  Tag,
  Timeline,
  Alert,
} from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CalendarOutlined,
  TeamOutlined,
  InfoCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
const { Title, Text } = Typography;

// --- Giả sử role lấy từ context/auth ---
const CURRENT_ROLE = "Teacher"; // Hoặc "Student", "Parent"

// --- Mock dữ liệu cho giáo viên ---
const mockTeacherData = [
  {
    lesson_id: 101,
    name: "Buổi 1 - Chào hỏi",
    start: "2026-05-01T18:00:00",
    end: "2026-05-01T19:30:00",
    description: "Học giới thiệu bản thân",
    address: "12 Nguyễn Văn Lộc, Hà Đông",
    teacher_name: "Cô Trần Ngọc Loan",
    class_id: 1,
    class_name: "Lớp 3A",
    marked: "main_teach",
  },
  {
    lesson_id: 102,
    name: "Buổi 2 - Gia đình",
    start: "2026-05-03T18:00:00",
    end: "2026-05-03T19:30:00",
    description: "Từ vựng về gia đình",
    address: "12 Nguyễn Văn Lộc, Hà Đông",
    teacher_name: "Cô Trần Ngọc Loan",
    class_id: 1,
    class_name: "Lớp 3A",
    marked: "substitute_teach",
  },
  {
    lesson_id: 103,
    name: "Buổi 3 - Ngữ pháp",
    start: "2026-05-05T18:00:00",
    end: "2026-05-05T19:30:00",
    description: "Ngữ pháp cơ bản",
    address: "12 Nguyễn Văn Lộc, Hà Đông",
    teacher_name: "Cô Trần Ngọc Loan",
    class_id: 1,
    class_name: "Lớp 3A",
    marked: "main_teach",
  },
  {
    lesson_id: 104,
    name: "Buổi 4 - Nghe hiểu",
    start: "2026-05-08T18:00:00",
    end: "2026-05-08T19:30:00",
    description: "Luyện nghe",
    address: "12 Nguyễn Văn Lộc, Hà Đông",
    teacher_name: "Cô Trần Ngọc Loan",
    class_id: 1,
    class_name: "Lớp 3A",
    marked: "absence_from_teaching",
  },
  {
    lesson_id: 201,
    name: "Buổi 1 - Hello",
    start: "2026-05-02T18:00:00",
    end: "2026-05-02T19:30:00",
    description: "Học chào hỏi cơ bản",
    address: "12 Nguyễn Văn Lộc, Hà Đông",
    teacher_name: "Cô Lê Thị Hoa",
    class_id: 2,
    class_name: "Lớp 3B",
    marked: "main_teach",
  },
];

// Hàm xử lý ngày giờ
const parseDate = (isoString) => new Date(isoString);
const formatTime = (isoString) => {
  const date = parseDate(isoString);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};
const formatDate = (isoString) => {
  const date = parseDate(isoString);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

// Tạo lưới tháng
const buildMonthGrid = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0).getDate();
  const offset = (firstDay.getDay() + 6) % 7;
  const weeks = [];
  let day = 1 - offset;

  while (day <= lastDay) {
    const week = [];
    for (let index = 0; index < 7; index += 1) {
      week.push(day >= 1 && day <= lastDay ? day : null);
      day += 1;
    }
    weeks.push(week);
  }

  return weeks;
};

// Các hằng số
const monthLabels = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];
const weekDayLabels = ["Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy", "Chủ nhật"];

const SchedulePage = () => {
  const [role] = useState(CURRENT_ROLE);
  const [viewMode, setViewMode] = useState("calendar"); // 'calendar' hoặc 'timetable'
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  // Dữ liệu giáo viên
  const [teacherLessons, setTeacherLessons] = useState([]);

  // Load dữ liệu mock (giả sử gọi API)
  useEffect(() => {
    if (role === "Teacher" || role === "Student") {
      setTeacherLessons(mockTeacherData);
    }
  }, [role]);

  // Lọc dữ liệu theo tháng/năm
  const filteredLessons = useMemo(() => {
    return teacherLessons.filter((lesson) => {
      const d = parseDate(lesson.start);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  }, [teacherLessons, year, month]);

  // Gom các buổi học theo ngày
  const lessonsByDay = useMemo(() => {
    return filteredLessons.reduce((acc, lesson) => {
      const day = parseDate(lesson.start).getDate();
      if (!acc[day]) acc[day] = [];
      acc[day].push(lesson);
      return acc;
    }, {});
  }, [filteredLessons]);

  const selectedLessons = lessonsByDay[selectedDay] || [];

  const monthGrid = useMemo(() => buildMonthGrid(year, month), [year, month]);

  // Xử lý chuyển tháng
  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
    setSelectedDay(1);
  };

  // Render trạng thái marked cho giáo viên
  const renderMarkedTag = (marked) => {
    let color = "";
    let label = "";
    if (marked === "main_teach") {
      color = "blue";
      label = "Dạy chính";
    } else if (marked === "substitute_teach") {
      color = "purple";
      label = "Dạy thay";
    } else if (marked === "absence_from_teaching") {
      color = "red";
      label = "Nghỉ dạy có phép";
    } else {
      color = "default";
      label = marked || "Chưa có";
    }
    return <Tag color={color}>{label}</Tag>;
  };

  // Nếu role là Teacher hoặc Student, hiển thị lịch
  return (
    <Layout style={{ background: "transparent" }}>
      <Content style={{ padding: 24 }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 22 }}>
          <Col>
            <Title level={4} style={{ margin: 0 }}>
              {role === "Teacher" ? "Lịch dạy" : "Lịch học"}
            </Title>
            <Text type="secondary">Xem lịch theo tháng, năm và lớp.</Text>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={7}>
            <Card style={{ borderRadius: 20 }} bodyStyle={{ padding: 20 }}>
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <div>
                  <Text type="secondary">Năm</Text>
                  <Select
                    value={year}
                    onChange={setYear}
                    style={{ width: "100%", marginTop: 8 }}
                  >
                    {[2024, 2025, 2026, 2027, 2028].map((value) => (
                      <Select.Option key={value} value={value}>
                        {value}
                      </Select.Option>
                    ))}
                  </Select>
                </div>

                <div>
                  <Text type="secondary">Tháng</Text>
                  <Select
                    value={month}
                    onChange={setMonth}
                    style={{ width: "100%", marginTop: 8 }}
                  >
                    {monthLabels.map((label, index) => (
                      <Select.Option key={label} value={index}>
                        {label}
                      </Select.Option>
                    ))}
                  </Select>
                </div>

                <Divider />

                <Timeline style={{ paddingTop: 16 }}>
                  <Timeline.Item dot={<CalendarOutlined style={{ fontSize: 18 }} />} color="blue">
                    <div style={{ fontSize: 14, lineHeight: 1.5 }}>Tổng {filteredLessons.length} buổi trong tháng</div>
                  </Timeline.Item>
                  <Timeline.Item dot={<TeamOutlined style={{ fontSize: 18 }} />} color="green">
                    <div style={{ fontSize: 14, lineHeight: 1.5 }}>Các lớp: {[...new Set(filteredLessons.map(l => l.class_name))].join(", ")}</div>
                  </Timeline.Item>
                  <Timeline.Item dot={<InfoCircleOutlined style={{ fontSize: 18 }} />} color="gray">
                    <div style={{ fontSize: 14, lineHeight: 1.5 }}>Quản lý lịch dạy theo năm học.</div>
                  </Timeline.Item>
                </Timeline>
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={17}>
            {viewMode === "calendar" ? (
              <Card style={{ borderRadius: 20 }} bodyStyle={{ padding: 20 }}>
                <Row justify="space-between" align="middle" style={{ marginBottom: 14 }}>
                  <Col>
                    <Text strong>{`${monthLabels[month]} ${year}`}</Text>
                  </Col>
                  <Col>
                    <Space>
                      <Button
                        type={viewMode === "calendar" ? "primary" : "default"}
                        onClick={() => setViewMode("calendar")}
                      >
                        Lịch tháng
                      </Button>
                      <Button
                        type={viewMode === "timetable" ? "primary" : "default"}
                        onClick={() => setViewMode("timetable")}
                      >
                        Thời khóa biểu
                      </Button>
                      <Button icon={<ArrowLeftOutlined />} onClick={handlePrevMonth} />
                      <Button icon={<ArrowRightOutlined />} onClick={handleNextMonth} />
                    </Space>
                  </Col>
                </Row>

                <Row gutter={[10, 10]} style={{ marginBottom: 14 }}>
                  {weekDayLabels.map((label) => (
                    <Col key={label} span={Math.floor(24 / 7)} style={{ textAlign: "center" }}>
                      <Text strong>{label}</Text>
                    </Col>
                  ))}
                </Row>

                <Row gutter={[10, 10]}>
                  {monthGrid.map((week, weekIndex) => (
                    <Col key={weekIndex} span={24}>
                      <Row gutter={[10, 10]}>
                        {week.map((day, idx) => {
                          const dayLessons = day ? lessonsByDay[day] || [] : [];
                          const selected = day === selectedDay;
                          return (
                            <Col key={`${weekIndex}-${idx}`} span={Math.floor(24 / 7)}>
                              <div
                                role="button"
                                style={{
                                  background: selected ? "#e6f7ff" : "#ffffff",
                                  border: selected ? "1px solid #1890ff" : "1px solid #f0f0f0",
                                  borderRadius: 16,
                                  minHeight: 118,
                                  padding: 12,
                                  cursor: day ? "pointer" : "default",
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "space-between",
                                }}
                                onClick={() => day && setSelectedDay(day)}
                              >
                                <div style={{ fontWeight: 700, marginBottom: 8 }}>{day || ""}</div>
                                <div>
                                  {dayLessons.slice(0, 2).map((lesson) => (
                                    <div key={lesson.lesson_id} style={{ marginBottom: 8, textAlign: "center" }}>
                                      <Tag color="blue" style={{ display: "inline-block" }}>
                                        {lesson.class_name}
                                      </Tag>
                                      <div style={{ fontSize: 11, marginTop: 4, color: "#999" }}>
                                        {formatTime(lesson.start)} - {formatTime(lesson.end)}
                                      </div>
                                      <div style={{ fontSize: 11, marginTop: 2 }}>{renderMarkedTag(lesson.marked)}</div>
                                    </div>
                                  ))}
                                  {dayLessons.length > 2 && (
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                      +{dayLessons.length - 2} buổi
                                    </Text>
                                  )}
                                </div>
                              </div>
                            </Col>
                          );
                        })}
                      </Row>
                    </Col>
                  ))}
                </Row>
              </Card>
            ) : (
              // Chế độ xem danh sách (thời khóa biểu)
              <Card style={{ borderRadius: 20 }} bodyStyle={{ padding: 20 }}>
                <Row justify="space-between" align="middle" style={{ marginBottom: 14 }}>
                  <Col>
                    <Text strong>Danh sách lịch dạy</Text>
                  </Col>
                  <Col>
                    <Space>
                      <Button
                        type={viewMode === "calendar" ? "primary" : "default"}
                        onClick={() => setViewMode("calendar")}
                      >
                        Lịch tháng
                      </Button>
                      <Button
                        type={viewMode === "timetable" ? "primary" : "default"}
                        onClick={() => setViewMode("timetable")}
                      >
                        Thời khóa biểu
                      </Button>
                      <Button icon={<ArrowLeftOutlined />} onClick={handlePrevMonth} />
                      <Button icon={<ArrowRightOutlined />} onClick={handleNextMonth} />
                    </Space>
                  </Col>
                </Row>
                {filteredLessons.length ? (
                  <Space direction="vertical" size="large" style={{ width: "100%" }}>
                    {filteredLessons.map((lesson) => (
                      <Card key={lesson.lesson_id} type="inner" bodyStyle={{ padding: 16 }}>
                        <Row gutter={[16, 16]} align="middle">
                          <Col xs={24} md={6}>
                            <Text strong>{lesson.name}</Text>
                            <div style={{ marginTop: 8 }}>
                              <Tag icon={<CalendarOutlined />} color="default">
                                {formatTime(lesson.start)} - {formatTime(lesson.end)}
                              </Tag>
                            </div>
                          </Col>
                          <Col xs={24} md={4}>
                            <Text type="secondary">Ngày</Text>
                            <div style={{ fontWeight: 700 }}>{formatDate(lesson.start)}</div>
                          </Col>
                          <Col xs={24} md={4}>
                            <Text type="secondary">Lớp</Text>
                            <div>{lesson.class_name}</div>
                          </Col>
                          <Col xs={24} md={5}>
                            <Text type="secondary">Địa điểm</Text>
                            <div>{lesson.address}</div>
                          </Col>
                          <Col xs={24} md={5}>
                            <Text type="secondary">Trạng thái</Text>
                            <div>{renderMarkedTag(lesson.marked)}</div>
                          </Col>
                        </Row>
                        <Divider style={{ margin: "12px 0" }} />
                        <Row>
                          <Col span={24}>
                            <Text type="secondary">Mô tả:</Text>
                            <Text>{lesson.description}</Text>
                          </Col>
                        </Row>
                      </Card>
                    ))}
                  </Space>
                ) : (
                  <Alert message="Không có lịch dạy trong tháng này" type="info" showIcon />
                )}
              </Card>
            )}
          </Col>
        </Row>

        {/* Phần chi tiết ngày chọn */}
        <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
          <Col xs={24}>
            <Card style={{ borderRadius: 20 }} bodyStyle={{ padding: 24 }}>
              <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
                <Col>
                  <Title level={5} style={{ margin: 0 }}>
                    Chi tiết ngày {selectedDay}/{month + 1}/{year}
                  </Title>
                  <Text type="secondary">Các buổi dạy trong ngày và trạng thái.</Text>
                </Col>
                <Col>
                  <Badge count={selectedLessons.length} showZero>
                    <Tag color="blue">Buổi</Tag>
                  </Badge>
                </Col>
              </Row>

              {selectedLessons.length ? (
                <Space direction="vertical" size="large" style={{ width: "100%" }}>
                  {selectedLessons.map((lesson) => (
                    <Card key={lesson.lesson_id} type="inner" bodyStyle={{ padding: 20 }}>
                      <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} md={8}>
                          <Text strong>{lesson.name}</Text>
                          <div style={{ marginTop: 8 }}>
                            <Tag icon={<CalendarOutlined />} color="default">
                              {formatTime(lesson.start)} - {formatTime(lesson.end)}
                            </Tag>
                          </div>
                        </Col>
                        <Col xs={24} md={4}>
                          <Text type="secondary">Lớp</Text>
                          <div>{lesson.class_name}</div>
                        </Col>
                        <Col xs={24} md={6}>
                          <Text type="secondary">Địa điểm</Text>
                          <div>{lesson.address}</div>
                        </Col>
                        <Col xs={24} md={6}>
                          <Text type="secondary">Trạng thái</Text>
                          <div>{renderMarkedTag(lesson.marked)}</div>
                        </Col>
                      </Row>
                      <Divider style={{ margin: "16px 0" }} />
                      <Row>
                        <Col span={24}>
                          <Text type="secondary">Mô tả:</Text>
                          <Text>{lesson.description}</Text>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </Space>
              ) : (
                <Alert message="Không có buổi dạy nào trong ngày này" type="info" showIcon />
              )}
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default SchedulePage;