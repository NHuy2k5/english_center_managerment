exports.transformAttendance = (attendance) => {
    const data = attendance.toJSON();
    const result = {
        lesson_id: data.id,
        lesson_name: data.name,
        start: data.start,
        end: data.end,
        students: data.StudentLessons.map(sl => ({
            student_id: sl.Student.id,
            full_name: sl.Student.student_user.full_name,
            status: sl.status
        }))
    }
    return result;
};