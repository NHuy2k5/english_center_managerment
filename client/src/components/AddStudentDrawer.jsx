import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Radio,
  Space,
  Row,
  Col,
  Divider,
  Avatar,
  message,
  Checkbox,
  Typography,
  Upload
} from "antd";
import {
  UserOutlined,
  UploadOutlined,
  SyncOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";
import { mockStudents } from "../mockData";

const { Option } = Select;

const AddStudentDrawer = ({ open, onClose, editRecord }) => {
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState(null);

  // Extract unique parents from mockStudents
  const uniqueParents = React.useMemo(() => {
    const parents = {};
    mockStudents.forEach(student => {
      if (student.parentPhone && student.parentName) {
        parents[student.parentPhone] = {
          name: student.parentName,
          phone: student.parentPhone
        };
      }
    });
    return Object.values(parents);
  }, []);

  // Watch for category change to dynamically render class options
  const selectedCategory = Form.useWatch("category", form);

  // Reset dependent fields when category changes, but ignore if we are in edit mode initialization
  useEffect(() => {
    if (!editRecord) {
      form.setFieldsValue({ grade: undefined, className: undefined });
    }
  }, [selectedCategory, form, editRecord]);

  useEffect(() => {
    if (open) {
      if (editRecord) {
        form.setFieldsValue({
          fullName: editRecord.name,
          phone: editRecord.phone,
          email: editRecord.email,
          username: editRecord.username,
          password: editRecord.password,
          parentName: editRecord.parentName,
          parentPhone: editRecord.parentPhone,
          parentUsername: editRecord.parentUsername,
          parentPassword: editRecord.parentPassword,
          // Convert some fields to match the UI, e.g. classCode to category/grade/className
          // Since it's mock data, we might not have all fields perfectly mapped
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, editRecord, form]);

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
    console.log(editRecord ? "Cập nhật dữ liệu:" : "Thêm mới dữ liệu:", { ...values, avatarUrl });
    message.success(editRecord ? "Cập nhật học viên thành công!" : "Thêm học viên thành công!");
    form.resetFields();
    setAvatarUrl(null);
    onClose();
  };

  const handleCancel = () => {
    form.resetFields();
    setAvatarUrl(null);
    onClose();
  };

  // Logic to render grade options based on category
  const renderGradeOptions = () => {
    switch (selectedCategory) {
      case "primary":
        return [1, 2, 3, 4, 5].map((g) => <Option key={g} value={g}>Lớp {g}</Option>);
      case "secondary":
        return [6, 7, 8, 9].map((g) => <Option key={g} value={g}>Lớp {g}</Option>);
      case "high":
        return [10, 11, 12].map((g) => <Option key={g} value={g}>Lớp {g}</Option>);
      case "ielts":
        return ["Pre IELTS", "4.5 - 5.5", "5.5 - 6.5", "6.5+"].map((lvl) => (
          <Option key={lvl} value={lvl}>{lvl}</Option>
        ));
      default:
        return null;
    }
  };

  const showClassName = ["primary", "secondary", "high"].includes(selectedCategory);

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
          boxShadow: "0 10px 40px rgba(22, 119, 255, 0.15)", // Đổ bóng nhẹ màu xanh
          overflow: "hidden" 
        }
      }}
    >
      <div style={{ padding: "16px 32px", borderBottom: "1px solid #f0f0f0", background: "#fafafa", display: "flex", alignItems: "center", gap: 12 }}>
        <Avatar size={40} style={{ background: "#1677ff" }} icon={<UserOutlined />} />
        <Typography.Title level={4} style={{ margin: 0 }}>
          {editRecord ? "Chỉnh sửa Học viên" : "Thêm Học viên mới"}
        </Typography.Title>
      </div>
      <Form layout="vertical" form={form} onFinish={handleFinish} requiredMark="optional" style={{ padding: "24px 32px" }}>
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
                border: "3px solid #e6f4ff"
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
                    const MAX_SIZE = 400; // Resize & compress ảnh
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
                return false; // Tránh gọi API upload mặc định
              }}
            >
              <Button icon={<UploadOutlined />} size="small" style={{ borderRadius: 6, borderColor: "#d9d9d9" }}>Tải ảnh lên</Button>
            </Upload>
            <Button icon={<SyncOutlined />} size="small" onClick={randomizeAvatar} style={{ borderRadius: 6, color: "#1677ff", borderColor: "#1677ff" }}>Ngẫu nhiên</Button>
          </Space>
        </div>

        {/* ── ACCOUNT INFO ──────────────────────────────────── */}
        <Divider orientation="left" style={{ margin: "0 0 16px 0", color: "#722ed1", borderColor: "#e8e8e8" }}>
          <LockOutlined style={{ marginRight: 8 }} /> Thông tin Đăng nhập
        </Divider>
        <div style={{ textAlign: "right", marginBottom: 16 }}>
          <Button size="small" type="dashed" onClick={generateCredentials} icon={<SyncOutlined />} style={{ color: "#722ed1", borderColor: "#722ed1" }}>
            Tạo tự động
          </Button>
        </div>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="username" label={<span style={{ fontWeight: 500 }}>Tên đăng nhập</span>} rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}>
              <Input size="large" placeholder="Ví dụ: nguyenvana123" prefix={<UserOutlined style={{ color: "#1677ff" }} />} style={inputStyle} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="password" label={<span style={{ fontWeight: 500 }}>Mật khẩu</span>} rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
              <Input.Password size="large" placeholder="Mật khẩu..." prefix={<LockOutlined style={{ color: "#1677ff" }} />} style={inputStyle} />
            </Form.Item>
          </Col>
        </Row>

        {/* ── PERSONAL INFO ─────────────────────────────────── */}
        <Divider orientation="left" style={{ margin: "12px 0 24px 0", color: "#13c2c2", borderColor: "#e8e8e8" }}>
          <UserOutlined style={{ marginRight: 8 }} /> Thông tin Cá nhân
        </Divider>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="fullName" label={<span style={{ fontWeight: 500 }}>Họ và tên</span>} rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
              <Input size="large" placeholder="Ví dụ: Nguyễn Văn A" style={inputStyle} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="birthday" label={<span style={{ fontWeight: 500 }}>Ngày sinh</span>} rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}>
              <DatePicker size="large" style={{ width: "100%", ...inputStyle }} format="DD/MM/YYYY" placeholder="Chọn ngày sinh" />
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
            <Form.Item name="email" label={<span style={{ fontWeight: 500 }}>Email</span>} rules={[{ required: true, message: 'Vui lòng nhập email!' }]}>
              <Input size="large" placeholder="Ví dụ: abc@gmail.com" prefix={<MailOutlined style={{ color: "#13c2c2" }} />} style={inputStyle} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={16}>
            <Form.Item name="address" label={<span style={{ fontWeight: 500 }}>Địa chỉ</span>} rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
              <Input size="large" placeholder="Số nhà, đường, quận/huyện..." prefix={<HomeOutlined style={{ color: "#13c2c2" }} />} style={inputStyle} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="sex" label={<span style={{ fontWeight: 500 }}>Giới tính</span>} initialValue="male">
              <Radio.Group style={{ marginTop: 6 }}>
                <Radio value="male">Nam</Radio>
                <Radio value="female">Nữ</Radio>
                <Radio value="other">Khác</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        {/* ── PARENT LINK ───────────────────────────────────── */}
        <Divider orientation="left" style={{ margin: "12px 0 24px 0", color: "#faad14", borderColor: "#e8e8e8" }}>
          <UserOutlined style={{ marginRight: 8 }} /> Thông tin Phụ huynh
        </Divider>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item name="parentPhone" label={<span style={{ fontWeight: 500 }}>Liên kết Phụ huynh</span>} rules={[{ required: true, message: 'Vui lòng chọn phụ huynh!' }]}>
              <Select
                showSearch
                placeholder="Gõ để tìm kiếm phụ huynh theo tên hoặc SĐT..."
                style={{ width: "100%", ...inputStyle }}
                allowClear
                size="large"
                options={uniqueParents.map(p => ({
                  label: `${p.phone} - ${p.name}`,
                  value: p.phone
                }))}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>
        </Row>

        {/* ── CLASS ASSIGNMENT ──────────────────────────────── */}
        <Divider orientation="left" style={{ margin: "12px 0 24px 0", color: "#f5222d", borderColor: "#e8e8e8" }}>
          <HomeOutlined style={{ marginRight: 8 }} /> Xếp lớp ban đầu
        </Divider>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="category" label={<span style={{ fontWeight: 500 }}>Chương trình</span>} rules={[{ required: true, message: 'Vui lòng chọn chương trình!' }]}>
              <Select size="large" placeholder="Chọn loại lớp" style={inputStyle}>
                <Option value="primary">Tiểu học</Option>
                <Option value="secondary">THCS</Option>
                <Option value="high">THPT</Option>
                <Option value="ielts">IELTS</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="grade" label={<span style={{ fontWeight: 500 }}>{selectedCategory === "ielts" ? "Trình độ" : "Khối lớp"}</span>} rules={[{ required: true, message: 'Vui lòng chọn thông tin!' }]}>
              <Select size="large" placeholder={selectedCategory === "ielts" ? "Chọn trình độ" : "Chọn khối"} disabled={!selectedCategory} style={inputStyle}>
                {renderGradeOptions()}
              </Select>
            </Form.Item>
          </Col>
          {showClassName && (
            <Col span={8}>
              <Form.Item name="className" label={<span style={{ fontWeight: 500 }}>Tên lớp</span>} rules={[{ required: true, message: 'Vui lòng chọn lớp!' }]}>
                <Select size="large" placeholder="Chọn tên lớp" style={inputStyle}>
                  <Option value="A">Lớp A</Option>
                  <Option value="B">Lớp B</Option>
                  <Option value="C">Lớp C</Option>
                </Select>
              </Form.Item>
            </Col>
          )}
        </Row>

        {/* ── FOOTER ACTIONS ────────────────────────────────── */}
        <div style={{ textAlign: "center", marginTop: 16, paddingTop: 24, borderTop: "1px solid #f0f0f0" }}>
          <Space size="large">
            <Button onClick={handleCancel} style={{ borderRadius: 8, padding: "0 24px", height: 40, fontWeight: 500 }}>
              Hủy bỏ
            </Button>
            <Button type="primary" onClick={() => form.submit()} style={{ borderRadius: 8, padding: "0 32px", height: 40, fontWeight: 500, boxShadow: "0 4px 12px rgba(22, 119, 255, 0.4)" }}>
              Hoàn tất
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

export default AddStudentDrawer;
