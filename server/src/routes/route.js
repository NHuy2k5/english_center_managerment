// Tài khoản nào cũng có thể thực hiện chức năng, nhưng mà phân quyền
const express = require('express');
const { logOut, logIn, refresh, getMe } = require('../controllers/auth.controller');
const { resourceHelper, buildQuery } = require('../middlewares/query.middleware');
const authenticate = require('../middlewares/authenticate.middleware');
const authorize = require('../middlewares/authorize.middleware');
const filterTuitionFeeByRole = require('../middlewares/tuitionfee.middleware');
const { getSalariesController, paySalaryMultipleController } = require('../controllers/monthlysalary.controller');
const validate = require('../middlewares/validate.middleware');
const {createStudentSchema, updateStudentSchema} = require("../validators/student.validator");
const {createTeacherSchema, updateTeacherSchema} = require("../validators/teacher.validator");
const {createParentSchema, updateParentSchema} = require("../validators/parent.validator");
const filterCourseByRole = require('../middlewares/course.middleware');
const optionalAuthenticate = require('../middlewares/optionalAuthenticate.middleware')
const {getCoursesController, getCourseController, addCourseController, updateCourseController} = require('../controllers/course.controller')
const {getStudentsController, getStudentController, addStudentController, updateStudentController, deleteStudentController} = require('../controllers/student.controller')
const {getParentsController, getParentController, addParentController, updateParentController, deleteParentController} = require('../controllers/parent.controller')
const {getRegistrationsController, getRegistrationController, addRegistrationController,  deleteRegistrationController} = require('../controllers/registration.controller')
const {createRegistrationSchema} = require('../validators/registration.validator')
const {getCouponsController, getCouponController, addCouponController, updateCouponController, deleteCouponController} = require('../controllers/coupon.controller')
const {createCouponSchema, updateCouponSchema} = require('../validators/coupon.validator')
const {getCategoryCoursesController, getCategoryCourseController, addCategoryCourseController, updateCategoryCourseController, deleteCategoryCourseController} = require('../controllers/categoryCourse.controller')
const {getClassesController, getClassController, addClassController, updateClassController, addToClass, removeFromClass} = require('../controllers/class.controller')
const filterTeacherByRole = require('../middlewares/teacher.middleware');
const {getTeachersController, getTeacherController, addTeacherController, updateTeacherController, deleteTeacherController} = require('../controllers/teacher.controller')
const {getLessonsController, getLessonController, addLessonController, updateLessonController} = require('../controllers/lesson.controller')
const filterClassByRole = require('../middlewares/class.middleware')
const {createCourseSchema, updateCourseSchema} = require('../validators/course.validator')
const {createClassSchema, updateClassSchema} = require('../validators/clsss.validator')
const {createLessonSchema, updateLessonSchema} = require('../validators/lesson.validator')
const {getTuitionFeesController, payTuitionFeesMultipleController, previewTuitionFeesController} = require('../controllers/tuitionfee.controller')
const {getSchedulesController} = require('../controllers/schedule.controller')
const {
    getAssignmentsController,
    getAssignmentController,
    createAssignmentController,
    deleteAssignmentController,
    changeTeacherController
} = require('../controllers/assignment.controller');
const {
    getClassAttendancesController,
    getLessonAttendanceController,
    updateLessonAttendanceController
} = require('../controllers/attendance.controller');


const router = express.Router();

// auth
router.post("/auth/login", logIn);
router.post(
    "/auth/refresh",
    authenticate, 
    refresh)
router.post(
    "/auth/logout",
    authenticate,
    logOut);
router.get(
    "/auth/me",
    authenticate,
    getMe);

// students
router.get(
    '/students',
    // authenticate,
    // authorize('admin'),
    resourceHelper('students'),
    buildQuery,
    getStudentsController
)
router.get(
    '/students/:studentID',
    // authenticate,
    // authorize('admin'),
    getStudentController
)
router.post(
    '/students',
    authenticate,
    authorize('admin'),
    validate(createStudentSchema),
    addStudentController
)
router.patch(
    '/students/:studentID',
    authenticate,
    authorize('admin'),
    validate(updateStudentSchema),
    updateStudentController
)
router.delete(
    '/students/:studentID',
    authenticate,
    authorize('admin'),
    deleteStudentController
)

