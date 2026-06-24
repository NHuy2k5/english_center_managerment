exports.transformSalary = (salary) => {
    const data = salary.toJSON();
    const result = {
        id: data.id,
        teacher_id: data.teacher_id,
        teacher_name: data.Teacher?.teacher_user?.full_name,
        the_first_of_the_month: data.the_first_of_the_month,
        the_end_of_the_month: data.the_end_of_the_month,
        total_lessons: data.total_lessons_teached,
        salary: data.monthly_salary,
        paid: data.is_teacher_paid
    };
    return result;
};