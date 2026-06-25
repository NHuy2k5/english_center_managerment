import React from 'react';
import { Modal, Avatar, Typography, Row, Col, Card, Tag, Divider, Space } from 'antd';
import { PhoneOutlined, MailOutlined, BookOutlined, CheckCircleOutlined, WarningOutlined, IdcardOutlined, LockOutlined, CalendarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const TeacherInfoModal = ({ open, onClose, teacher }) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
    >
      {teacher && (
        <div style={{ margin: '-20px -24px -24px -24px', overflow: 'hidden', borderRadius: 8 }}>
          {/* HEADER BANNER */}
          <div style={{ height: 140, background: 'linear-gradient(135deg, #52c41a, #b7eb8f)', position: 'relative' }} />
          
          {/* AVATAR OVERLAP */}
          <div style={{ padding: '0 32px 32px 32px', position: 'relative' }}>
            <Avatar
              size={100}
              style={{
                background: '#fff',
                color: '#52c41a',
                fontSize: 40,
                fontWeight: 'bold',
                position: 'absolute',
                top: -50,
                border: '4px solid #fff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              {teacher?.name?.trim().split(' ').pop()[0] || 'T'}
            </Avatar>
            
            {/* BASIC INFO */}
            <div style={{ marginLeft: 120, paddingTop: 12 }}>
              <Title level={3} style={{ margin: 0, color: '#0f1c3f' }}>{teacher.name}</Title>
              <Text type="secondary" style={{ fontSize: 14 }}>Mã GV: {teacher.id}</Text>
              <div style={{ marginTop: 8 }}>
                {teacher.salaryPending ? (
                  <Tag color="warning" icon={<WarningOutlined />}>Chưa thanh toán lương</Tag>
                ) : (
                  <Tag color="success" icon={<CheckCircleOutlined />}>Đã thanh toán lương</Tag>
                )}
                <Tag color="processing">Đang giảng dạy</Tag>
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
                      <Text type="secondary" style={{ fontSize: 12 }}>Số điện thoại</Text>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{teacher.phone}</div>
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
                      <Text type="secondary" style={{ fontSize: 12 }}>Tài khoản giáo viên</Text>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{teacher.username || 'Chưa cấp'}</div>
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
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{teacher.dob || 'Chưa cập nhật'}</div>
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
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{teacher.email}</div>
                    </div>
                  </Space>
                </Card>
              </Col>
              
              <Col span={24}>
                <Card bordered={false} style={{ background: '#fafafa', borderRadius: 12 }}>
                  <Space align="start" style={{ marginBottom: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f9f0ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#722ed1' }}>
                      <BookOutlined style={{ fontSize: 18 }} />
                    </div>
                    <div style={{ paddingTop: 8 }}>
                      <Text style={{ fontWeight: 600, fontSize: 15 }}>Các lớp đang giảng dạy</Text>
                    </div>
                  </Space>
                  
                  <div style={{ paddingLeft: 48 }}>
                    {teacher.classes && teacher.classes.length > 0 ? (
                      teacher.classes.map((cls, idx) => (
                        <div key={idx} style={{ marginBottom: 8 }}>
                          <Tag color="purple">{cls.category}</Tag>
                          <Text strong style={{ marginLeft: 8 }}>{cls.names.join(", ")}</Text>
                        </div>
                      ))
                    ) : (
                      <Text type="secondary" italic>Giáo viên này chưa được phân lớp.</Text>
                    )}
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default TeacherInfoModal;
