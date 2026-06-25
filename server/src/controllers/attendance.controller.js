const {
    getClassAttendances,
    getLessonAttendance,
    updateLessonAttendance
} = require('../services/attendance.service');

// GET /classes/:classID/attendances
const getClassAttendancesController = async (req, res) => {
    try {
        const result = await getClassAttendances(req.params.classID);
        return res.status(result.status).json(
            result.data
                ? { data: result.data, message: result.message }
                : { message: result.message }
        );
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// GET /lessons/:lessonID/attendance
const getLessonAttendanceController = async (req, res) => {
    try {
        const result = await getLessonAttendance(req.params.lessonID);
        return res.status(result.status).json(
            result.data
                ? { data: result.data, message: result.message }
                : { message: result.message }
        );
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// PUT /lessons/:lessonID/attendance
const updateLessonAttendanceController = async (req, res) => {
    try {
        const { lessonID } = req.params;
        const { attendances } = req.body;

        if (!attendances?.length) {
            return res.status(400).json({
                message: 'attendances is required'
            });
        }

        const result = await updateLessonAttendance(lessonID, attendances);

        return res.status(result.status).json({ message: result.message });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getClassAttendancesController,
    getLessonAttendanceController,
    updateLessonAttendanceController
};