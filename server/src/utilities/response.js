module.exports = {
    successResponse: ({res, data, status = 200, message = "Success", meta = {}}) => {
        res.status(status).json({
            success: true,
            data,
            message,
            ...meta
        })
    },
    errrorResponse: ({res, error, status = 500, messgae}) => {
        res.status(status).json({
            success: false,
            error,
            messgae,
        })
    }
};