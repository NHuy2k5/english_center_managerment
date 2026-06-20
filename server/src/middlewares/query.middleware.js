const { Op } = require("sequelize");
const buildQuery = (req, res, next) => {
    if(!req.queryOptions){
        req.queryOptions = {};
    }
    // Lấy vài trường tìm kiếm
    const searchableFields = [];
    // Lấy path
    const path = req.path.split("/");
    // Có điều kiện
    const where = {};
    for (const [key, value] of Object.entries(req.query)) {
        if (key == "_fields" || key == "_soft" || key == "_order" || key == "_page" || key == "_limit" || key == "q" || key == "_pagination") {
            // 1 vài thuộc tính
            if (req.query._fields) {
                req.queryOptions.attributes = req.query._fields.split(",");
            }
            // Có thể sắp xếp
            if (req.query._soft) {
                req.queryOptions.sort = req.query._sort;
                req.queryOptions.order = req.query._order.toUpperCase() || "ASC";
            }
            // Có thể phân trang
            if (req.query._page) {
                const page = Number(req.query._page);
                const limit = Number(req.query._limit || 10);
                req.queryOptions.limit = limit;
                req.queryOptions.offset = (page - 1) * limit;
            }
            if(req.query.q){
                if(path[0] == "users"){
                    where[Op.or] = [...searchableFields, "user_name", "full_name", "phone", "email"].map(field => ({
                        [field]: {
                            [Op.like]: `%${req.query.q}%`
                        }
                    }));
                }
            }
        }
        else {
            // Tách age[18] thành age và 18
            const match = key.match(/(.*?)\[(.*?)\]/);
            // [gte]
            if (match[2] == "gte") {
                where[match[1]] = {
                    ...(where[match[1]] || {}),
                    [Op.gte]: value
                }
            }
            // [lte]
            else if (match[2] == "lte") {
                where[match[1]] = {
                    ...(where[match[1]] || {}),
                    [Op.lte]: value
                }
            }
            // [gt]
            else if (match[2] == "gt") {
                where[match[1]] = {
                    ...(where[match[1]] || {}),
                    [Op.gt]: value
                }
            }
            // [lt]
            else if (match[2] == "lt") {
                where[match[1]] = {
                    ...(where[match[1]] || {}),
                    [Op.lt]: value
                }
            }
            // age=male
            else {
                where[key] = value;
            }
        }
    }
    req.queryOptions.where = where;
    next();
};
module.exports = buildQuery;