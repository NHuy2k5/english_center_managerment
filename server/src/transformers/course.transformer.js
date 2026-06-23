exports.transformCourse = (course) => {
    const data = course.toJSON();
    const {course_in_category, ...courseData} = data;
     const result = {}
    if('category_course_id' in courseData && courseData.category_course_id !== null){
        result = {
            ...courseData
        }
        result.category_corse_name = course_in_category.name
    }
    else{
        result = {
            ...courseData
        }
    }
    return result;
};