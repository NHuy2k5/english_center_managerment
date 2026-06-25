import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, DatePicker, Select, Row, Col, message } from "antd";
import dayjs from "dayjs";
import { EditOutlined } from "@ant-design/icons";

const { Option } = Select;
const { RangePicker } = DatePicker;

const EditPaymentModal = ({ open, onClose, paymentRecord }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && paymentRecord) {
      form.setFieldsValue({
        student_name: paymentRecord.student_name,
        class_name: paymentRecord.class_name,
        course_name: paymentRecord.course_name,
        date_range: [
          dayjs(paymentRecord.the_first_of_the_month),
          dayjs(paymentRecord.the_end_of_the_month)
        ],
        total_reality_lessons: paymentRecord.total_reality_lessons,
        actual_listed_tuition_fee: paymentRecord.actual_listed_tuition_fee,
        coupon_code: paymentRecord.coupon?.code || "",
        coupon_discount: paymentRecord.coupon?.discount || 0,
      });
    }
  }, [open, paymentRecord, form]);

  const handleFinish = (values) => {
    console.log("Dữ liệu cập nhật hóa đơn:", values);
    message.success("Đã cập nhật hóa đơn học phí thành công!");
    onClose();
  };

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#0f1c3f" }}>
          <EditOutlined style={{ color: "#1677ff" }} /> Chỉnh sửa Hóa đơn Học phí
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
            <Form.Item name="student_name" label="Tên Học viên" rules={[{ required: true }]}>
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="class_name" label="Lớp học" rules={[{ required: true }]}>
              <Select>
                <Option value="10A">10A</Option>
                <Option value="3B">3B</Option>
                <Option value="8A">8A</Option>
                <Option value="11B">11B</Option>
                <Option value="12C">12C</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="course_name" label="Chương trình/Trình độ" rules={[{ required: true }]}>
              <Select>
                <Option value="pre ielts">Pre IELTS</Option>
                <Option value="4.5-5.5">4.5-5.5</Option>
                <Option value="5.5-6.5">5.5-6.5</Option>
                <Option value="6.5+">6.5+</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="date_range" label="Kỳ thu học phí" rules={[{ required: true }]}>
              <RangePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="total_reality_lessons" label="Số buổi thực tế" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} min={1} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="actual_listed_tuition_fee" label="Học phí (VNĐ)" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="coupon_code" label="Mã Giảm giá">
              <Input placeholder="Ví dụ: EARLYBIRD" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="coupon_discount" label="Số tiền giảm (VNĐ)">
              <InputNumber style={{ width: "100%" }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EditPaymentModal;
