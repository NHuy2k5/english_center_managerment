import React, { useState, useEffect } from "react";
import { Row, Col, Card, Typography, Space, Button, Badge, message as antMessage, Spin } from "antd";
import { ArrowRightOutlined, BookOutlined, GlobalOutlined, TrophyOutlined, CompassOutlined, TeamOutlined, DesktopOutlined } from "@ant-design/icons";
import MainLayout from "../layout/MainLayout";

const { Title, Text } = Typography;

const STYLES = [
  {
    icon: <BookOutlined />,
    color: "#ff7875",
    gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)",
  },
  {
    icon: <CompassOutlined />,
    color: "#69b1ff",
    gradient: "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)",
  },
  {
    icon: <TrophyOutlined />,
    color: "#ffc069",
    gradient: "linear-gradient(120deg, #f6d365 0%, #fda085 100%)",
  },
  {
    icon: <GlobalOutlined />,
    color: "#b37feb",
    gradient: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
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
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch("http://localhost:5002/api/v1/category-courses", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const json = await res.json();
        if (res.ok && json.data) {
          const formattedData = json.data.map((cat, index) => {
            const style = STYLES[index % STYLES.length];
            return {
              id: cat.id,
              title: cat.name,
              desc: "Quản lý các khóa học và lớp học thuộc danh mục " + cat.name,
              icon: style.icon,
              color: style.color,
              gradient: style.gradient,
              activeClasses: "?",
              students: "?"
            };
          });
          setCategories(formattedData);
        } else {
          antMessage.error(json.message || "Không thể tải danh sách chương trình");
        }
      } catch (err) {
        antMessage.error("Lỗi kết nối máy chủ");
      }
      setLoading(false);
    };
    fetchCategories();
  }, []);

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
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            {categories.map(cat => (
              <Col xs={24} sm={12} xl={6} key={cat.id}>
                <CategoryCard cat={cat} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </MainLayout>
  );
};

export default ClassPage;