// teachers
router.get(
    '/teachers',
    optionalAuthenticate,
    resourceHelper('teachers'),
    buildQuery,
    filterTeacherByRole,
    getTeachersController
);
router.get(
    '/teachers/:teacherID',
    optionalAuthenticate,
    resourceHelper('teachers'),
    buildQuery,
    filterTeacherByRole,
    getTeacherController
);
router.post(
    '/teachers',
    authenticate,
    authorize('admin'),
    validate(createTeacherSchema),
    addTeacherController
)
router.patch(
    '/teachers/:teacherID',
    authenticate,
    authorize('admin'),
    validate(updateTeacherSchema),
    updateTeacherController
)
router.delete(
    '/teachers/:teacherID',
    authenticate,
    authorize('admin'),
    deleteTeacherController
)

// parents
router.get(
    '/parents',
    // authenticate,
    // authorize('admin'),
    resourceHelper('parents'),
    buildQuery,
    getParentsController
)
router.get(
    '/parents/:parentID',
    authenticate,
    authorize('admin'),
    getParentController
)
router.post(
    '/parents',
    authenticate,
    authorize('admin'),
    validate(createParentSchema),
    addParentController
)
router.patch(
    '/parents/:parentID',
    authenticate,
    authorize('admin'),
    validate(updateParentSchema),
    updateParentController
)
router.delete(
    '/parents/:parentID',
    authenticate,
    authorize('admin'),
    deleteParentController
)

// registration
router.get(
    '/registrations',
    // authenticate,
    // authorize('admin'),
    resourceHelper('registrations'),
    buildQuery,
    getRegistrationsController
)
router.get(
    '/registrations/:registrationID',
    authenticate,
    authorize('admin'),
    getRegistrationController
)
router.post(
    '/registrations',
    validate(createRegistrationSchema),
    addRegistrationController
)
router.delete(
    '/registrations/:registrationID',
    authenticate,
    authorize('admin'),
    deleteRegistrationController
)

// coupon
router.get(
    '/coupons',
    // authenticate,
    // authorize('admin', 'parent'),
    resourceHelper('coupons'),
    buildQuery,
    getCouponsController
)
router.get(
    '/coupons/:couponID',
    // authenticate,
    // authorize('admin', 'parent'),
    getCouponController
)
router.post(
    '/coupons',
    authenticate,
    authorize('admin'),
    validate(createCouponSchema),
    addCouponController
)
router.patch(
    '/coupons/:couponID',
    authenticate,
    authorize('admin'),
    validate(updateCouponSchema),
    updateCouponController
)
router.delete(
    '/coupons/:couponID',
    authenticate,
    authorize('admin'),
    deleteCouponController
)

// category-courses
router.get(
    '/category-courses',
    optionalAuthenticate,
    resourceHelper('categoryCourses'),
    buildQuery,
    getCategoryCoursesController
)
router.post(
    '/category-courses',
    authenticate,
    authorize('admin'),
    addCategoryCourseController
)
router.patch(
    '/category-courses/:categoryCourseID',
    authenticate,
    authorize('admin'),
    updateCategoryCourseController
)
router.delete(
    '/category-courses/:categoryCourseID',
    authenticate,
    authorize('admin'),
    deleteCategoryCourseController
)

// courses
router.get(
    '/courses',
    optionalAuthenticate,
    resourceHelper('courses'),
    buildQuery,
    filterCourseByRole,
    getCoursesController
)
router.get(
    '/courses/:courseID',
    optionalAuthenticate,
    resourceHelper('courses'),
    buildQuery,
    filterCourseByRole,
    getCourseController
)
router.post(
    '/courses',
    authenticate,
    authorize('admin'),
    validate(createCourseSchema),
    addCourseController
)
router.patch(
    '/courses/:courseID',
    authenticate,
    authorize('admin'),
    validate(updateCourseSchema),
    updateCourseController
)

