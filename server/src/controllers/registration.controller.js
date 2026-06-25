const { getRegistration, getRegistrations, createRegistration, updateRegistration, deleteRegistration } = require("../services/registration.service");

const getRegistrationsController = async (req, res) => {
    try {
        const query = req.queryOptions;
        const {status, ...result} = await getRegistrations(query);
        if('data' in result) {
            return res.status(status).json(result);
        }
        return res.status(status).json(result);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const getRegistrationController = async (req, res) => {
    try {
        const id = Number(req.params.registrationID);
        const {status, ...result} = await getRegistration(id);
        if('data' in result) {
            return res.status(status).json(result);
        }
        return res.status(status).json(result);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const addRegistrationController = async (req, res) => {
    try {
        const data = req.body;
        const {status, ...result} = await createRegistration(data);
        if('data' in result) {
            return res.status(status).json(result);
        }
        return res.status(status).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const deleteRegistrationController = async (req, res) => {
    try {
        const data = req.body;
        const id = Number(req.params.registrationID);
        const result = await deleteRegistration(id);
        return res.status(result.status).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
module.exports = {getRegistrationsController, getRegistrationController, addRegistrationController,  deleteRegistrationController}