exports.transformClass = (cLass) => {
    const data = cLass.toJSON();
    const { Course, ...classData } = data;
    const result = {}
    if ('course_id' in classData && classData.course_id !== null) {
        result = {
            ...classData
        }
        result.course_name = Course.name
    }
    else {
        result = {
            ...classData
        }
    }
    return result;
};