exports.transformAssignment = (assignment) => {
    const data = assignment.toJSON();
    const {Teacher, Lesson, ...assignmentData} = data;
    const {Class, ...lessonData} = Lesson;
     const result = {
        id: assignmentData.id,
        status: assignmentData.status
    };
    result.teacher = {
        id: Teacher.id,
        full_name: Teacher.teacher_user.full_name
    };
    result.lesson = {
        ...lessonData,
        class_name: Class.name,
    }
    return result;
};