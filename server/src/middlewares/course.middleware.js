// middlewares/course.middleware.js
const filterCourseByRole = (req, res, next) => {
    const userRole = req.user?.role || '';
    const isPrivileged = userRole === 'admin' || userRole === 'teacher';
    if (!isPrivileged) {
        // parent, student, guest chỉ xem được public
        req.queryOptions.course.where.status = 'public';
    }
    next();
};
module.exports = filterCourseByRole;