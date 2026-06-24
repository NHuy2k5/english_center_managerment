exports.transformClass = (cLass) => {
    const data = cLass.toJSON();
    const { Course, ...classData } = data;
    const result = {
            ...classData
    };
    if ('course_id' in classData && classData.course_id !== null && Course) {
        result.course_name = Course.name
    }
    return result;
};