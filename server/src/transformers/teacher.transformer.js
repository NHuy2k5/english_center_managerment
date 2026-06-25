exports.transformTeacher = (teacher) => {
    const data = teacher.toJSON();
    const {teacher_user,...teacherData} = data;
     const result = {
        ...teacherData,
        ...teacher_user,
    };
    return result;
};