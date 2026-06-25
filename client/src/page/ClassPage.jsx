import React, { useState } from "react";
import { Row, Col, Card, Typography, Space, Button, Badge } from "antd";
import { ArrowRightOutlined, BookOutlined, GlobalOutlined, TrophyOutlined, CompassOutlined, TeamOutlined, DesktopOutlined } from "@ant-design/icons";
import MainLayout from "../layout/MainLayout";

const { Title, Text } = Typography;

const classCategories = [
  {
    id: "primary",
    title: "Tiếng Anh Tiểu Học",
    desc: "Xây dựng nền tảng vững chắc, phát âm chuẩn ngay từ đầu cho các bé từ 6-11 tuổi.",
    icon: <BookOutlined />,
    color: "#ff7875",
    gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)",
    activeClasses: 5,
    students: 245
  },
  {
    id: "secondary",
    title: "Tiếng Anh THCS",
    desc: "Ngữ pháp chuyên sâu, kỹ năng toàn diện chuẩn bị cho kỳ thi chuyển cấp.",
    icon: <CompassOutlined />,
    color: "#69b1ff",
    gradient: "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)",
    activeClasses: 4,
    students: 310
  },
  {
    id: "high",
    title: "Tiếng Anh THPT",
    desc: "Đột phá điểm số, ôn thi Đại học với lộ trình cá nhân hóa.",
    icon: <TrophyOutlined />,
    color: "#ffc069",
    gradient: "linear-gradient(120deg, #f6d365 0%, #fda085 100%)",
    activeClasses: 3,
    students: 198
  },
  {
    id: "ielts",
    title: "Luyện thi IELTS",
    desc: "Chiến lược làm bài thực chiến, cam kết đầu ra 6.5+ với đội ngũ 8.0+",
    icon: <GlobalOutlined />,
    color: "#b37feb",
    gradient: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
    activeClasses: 4,
    students: 420
  }
];

import { useNavigate } from "react-router-dom";

const CategoryCard = ({ cat }) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/class/${cat.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid #f0f0f0",
        background: "#ffffff",
        boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.08)" : "0 2px 8px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.3s ease",
        cursor: "pointer",
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}
      bodyStyle={{ padding: "32px 24px", display: "flex", flexDirection: "column", flex: 1 }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: cat.color + "15",
          color: cat.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          marginBottom: 20,
          transition: "all 0.3s"
        }}
      >
        {cat.icon}
      </div>

      <Title level={4} style={{ color: "#0f1c3f", marginBottom: 12 }}>
        {cat.title}
      </Title>
      
      <Text style={{ color: "#595959", fontSize: 14, lineHeight: 1.5, flex: 1 }}>
        {cat.desc}
      </Text>

      <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
        <div style={{ background: "#f5f5f5", padding: "6px 10px", borderRadius: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <DesktopOutlined style={{ color: "#8c8c8c" }} />
          <Text style={{ color: "#262626", fontWeight: 500, fontSize: 13 }}>{cat.activeClasses} Lớp</Text>
        </div>
        <div style={{ background: "#f5f5f5", padding: "6px 10px", borderRadius: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <TeamOutlined style={{ color: "#8c8c8c" }} />
          <Text style={{ color: "#262626", fontWeight: 500, fontSize: 13 }}>{cat.students} HV</Text>
        </div>
      </div>
      
      <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 6, color: cat.color, fontWeight: 500 }}>
        Xem danh sách lớp <ArrowRightOutlined />
      </div>
    </Card>
  );
};

const ClassPage = () => {
  return (
    <MainLayout selectedKey="class" title="Quản lý Khóa học & Lớp học">
      <div style={{ padding: "0 10px" }}>
        {/* HEADER SECTION */}
        <div style={{ marginBottom: 24 }}>
          <Title level={3} style={{ color: "#0f1c3f", margin: "0 0 4px 0", fontWeight: 600 }}>
            Chương trình Đào tạo
          </Title>
          <Text style={{ color: "#8c8c8c", fontSize: 14 }}>
            Quản lý danh sách lớp học theo từng cấp độ và chương trình.
          </Text>
        </div>

        {/* CARDS GRID */}
        <Row gutter={[24, 24]}>
          {classCategories.map(cat => (
            <Col xs={24} sm={12} xl={6} key={cat.id}>
              <CategoryCard cat={cat} />
            </Col>
          ))}
        </Row>
      </div>
    </MainLayout>
  );
};

export default ClassPage;
