const {
    createAssignment,
    deleteAssignment,
    changeTeacher,
    getAssignments,
    getAssignment
} = require('../services/assignment.service');

// GET /assignments
const getAssignmentsController = async (req, res) => {
    try {
        const { status, ...result } = await getAssignments(req.queryOptions);
        if (!('data' in result)) {
            return res.status(status).json(result);
        }
        return res.status(status).json(result);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// GET /assignments/:assignmentID
const getAssignmentController = async (req, res) => {
    try {
        const result = await getAssignment(req.params.assignmentID);
        return res.status(result.status).json(
            result.data
                ? { data: result.data, message: result.message }
                : { message: result.message }
        );
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// POST /assignments
const createAssignmentController = async (req, res) => {
    try {
        const { lesson_id, teacher_id, pay_per_lesson } = req.body;

        if (!lesson_id || !teacher_id) {
            return res.status(400).json({
                message: 'lesson_id, teacher_id are required'
            });
        }

        const result = await createAssignment({
            lesson_id,
            teacher_id,
            pay_per_lesson
        });

        return res.status(result.status).json(
            result.data
                ? { data: result.data, message: result.message }
                : { message: result.message }
        );
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// DELETE /assignments/:assignmentID
const deleteAssignmentController = async (req, res) => {
    try {
        const result = await deleteAssignment(req.params.assignmentID);
        return res.status(result.status).json({ message: result.message });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// PATCH /assignments/:assignmentID/change-teacher
const changeTeacherController = async (req, res) => {
    try {
        const { assignmentID } = req.params;
        const { new_teacher_id, pay_per_lesson } = req.body; // ✅ bỏ old_teacher_id

        if (!new_teacher_id) {
            return res.status(400).json({
                message: 'new_teacher_id is required'
            });
        }

        const result = await changeTeacher(
            { teacher_id: new_teacher_id, pay_per_lesson },
            assignmentID
        );

        if (result.status === 404) {
            return res.status(404).json({ message: result.message });
        }

        return res.status(result.status).json({ message: result.message });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAssignmentsController,
    getAssignmentController,
    createAssignmentController,
    deleteAssignmentController,
    changeTeacherController
};