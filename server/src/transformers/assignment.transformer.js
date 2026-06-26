exports.transformAssignment = (assignment) => {
    const data = assignment.toJSON();
    const { Teacher, assignment_lesson, ...assignmentData } = data; // ✅ đổi Lesson → assignment_lesson

    if (!assignment_lesson) {
        return {
            id: assignmentData.id,
            status: assignmentData.status,
            teacher: null,
            lesson: null
        };
    }

    const { Class, ...lessonData } = assignment_lesson; // ✅

    const result = {
        id: assignmentData.id,
        status: assignmentData.status
    };

    result.teacher = {
        id: Teacher?.id || null,
        full_name: Teacher?.teacher_user?.full_name || null
    };

    result.lesson = {
        ...lessonData,
        class_name: Class?.name || null
    };

    return result;
};