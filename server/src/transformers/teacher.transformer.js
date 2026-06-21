exports.transformTeacher = (teacher) => {
    const data = teacher.toJSON();
     const result = {
        id: data.id,
        ...data.teacher_user,
        balance: data.balance,
        description: data.description,
        thumbnail_link: data.thumbnail_link,
        thumbnail_id: data.thumbnail_id,
        status: data.status
    };
    return result;
};