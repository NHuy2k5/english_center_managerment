import React from 'react';
import { Modal, Avatar, Typography, Row, Col, Card, Tag, Divider, Space } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, CheckCircleOutlined, WarningOutlined, CalendarOutlined, KeyOutlined, LockOutlined, IdcardOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const StudentInfoModal = ({ open, onClose, student }) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
    >
      {student && (
        <div style={{ margin: '-20px -24px -24px -24px', overflow: 'hidden', borderRadius: 8 }}>
          {/* HEADER BANNER */}
          <div style={{ height: 140, background: 'linear-gradient(135deg, #1677ff, #69b1ff)', position: 'relative' }} />
          
          {/* AVATAR OVERLAP */}
          <div style={{ padding: '0 32px 32px 32px', position: 'relative' }}>
            <Avatar
              size={100}
              style={{
                background: '#fff',
                color: '#1677ff',
                fontSize: 40,
                fontWeight: 'bold',
                position: 'absolute',
                top: -50,
                border: '4px solid #fff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              {student?.name?.trim().split(' ').pop()[0] || 'H'}
            </Avatar>
            
            {/* BASIC INFO */}
            <div style={{ marginLeft: 120, paddingTop: 12 }}>
              <Title level={3} style={{ margin: 0, color: '#0f1c3f' }}>{student.name}</Title>
              <Text type="secondary" style={{ fontSize: 14 }}>Mã HV: {student.id}</Text>
              <div style={{ marginTop: 8 }}>
                {student.tuitionOwed ? (
                  <Tag color="error" icon={<WarningOutlined />}>Nợ học phí</Tag>
                ) : (
                  <Tag color="success" icon={<CheckCircleOutlined />}>Đã đóng học phí</Tag>
                )}
                <Tag color="processing">Lớp {student.classCode || 'Chưa phân lớp'}</Tag>
              </div>
            </div>

            <Divider style={{ margin: '24px 0' }} />

            {/* DETAILS */}
            <Row gutter={[24, 24]}>
              <Col span={12}>
                <Card bordered={false} style={{ background: '#fafafa', borderRadius: 12 }}>
                  <Space align="start">
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f6ffed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#52c41a' }}>
                      <PhoneOutlined style={{ fontSize: 18 }} />
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>SĐT Học viên</Text>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{student.phone}</div>
                    </div>
                  </Space>
                </Card>
              </Col>
              <Col span={12}>
                <Card bordered={false} style={{ background: '#fafafa', borderRadius: 12 }}>
                  <Space align="start">
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#e6f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1677ff' }}>
                      <IdcardOutlined style={{ fontSize: 18 }} />
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Tài khoản học sinh</Text>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{student.username || 'Chưa cấp'}</div>
                      <div style={{ fontSize: 12, color: '#8c8c8c' }}><LockOutlined /> ******</div>
                    </div>
                  </Space>
                </Card>
              </Col>
              
              <Col span={12}>
                <Card bordered={false} style={{ background: '#fafafa', borderRadius: 12 }}>
                  <Space align="start">
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f9f0ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#722ed1' }}>
                      <CalendarOutlined style={{ fontSize: 18 }} />
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Ngày sinh</Text>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{student.dob || 'Chưa cập nhật'}</div>
                    </div>
                  </Space>
                </Card>
              </Col>
              <Col span={12}>
                <Card bordered={false} style={{ background: '#fafafa', borderRadius: 12 }}>
                  <Space align="start">
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#fff0f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#eb2f96' }}>
                      <MailOutlined style={{ fontSize: 18 }} />
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Email liên hệ</Text>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{student.email}</div>
                    </div>
                  </Space>
                </Card>
              </Col>
              
              <Col span={24}>
                <Card bordered={false} style={{ background: '#fffbe6', borderRadius: 12, border: '1px solid #ffe58f' }}>
                  <Space align="start" style={{ marginBottom: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#fff1b8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#faad14' }}>
                      <UserOutlined style={{ fontSize: 18 }} />
                    </div>
                    <div style={{ paddingTop: 8 }}>
                      <Text style={{ fontWeight: 600, fontSize: 15, color: '#d48806' }}>Thông tin Phụ huynh</Text>
                    </div>
                  </Space>
                  
                  <Row gutter={[16, 16]} style={{ paddingLeft: 48 }}>
                    <Col span={12}>
                      <Text type="secondary" style={{ fontSize: 12 }}>Họ và tên</Text>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#d48806' }}>{student.parentName}</div>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary" style={{ fontSize: 12 }}>Số điện thoại</Text>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#d48806' }}>{student.parentPhone}</div>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary" style={{ fontSize: 12 }}>Tài khoản</Text>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#d48806' }}>{student.parentUsername || 'Chưa cấp'}</div>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary" style={{ fontSize: 12 }}>Mật khẩu</Text>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#d48806' }}><LockOutlined /> ******</div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default StudentInfoModal;
