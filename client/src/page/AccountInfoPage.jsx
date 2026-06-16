import { useState } from "react";
import {
  Layout,
  Menu,
  Card,
  Avatar,
  Tabs,
  Form,
  Input,
  Button,
  Descriptions,
  Tag,
  Row,
  Col,
  message,
} from "antd";

import {
  UserOutlined,
  HomeOutlined,
  TeamOutlined,
  BookOutlined,
  CalendarOutlined,
  LockOutlined,
  EditOutlined,
  SaveOutlined,
} from "@ant-design/icons";

const { Sider, Content } = Layout;

const AccountInfoPage = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [user, setUser] = useState({
    fullName: "Trần Xuân Thủy",
    email: "thuy@gmail.com",
    phone: "0976127895",
    dob: "07/12/2005",
    gender: "Nam",
    address: "Hà Nội",
    role: "Nhân viên tư vấn",
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    message.success("Cập nhật thành công");
    setIsEditing(false);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* MENU TRÁI */}
      <Sider width={250}>
        <div
          style={{
            height: 64,
            color: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          English Center
        </div>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["5"]}
          items={[
            {
              key: "1",
              icon: <HomeOutlined />,
              label: "Trang chủ",
            },
            {
              key: "2",
              icon: <TeamOutlined />,
              label: "Lớp học",
            },
            {
              key: "3",
              icon: <BookOutlined />,
              label: "Khóa học",
            },
            {
              key: "4",
              icon: <CalendarOutlined />,
              label: "Lịch học",
            },
            {
              key: "5",
              icon: <UserOutlined />,
              label: "Thông tin cá nhân",
            },
          ]}
        />
      </Sider>

      {/* NỘI DUNG */}
      <Layout>
        <Content
          style={{
            padding: 24,
            background: "#f5f5f5",
          }}
        >
          <Card bodyStyle={{ padding: 0 }}>
            {/* Banner with overlaid Avatar */}
            <div
              style={{
                position: "relative",
                height: 200,
                background: "url('https://images.unsplash.com/photo-1580522868751-f5a12ef10c10?w=800') center/cover",
                borderRadius: "8px 8px 0 0",
              }}
            />

            {/* Header with Avatar and Info */}
            <div
              style={{
                padding: "0 40px 30px 40px",
                marginTop: "-80px",
                position: "relative",
              }}
            >
              <Row align="middle" gutter={20}>
                <Col>
                  <Avatar
                    size={120}
                    icon={<UserOutlined />}
                    style={{
                      border: "4px solid white",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                      backgroundColor: "#87d068",
                    }}
                  />
                </Col>

                <Col style={{ paddingTop: 30 }}>
                  <h1 style={{ margin: "0 0 5px 0" }}>{user.fullName}</h1>
                  <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
                    Nhân viên tư vấn 
                  </p>
                </Col>

                <Col flex="auto" />

                <Col style={{ paddingTop: 30 }}>
                  {!isEditing && (
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() =>
                        setIsEditing(true)
                      }
                    >
                      Chỉnh sửa
                    </Button>
                  )}
                </Col>
              </Row>

              <Tabs
                style={{ marginTop: 30 }}
                items={[
                  {
                    key: "1",
                    label: "Thông tin cá nhân",

                    children: !isEditing ? (
                      <Descriptions
                        bordered
                        column={1}
                      >
                        <Descriptions.Item label="Họ tên">
                          {user.fullName}
                        </Descriptions.Item>

                        <Descriptions.Item label="Email">
                          {user.email}
                        </Descriptions.Item>

                        <Descriptions.Item label="Số điện thoại">
                          {user.phone}
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày sinh">
                          {user.dob}
                        </Descriptions.Item>

                        <Descriptions.Item label="Giới tính">
                          {user.gender}
                        </Descriptions.Item>

                        <Descriptions.Item label="Địa chỉ">
                          {user.address}
                        </Descriptions.Item>

                        <Descriptions.Item label="Chức vụ">
                          <Tag color="blue">
                            {user.role}
                          </Tag>
                        </Descriptions.Item>
                      </Descriptions>
                    ) : (
                      <Form layout="vertical">
                        <Form.Item label="Họ tên">
                          <Input
                            name="fullName"
                            value={user.fullName}
                            onChange={handleChange}
                          />
                        </Form.Item>

                        <Form.Item label="Email">
                          <Input
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                          />
                        </Form.Item>

                        <Form.Item label="Số điện thoại">
                          <Input
                            name="phone"
                            value={user.phone}
                            onChange={handleChange}
                          />
                        </Form.Item>

                        <Form.Item label="Ngày sinh">
                          <Input
                            name="dob"
                            value={user.dob}
                            onChange={handleChange}
                          />
                        </Form.Item>

                        <Form.Item label="Giới tính">
                          <Input
                            name="gender"
                            value={user.gender}
                            onChange={handleChange}
                          />
                        </Form.Item>

                        <Form.Item label="Địa chỉ">
                          <Input
                            name="address"
                            value={user.address}
                            onChange={handleChange}
                          />
                        </Form.Item>

                        <Form.Item label="Chức vụ">
                          <Input
                            value={user.role}
                            disabled
                          />
                        </Form.Item>

                        <Button
                          type="primary"
                          icon={<SaveOutlined />}
                          onClick={handleSave}
                        >
                          Lưu
                        </Button>

                        <Button
                          style={{ marginLeft: 10 }}
                          onClick={() =>
                            setIsEditing(false)
                          }
                        >
                          Hủy
                        </Button>
                      </Form>
                    ),
                  },

                  {
                    key: "2",
                    label: "Đổi mật khẩu",

                    children: (
                      <Form layout="vertical">
                        <Form.Item label="Mật khẩu hiện tại">
                          <Input.Password />
                        </Form.Item>

                        <Form.Item label="Mật khẩu mới">
                          <Input.Password />
                        </Form.Item>

                        <Form.Item label="Nhập lại mật khẩu">
                          <Input.Password />
                        </Form.Item>

                        <Button
                          type="primary"
                          icon={<LockOutlined />}
                        >
                          Đổi mật khẩu
                        </Button>
                      </Form>
                    ),
                  },
                ]}
              />
            </div>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AccountInfoPage;