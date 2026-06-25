const { getParent, getParents, createParent, updateParent, deleteParent } = require("../services/parent.service");

const getParentsController = async (req, res) => {
    try {
        const query = req.queryOptions;
        const {status, ...result} = await getParents(query);
        if('data' in result) {
            return res.status(status).json(result);
        }
        return res.status(status).json(result);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const getParentController = async (req, res) => {
    try {
        const id = Number(req.params.parentID);
        const {status, ...result} = await getParent(id);
        if('data' in result) {
            return res.status(status).json(result);
        }
        return res.status(status).json(result);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const addParentController = async (req, res) => {
    try {
        const data = req.body;
        const {status, ...result} = await createParent(data);
        if('data' in result) {
            return res.status(status).json(result);
        }
        return res.status(status).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const updateParentController = async (req, res) => {
    try {
        const data = req.body;
        const id = Number(req.params.parentID);
        const {status, ...result} = await updateParent(data, id);
        if('data' in result) {
            return res.status(status).json(result);
        }
        return res.status(status).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const deleteParentController = async (req, res) => {
    try {
        const data = req.body;
        const id = Number(req.params.parentID);
        const result = await deleteParent(id);
        return res.status(status).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
module.exports = {getParentsController, getParentController, addParentController, updateParentController, deleteParentController}