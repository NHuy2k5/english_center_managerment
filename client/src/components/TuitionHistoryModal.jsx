import React, { useState } from 'react';
import { Modal, Typography, Row, Col, Card, Timeline, Tag, Avatar, Button, message as antMessage } from 'antd';
import { CheckCircleOutlined, DollarCircleOutlined, WarningOutlined } from '@ant-design/icons';
import PaymentConfirmModal from './PaymentConfirmModal';

const { Title, Text } = Typography;

const formatVND = (amount) => amount.toLocaleString("vi-VN") + " ₫";

const TuitionHistoryModal = ({ open, onClose, student }) => {
  if (!student) return null;

  const [paymentModalVisible, setPaymentModalVisible] = useState(false);

  // Mock timeline data
  const mockTimeline = [
    {
      date: "10/06/2026",
      status: "owe",
      amount: student.fee || 2800000,
      note: student.tuitionOwed ? "Chưa thanh toán (Quá hạn)" : "Hóa đơn tháng 6",
    },
    {
      date: "15/05/2026",
      status: "paid",
      amount: 2800000,
      note: "Đã thanh toán (Tiền mặt)",
    },
    {
      date: "10/04/2026",
      status: "paid",
      amount: 2800000,
      note: "Đã thanh toán (Chuyển khoản)",
    },
    {
      date: "12/03/2026",
      status: "paid",
      amount: 2800000,
      note: "Đã thanh toán (Tiền mặt)",
    }
  ];

  const totalPaid = mockTimeline.filter(t => t.status === "paid").reduce((sum, t) => sum + t.amount, 0);
  const totalOwed = student.tuitionOwed ? student.fee : 0;

  const mockPaymentRecord = {
    student_name: student.name,
    class_name: student.classCode || "N/A",
    course_name: "Khóa học hiện tại",
    balance: 0,
    actual_listed_tuition_fee: totalOwed,
    coupon: null,
    the_first_of_the_month: "2026-06-01",
    the_end_of_the_month: "2026-06-30",
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={500}
      centered
      styles={{
        content: { padding: 0, overflow: 'hidden', borderRadius: 16, border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }
      }}
    >
      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #eb2f96, #ff85c0)', padding: '24px', textAlign: 'center', color: '#fff', position: 'relative' }}>
        <Avatar size={64} style={{ background: '#fff', color: '#eb2f96', fontSize: 24, fontWeight: 'bold', marginBottom: 12 }}>
          <DollarCircleOutlined />
        </Avatar>
        <Title level={4} style={{ color: '#fff', margin: 0 }}>Lịch sử học phí</Title>
        <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>Học viên: {student.name}</Text>
        
        {totalOwed > 0 && (
          <Button 
            type="primary" 
            style={{ position: 'absolute', right: 24, top: 24, background: '#fff', color: '#eb2f96', fontWeight: 600, border: 'none', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            onClick={() => setPaymentModalVisible(true)}
          >
            Đóng tiền ngay
          </Button>
        )}
      </div>

      <div style={{ padding: '24px' }}>
        {/* SUMMARY CARDS */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={12}>
            <Card bordered={false} style={{ background: '#fff0f6', borderRadius: 12, textAlign: 'center' }}>
              <Text type="secondary" style={{ fontSize: 12, color: '#eb2f96' }}>Tổng đã nộp</Text>
              <div style={{ fontWeight: 700, fontSize: 18, color: '#eb2f96' }}>{formatVND(totalPaid)}</div>
            </Card>
          </Col>
          <Col span={12}>
            <Card bordered={false} style={{ background: totalOwed > 0 ? '#fff2f0' : '#f6ffed', borderRadius: 12, textAlign: 'center' }}>
              <Text type="secondary" style={{ fontSize: 12, color: totalOwed > 0 ? '#ff4d4f' : '#52c41a' }}>Còn nợ</Text>
              <div style={{ fontWeight: 700, fontSize: 18, color: totalOwed > 0 ? '#ff4d4f' : '#52c41a' }}>{formatVND(totalOwed)}</div>
            </Card>
          </Col>
        </Row>

        {/* TIMELINE */}
        <Title level={5} style={{ marginBottom: 16, color: '#0f1c3f' }}>Chi tiết giao dịch</Title>
        <Timeline
          style={{ marginTop: 16 }}
          items={mockTimeline.map((item, index) => ({
            color: item.status === "paid" ? "green" : "red",
            dot: item.status === "paid" ? <CheckCircleOutlined style={{ fontSize: '16px' }} /> : <WarningOutlined style={{ fontSize: '16px' }} />,
            children: (
              <div style={{ paddingBottom: index === mockTimeline.length - 1 ? 0 : 12 }}>
                <Row justify="space-between" align="middle">
                  <Col>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{item.date}</div>
                    <Text type="secondary" style={{ fontSize: 12 }}>{item.note}</Text>
                  </Col>
                  <Col>
                    <Tag color={item.status === "paid" ? "success" : "error"} style={{ fontWeight: 600, margin: 0, borderRadius: 6 }}>
                      {item.status === "paid" ? "+" : "-"}{formatVND(item.amount)}
                    </Tag>
                  </Col>
                </Row>
              </div>
            )
          }))}
        />
      </div>

      <PaymentConfirmModal 
        open={paymentModalVisible} 
        onClose={() => setPaymentModalVisible(false)} 
        paymentRecord={mockPaymentRecord} 
        onSuccess={() => {
          antMessage.success("Đã thanh toán học phí thành công từ Hồ sơ học viên!");
          setPaymentModalVisible(false);
          onClose();
        }} 
      />
    </Modal>
  );
};

export default TuitionHistoryModal;
