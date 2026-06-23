exports.transformSalary = (salary) => {
    const data = salary.toJSON();
    const result = {
        id: data.id,
        teacher_id: data.teacher_id,
        teacher_name: data.Teacher.teacher_user.full_name,
        total_lessons: data.total_lessons_teached,
        salary: data.monthly_salary,
        paid: data.is_teacher_paid
    };
    return result;
};