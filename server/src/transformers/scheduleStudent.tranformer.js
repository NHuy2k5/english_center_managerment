exports.transformScheduleStudent = (schedule) => {
    const data = schedule.toJSON();
    const { Student, Lesson, ...scheduleData } = data;
    const { student_user } = Student;
    const result = {
        id: scheduleData.id,
        status: scheduleData.status,
        student: {
            id: Student.id,
            ...student_user
        },
    };
    const { Class, assignments, ...lessonData } = Lesson; // ✅ Assignments (số nhiều) theo Sequelize

    // Lấy assignment đầu tiên (1 lesson thường có 1 teacher)
    const assignment = assignments?.[0];

    result.lesson = {
        ...lessonData,
        class_name: Class?.name,
        teacher_id: assignment?.teacher_id || null,           // ✅ thêm vào lesson
        teacher_name: assignment?.Teacher?.teacher_user?.full_name || null // ✅
    };
    return result;
};