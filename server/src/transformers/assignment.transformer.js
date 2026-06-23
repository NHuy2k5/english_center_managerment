exports.transformAssignment = (assignment) => {
    const data = assignment.toJSON();
    const {Teacher, Lesson, ...assignmentData} = data;
    const {Class, ...lessonData} = Lesson;
     const result = {
        id: assignmentData.id,
        status: assignmentData.status
    };
    result.teacher.id = Teacher.id;
    result.teacher.full_name = Teacher.full_name
    result.lesson = {
        ...lessonData,
        class_name: Class.name,
    }
    return result;
};