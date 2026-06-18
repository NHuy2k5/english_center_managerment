import { useMemo, useState } from "react";
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
} from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CalendarOutlined,
  TeamOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
const { Title, Text } = Typography;

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

const classes = [
  {
    id: "PRE102084",
    label: "Lớp 3.1 - 2018",
    grade: "Lớp 3",
    year: 2018,
    teacher: "Trần Ngọc Loan",
    room: "GT - TOEIC 12 Nguyễn Văn Lộc, Hà Đông, HN",
    method: "Offline",
    students: 18,
  },
  {
    id: "PRE102085",
    label: "Lớp 3.2 - 2018",
    grade: "Lớp 3",
    year: 2018,
    teacher: "Trần Ngọc Loan",
    room: "GT - TOEIC 12 Nguyễn Văn Lộc, Hà Đông, HN",
    method: "Offline",
    students: 16,
  },
];

const scheduleEvents = [
  { id: 1, day: 1, classId: "PRE102084", title: "Buổi 1 - TOEIC cơ bản", time: "18:00 - 19:30", room: "A1", attendance: 19, absences: 1, month: 5, year: 2026 },
  { id: 2, day: 3, classId: "PRE102084", title: "Buổi 2 - Từ vựng", time: "18:00 - 19:30", room: "A1", attendance: 18, absences: 2, month: 5, year: 2026 },
  { id: 3, day: 5, classId: "PRE102084", title: "Buổi 3 - Ngữ pháp", time: "18:00 - 19:30", room: "A1", attendance: 20, absences: 0, month: 5, year: 2026 },
  { id: 4, day: 8, classId: "PRE102084", title: "Buổi 4 - Nghe hiểu", time: "18:00 - 19:30", room: "A1", attendance: 17, absences: 3, month: 5, year: 2026 },
  { id: 5, day: 2, classId: "PRE102085", title: "Buổi 1 - TOEIC cơ bản", time: "18:00 - 19:30", room: "A2", attendance: 16, absences: 0, month: 5, year: 2026 },
  { id: 6, day: 4, classId: "PRE102085", title: "Buổi 2 - Từ vựng", time: "18:00 - 19:30", room: "A2", attendance: 15, absences: 1, month: 5, year: 2026 },
  { id: 7, day: 9, classId: "PRE102085", title: "Buổi 3 - Ngữ pháp", time: "18:00 - 19:30", room: "A2", attendance: 15, absences: 1, month: 5, year: 2026 },
];

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

