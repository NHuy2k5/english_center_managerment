exports.transformRegistration = (registration) => {
    const data = registration.toJSON();
     const result = {
        id: data.id,
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        address: data.address
    };
    if (data.category_course_id) {
        result.category_course_id = data.category_course_id;

        result.category_course = data.CategoryCourse
            ? {
                id: data.CategoryCourse.id,
                name: data.CategoryCourse.name
            }
            : null;
    }
    return result;
};