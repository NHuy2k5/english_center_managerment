// middlewares/course.middleware.js
const filterCourseByRole = (req, res, next) => {
    const isPrivileged =  req.user?.role === 'admin' || req.user?.role === 'teacher';
    console.log(isPrivileged);
    if (!isPrivileged) {
        // parent, student, guest chỉ xem được public
        req.queryOptions.course.where.status = 'public';
    }
    next();
};
module.exports = filterCourseByRole;