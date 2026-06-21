exports.transformStudent = (student) => {
    const data = student.toJSON();
     const result = {
        id: data.id,
        ...data.student_user
    };
    if (data.parent_id) {
        result.parent_id = data.parent_id;

        result.parent = data.Parent
            ? {
                id: data.Parent.id,
                ...(data.Parent.parent_user || {})
            }
            : null;
    }
    return result;
};