// Chỉ validate khi tạo hoặc update
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            const data = {
            body: req.body,
            params: req.params,
        }
        await schema.validate(data, {
                abortEarly: false,
                context:{
                    ...req.params
                }
        });
        next();
        } catch (error) {
            return res.status(400).json({
                success: false,
                errors: error.errors
            });
        }
    }
}
module.exports = validate;