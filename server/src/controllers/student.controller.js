const { getStudents } = require("../services/student.service");

const index = async (req, res) => {
    const query = req.queryOptions;
    const result = await getStudents(query);
    if(result.status === 404){
        res.status(result.status).json(result.message);
    }
    else if(result.status === 200){
        res.status(result.status).json(result.data);
    }
}