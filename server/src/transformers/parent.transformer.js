exports.transformParent = (parent) => {
    const data = parent.toJSON();
     const result = {
        id: data.id,
        ...data.parent_user,
        balance: data.balance,
        students: []
    };
    if (data?.Students?.length) {
        data.Students.forEach((student) => {
            result.students.push({
                id: student.id,
                ...student.student_user
            });
        })
    }
    return result;
};