const { getCourse, getCourses, createCourse, updateCourse } = require("../services/course.service");

const getCoursesController = async (req, res) => {
    try {
        const query = req.queryOptions;
        const {status, ...result} = await getCourses(query);
        if(!('data' in result)) {
            return res.status(status).json(result);
        }
        return res.status(status).json(result);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const getCourseController = async (req, res) => {
    try {
        const userRole = req.user?.role || '';
        const isPrivileged = userRole === 'admin' || userRole === 'teacher';

        const {status, ...result} = await getCourse(Number(req.params.courseID));

        if (!('data' in result)) {
            return res.status(status).json({ message: 'Course not found' });
        }

        // guest, parent, student không được xem khóa học không public
        if (!isPrivileged && result.data.status !== 'public') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        return res.status(200).json(result);

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const addCourseController = async (req, res) => {
    try {
        const data = req.body;
        const {status, ...result} = await createCourse(data);
        if('data' in result) {
            return res.status(status).json(result);
        }
        return res.status(status).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const updateCourseController = async (req, res) => {
    try {
        const data = req.body;
        const id = Number(req.params.courseID);
        const {status, ...result} = await updateCourse(data, id);
        if('data' in result) {
            return res.status(status).json(result);
        }
        return res.status(status).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
module.exports = {getCoursesController, getCourseController, addCourseController, updateCourseController}