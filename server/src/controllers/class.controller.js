const { getClass, getClasss, createClass, updateClass, addStudentOrTeacherToClass, removeStudentOrTeacherToClass } = require("../services/class.service");

const getClassesController = async (req, res) => {
    try {
        const courseID = Number(req.params.courseID);
        const query = req.queryOptions;
        query.class.where = {
            ...query.class.where,
            course_id: courseID
        }
        const {status, ...result} = await getClasss(query);
        if('data' in result) {
            return res.status(status).json(result);
        }
        return res.status(status).json(result);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const getClassController = async (req, res) => {
    try {
        const classID = Number(req.params.classID);
        const userRole = req.user?.role || '';
        const isPrivileged = userRole === 'admin' || userRole === 'teacher';
        const {status, ...result} = await getClass(classID);
        if(!('data' in result)) {
            return res.status(status).json(result);
        }
        // guest, parent, student không được xem lớp học đã đóng
        if (!isPrivileged && course.status !== 'closed') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        return res.status(status).json(result);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const addClassController = async (req, res) => {
    try {
        const courseID = Number(req.params.courseID);
        const data = req.body;
        data.course_id = courseID
        const {status, ...result} = await createClass(data);
        if('data' in result) {
            return res.status(status).json(result);
        }
        return res.status(status).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const updateClassController = async (req, res) => {
    try {
        const data = req.body;
        const {courseID, classID} = req.params;
        if('course_id' in data){
            data.course_id = courseID
        }
        const {status, ...result} = await updateClass(data, number(classID));
        if('data' in result) {
            return res.status(status).json(result);
        }
        return res.status(status).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const addToClass = async (req, res) => {
    try {
        const data = req.body;
        /*
        req.body: {
            user_id:...
        } 
        */
        const classID = Number(req.params.classID);
        if(!data.user){
            return res.status(400).json({
                message: 'user_id is required'
            });
        }
        const {status, ...result} = await addStudentOrTeacherToClass(classID, req.body.user_id);
        const businessErrors = [
            'Student already in this class',
            'Can not add student to this class because not lesson in class',
            'Can not add student to this class because this class is full',
        ];
        if (status === 404) {
            return res.status(status).json(result);
        }
        if (status === 400 && businessErrors.includes(result.message)) {
            return res.status(status).json(result);
        }
        if (status === 400) {
            return res.status(500).json(result);
        }
        return res.status(status).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
const removeFromClass = async (req, res) => {
    try {
        const data = req.body;
        /*
        req.body: {
            user_id:...
        } 
        */
        const classID = Number(req.params.classID);
        const {status, ...result} = await removeStudentOrTeacherToClass(classID, req.body.user_id);
        addStudentOrTeacherToClass(classID, req.body.user_id);
        const businessErrors = [
            'Student is not in class or left from this class',
            'Teacher is not in this class',
        ];;
        if (status === 404) {
            return res.status(status).json(result);
        }
        if (status === 400 && businessErrors.includes(result.message)) {
            return res.status(status).json(result);
        }
        if (status === 400) {
            return res.status(500).json(result);
        }
        return res.status(status).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
module.exports = {getClassesController, getClassController, addClassController, updateClassController, addToClass, removeFromClass}