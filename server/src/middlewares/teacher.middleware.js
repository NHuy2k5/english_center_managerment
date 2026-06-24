const filterTeacherByRole = (req, res, next) => {
    const userRole = req.user?.role || '';
    const isAdmin = userRole === 'admin';
    if (!isAdmin) {
        // Chỉ xem được teacher public
        req.queryOptions.teacher.where.status = 'public';

        // Chỉ được xem một số field nhất định
        req.queryOptions.teacher.attributes = [
            'id',
            'description',
            'thumbnail_link',
            'thumbnail_id'
        ];
        req.queryOptions.user.attributes = [
            'full_name'
        ];
    }
    next();
};
module.exports = filterTeacherByRole;