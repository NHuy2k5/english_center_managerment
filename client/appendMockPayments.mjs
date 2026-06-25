import fs from 'fs';

const filePath = './src/mockData.js';
let content = fs.readFileSync(filePath, 'utf8');

const mockPaymentsString = `

export const mockPayments = [
  {
    key: "1",
    student_name: "Nguyễn Thị Lan",
    class_name: "7A",
    the_first_of_the_month: "2026-06-01",
    the_end_of_the_month: "2026-06-30",
    total_reality_lessons: 12,
    actual_listed_tuition_fee: 3000000,
    coupon: { code: "SUMMER10", discount: 200000 },
    have_student_paid: false
  },
  {
    key: "2",
    student_name: "Trần Minh Khoa",
    class_name: "12C",
    the_first_of_the_month: "2026-06-01",
    the_end_of_the_month: "2026-06-30",
    total_reality_lessons: 8,
    actual_listed_tuition_fee: 2400000,
    coupon: null,
    have_student_paid: true
  },
  {
    key: "3",
    student_name: "Lê Thị Hoa",
    class_name: "3B",
    the_first_of_the_month: "2026-05-01",
    the_end_of_the_month: "2026-05-31",
    total_reality_lessons: 10,
    actual_listed_tuition_fee: 2500000,
    coupon: { code: "LOYAL5", discount: 100000 },
    have_student_paid: true
  },
  {
    key: "4",
    student_name: "Phạm Văn Đức",
    class_name: "8A",
    the_first_of_the_month: "2026-06-01",
    the_end_of_the_month: "2026-06-30",
    total_reality_lessons: 12,
    actual_listed_tuition_fee: 2800000,
    coupon: null,
    have_student_paid: false
  },
  {
    key: "5",
    student_name: "Hoàng Anh Tú",
    class_name: "11B",
    the_first_of_the_month: "2026-07-01",
    the_end_of_the_month: "2026-07-31",
    total_reality_lessons: 15,
    actual_listed_tuition_fee: 3750000,
    coupon: { code: "EARLYBIRD", discount: 250000 },
    have_student_paid: false
  }
];
`;

if (!content.includes('mockPayments')) {
  fs.writeFileSync(filePath, content + mockPaymentsString, 'utf8');
}
console.log("Appended mockPayments to mockData.js");
