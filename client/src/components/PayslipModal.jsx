import React, { useState, useEffect } from 'react';
import { Modal, Typography, Space, Button, Divider, Row, Col, Avatar, message as antMessage } from 'antd';
import {
  BankOutlined,
  CheckCircleFilled,
  FileProtectOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const formatVND = (amount) => amount.toLocaleString("vi-VN") + " ₫";

const PayslipModal = ({ open, onClose, salaryRecord }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (open) {
      setIsSuccess(false);
      setIsProcessing(false);
    }
  }, [open, salaryRecord]);

  if (!salaryRecord) return null;

  const handleConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        antMessage.success(`Đã chi trả lương cho giáo viên ${salaryRecord.teacher_name}`);
        onClose();
      }, 1500);
    }, 1000);
  };

  // SUCCESS VIEW
  if (isSuccess) {
    return (
      <Modal
        open={open}
        footer={null}
        closable={false}
        centered
        width={360}
        styles={{ body: { padding: '40px 20px', textAlign: 'center' } }}
      >
        <CheckCircleFilled style={{ fontSize: 64, color: '#52c41a', marginBottom: 16 }} />
        <Title level={4} style={{ color: '#52c41a', margin: 0 }}>Giao dịch thành công!</Title>
        <Text type="secondary">Đã lưu lịch sử trả lương vào hệ thống.</Text>
      </Modal>
    );
  }

  // CONFIRMATION VIEW (Corporate Payslip Design)
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={480}
      styles={{ body: { padding: 0 } }}
      closable={false}
    >
      <div style={{ position: 'relative', background: '#f5f5f5', borderRadius: 16, overflow: 'hidden' }}>
        
        {/* Payslip Header */}
        <div style={{ background: 'linear-gradient(135deg, #722ed1, #531dab)', padding: '24px 24px 32px 24px', textAlign: 'center', color: '#fff' }}>
          <FileProtectOutlined style={{ fontSize: 32, marginBottom: 8 }} />
          <Title level={4} style={{ color: '#fff', margin: 0 }}>Phiếu xác nhận trả lương</Title>
        </div>

        {/* Payslip Body */}
        <div style={{ 
          background: '#fff', 
          margin: '0 16px 16px 16px', 
          padding: '24px', 
          borderRadius: 8, 
          marginTop: -20, 
          position: 'relative',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar size={48} style={{ background: '#f9f0ff', color: '#722ed1', fontWeight: 700 }}>
                {salaryRecord.teacher_name.split(" ").pop()[0]}
              </Avatar>
              <div>
                <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Giáo viên</Text>
                <div style={{ fontSize: 18, fontWeight: 600 }}>{salaryRecord.teacher_name}</div>
              </div>
            </div>

            <Divider style={{ margin: '8px 0' }} />

            <Row justify="space-between">
              <Col><Text type="secondary">Kỳ lương</Text></Col>
              <Col>
                <Text strong>
                  Từ {salaryRecord.the_first_of_the_month.split('-').reverse().join('/')} đến {salaryRecord.the_end_of_the_month.split('-').reverse().join('/')}
                </Text>
              </Col>
            </Row>

            <Row justify="space-between">
              <Col><Text type="secondary">Tổng số buổi dạy</Text></Col>
              <Col><Text strong>{salaryRecord.total_lessons_teached} buổi</Text></Col>
            </Row>

            <div style={{ background: '#fafafa', padding: 12, borderRadius: 8, marginTop: 8 }}>
              <Row justify="space-between" align="middle">
                <Col><Text strong style={{ fontSize: 16 }}>Thực lĩnh (VNĐ)</Text></Col>
                <Col><Text strong style={{ color: '#eb2f96', fontSize: 20 }}>{formatVND(salaryRecord.monthly_salary)}</Text></Col>
              </Row>
            </div>
          </Space>
        </div>

        {/* Footer Actions */}
        <div style={{ padding: '0 24px 24px 24px', display: 'flex', gap: 12 }}>
          <Button size="large" onClick={onClose} style={{ flex: 1 }}>Hủy</Button>
          
          <Button 
            type="primary" 
            size="large" 
            style={{ flex: 1, background: '#722ed1', borderColor: '#722ed1' }} 
            icon={<BankOutlined />}
            onClick={handleConfirm}
            loading={isProcessing}
          >
            Chuyển khoản & Xác nhận
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PayslipModal;
