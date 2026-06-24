// middlewares/course.middleware.js
const filterClassByRole = (req, res, next) => {
    const userRole = req.user?.role || '';
    const isPrivileged = userRole === 'admin' || userRole === 'teacher';
    if (!isPrivileged) {
        // parent, student, guest chỉ xem được public
        req.queryOptions.class.where.status = 'public';
    }
    next();
};
module.exports = filterClassByRole;