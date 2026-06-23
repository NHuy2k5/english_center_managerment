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
    email: "thuy@gmail.com",
    phone: "0976127895",
    address: "Hà Nội",
    // role values expected: 'student', 'parent', 'teacher', 'staff', ...
    role: "student",
    avatar: null,

    // new fields per requirement
    user_name: "thuy",
    full_name: "Trần Xuân Thủy",
    birthday: "2005-12-07",
    sex: "Nam",
    // avatar link/id used in API shapes
    avatar_link: null,
    avatar_id: "1",

    // parent object (only for students)
    parent: {
      id: 2,
      avatar_link: null,
      full_name: "Trần Thị Lan",
      avatar_id: 10,
    },

    // students array (only for parents)
    students: [
      {
        id: 3,
        avatar_link: null,
        full_name: "Nguyễn Văn A",
        avatar_id: 20,
      },
      {
        id: 4,
        avatar_link: null,
        full_name: "Lê Thị B",
        avatar_id: 21,
      },
    ],

    // optional fields for teacher/parent
    balance: 0,
    description: "",
    thumbnail_link: null,
    thumbnail_id: null,
    status: null,
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
      setUser((prev) => ({
        ...prev,
        avatar: imageUrl,
        // keep API-friendly fields in sync
        avatar_link: imageUrl,
        avatar_id: `av_${Date.now()}`,
      }));
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

  const getRoleLabel = (role) => {
    switch ((role || "").toLowerCase()) {
      case "student":
        return "Học sinh";
      case "parent":
        return "Phụ huynh";
      case "teacher":
        return "Giáo viên";
      case "staff":
        return "Nhân viên";
      default:
        return "Nhân viên tư vấn";
    }
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
                <h1 style={{ margin: "0 0 5px 0" }}>{user.full_name}</h1>
                <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
                  {getRoleLabel(user.role)}
                </p>
              </Col>

              {/* parent/student information is shown in the Thông tin cá nhân tab */}

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

            <div style={{ marginTop: 24 }}>
              {(user.role === "student" && user.parent) && (
                <div
                  style={{
                    padding: 20,
                    background: "#ffffff",
                    borderRadius: 12,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                  }}
                >
                  <div style={{ marginBottom: 16, fontSize: 16, fontWeight: 700 }}>
                    Thông tin phụ huynh
                  </div>
                  <Row align="middle" gutter={16}>
                    <Col>
                      <Avatar
                        size={80}
                        src={user.parent.avatar_link || undefined}
                        icon={<UserOutlined />}
                        style={{ border: "2px solid #f0f0f0" }}
                      />
                    </Col>
                    <Col>
                      <div style={{ fontSize: 18, fontWeight: 700 }}>{user.parent.full_name}</div>
                      <div style={{ fontSize: 14, color: "#666" }}>ID: {user.parent.id}</div>
                    </Col>
                  </Row>
                </div>
              )}

              {(user.role === "parent" && user.students && user.students.length > 0) && (
                <div
                  style={{
                    padding: 20,
                    background: "#ffffff",
                    borderRadius: 12,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                  }}
                >
                  <div style={{ marginBottom: 16, fontSize: 16, fontWeight: 700 }}>
                    Danh sách học sinh
                  </div>
                  <Row gutter={16}>
                    {user.students.map((s) => (
                      <Col key={s.id}>
                        <div
                          style={{
                            padding: 16,
                            minWidth: 140,
                            borderRadius: 12,
                            background: "#fafafa",
                            textAlign: "center",
                          }}
                        >
                          <Avatar
                            size={64}
                            src={s.avatar_link || undefined}
                            icon={<UserOutlined />}
                            style={{ border: "2px solid #f0f0f0" }}
                          />
                          <div style={{ marginTop: 12, fontWeight: 700 }}>{s.full_name}</div>
                          <div style={{ fontSize: 12, color: "#999" }}>ID: {s.id}</div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
            </div>

            <Tabs
              style={{ marginTop: 30 }}
              items={[
                {
                  key: "1",
                  label: "Thông tin cá nhân",
                  children: !isEditing ? (
                    <Descriptions bordered column={1}>
                      <Descriptions.Item label="User name">{user.user_name}</Descriptions.Item>
                      <Descriptions.Item label="Họ tên">{user.full_name}</Descriptions.Item>
                      <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                      <Descriptions.Item label="Số điện thoại">{user.phone}</Descriptions.Item>
                      <Descriptions.Item label="Ngày sinh">{user.birthday}</Descriptions.Item>
                      <Descriptions.Item label="Giới tính">{user.sex}</Descriptions.Item>
                      <Descriptions.Item label="Địa chỉ">{user.address}</Descriptions.Item>



                      {(user.role === "parent" || user.role === "teacher") && (
                        <Descriptions.Item label="Balance">{user.balance}</Descriptions.Item>
                      )}

                      {user.role === "teacher" && (
                        <>
                          <Descriptions.Item label="Description">{user.description}</Descriptions.Item>
                          <Descriptions.Item label="Thumbnail link">{user.thumbnail_link}</Descriptions.Item>
                          <Descriptions.Item label="Thumbnail ID">{user.thumbnail_id}</Descriptions.Item>
                          <Descriptions.Item label="Status">{user.status}</Descriptions.Item>
                        </>
                      )}

                      <Descriptions.Item label="Chức vụ">
                        <Tag color="blue">{getRoleLabel(user.role)}</Tag>
                      </Descriptions.Item>
                    </Descriptions>
                  ) : (
                    <Form layout="vertical">
                      <Form.Item label="User name">
                        <Input name="user_name" value={user.user_name} onChange={handleChange} />
                      </Form.Item>
                      <Form.Item label="Họ tên">
                        <Input name="full_name" value={user.full_name} onChange={handleChange} />
                      </Form.Item>
                      <Form.Item label="Email">
                        <Input name="email" value={user.email} onChange={handleChange} />
                      </Form.Item>
                      <Form.Item label="Số điện thoại">
                        <Input name="phone" value={user.phone} onChange={handleChange} />
                      </Form.Item>
                      <Form.Item label="Ngày sinh">
                        <Input name="birthday" value={user.birthday} onChange={handleChange} />
                      </Form.Item>
                      <Form.Item label="Giới tính">
                        <Input name="sex" value={user.sex} onChange={handleChange} />
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