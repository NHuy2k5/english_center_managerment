exports.transformCourse = (course) => {
    const data = course.toJSON();
    const {course_in_category, ...courseData} = data;
    const result = {
        ...courseData
    }
    if('category_course_id' in courseData && courseData.category_course_id !== null && course_in_category){
        result.category_course_name = course_in_category.name
    }
    return result;
};