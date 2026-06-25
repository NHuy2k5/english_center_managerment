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
  CheckCircleOutlined,
  BankOutlined,
  IdcardOutlined,
  BookOutlined,
  PlusOutlined,
  MinusCircleOutlined
} from "@ant-design/icons";

const { Option } = Select;
const { Text } = Typography;

const AddTeacherDrawer = ({ open, onClose, editRecord }) => {
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    if (open) {
      if (editRecord) {
        form.setFieldsValue({
          fullName: editRecord.name,
          phone: editRecord.phone,
          email: editRecord.email,
          username: editRecord.username,
          password: editRecord.password,
          // Convert '12/04/1990' to dayjs inside if we want, but since it's mock, we might leave it or use dayjs(editRecord.dob, "DD/MM/YYYY") if imported dayjs
          // other fields can be left blank if not in mock data
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, editRecord, form]);

  // Quan sát mảng assignedClasses để lấy category của từng row
  const assignedClasses = Form.useWatch("assignedClasses", form) || [];

  const renderGradeOptions = (cat) => {
    switch (cat) {
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
    
    const username = `gv_${normalizedName}${randNum}`;
    const password = `${l1}${l2}${randNum}`;
    
    form.setFieldsValue({ username, password });
    message.success({
      content: `Đã tạo tài khoản: ${username} / ${password}`,
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
    });
  };

  const randomizeAvatar = () => {
    const randomId = Math.floor(Math.random() * 1000);
    setAvatarUrl(`https://api.dicebear.com/7.x/notionists/svg?seed=${randomId}&backgroundColor=f6ffed`);
  };

  const handleFinish = (values) => {
    console.log(editRecord ? "Cập nhật Giáo viên:" : "Dữ liệu Giáo viên mới:", { ...values, avatarUrl });
    message.success(editRecord ? "Cập nhật giáo viên thành công!" : "Thêm giáo viên thành công!");
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
          boxShadow: "0 10px 40px rgba(82, 196, 26, 0.15)", // Đổ bóng nhẹ màu xanh lá
          overflow: "hidden" 
        }, 
        body: { padding: "32px 32px 32px", maxHeight: "85vh", overflowY: "auto" } 
      }}
    >
      <div style={{ padding: "16px 32px", borderBottom: "1px solid #f0f0f0", background: "#fafafa", display: "flex", alignItems: "center", gap: 12 }}>
        <Avatar size={40} style={{ background: "#52c41a" }} icon={<UserOutlined />} />
        <Typography.Title level={4} style={{ margin: 0 }}>
          {editRecord ? "Chỉnh sửa Giáo viên" : "Thêm Giáo viên mới"}
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
                border: "3px solid #f6ffed"
              }}
            />
          </div>
          <Space>
            <Upload showUploadList={false} beforeUpload={() => false}>
              <Button icon={<UploadOutlined />} size="small" style={{ borderRadius: 6, borderColor: "#d9d9d9" }}>Tải ảnh lên</Button>
            </Upload>
            <Button icon={<SyncOutlined />} size="small" onClick={randomizeAvatar} style={{ borderRadius: 6, color: "#52c41a", borderColor: "#52c41a" }}>Ngẫu nhiên</Button>
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
              <Input size="large" placeholder="Ví dụ: gv_nguyenvana123" prefix={<UserOutlined style={{ color: "#722ed1" }} />} style={inputStyle} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="password" label={<span style={{ fontWeight: 500 }}>Mật khẩu</span>} rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
              <Input.Password size="large" placeholder="Mật khẩu..." prefix={<LockOutlined style={{ color: "#722ed1" }} />} style={inputStyle} />
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
            <Form.Item name="address" label={<span style={{ fontWeight: 500 }}>Địa chỉ</span>}>
              <Input size="large" placeholder="Số nhà, đường, quận/huyện..." prefix={<HomeOutlined style={{ color: "#13c2c2" }} />} style={inputStyle} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="sex" label={<span style={{ fontWeight: 500 }}>Giới tính</span>} initialValue="male">
              <Radio.Group style={{ marginTop: 6 }}>
                <Radio value="male">Nam</Radio>
                <Radio value="female">Nữ</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        {/* ── FINANCIAL INFO (SALARY) ───────────────────────── */}
        <Divider orientation="left" style={{ margin: "12px 0 24px 0", color: "#eb2f96", borderColor: "#e8e8e8" }}>
          <BankOutlined style={{ marginRight: 8 }} /> Thông tin Nhận lương
        </Divider>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="cccd" label={<span style={{ fontWeight: 500 }}>Số CCCD</span>} rules={[{ required: true, message: 'Vui lòng nhập CCCD!' }]}>
              <Input size="large" placeholder="Ví dụ: 001099123456" prefix={<IdcardOutlined style={{ color: "#eb2f96" }} />} style={inputStyle} />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item name="bankName" label={<span style={{ fontWeight: 500 }}>Ngân hàng</span>} rules={[{ required: true, message: 'Vui lòng chọn ngân hàng!' }]}>
              <Select size="large" showSearch placeholder="Tìm và chọn ngân hàng" style={inputStyle}>
                {[
                  "SBV (Ngân hàng Nhà nước)", "Vietcombank", "VietinBank", "BIDV", "Agribank", "MB", "Techcombank", "VPBank", "ACB", "Sacombank", "HDBank", "SHB", "VIB", "TPBank", "MSB", "OCB", "SeABank", "LienVietPostBank (LPBank)", "Eximbank", "PVcomBank", "Bac A Bank", "Nam A Bank", "VietBank", "Kienlongbank", "Viet Capital Bank (BVBank)", "ABBANK", "OceanBank", "GPBank", "CBBank", "Saigonbank", "BAOVIET Bank", "PGBank", "SCB", "DongA Bank", "VRB", "Indovina Bank", "HSBC", "Standard Chartered", "Shinhan Bank", "Woori Bank", "UOB", "Public Bank", "CIMB", "HLBVN", "VBSP", "VDB", "Co-opBank"
                ].map((bank) => (
                  <Option key={bank} value={bank}>{bank}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="accountName" label={<span style={{ fontWeight: 500 }}>Tên người nhận</span>} rules={[{ required: true, message: 'Vui lòng nhập tên người nhận!' }]}>
              <Input size="large" placeholder="Ví dụ: NGUYEN VAN A" style={inputStyle} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="bankAccount" label={<span style={{ fontWeight: 500 }}>Số tài khoản</span>} rules={[{ required: true, message: 'Vui lòng nhập STK!' }]}>
              <Input size="large" placeholder="Ví dụ: 0123456789" style={inputStyle} />
            </Form.Item>
          </Col>
        </Row>

        {/* ── CLASS ASSIGNMENT ──────────────────────────────── */}
        <Divider orientation="left" style={{ margin: "12px 0 24px 0", color: "#faad14", borderColor: "#e8e8e8" }}>
          <BookOutlined style={{ marginRight: 8 }} /> Phân công Lớp giảng dạy
        </Divider>
        <Form.List name="assignedClasses">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => {
                const category = assignedClasses[name]?.category;
                const showClassName = ["primary", "secondary", "high"].includes(category);
                return (
                  <div key={key} style={{ background: "#fbfbfb", padding: 16, borderRadius: 8, marginBottom: 16, position: "relative" }}>
                    <Button 
                      type="text" 
                      danger 
                      icon={<MinusCircleOutlined />} 
                      onClick={() => remove(name)}
                      style={{ position: "absolute", top: 8, right: 8 }}
                    />
                    <Row gutter={24}>
                      <Col span={showClassName ? 8 : 12}>
                        <Form.Item
                          {...restField}
                          name={[name, 'category']}
                          label={<span style={{ fontWeight: 500 }}>Chương trình</span>}
                          rules={[{ required: true, message: 'Chọn CT!' }]}
                        >
                          <Select size="large" placeholder="Chọn loại lớp" style={inputStyle} onChange={() => {
                            // Reset các trường phụ thuộc khi đổi category
                            const currentClasses = form.getFieldValue("assignedClasses");
                            currentClasses[name].grade = undefined;
                            currentClasses[name].className = undefined;
                            form.setFieldsValue({ assignedClasses: currentClasses });
                          }}>
                            <Option value="primary">Tiểu học</Option>
                            <Option value="secondary">THCS</Option>
                            <Option value="high">THPT</Option>
                            <Option value="ielts">IELTS</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={showClassName ? 8 : 12}>
                        <Form.Item
                          {...restField}
                          name={[name, 'grade']}
                          label={<span style={{ fontWeight: 500 }}>{category === "ielts" ? "Trình độ" : "Khối lớp"}</span>}
                          rules={[{ required: true, message: 'Chọn Khối/TĐ!' }]}
                        >
                          <Select size="large" placeholder={category === "ielts" ? "Chọn trình độ" : "Chọn khối"} disabled={!category} style={inputStyle}>
                            {renderGradeOptions(category)}
                          </Select>
                        </Form.Item>
                      </Col>
                      {showClassName && (
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, 'className']}
                            label={<span style={{ fontWeight: 500 }}>Tên lớp</span>}
                            rules={[{ required: true, message: 'Chọn lớp!' }]}
                          >
                            <Select size="large" placeholder="Chọn tên lớp" style={inputStyle}>
                              <Option value="A">Lớp A</Option>
                              <Option value="B">Lớp B</Option>
                              <Option value="C">Lớp C</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                      )}
                    </Row>
                  </div>
                );
              })}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{ height: 40, borderRadius: 8 }}>
                  Thêm lớp giảng dạy
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

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

export default AddTeacherDrawer;