//classes
router.get(
    '/courses/:courseID/classes',
    optionalAuthenticate,
    resourceHelper('classes'),
    buildQuery,
    filterClassByRole,
    getClassesController
)
router.get(
    '/courses/:courseID/classes/:classID',
    optionalAuthenticate,
    resourceHelper('classes'),
    buildQuery,
    filterClassByRole,
    getClassController
)
router.post(
    '/courses/:courseID/classes',
    authenticate,
    authorize('admin'),
    validate(createClassSchema),
    addClassController
)
router.patch(
    '/courses/:courseID/classes/:classID',
    authenticate,
    authorize('admin'),
    validate(updateClassSchema),
    updateClassController
)
/*
        req.body: {
            user_id:...
        } 
*/
router.post(
    '/courses/:courseID/classes/:classID/add-to-class',
    authenticate,
    authorize('admin'),
    addToClass
)
/*
        req.body: {
            user_id:...
        } 
*/
router.post(
    '/courses/:courseID/classes/:classID/remove-from-class',
    authenticate,
    authorize('admin'),
    removeFromClass
)

//lessons
router.get(
    '/courses/:courseID/classes/:classID/lessons',
    optionalAuthenticate,
    resourceHelper('lessons'),
    buildQuery,
    getLessonsController
)
router.get(
    '/courses/:courseID/classes/:classID/lessons/:lessonID',
    optionalAuthenticate,
    getLessonController
)
router.post(
    '/courses/:courseID/classes/:classID/lessons',
    authenticate,
    authorize('admin'),
    validate(createLessonSchema),
    addLessonController
)
router.patch(
    '/courses/:courseID/classes/:classID/lessons/:lessonID',
    authenticate,
    authorize('admin'),
    validate(updateLessonSchema),
    updateLessonController
)

// schedule
router.get(
    '/schedule',
    authenticate,
    authorize('student', 'parent', 'teacher'),
    getSchedulesController
);

//assignments
router.get(
    '/assignments',
    authenticate,
    authorize('admin'),
    resourceHelper('assignments'),
    buildQuery,
    getAssignmentsController
);

router.get(
    '/assignments/:assignmentID',
    authenticate,
    authorize('admin'),
    getAssignmentController
);

router.post(
    '/assignments',
    authenticate,
    authorize('admin'),
    createAssignmentController
);

router.delete(
    '/assignments/:assignmentID',
    authenticate,
    authorize('admin'),
    deleteAssignmentController
);

router.patch(
    '/assignments/:assignmentID/change-teacher',
    authenticate,
    authorize('admin'),
    changeTeacherController
);

//Attendance
router.get(
    '/classes/:classID/attendances',
    authenticate,
    authorize('admin', 'teacher'),
    getClassAttendancesController
);

router.get(
    '/lessons/:lessonID/attendance',
    authenticate,
    authorize('admin', 'teacher'),
    getLessonAttendanceController
);

router.put(
    '/lessons/:lessonID/attendance',
    authenticate,
    authorize('admin', 'teacher'),
    updateLessonAttendanceController
);

// tuition fees:
router.get(
    '/tuition-fees',
    authenticate,
    authorize('admin', 'parent'),
    resourceHelper('tuitionfees'),
    buildQuery,
    filterTuitionFeeByRole,
    getTuitionFeesController
);
router.post(
    '/tuition-fees/pay-multiple',
    authenticate,
    authorize('parent'),
    resourceHelper('tuitionfees'),
    payTuitionFeesMultipleController
);
router.post(
    '/tuition-fees/preview',
    authenticate,
    authorize('admin', 'parent'),
    previewTuitionFeesController
);

//monthly salary
router.post(
    '/salaries/pay',
    authenticate,
    authorize('admin'),
    paySalaryMultipleController
);

router.get(
    '/salaries',
    authenticate,
    authorize('admin', 'teacher'),
    resourceHelper('monthlysalaries'),
    buildQuery,
    getSalariesController
);
module.exports = router;