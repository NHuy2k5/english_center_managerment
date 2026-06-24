import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Input, Button, message, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import styled from "styled-components";
import axios from "axios";

const { Title, Text } = Typography;

// ===== Styled Components =====
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f0f2f5;
`;

const LoginCard = styled.div`
  background: #fff;
  padding: 40px 32px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const StyledButton = styled(Button)`
  width: 100%;
  margin-top: 8px;
`;

const ForgotLink = styled.div`
  text-align: right;
  margin-top: 8px;
  a {
    color: #1890ff;
  }
`;
// ===============================

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { identifier, password } = values;
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/auth/signin", {
        name_sign_up: identifier,
        password: password,
      });
      const { access_token, refresh_token, user_id } = response.data;

      // Lưu token
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("user_id", user_id);

      message.success("Đăng nhập thành công!");
      // Chuyển đến trang chủ (bạn có thể đổi thành "/dashboard" hoặc "/")
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      message.error(error.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <LoginCard>
        <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
          Đăng nhập
        </Title>
        <Form name="login" onFinish={onFinish} size="large">
          <Form.Item
            name="identifier"
            rules={[{ required: true, message: "Vui lòng nhập email, số điện thoại hoặc tên đăng nhập!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email / Số điện thoại / Tên đăng nhập" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>

          <ForgotLink>
            <Link to="/forgot-password">Quên mật khẩu?</Link>
          </ForgotLink>

          <Form.Item>
            <StyledButton type="primary" htmlType="submit" loading={loading}>
              Đăng nhập
            </StyledButton>
          </Form.Item>
        </Form>
        {/* Nếu bạn có trang đăng ký, thêm link */}
        {/* <div style={{ textAlign: "center" }}>
          <Text>Chưa có tài khoản? <Link to="/register">Đăng ký</Link></Text>
        </div> */}
      </LoginCard>
    </Container>
  );
};

export default LoginPage;