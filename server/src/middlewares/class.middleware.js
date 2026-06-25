// middlewares/course.middleware.js
const filterClassByRole = (req, res, next) => {
    const isPrivileged =  req.user?.role === 'admin' || req.user?.role === 'teacher';
    if (!isPrivileged) {
        // parent, student, guest chỉ xem được public
        req.queryOptions.cLass.where.status = 'public';
    }
    next();
};
module.exports = filterClassByRole;