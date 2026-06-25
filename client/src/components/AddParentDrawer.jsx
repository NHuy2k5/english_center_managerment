import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Button,
  Space,
  Row,
  Col,
  Divider,
  Avatar,
  message,
  Typography,
  Upload
} from "antd";
import {
  UserOutlined,
  UploadOutlined,
  SyncOutlined,
  LockOutlined,
  PhoneOutlined,
  DollarOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";

const { Text } = Typography;

const AddParentDrawer = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState(null);

  const generateCredentials = () => {
    const fullName = form.getFieldValue("fullName");
    if (!fullName) {
      message.warning("Vui lòng nhập Họ và tên ở mục dưới trước khi tạo tài khoản!");
      return;
    }
    
    const normalizedName = fullName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D')
      .toLowerCase()
      .replace(/\s+/g, '');
      
    const randNum = Math.floor(Math.random() * 90 + 10);
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const l1 = letters.charAt(Math.floor(Math.random() * letters.length));
    const l2 = letters.charAt(Math.floor(Math.random() * letters.length));
    
    const username = `${normalizedName}${randNum}`;
    const password = `${l1}${l2}${randNum}`;
    
    form.setFieldsValue({ username, password });
    message.success({
      content: `Đã tạo tài khoản: ${username} / ${password}`,
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
    });
  };

  const randomizeAvatar = () => {
    const randomId = Math.floor(Math.random() * 1000);
    setAvatarUrl(`https://api.dicebear.com/7.x/notionists/svg?seed=${randomId}&backgroundColor=e6f4ff`);
  };

  const handleFinish = (values) => {
    console.log("Dữ liệu Phụ huynh mới:", { ...values, avatarUrl });
    message.success("Thêm phụ huynh thành công!");
    form.resetFields();
    setAvatarUrl(null);
    onClose();
  };

  const handleCancel = () => {
    form.resetFields();
    setAvatarUrl(null);
    onClose();
  };

  const inputStyle = { borderRadius: 8, boxShadow: "0 2px 6px rgba(0,0,0,0.03)" };

  return (
    <Modal
      title={null}
      width={720}
      centered
      onCancel={handleCancel}
      open={open}
      footer={null}
      style={{ top: 20 }}
      styles={{ 
        content: { 
          borderRadius: 16, 
          boxShadow: "0 10px 40px rgba(82, 196, 26, 0.15)", // Đổ bóng xanh lá
          overflow: "hidden" 
        }, 
        body: { padding: "32px 32px 32px" } 
      }}
    >
      <Form layout="vertical" form={form} onFinish={handleFinish} requiredMark="optional">
        {/* ── AVATAR ───────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 32 }}>
          <div style={{ position: "relative", width: 90, height: 90, marginBottom: 16 }}>
            <Avatar
              size={90}
              src={avatarUrl}
              icon={!avatarUrl && <UserOutlined />}
              style={{ 
                backgroundColor: avatarUrl ? "transparent" : "#bfbfbf",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                border: "3px solid #f6ffed"
              }}
            />
          </div>
          <Space>
            <Upload
              showUploadList={false}
              beforeUpload={(file) => {
                const isImage = file.type.startsWith('image/');
                if (!isImage) {
                  message.error('Chỉ hỗ trợ tải lên file hình ảnh!');
                  return false;
                }
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (e) => {
                  const img = new Image();
                  img.src = e.target.result;
                  img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_SIZE = 400;
                    let width = img.width;
                    let height = img.height;
                    if (width > height) {
                      if (width > MAX_SIZE) {
                        height *= MAX_SIZE / width;
                        width = MAX_SIZE;
                      }
                    } else {
                      if (height > MAX_SIZE) {
                        width *= MAX_SIZE / height;
                        height = MAX_SIZE;
                      }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
                    setAvatarUrl(compressedBase64);
                    message.success("Tải ảnh và tối ưu hóa thành công!");
                  };
                };
                return false;
              }}
            >
              <Button icon={<UploadOutlined />} size="small" style={{ borderRadius: 6, borderColor: "#d9d9d9" }}>Tải ảnh lên</Button>
            </Upload>
            <Button icon={<SyncOutlined />} size="small" onClick={randomizeAvatar} style={{ borderRadius: 6, color: "#52c41a", borderColor: "#52c41a" }}>Ngẫu nhiên</Button>
          </Space>
        </div>

        {/* ── ACCOUNT INFO ──────────────────────────────────── */}
        <Divider orientation="left" style={{ margin: "0 0 16px 0", color: "#52c41a", borderColor: "#e8e8e8" }}>
          <LockOutlined style={{ marginRight: 8 }} /> Thông tin Đăng nhập
        </Divider>
        <div style={{ textAlign: "right", marginBottom: 16 }}>
          <Button size="small" type="dashed" onClick={generateCredentials} icon={<SyncOutlined />} style={{ color: "#52c41a", borderColor: "#52c41a" }}>
            Tạo tự động
          </Button>
        </div>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="username" label={<span style={{ fontWeight: 500 }}>Tên đăng nhập</span>} rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}>
              <Input size="large" placeholder="Ví dụ: phuhuynh123" prefix={<UserOutlined style={{ color: "#52c41a" }} />} style={inputStyle} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="password" label={<span style={{ fontWeight: 500 }}>Mật khẩu</span>} rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
              <Input.Password size="large" placeholder="Mật khẩu..." prefix={<LockOutlined style={{ color: "#52c41a" }} />} style={inputStyle} />
            </Form.Item>
          </Col>
        </Row>

        {/* ── PERSONAL & FINANCE INFO ─────────────────────────────────── */}
        <Divider orientation="left" style={{ margin: "12px 0 24px 0", color: "#13c2c2", borderColor: "#e8e8e8" }}>
          <UserOutlined style={{ marginRight: 8 }} /> Thông tin Cá nhân & Số dư
        </Divider>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item name="fullName" label={<span style={{ fontWeight: 500 }}>Họ và tên</span>} rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
              <Input size="large" placeholder="Ví dụ: Lê Văn Thành" prefix={<UserOutlined style={{ color: "#13c2c2" }} />} style={inputStyle} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="phone" label={<span style={{ fontWeight: 500 }}>Số điện thoại</span>} rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
              <Input size="large" placeholder="Ví dụ: 0912345678" prefix={<PhoneOutlined style={{ color: "#13c2c2" }} />} style={inputStyle} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="balance" label={<span style={{ fontWeight: 500 }}>Số dư (VNĐ)</span>} initialValue={0} rules={[{ required: true, message: 'Vui lòng nhập số dư!' }]}>
              <InputNumber 
                size="large" 
                style={{ width: "100%", ...inputStyle }} 
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                prefix={<DollarOutlined style={{ color: "#52c41a", marginRight: 8 }} />} 
                min={0}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* ── FOOTER ACTIONS ────────────────────────────────── */}
        <div style={{ textAlign: "center", marginTop: 16, paddingTop: 24, borderTop: "1px solid #f0f0f0" }}>
          <Space size="large">
            <Button onClick={handleCancel} style={{ borderRadius: 8, padding: "0 24px", height: 40, fontWeight: 500 }}>
              Hủy bỏ
            </Button>
            <Button type="primary" onClick={() => form.submit()} style={{ background: "#52c41a", borderColor: "#52c41a", borderRadius: 8, padding: "0 32px", height: 40, fontWeight: 500, boxShadow: "0 4px 12px rgba(82, 196, 26, 0.4)" }}>
              Hoàn tất
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

export default AddParentDrawer;
