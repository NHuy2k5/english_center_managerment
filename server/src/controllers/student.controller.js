const { getStudent, getStudents, createStudent, updateStudent, deleteStudent } = require("../services/student.service");

const getStudentsController = async (req, res) => {
    try {
        const query = req.queryOptions;
        const {status, ...result} = await getStudents(query);
        if('data' in result) {
            return res.status(status).json(result);
        }
        return res.status(status).json(result);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const getStudentController = async (req, res) => {
    try {
        const id = Number(req.params.studentID);
        const {status, ...result} = await getStudent(id);
        if('data' in result) {
            return res.status(status).json(result);
        }
        return res.status(status).json(result);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const addStudentController = async (req, res) => {
    try {
        const data = req.body;
        const {status, ...result} = await createStudent(data);
        if('data' in result) {
            return res.status(status).json(result);
        }
        return res.status(status).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const updateStudentController = async (req, res) => {
    try {
        const data = req.body;
        const id = Number(req.params.studentID);
        const {status, ...result} = await updateStudent(data, id);
        if('data' in result) {
            return res.status(status).json(result);
        }
        return res.status(status).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const deleteStudentController = async (req, res) => {
    try {
        const data = req.body;
        const id = Number(req.params.studentID);
        const result = await deleteStudent(id);
        return res.status(result.status).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
module.exports = {getStudentsController, getStudentController, addStudentController, updateStudentController, deleteStudentController}