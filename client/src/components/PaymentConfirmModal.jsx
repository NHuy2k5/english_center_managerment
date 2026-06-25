import React, { useState, useEffect } from 'react';
import { Modal, Typography, Space, Button, Divider, Row, Col, Avatar, Tag, message as antMessage } from 'antd';
import {
  WalletOutlined,
  CheckCircleFilled,
  PlusCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import TopUpModal from './TopUpModal';

const { Title, Text } = Typography;

const formatVND = (amount) => amount.toLocaleString("vi-VN") + " ₫";

const PaymentConfirmModal = ({ open, onClose, paymentRecord }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [topUpModalOpen, setTopUpModalOpen] = useState(false);
  
  // Local state to simulate balance update after top-up
  const [localBalance, setLocalBalance] = useState(0);

  // Reset states when modal opens
  useEffect(() => {
    if (open) {
      setIsSuccess(false);
      setIsProcessing(false);
      setLocalBalance(paymentRecord?.balance || 0);
    }
  }, [open, paymentRecord]);

  const discount = paymentRecord?.coupon ? paymentRecord.coupon.discount : 0;
  const actualFee = (paymentRecord?.actual_listed_tuition_fee || 0) - discount;
  const balance = localBalance;
  const isSufficient = balance >= actualFee;
  const remainingBalance = balance - actualFee;

  const handleConfirm = () => {
    setIsProcessing(true);
    // Simulate API call delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      // Let it show success animation for 1.5s then close
      setTimeout(() => {
        antMessage.success("Thanh toán thành công!");
        onClose();
        // Here we would typically trigger a refresh of the parent data
      }, 1500);
    }, 1000);
  };

  const handleTopUp = () => {
    setTopUpModalOpen(true);
  };

  const handleTopUpSuccess = (amount) => {
    setLocalBalance(prev => prev + amount);
    setTopUpModalOpen(false);
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
        <Title level={4} style={{ color: '#52c41a', margin: 0 }}>Thanh toán thành công!</Title>
        <Text type="secondary">Hóa đơn đã được ghi nhận vào hệ thống.</Text>
      </Modal>
    );
  }

  // CONFIRMATION VIEW (Ticket-like design)
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={440}
      styles={{ body: { padding: 0 } }}
      closable={false}
    >
      {paymentRecord && (
        <div style={{ position: 'relative', background: '#f5f5f5', borderRadius: 16, overflow: 'hidden' }}>
          
          {/* Ticket Header */}
          <div style={{ background: 'linear-gradient(135deg, #1677ff, #0958d9)', padding: '24px 24px 32px 24px', textAlign: 'center', color: '#fff' }}>
            <FileTextOutlined style={{ fontSize: 32, marginBottom: 8 }} />
            <Title level={4} style={{ color: '#fff', margin: 0 }}>Xác nhận thanh toán</Title>
          </div>

          {/* Ticket Body */}
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
              {/* Invoice Details */}
              <div>
                <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Học viên</Text>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{paymentRecord.student_name} <Tag color="blue">{paymentRecord.class_name}</Tag></div>
                {paymentRecord.course_name && (
                  <div style={{ marginTop: 4 }}>
                    <Text type="secondary" style={{ fontSize: 13 }}>Khóa học: </Text>
                    <Text strong style={{ fontSize: 13, color: '#1677ff' }}>{paymentRecord.course_name}</Text>
                  </div>
                )}
              </div>

              <Row justify="space-between">
                <Col><Text type="secondary">Học phí gốc</Text></Col>
                <Col><Text>{formatVND(paymentRecord.actual_listed_tuition_fee)}</Text></Col>
              </Row>
              
              {discount > 0 && (
                <Row justify="space-between">
                  <Col><Text type="secondary">Giảm giá ({paymentRecord.coupon?.code})</Text></Col>
                  <Col><Text type="success">-{formatVND(discount)}</Text></Col>
                </Row>
              )}

              <Divider style={{ margin: '8px 0' }} dashed />

              <Row justify="space-between" align="middle">
                <Col><Text strong style={{ fontSize: 16 }}>Tổng phải nộp</Text></Col>
                <Col><Text strong style={{ color: '#ff4d4f', fontSize: 18 }}>{formatVND(actualFee)}</Text></Col>
              </Row>

              <Divider style={{ margin: '16px 0 8px 0' }} />

              {/* Wallet Details */}
              <div style={{ background: isSufficient ? '#f6ffed' : '#fff1f0', padding: 12, borderRadius: 8, border: `1px solid ${isSufficient ? '#b7eb8f' : '#ffa39e'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Avatar size="small" style={{ background: isSufficient ? '#52c41a' : '#ff4d4f' }}><WalletOutlined /></Avatar>
                  <Text strong>Ví của phụ huynh: {paymentRecord.parent_name}</Text>
                </div>
                
                <Row justify="space-between">
                  <Col><Text type="secondary">Số dư hiện tại</Text></Col>
                  <Col><Text strong>{formatVND(balance)}</Text></Col>
                </Row>

                <Row justify="space-between" style={{ marginTop: 4 }}>
                  <Col><Text type="secondary">Số dư sau thanh toán</Text></Col>
                  <Col>
                    {isSufficient ? (
                      <Text strong type="success">{formatVND(remainingBalance)}</Text>
                    ) : (
                      <Text strong type="danger">Thiếu {formatVND(Math.abs(remainingBalance))}</Text>
                    )}
                  </Col>
                </Row>
              </div>
            </Space>
          </div>

          {/* Footer Actions */}
          <div style={{ padding: '0 24px 24px 24px', display: 'flex', gap: 12 }}>
            <Button size="large" onClick={onClose} style={{ flex: 1 }}>Hủy</Button>
            
            {isSufficient ? (
              <Button 
                type="primary" 
                size="large" 
                style={{ flex: 1, background: '#52c41a', borderColor: '#52c41a' }} 
                icon={<CheckCircleFilled />}
                onClick={handleConfirm}
                loading={isProcessing}
              >
                Xác nhận
              </Button>
            ) : (
              <Button 
                type="primary" 
                size="large" 
                danger 
                style={{ flex: 1 }} 
                icon={<PlusCircleOutlined />}
                onClick={handleTopUp}
              >
                Nạp thêm tiền
              </Button>
            )}
          </div>
        </div>
      )}

      <TopUpModal 
        open={topUpModalOpen}
        onClose={() => setTopUpModalOpen(false)}
        parentName={paymentRecord?.parent_name}
        currentBalance={localBalance}
        requiredAmount={Math.abs(remainingBalance)}
        onSuccess={handleTopUpSuccess}
      />
    </Modal>
  );
};

export default PaymentConfirmModal;
