import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, DatePicker, Row, Col, message } from "antd";
import dayjs from "dayjs";
import { EditOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

const EditSalaryModal = ({ open, onClose, salaryRecord }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && salaryRecord) {
      form.setFieldsValue({
        teacher_name: salaryRecord.teacher_name,
        date_range: [
          dayjs(salaryRecord.the_first_of_the_month),
          dayjs(salaryRecord.the_end_of_the_month)
        ],
        total_lessons_teached: salaryRecord.total_lessons_teached,
        monthly_salary: salaryRecord.monthly_salary,
      });
    }
  }, [open, salaryRecord, form]);

  const handleFinish = (values) => {
    console.log("Dữ liệu cập nhật bảng lương:", values);
    message.success("Đã cập nhật bảng lương thành công!");
    onClose();
  };

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#0f1c3f" }}>
          <EditOutlined style={{ color: "#1677ff" }} /> Chỉnh sửa Phiếu Lương
        </div>
      }
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Lưu thay đổi"
      cancelText="Hủy"
      centered
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} style={{ marginTop: 24 }}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="teacher_name" label="Tên Giáo viên" rules={[{ required: true }]}>
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="date_range" label="Kỳ lương" rules={[{ required: true }]}>
              <RangePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="total_lessons_teached" label="Số buổi dạy thực tế" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="monthly_salary" label="Tổng lương (VNĐ)" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EditSalaryModal;
