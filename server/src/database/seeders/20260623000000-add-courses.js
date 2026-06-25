// seeders/20260623000000-add-courses.js
'use strict';

const { Course, CategoryCourse } = require("../../models/index");
const currentYear = new Date().getFullYear();

const buildDescription = (
    targetStudents,
    objectives,
    methods,
    outcomes,
    materials,
    assessments
) => ({
    target_students: targetStudents,
    course_objectives: objectives,
    teaching_methods: methods,
    learning_outcomes: outcomes,
    learning_materials: materials,
    assessment_and_reports: assessments
});

const coursesData = [
    {
        name: 'Tiếng Anh Lớp 1',
        category: 1, // index của categoryCoursesData
        description: buildDescription(
            'Học sinh lớp 1 (6–7 tuổi), mới làm quen với tiếng Anh.',
            'Làm quen với bảng chữ cái, số đếm và từ vựng cơ bản.',
            'Học qua trò chơi, bài hát và tranh ảnh.',
            'Nhận biết từ vựng cơ bản và tự giới thiệu bản thân.',
            'Giáo trình thiếu nhi, flashcard, video minh họa.',
            'Đánh giá qua hoạt động trên lớp và báo cáo phụ huynh.'
        )
    },
    {
        name: 'Tiếng Anh Lớp 3',
        category: 1,
        description: buildDescription(
            'Học sinh lớp 3.',
            'Phát triển đồng đều 4 kỹ năng tiếng Anh.',
            'Học qua dự án nhỏ, trò chơi và hoạt động nhóm.',
            'Tự tin giao tiếp trong các tình huống quen thuộc.',
            'Giáo trình chuẩn quốc tế và tài liệu bổ trợ.',
            'Kiểm tra định kỳ và đánh giá kỹ năng toàn diện.'
        )
    },
    {
        name: 'Tiếng Anh Lớp 5',
        category: 1,
        description: buildDescription(
            'Học sinh lớp 5.',
            'Hoàn thiện nền tảng tiểu học và chuẩn bị THCS.',
            'Học tích hợp 4 kỹ năng.',
            'Giao tiếp cơ bản và đọc viết đoạn văn ngắn.',
            'Giáo trình nâng cao và tài liệu chuyển cấp.',
            'Đánh giá năng lực tổng hợp định kỳ.'
        )
    },
    {
        name: 'Tiếng Anh Lớp 7',
        category: 2,
        description: buildDescription(
            'Học sinh lớp 7.',
            'Nâng cao kỹ năng giao tiếp và đọc hiểu.',
            'Học theo dự án và thảo luận nhóm.',
            'Viết được bài luận ngắn theo chủ đề.',
            'Giáo trình THCS nâng cao.',
            'Đánh giá qua bài kiểm tra và dự án.'
        )
    },
    {
        name: 'Tiếng Anh Lớp 9',
        category: 2,
        description: buildDescription(
            'Học sinh lớp 9.',
            'Ôn tập kiến thức THCS và chuẩn bị thi chuyển cấp.',
            'Luyện đề và hệ thống hóa kiến thức.',
            'Nắm vững kiến thức THCS.',
            'Bộ đề thi chuyển cấp và tài liệu trọng tâm.',
            'Thi thử định kỳ và báo cáo kết quả.'
        )
    },
    {
        name: 'Tiếng Anh Lớp 12',
        category: 3,
        description: buildDescription(
            'Học sinh lớp 12.',
            'Chuẩn bị kỳ thi tốt nghiệp THPT.',
            'Luyện đề chuyên sâu và chiến lược làm bài.',
            'Tăng tốc độ và độ chính xác khi làm bài thi.',
            'Bộ đề THPT các năm và tài liệu ôn tập.',
            'Thi thử thường xuyên và phân tích kết quả.'
        )
    }
];

module.exports = {
    async up() {
        const now = new Date();

        const categories = await CategoryCourse.findAll({
            order: [['id', 'ASC']]
        });

        if (!categories.length) {
            throw new Error('No category courses found. Run category seeder first.');
        }

        for (const data of coursesData) {
            const category = categories[data.category - 1];

            await Course.create({
                name: data.name,
                year_course: currentYear,
                description: data.description, // ✅ setter tự JSON.stringify
                thumbnail_link: null,
                thumbnail_id: null,
                category_course_id: category?.id ?? null,
                status: 'public',
                created_at: now,
                updated_at: now
            });
        }
    },

    async down() {
        const names = coursesData.map(c => c.name);

        const { Op } = require('sequelize');
        await Course.destroy({
            where: {
                name: { [Op.in]: names }
            }
        });
    }
};