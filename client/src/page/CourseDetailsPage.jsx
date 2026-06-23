import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Layout,
  Row,
  Col,
  Card,
  Avatar,
  Divider,
  Tabs,
  Table,
  List,
  Badge,
  Typography,
  Button,
  Tag,
  Space,
  Descriptions,
  Empty,
  Result,
} from "antd";
import {
  BookOutlined,
  UserOutlined,
  CalendarOutlined,
  RightOutlined,
  DownOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// Mock dữ liệu (giữ nguyên)
const mockCoursesData = {
  1: {
    id: 1,
    name: "Tiếng Anh lớp 3 - 2026",
    year_course: 2026,
    total_students_registered: 30,
    total_students_dropped_out: 2,
    total_lessons: 48,
    listed_price: 2800000,
    discount: 10,
    description: "Chương trình tiếng Anh cho học sinh lớp 3 năm học 2025-2026, giúp các em làm quen với tiếng Anh qua các chủ đề gần gũi như gia đình, trường học, màu sắc, con vật. Khóa học được thiết kế với phương pháp học qua trò chơi, bài hát và hoạt động tương tác, tạo hứng thú cho các em ngay từ những buổi học đầu tiên.",
    thumbnail_link: "https://via.placeholder.com/100x100?text=Grade+3",
    thumbnail_id: "thumb_3",
    category_course_id: 1,
    category_course_name: "Tiếng Anh cấp 1",
    classes: [
      {
        id: 101,
        name: "Lớp 3A",
        teacher: "Cô Trần Ngọc Loan",
        schedule: "Thứ 2,4,6 - 18:00-19:30",
        room: "Phòng 201",
        lessons: [
          { id: 1, title: "Buổi 1 - Chào hỏi", date: "01/09/2026", time: "18:00-19:30" },
          { id: 2, title: "Buổi 2 - Gia đình", date: "03/09/2026", time: "18:00-19:30" },
          { id: 3, title: "Buổi 3 - Màu sắc", date: "06/09/2026", time: "18:00-19:30" },
          { id: 4, title: "Buổi 4 - Số đếm", date: "08/09/2026", time: "18:00-19:30" },
        ]
      },
      {
        id: 102,
        name: "Lớp 3B",
        teacher: "Cô Lê Thị Hoa",
        schedule: "Thứ 3,5,7 - 18:00-19:30",
        room: "Phòng 202",
        lessons: [
          { id: 5, title: "Buổi 1 - Chào hỏi", date: "02/09/2026", time: "18:00-19:30" },
          { id: 6, title: "Buổi 2 - Gia đình", date: "04/09/2026", time: "18:00-19:30" },
        ]
      },
      {
        id: 103,
        name: "Lớp 3C",
        teacher: "Cô Phạm Thu Hà",
        schedule: "Thứ 2,4,6 - 17:00-18:30",
        room: "Phòng 203",
        lessons: [
          { id: 7, title: "Buổi 1 - Chào hỏi", date: "01/09/2026", time: "17:00-18:30" },
        ]
      }
    ]
  },
  2: {
    id: 2,
    name: "Tiếng Anh lớp 4 - 2026",
    year_course: 2026,
    total_students_registered: 28,
    total_students_dropped_out: 1,
    total_lessons: 48,
    listed_price: 2900000,
    discount: 5,
    description: "Chương trình tiếng Anh cho học sinh lớp 4 năm học 2025-2026, tập trung phát triển kỹ năng giao tiếp và từ vựng theo chủ đề. Học sinh sẽ được rèn luyện nghe, nói, đọc, viết qua các hoạt động nhóm và dự án nhỏ.",
    thumbnail_link: "https://via.placeholder.com/100x100?text=Grade+4",
    thumbnail_id: "thumb_4",
    category_course_id: 1,
    category_course_name: "Tiếng Anh cấp 1",
    classes: [
      {
        id: 201,
        name: "Lớp 4A",
        teacher: "Thầy Nguyễn Văn An",
        schedule: "Thứ 2,4,6 - 19:00-20:30",
        room: "Phòng 301",
        lessons: [
          { id: 8, title: "Buổi 1 - My school", date: "01/09/2026", time: "19:00-20:30" },
        ]
      }
    ]
  },
  3: {
    id: 3,
    name: "Tiếng Anh lớp 5 - 2026",
    year_course: 2026,
    total_students_registered: 26,
    total_students_dropped_out: 3,
    total_lessons: 48,
    listed_price: 3000000,
    discount: 0,
    description: "Chương trình tiếng Anh cho học sinh lớp 5 năm học 2025-2026, củng cố kiến thức nền tảng và chuẩn bị cho chương trình cấp 2. Đặc biệt chú trọng kỹ năng viết đoạn văn và thuyết trình đơn giản.",
    thumbnail_link: "https://via.placeholder.com/100x100?text=Grade+5",
    thumbnail_id: "thumb_5",
    category_course_id: 1,
    category_course_name: "Tiếng Anh cấp 1",
    classes: [
      {
        id: 301,
        name: "Lớp 5A",
        teacher: "Cô Vũ Thị Mai",
        schedule: "Thứ 3,5,7 - 17:00-18:30",
        room: "Phòng 401",
        lessons: []
      }
    ]
  }
};

// Dữ liệu mô tả chi tiết (có thể lấy từ API)
const courseDetailDescription = {
  "Đối tượng học viên": [
    "Dành cho học sinh lớp 3, phù hợp cả học sinh mới bắt đầu và đã có nền tảng cơ bản.",
    "Học sinh muốn cải thiện kỹ năng giao tiếp tiếng Anh và tự tin hơn khi trình bày."
  ],
  "Mục tiêu khóa học": [
    "Xây dựng nền tảng ngôn ngữ qua nghe, nói, đọc, viết với chủ đề gần gũi học sinh.",
    "Mở rộng vốn từ vựng theo từng chủ điểm và luyện phản xạ giao tiếp đơn giản."
  ],
  "Phương pháp giảng dạy": [
    "Học qua trò chơi, bài hát, video, truyện tranh và hoạt động đóng vai.",
    "Thực hành theo cặp, nhóm nhỏ để kích thích tương tác và phản xạ tiếng Anh."
  ],
  "Kết quả học tập và đánh giá": [
    "Học sinh có thể giới thiệu bản thân, trả lời câu hỏi quen thuộc và viết đoạn ngắn theo mẫu.",
    "Đánh giá định kỳ giúp nắm rõ tiến độ, và có báo cáo kết quả để phụ huynh theo dõi."
  ],
  "Giáo viên": [
    "Giáo viên giàu kinh nghiệm, chuyên môn tiếng Anh trẻ em và theo sát tiến độ từng học sinh."
  ],
  "Tài liệu học tập": [
    "Giáo trình phù hợp chương trình lớp 3, kèm phiếu bài tập và tài liệu ôn luyện.",
    "Tài nguyên học trực tuyến hỗ trợ mở rộng sau mỗi buổi học."
  ]
};

const CourseDetailsPage = () => {
  const { courseID } = useParams(); // Lấy courseID từ URL (khớp với route :courseID)
  const [selectedCourseId, setSelectedCourseId] = useState(courseID || '1');

  const course = useMemo(() => mockCoursesData[selectedCourseId], [selectedCourseId]);

  // Nếu không tìm thấy khóa học, hiển thị thông báo
  if (!course) {
    return (
      <Layout style={{ background: '#f5f7fa', padding: 24, minHeight: '100vh' }}>
        <Content>
          <Result
            status="404"
            title="Không tìm thấy khóa học"
            subTitle="Khóa học bạn yêu cầu không tồn tại hoặc đã bị xóa."
          />
        </Content>
      </Layout>
    );
  }

  const otherCourses = useMemo(() => {
    return Object.values(mockCoursesData).filter(c => c.id !== course.id);
  }, [course.id]);

  const classColumns = [
    {
      title: 'Lớp',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Giáo viên',
      dataIndex: 'teacher',
      key: 'teacher',
      render: (text) => <Space><UserOutlined /> {text}</Space>,
    },
    {
      title: 'Lịch học',
      dataIndex: 'schedule',
      key: 'schedule',
      render: (text) => <Space><CalendarOutlined /> {text}</Space>,
    },
    {
      title: 'Phòng học',
      dataIndex: 'room',
      key: 'room',
    },
    {
      title: 'Số buổi',
      key: 'lessonsCount',
      render: (_, record) => record.lessons?.length || 0,
    }
  ];

  const lessonColumns = [
    {
      title: 'Buổi',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Giờ học',
      dataIndex: 'time',
      key: 'time',
    },
  ];

  const expandedRowRender = (classRecord) => {
    if (!classRecord.lessons || classRecord.lessons.length === 0) {
      return <Empty description="Chưa có buổi học nào" />;
    }
    return (
      <Table
        columns={lessonColumns}
        dataSource={classRecord.lessons}
        pagination={false}
        size="small"
        rowKey="id"
        style={{ marginTop: 8 }}
      />
    );
  };

  return (
    <Layout style={{ background: '#f5f7fa', padding: 24, minHeight: '100vh' }}>
      <Content>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', background: '#ffffff' }}>
              <Row gutter={16} align="middle">
                <Col>
                  <Avatar
                    size={64}
                    shape="square"
                    src={course.thumbnail_link}
                    icon={<BookOutlined />}
                    style={{ borderRadius: 8 }}
                  />
                </Col>
                <Col flex="auto">
                  <Title level={4} style={{ marginBottom: 4 }}>{course.name}</Title>
                  <Space>
                    <Tag color="blue">{course.category_course_name}</Tag>
                    <Tag color="cyan">Năm học {course.year_course}</Tag>
                    <Badge count={`${course.total_lessons} buổi`} style={{ backgroundColor: '#1890ff' }} />
                  </Space>
                  <Paragraph style={{ marginTop: 8, color: '#666' }}>
                    {course.description}
                  </Paragraph>
                </Col>
              </Row>

              <Divider />

              <Tabs defaultActiveKey="1">
                <TabPane tab={<span><FileTextOutlined /> Mô tả</span>} key="1">
                  <div style={{ padding: '8px 0' }}>
                    <Row gutter={[16, 16]}>
                      {Object.entries(courseDetailDescription).map(([title, items], idx) => {
                        const bgColors = [
                          "#fff7e6", "#f6ffed", "#e6f7ff", "#fff0f6", "#f9f0ff", "#e8f5ff"
                        ];
                        const titleColors = [
                          "#d48806", "#389e0d", "#096dd9", "#d4380d", "#722ed1", "#13c2c2"
                        ];
                        return (
                          <Col key={title} xs={24} sm={12} md={8}>
                            <Card
                              hoverable
                              style={{
                                borderRadius: 20,
                                minHeight: 200,
                                background: bgColors[idx % bgColors.length],
                                border: 'none',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                                transition: 'all 0.3s',
                              }}
                              bodyStyle={{ padding: 20 }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
                                <div
                                  style={{
                                    width: 6,
                                    height: 30,
                                    borderRadius: 4,
                                    background: titleColors[idx % titleColors.length],
                                    marginRight: 12,
                                  }}
                                />
                                <Text strong style={{ fontSize: 16, color: titleColors[idx % titleColors.length] }}>
                                  {title}
                                </Text>
                              </div>
                              <Paragraph style={{ color: '#444', lineHeight: 1.8, marginBottom: 0 }}>
                                {items.map((item, i) => (
                                  <span key={i}>
                                    • {item}
                                    {i < items.length - 1 && <br />}
                                  </span>
                                ))}
                              </Paragraph>
                            </Card>
                          </Col>
                        );
                      })}
                    </Row>
                  </div>
                </TabPane>

                <TabPane tab="Danh sách lớp" key="2">
                  <Table
                    columns={classColumns}
                    dataSource={course.classes}
                    rowKey="id"
                    expandable={{
                      expandedRowRender,
                      expandIcon: ({ expanded, onExpand, record }) => (
                        <Button
                          type="link"
                          icon={expanded ? <DownOutlined /> : <RightOutlined />}
                          onClick={(e) => onExpand(record, e)}
                        />
                      )
                    }}
                    pagination={false}
                    size="middle"
                  />
                </TabPane>

                <TabPane tab="Giáo viên" key="3">
                  <List
                    dataSource={course.classes}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar icon={<UserOutlined />} style={{ backgroundColor: '#87d068' }} />}
                          title={<Text strong>{item.teacher}</Text>}
                          description={`Phụ trách ${item.name} - ${item.schedule}`}
                        />
                      </List.Item>
                    )}
                  />
                </TabPane>
              </Tabs>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card 
              style={{ 
                borderRadius: 16, 
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                background: '#ffffff'
              }}
              bodyStyle={{ padding: 20 }}
            >
              <Title level={5} style={{ color: '#2c3e50' }}>Thông tin khóa học</Title>
              <Descriptions column={1} size="small" bordered>
                <Descriptions.Item label="Danh mục">{course.category_course_name}</Descriptions.Item>
                <Descriptions.Item label="Năm học">{course.year_course}</Descriptions.Item>
                <Descriptions.Item label="Số buổi">{course.total_lessons}</Descriptions.Item>
                <Descriptions.Item label="Số lớp">{course.classes.length}</Descriptions.Item>
                <Descriptions.Item label="Học viên đăng ký">{course.total_students_registered}</Descriptions.Item>
                <Descriptions.Item label="Học viên bỏ học">{course.total_students_dropped_out}</Descriptions.Item>
                <Descriptions.Item label="Giá niêm yết">{course.listed_price.toLocaleString()} ₫</Descriptions.Item>
                {course.discount > 0 && (
                  <Descriptions.Item label="Giảm giá">{course.discount}%</Descriptions.Item>
                )}
                <Descriptions.Item label="Giá sau giảm">
                  <Text strong style={{ color: '#52c41a' }}>
                    {(course.listed_price * (1 - course.discount / 100)).toLocaleString()} ₫
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card 
              style={{ 
                borderRadius: 16, 
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                marginTop: 16,
                background: '#ffffff'
              }}
              bodyStyle={{ padding: 20 }}
              title={<span style={{ fontSize: 16, fontWeight: 600, color: '#2c3e50' }}>🌟 Khám phá khóa học khác</span>}
            >
              <List
                dataSource={otherCourses}
                renderItem={(item) => (
                  <List.Item 
                    style={{ cursor: 'pointer', padding: '12px 0' }}
                    onClick={() => setSelectedCourseId(item.id)}
                  >
                    <List.Item.Meta
                      avatar={<Avatar shape="square" size={48} src={item.thumbnail_link} icon={<BookOutlined />} />}
                      title={<Text strong style={{ color: '#1890ff' }}>{item.name}</Text>}
                      description={
                        <Space size={4}>
                          <Tag color="blue">{item.category_course_name}</Tag>
                          <Text type="secondary">{item.total_lessons} buổi</Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default CourseDetailsPage;