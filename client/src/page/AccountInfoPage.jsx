import { useState } from "react";
import {
  Layout,
  Card,
  Avatar,
  Upload,
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

const { Content } = Layout;

const AccountInfoPage = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [passwordForm] = Form.useForm();

  const [user, setUser] = useState({
    fullName: "Trần Xuân Thủy",
    email: "thuy@gmail.com",
    phone: "0976127895",
    dob: "07/12/2005",
    gender: "Nam",
    address: "Hà Nội",
    role: "Nhân viên tư vấn",
    avatar: null,
  });

  // helper to convert file to base64 for preview
  const getBase64 = (file, cb) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => cb(reader.result));
    reader.readAsDataURL(file);
  };

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

  const handleAvatarUpload = ({ file, onSuccess }) => {
    // convert to base64 and set as user avatar
    getBase64(file, (imageUrl) => {
      setUser((prev) => ({ ...prev, avatar: imageUrl }));
      onSuccess && onSuccess("ok");
    });
  };

  const handlePasswordChange = (values) => {
    const { currentPassword, newPassword, confirmPassword } = values;
    if (newPassword !== confirmPassword) {
      passwordForm.setFields([
        {
          name: "confirmPassword",
          errors: ["Mật khẩu không khớp"],
        },
      ]);
      return;
    }

    // Placeholder: perform actual password change logic here
    message.success("Đổi mật khẩu thành công");
    passwordForm.resetFields();
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
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
              background:
                "url('https://images.unsplash.com/photo-1580522868751-f5a12ef10c10?w=800') center/cover",
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
                <Upload
                  showUploadList={false}
                  accept="image/*"
                  customRequest={handleAvatarUpload}
                  beforeUpload={(file) => {
                    const isImg = file.type.startsWith("image/");
                    if (!isImg) {
                      message.error("Bạn chỉ được phép tải ảnh lên!");
                    }
                    return isImg || Upload.LIST_IGNORE;
                  }}
                >
                  <Avatar
                    size={120}
                    src={user.avatar}
                    icon={<UserOutlined />}
                    style={{
                      border: "4px solid white",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                      backgroundColor: "#87d068",
                      cursor: "pointer",
                    }}
                  />
                </Upload>
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
                    onClick={() => setIsEditing(true)}
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
                    <Descriptions bordered column={1}>
                      <Descriptions.Item label="Họ tên">{user.fullName}</Descriptions.Item>
                      <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                      <Descriptions.Item label="Số điện thoại">{user.phone}</Descriptions.Item>
                      <Descriptions.Item label="Ngày sinh">{user.dob}</Descriptions.Item>
                      <Descriptions.Item label="Giới tính">{user.gender}</Descriptions.Item>
                      <Descriptions.Item label="Địa chỉ">{user.address}</Descriptions.Item>
                      <Descriptions.Item label="Chức vụ">
                        <Tag color="blue">{user.role}</Tag>
                      </Descriptions.Item>
                    </Descriptions>
                  ) : (
                    <Form layout="vertical">
                      <Form.Item label="Họ tên">
                        <Input name="fullName" value={user.fullName} onChange={handleChange} />
                      </Form.Item>
                      <Form.Item label="Email">
                        <Input name="email" value={user.email} onChange={handleChange} />
                      </Form.Item>
                      <Form.Item label="Số điện thoại">
                        <Input name="phone" value={user.phone} onChange={handleChange} />
                      </Form.Item>
                      <Form.Item label="Ngày sinh">
                        <Input name="dob" value={user.dob} onChange={handleChange} />
                      </Form.Item>
                      <Form.Item label="Giới tính">
                        <Input name="gender" value={user.gender} onChange={handleChange} />
                      </Form.Item>
                      <Form.Item label="Địa chỉ">
                        <Input name="address" value={user.address} onChange={handleChange} />
                      </Form.Item>
                      <Form.Item label="Chức vụ">
                        <Input value={user.role} disabled />
                      </Form.Item>

                      <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
                        Lưu
                      </Button>
                      <Button style={{ marginLeft: 10 }} onClick={() => setIsEditing(false)}>
                        Hủy
                      </Button>
                    </Form>
                  ),
                },
                {
                  key: "2",
                  label: "Đổi mật khẩu",
                  children: (
                    <Form form={passwordForm} layout="vertical" onFinish={handlePasswordChange}>
                      <Form.Item
                        name="currentPassword"
                        label="Mật khẩu hiện tại"
                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại" }]}
                      >
                        <Input.Password />
                      </Form.Item>

                      <Form.Item
                        name="newPassword"
                        label="Mật khẩu mới"
                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới" }, { min: 6, message: "Mật khẩu ít nhất 6 ký tự" }]}
                      >
                        <Input.Password />
                      </Form.Item>

                      <Form.Item
                        name="confirmPassword"
                        label="Nhập lại mật khẩu"
                        rules={[{ required: true, message: "Vui lòng nhập lại mật khẩu" }]}
                      >
                        <Input.Password />
                      </Form.Item>

                      <Button type="primary" htmlType="submit" icon={<LockOutlined />}>
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
  );
};

export default AccountInfoPage;