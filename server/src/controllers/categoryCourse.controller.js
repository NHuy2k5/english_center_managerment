const { getCategoryCourse, getCategoryCourses, createCategoryCourse, updateCategoryCourse, deleteCategoryCourse } = require("../services/categoryCourse.service");

const getCategoryCoursesController = async (req, res) => {
    try {
        const query = req.queryOptions;
        const {status, ...result} = await getCategoryCourses(query);
        if('data' in result) {
            return res.status(status).json(result);
        }
        return res.status(status).json(result);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const getCategoryCourseController = async (req, res) => {
    try {
        const id = Number(req.params.categoryCourseID);
        const {status, ...result} = await getCategoryCourse(id);
        if('data' in result) {
            return res.status(status).json(result);
        }
        return res.status(status).json(result);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const addCategoryCourseController = async (req, res) => {
    try {
        const data = req.body;
        const {status, ...result} = await createCategoryCourse(data);
        if('data' in result) {
            return res.status(status).json(result);
        }
        return res.status(status).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const updateCategoryCourseController = async (req, res) => {
    try {
        const data = req.body;
        const id = Number(req.params.categoryCourseID);
        const {status, ...result} = await updateCategoryCourse(data, id);
        if('data' in result) {
            return res.status(status).json(result);
        }
        return res.status(status).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const deleteCategoryCourseController = async (req, res) => {
    try {
        const data = req.body;
        const id = Number(req.params.categoryCourseID);
        const result = await deleteCategoryCourse(id);
        return res.status(result.status).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
module.exports = {getCategoryCoursesController, getCategoryCourseController, addCategoryCourseController, updateCategoryCourseController, deleteCategoryCourseController}