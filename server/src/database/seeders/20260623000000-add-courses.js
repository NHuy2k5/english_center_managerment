'use strict';

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


/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
        */
        await queryInterface.bulkInsert('courses', [
            {
                name: 'Tiếng Anh Lớp 1',
                year_course: currentYear,
                description:
                    buildDescription(
                        'Học sinh lớp 1 (6–7 tuổi), mới làm quen với tiếng Anh.',
                        'Làm quen với bảng chữ cái, số đếm và từ vựng cơ bản.',
                        'Học qua trò chơi, bài hát và tranh ảnh.',
                        'Nhận biết từ vựng cơ bản và tự giới thiệu bản thân.',
                        'Giáo trình thiếu nhi, flashcard, video minh họa.',
                        'Đánh giá qua hoạt động trên lớp và báo cáo phụ huynh.'
                    ),
                thumbnail_link: null,
                thumbnail_id: null,
                category_course_id: 1,
                status: 'public',
                createdAt: new Date(),
                updatedAt: new Date()
            },

            {
                name: 'Tiếng Anh Lớp 3',
                year_course: currentYear,
                description:
                    buildDescription(
                        'Học sinh lớp 3.',
                        'Phát triển đồng đều 4 kỹ năng tiếng Anh.',
                        'Học qua dự án nhỏ, trò chơi và hoạt động nhóm.',
                        'Tự tin giao tiếp trong các tình huống quen thuộc.',
                        'Giáo trình chuẩn quốc tế và tài liệu bổ trợ.',
                        'Kiểm tra định kỳ và đánh giá kỹ năng toàn diện.'
                    ),
                thumbnail_link: null,
                thumbnail_id: null,
                category_course_id: 1,
                status: 'public',
                createdAt: new Date(),
                updatedAt: new Date()
            },

            {
                name: 'Tiếng Anh Lớp 5',
                year_course: currentYear,
                description:
                    buildDescription(
                        'Học sinh lớp 5.',
                        'Hoàn thiện nền tảng tiểu học và chuẩn bị THCS.',
                        'Học tích hợp 4 kỹ năng.',
                        'Giao tiếp cơ bản và đọc viết đoạn văn ngắn.',
                        'Giáo trình nâng cao và tài liệu chuyển cấp.',
                        'Đánh giá năng lực tổng hợp định kỳ.'
                    ),
                thumbnail_link: null,
                thumbnail_id: null,
                category_course_id: 1,
                status: 'public',
                createdAt: new Date(),
                updatedAt: new Date()
            },

            {
                name: 'Tiếng Anh Lớp 7',
                year_course: currentYear,
                description:
                    buildDescription(
                        'Học sinh lớp 7.',
                        'Nâng cao kỹ năng giao tiếp và đọc hiểu.',
                        'Học theo dự án và thảo luận nhóm.',
                        'Viết được bài luận ngắn theo chủ đề.',
                        'Giáo trình THCS nâng cao.',
                        'Đánh giá qua bài kiểm tra và dự án.'
                    ),
                thumbnail_link: null,
                thumbnail_id: null,
                category_course_id: 2,
                status: 'public',
                createdAt: new Date(),
                updatedAt: new Date()
            },

            {
                name: 'Tiếng Anh Lớp 9',
                year_course: currentYear,
                description:
                    buildDescription(
                        'Học sinh lớp 9.',
                        'Ôn tập kiến thức THCS và chuẩn bị thi chuyển cấp.',
                        'Luyện đề và hệ thống hóa kiến thức.',
                        'Nắm vững kiến thức THCS.',
                        'Bộ đề thi chuyển cấp và tài liệu trọng tâm.',
                        'Thi thử định kỳ và báo cáo kết quả.'
                    ),
                thumbnail_link: null,
                thumbnail_id: null,
                category_course_id: 2,
                status: 'public',
                createdAt: new Date(),
                updatedAt: new Date()
            },

            {
                name: 'Tiếng Anh Lớp 12',
                year_course: currentYear,
                description: buildDescription(
                    'Học sinh lớp 12.',
                    'Chuẩn bị kỳ thi tốt nghiệp THPT.',
                    'Luyện đề chuyên sâu và chiến lược làm bài.',
                    'Tăng tốc độ và độ chính xác khi làm bài thi.',
                    'Bộ đề THPT các năm và tài liệu ôn tập.',
                    'Thi thử thường xuyên và phân tích kết quả.'
                ),
                thumbnail_link: null,
                thumbnail_id: null,
                category_course_id: 3,
                status: 'public',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
         await queryInterface.bulkDelete(
            'Courses',
            {
                name: [
                    'Tiếng Anh Lớp 1',
                    'Tiếng Anh Lớp 3',
                    'Tiếng Anh Lớp 5',
                    'Tiếng Anh Lớp 7',
                    'Tiếng Anh Lớp 9',
                    'Tiếng Anh Lớp 12'
                ]
            }
        );
    }
};