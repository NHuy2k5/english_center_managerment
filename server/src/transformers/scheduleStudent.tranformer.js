exports.transformSheduleStudent = (schedule) => {
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
    const { Class, Assignment, ...lessonData } = Lesson;
    result.lesson = {
        ...lessonData,
        class_name: Class?.name
    };
    if (Assignment) {
        result.teacher = {
            id: Assignment.teacher_id,
            full_name: Assignment.Teacher?.teacher_user?.full_name
        }
    }
    return result;
};