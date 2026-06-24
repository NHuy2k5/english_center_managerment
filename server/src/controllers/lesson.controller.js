const { getLesson, getLessons, createLesson, updateLesson, deleteLesson } = require("../services/lesson.service");

const getLessonsController = async (req, res) => {
    try {
        const classID = Number(req.params.classID);
        const query = req.queryOptions;
        query.lesson.where = {
            ...query.class.where,
            class_id: classID
        }
        const {status, ...result} = await getLessons(query);
        if('data' in result) {
            return res.status(status).json(result);
        }
        return res.status(status).json(result);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const getLessonController = async (req, res) => {
    try {
        const id = Number(req.params.lessonID);
        const {status, ...result} = await getLesson(id);
        if('data' in result) {
            return res.status(status).json(result);
        }
        return res.status(status).json(result);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const addLessonController = async (req, res) => {
    try {
        const data = req.body;
        const classID = Number(req.params.classID);
        data.class_id = classID
        const {status, ...result} = await createLesson(data);
        if('data' in result) {
            return res.status(status).json(result);
        }
        return res.status(status).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const updateLessonController = async (req, res) => {
    try {
        const data = req.body;
        const id = Number(req.params.lessonID);
        const {status, ...result} = await updateLesson(data, id);
        if('data' in result) {
            return res.status(status).json(result);
        }
        return res.status(status).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {getLessonsController, getLessonController, addLessonController, updateLessonController}