const SchedulePage = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [selectedClassId, setSelectedClassId] = useState(classes[0].id);
  const [viewMode, setViewMode] = useState("calendar");

  const activeClass = classes.find((item) => item.id === selectedClassId);
  const monthGrid = useMemo(() => buildMonthGrid(year, month), [year, month]);

  const filteredEvents = useMemo(
    () => scheduleEvents.filter((item) => item.month === month && item.year === year && item.classId === selectedClassId),
    [month, year, selectedClassId]
  );

  const eventsByDay = useMemo(() => {
    return filteredEvents.reduce((acc, event) => {
      if (!acc[event.day]) acc[event.day] = [];
      acc[event.day].push(event);
      return acc;
    }, {});
  }, [filteredEvents]);

  const selectedEvents = eventsByDay[selectedDay] || [];

  const summary = useMemo(() => {
    const totalSessions = filteredEvents.length;
    const totalAbsences = filteredEvents.reduce((sum, event) => sum + event.absences, 0);
    return { totalSessions, totalAbsences };
  }, [filteredEvents]);

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

  return (
    <Layout style={{ background: "transparent" }}>
      <Content style={{ padding: 24 }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 22 }}>
          <Col>
            <Title level={4} style={{ margin: 0 }}>
              Lịch học & Phòng học
            </Title>
            <Text type="secondary">Xem lịch học theo tháng, năm, lớp và phòng học.</Text>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={7}>
            <Card style={{ borderRadius: 20 }} bodyStyle={{ padding: 20 }}>
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <div>
                  <Text type="secondary">Chọn lớp</Text>
                  <Select
                    value={selectedClassId}
                    onChange={setSelectedClassId}
                    style={{ width: "100%", marginTop: 8 }}
                  >
                    {classes.map((item) => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>
                </div>

                <div>
                  <Text type="secondary">Chọn năm</Text>
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
                  <Text type="secondary">Chọn tháng</Text>
                  <Select value={month} onChange={setMonth} style={{ width: "100%", marginTop: 8 }}>
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
                    <div style={{ fontSize: 14, lineHeight: 1.5 }}>Lớp {activeClass.label} đang dùng phòng {activeClass.room}</div>
                  </Timeline.Item>
                  <Timeline.Item dot={<TeamOutlined style={{ fontSize: 18 }} />} color="green">
                    <div style={{ fontSize: 14, lineHeight: 1.5 }}>Giáo viên chủ nhiệm: {activeClass.teacher}</div>
                  </Timeline.Item>
                  <Timeline.Item dot={<InfoCircleOutlined style={{ fontSize: 18 }} />} color="gray">
                    <div style={{ fontSize: 14, lineHeight: 1.5 }}>Quản lý lớp học theo năm học riêng biệt và không xóa dữ liệu cũ.</div>
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
                        type={viewMode === 'calendar' ? 'primary' : 'default'}
                        onClick={() => setViewMode('calendar')}
                      >Lịch tháng</Button>
                      <Button
                        type={viewMode === 'timetable' ? 'primary' : 'default'}
                        onClick={() => setViewMode('timetable')}
                      >Thời khóa biểu</Button>
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
                          const dayEvents = day ? eventsByDay[day] || [] : [];
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
                                  {dayEvents.slice(0, 2).map((item) => (
                                    <div key={item.id} style={{ marginBottom: 8, textAlign: 'center' }}>
                                      <Tag color="blue" style={{ display: "inline-block" }}>
                                        {item.classId}
                                      </Tag>
                                      <div style={{ fontSize: 11, marginTop: 4, color: '#999' }}>{item.time}</div>
                                    </div>
                                  ))}
                                  {dayEvents.length > 2 && (
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                      +{dayEvents.length - 2} buổi
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
              <Card style={{ borderRadius: 20 }} bodyStyle={{ padding: 20 }}>
                <Row justify="space-between" align="middle" style={{ marginBottom: 14 }}>
                  <Col>
                    <Text strong>Danh sách lịch học</Text>
                  </Col>
                  <Col>
                    <Space>
                      <Button
                        type={viewMode === 'calendar' ? 'primary' : 'default'}
                        onClick={() => setViewMode('calendar')}
                      >Lịch tháng</Button>
                      <Button
                        type={viewMode === 'timetable' ? 'primary' : 'default'}
                        onClick={() => setViewMode('timetable')}
                      >Thời khóa biểu</Button>
                      <Button icon={<ArrowLeftOutlined />} onClick={handlePrevMonth} />
                      <Button icon={<ArrowRightOutlined />} onClick={handleNextMonth} />
                    </Space>
                  </Col>
                </Row>
                {filteredEvents.length ? (
                  <Space direction="vertical" size="large" style={{ width: "100%" }}>
                    {filteredEvents.map((event) => (
                      <Card key={event.id} type="inner" bodyStyle={{ padding: 16 }}>
                        <Row gutter={[16, 16]} align="middle">
                          <Col xs={24} md={6}>
                            <Text strong>{event.title}</Text>
                            <div style={{ marginTop: 8 }}>
                              <Tag icon={<CalendarOutlined />} color="default">
                                {event.time}
                              </Tag>
                            </div>
                          </Col>
                          <Col xs={24} md={5}>
                            <Text type="secondary">Ngày</Text>
                            <div style={{ fontWeight: 700 }}>{event.day}/{month + 1}/{year}</div>
                          </Col>
                          <Col xs={24} md={5}>
                            <Text type="secondary">Phòng học</Text>
                            <div>{event.room}</div>
                          </Col>
                          <Col xs={24} md={4}>
                            <Text type="secondary">Giáo viên</Text>
                            <div>{activeClass.teacher}</div>
                          </Col>
                          <Col xs={24} md={4}>
                            <Text type="secondary">Điểm danh</Text>
                            <div>{event.attendance} / {activeClass.students}</div>
                          </Col>
                        </Row>
                      </Card>
                    ))}
                  </Space>
                ) : (
                  <Card type="inner" bodyStyle={{ padding: 24, textAlign: "center" }}>
                    <Text type="secondary">Không có lịch học nào cho tháng này. Hãy chọn tháng khác.</Text>
                  </Card>
                )}
              </Card>
            )}
          </Col>
        </Row>

        <Row gutter={[16, 16]} justify="center" style={{ marginTop: 20 }}>
          <Col xs={24}>
            <Card style={{ borderRadius: 20 }} bodyStyle={{ padding: 24 }}>
              <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
                <Col>
                  <Title level={5} style={{ margin: 0 }}>
                    Chi tiết ngày {selectedDay}/{month + 1}/{year}
                  </Title>
                  <Text type="secondary">Lịch học, phòng học và trạng thái chuyên cần.</Text>
                </Col>
                <Col>
                  <Badge count={selectedEvents.length} showZero>
                    <Tag color="blue">Buổi</Tag>
                  </Badge>
                </Col>
              </Row>

              {selectedEvents.length ? (
                <Space direction="vertical" size="large" style={{ width: "100%" }}>
                  {selectedEvents.map((event) => (
                    <Card key={event.id} type="inner" bodyStyle={{ padding: 20 }}>
                      <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} md={10}>
                          <Text strong>{event.title}</Text>
                          <div style={{ marginTop: 8 }}>
                            <Tag icon={<CalendarOutlined />} color="default">
                              {event.time}
                            </Tag>
                          </div>
                        </Col>
                        <Col xs={24} md={7}>
                          <Text type="secondary">Giáo viên</Text>
                          <div>{activeClass.teacher}</div>
                        </Col>
                        <Col xs={24} md={7}>
                          <Text type="secondary">Phòng học</Text>
                          <div>{event.room}</div>
                        </Col>
                      </Row>

                      <Divider style={{ margin: "18px 0" }} />
                      <Row gutter={[16, 16]}>
                        <Col xs={24} md={8}>
                          <Text type="secondary">Điểm danh</Text>
                          <div>{event.attendance} / {activeClass.students}</div>
                        </Col>
                        <Col xs={24} md={8}>
                          <Text type="secondary">Nghỉ</Text>
                          <div>{event.absences} buổi</div>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </Space>
              ) : (
                <Card type="inner" bodyStyle={{ padding: 24, textAlign: "center" }}>
                  <Text type="secondary">Chưa có lịch học cho ngày này. Hãy chọn ngày khác.</Text>
                </Card>
              )}
            </Card>
          </Col>

          {/* Right summary panel removed per request */}
        </Row>
      </Content>
    </Layout>
  );
};

export default SchedulePage;
