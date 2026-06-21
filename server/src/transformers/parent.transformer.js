exports.transformParent = (parent) => {
    const data = parent.toJSON();
     const result = {
        id: data.id,
        ...data.parent_user,
        balance: data.balance,
        students: []
    };
    if (data?.Student?.length) {
        data.Student.forEach((student) => {
            result.students.push({
                id: student.id,
                ...student.student_user
            });
        })
    }
    return result;
};