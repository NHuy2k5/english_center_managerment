exports.transformLesson = (lesson) => {
    const data = lesson.toJSON();
    const { Class, ...lessonData } = data;
    const result = {
        ...lessonData
    };
    if (Class) {
        result.class_name = Class.class_name
    }
    else {
        const { Class, ...lessonData } = Lesson;
        result.lesson = {
            ...lessonData,
            class_name: Class.name
        }
    }
    return result;
};