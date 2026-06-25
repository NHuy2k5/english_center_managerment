import React, { useState, useEffect } from 'react';
import { Modal, Typography, InputNumber, Button, Space, message as antMessage } from 'antd';
import { WalletOutlined, DollarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const TopUpModal = ({ open, onClose, parentName, currentBalance, requiredAmount, onSuccess }) => {
  const [amount, setAmount] = useState(requiredAmount);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (open) {
      setAmount(requiredAmount);
      setIsProcessing(false);
    }
  }, [open, requiredAmount]);

  const handleTopUp = () => {
    if (!amount || amount <= 0) {
      antMessage.error("Vui lòng nhập số tiền hợp lệ!");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      antMessage.success(`Đã nạp thành công ${amount.toLocaleString('vi-VN')} ₫ vào ví của phụ huynh ${parentName}`);
      onSuccess(amount);
    }, 1000);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={
        <Space>
          <WalletOutlined style={{ color: '#1677ff' }} />
          <span>Nạp tiền vào Ví</span>
        </Space>
      }
      centered
      width={400}
    >
      <div style={{ padding: '16px 0', textAlign: 'center' }}>
        <Text type="secondary">Phụ huynh: </Text>
        <Text strong>{parentName}</Text>
        <div style={{ marginTop: 8 }}>
          <Text type="secondary">Số dư hiện tại: </Text>
          <Text strong style={{ color: '#52c41a' }}>{(currentBalance || 0).toLocaleString('vi-VN')} ₫</Text>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 8, fontWeight: 500 }}>Số tiền nạp (₫):</div>
        <InputNumber
          style={{ width: '100%', fontSize: 18 }}
          size="large"
          min={10000}
          step={50000}
          value={amount}
          onChange={(val) => setAmount(val)}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
          addonBefore={<DollarOutlined />}
        />
        {amount < requiredAmount && (
          <Text type="danger" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
            Gợi ý: Cần nạp tối thiểu {requiredAmount.toLocaleString('vi-VN')} ₫ để đủ thanh toán hóa đơn.
          </Text>
        )}
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <Button size="large" onClick={onClose} style={{ flex: 1 }}>Hủy</Button>
        <Button 
          type="primary" 
          size="large" 
          onClick={handleTopUp} 
          loading={isProcessing}
          style={{ flex: 1 }}
        >
          Xác nhận Nạp
        </Button>
      </div>
    </Modal>
  );
};

export default TopUpModal;
