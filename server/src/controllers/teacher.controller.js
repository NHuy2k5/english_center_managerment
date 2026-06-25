const {getTeachers, getTeacher, createTeacher, updateTeacher, deleteTeacher} = require('../services/teacher.service')

const getTeachersController = async (req, res) => {
    try {
        const { status, ...result } = await getTeachers(req.queryOptions);

        if (!('data' in result)) {
            return res.status(status).json(result);
        }

        return res.status(status).json(result);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getTeacherController = async (req, res) => {
    try {
        const userRole = req.user?.role || '';
        const isAdmin = userRole === 'admin';

        const result = await getTeacher(req.params.teacherID);

        if (result.status === 404) {
            return res.status(404).json({ message: result.message });
        }

        // guest, parent, student, teacher không được xem teacher không public
        if (!isAdmin && result.data.status !== 'public') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        // Lọc field nếu không phải admin
        if (!isAdmin) {
            const { full_name, description, thumbnail_link, thumbnail_id, id } = result.data;
            return res.status(200).json({
                data: { id, full_name, description, thumbnail_link, thumbnail_id }
            });
        }

        return res.status(200).json({ data: result.data });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const addTeacherController = async (req, res) => {
    try {
        const data = req.body;
        const {status, ...result} = await createTeacher(data);
        if('data' in result) {
            return res.status(status).json(result);
        }
        return res.status(status).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const updateTeacherController = async (req, res) => {
    try {
        const data = req.body;
        const id = Number(req.params.teacherID);
        const {status, ...result} = await updateTeacher(data, id);
        if('data' in result) {
            return res.status(status).json(result);
        }
        return res.status(status).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const deleteTeacherController = async (req, res) => {
    try {
        const data = req.body;
        const id = Number(req.params.teacherID);
        const result = await deleteTeacher(id);
        return res.status(status).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {getTeachersController, getTeacherController, addTeacherController, updateTeacherController, deleteTeacherController}