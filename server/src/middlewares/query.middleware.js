const {Op} = require('sequelize');
const FIELD_MAP = {
    // User
    user_name: "user",
    birthday: "user",
    sex: "user",

    // Student
    parent_id: "student",

    // Teacher Parent
    balance: {
        parents: "parent",
        teachers: "teacher"
    },

    //
    full_name: {
        students: "user",
        teachers: "user",
        parents: "user",
        registrations: "registration"
    },
    phone: {
        students: "user",
        teachers: "user",
        parents: "user",
        registrations: "registration"
    },
    email: {
        students: "user",
        teachers: "user",
        parents: "user",
        registrations: "registration"
    },
    address: {
        students: "user",
        teachers: "user",
        parents: "user",
        lessons: "lesson",
        registrations: "registration"
    },
    created_at: {
        students: "student",
        parents: "parent",
        teachers: "teacher",
        categorycourses: "categoryCourse",
        courses: "course",
        classes: "cLass",
        lessons: "lesson",
        coupons: "coupon",
        tuitionfees: "tuitionFee",
        monthlysalaries: "monthlyTeacherSalary",
        registrations: "registration",
        assignments: "assignments",
        attendances: "attendances"
    },
    updated_at: {
        students: "student",
        parents: "parent",
        teachers: "teacher",
        categorycourses: "categoryCourse",
        courses: "course",
        classes: "cLass",
        lessons: "lesson",
        coupons: "coupon",
        tuitionfees: "tuitionFee",
        monthlysalaries: "monthlyTeacherSalary",
        registrations: "registration",
        attendances: "attendances",
        assignments: "assignments"
    },
    name: {
        categorycourses: "categoryCourse",
        courses: "course",
        classes: "cLass",
        lessons: "lesson",
        coupons: "coupon",
    },
    start: {
        lessons: "lesson",
        coupons: "coupon"
    },
    end: {
        lessons: "lesson",
        coupons: "coupon"
    },
    class_id: {
        lessons: "lesson",
        tuitionfees: "tuitionFee"
    },
    the_first_of_the_month: {
        tuitionfees: "tuitionFee",
        monthlysalaries: "monthlyTeacherSalary"
    },
    the_end_of_the_month: {
        tuitionfees: "tuitionFee",
        monthlysalaries: "monthlyTeacherSalary"
    },
    category_course_id: {
        courses: "course",
        registrations: "registration"
    },
    // Course
    year_course: "course",
    total_lessons: "course",
    listed_price: "course",
    status: "course",
    discount: "course",

    // Class
    total_students: "cLass",

    // Lesson
    listed_price: "lesson",
    class_id: "lesson",

    // Monthly Salary
    teacher_id: "monthlyTeacherSalary",
    the_first_of_the_month: "monthlyTeacherSalary",
    the_end_of_the_month: "monthlyTeacherSalary",
    total_lessons_teached: "monthlyTeacherSalary",
    monthly_salary: "monthlyTeacherSalary",
    is_teacher_paid: "monthlyTeacherSalary",

    // Tuition Fee
    total_reality_lessons: "tuitionFee",
    actual_listed_tuition_fee: "tuitionFee",
    coupon_id: "tuitionFee",
    have_student_paid: "tuitionFee"

};
const VIRTUAL_FIELDS = {
    cLass: [
        'total_students_registered',
        'total_students_dropped_out',
        'total_lessons',
        'total_lessons_finished',
    ],
    // course: [
    //     'total_lessons',
    //     'total_lessons_finished'
    // ]
};
const getModelByField = (field, resource) => {
    const config = FIELD_MAP[field];
    if (!config) {
        return;
    }
    if (typeof config === 'string') {
        return config;
    }
    return config[resource] || null
}
const createQueryOptions = () => ({
    limit: null,
    offset: null,
    user: {
        attributes: [],
        where: {},
        order: []
    },
    student: {
        attributes: [],
        where: {},
        order: []
    },
    parent: {
        attributes: [],
        where: {},
        order: []
    },
    teacher: {
        attributes: [],
        where: {},
        order: []
    },
    registration: {
        attributes: [],
        where: {},
        order: []
    },
    course: {
        attributes: [],
        where: {},
        order: []
    },
    categoryCourse: {
        attributes: [],
        where: {},
        order: []
    },
    cLass: {
        attributes: [],
        virtualAttributes: [],
        where: {},
        order: []
    },
    lesson: {
        attributes: [],
        where: {},
        order: []
    },
    coupon: {
        attributes: [],
        where: {},
        order: []
    },
    monthlyTeacherSalary: {
        attributes: [],
        where: {},
        order: []
    },
    tuitionFee: {
        attributes: [],
        where: {},
        order: []
    },
    // Phân công
    assignment: {
        attributes: [],
        where: {},
        order: []
    },
    // Điểm danh
    attendance: {
        attributes: [],
        where: {},
        order: []
    }
});
// ?_fields=full_name,phone,parent_id
const parseFields = (req) => {
    if (!req.query._fields) {
        return;
    };
    const fields = req.query._fields.split(",");
    for (const field of fields) {
        const model = getModelByField(field, req.resource);
        if (!model) continue;
        const isVirtual =
            VIRTUAL_FIELDS[model]?.includes(field);
        if (isVirtual) {
            req.queryOptions[model].virtualAttributes.push(field);
        } else {
            req.queryOptions[model].attributes.push(field);
        }
    };
}

// ?_sort=full_name&_order=desc
const parseSort = (req) => {
    if (!req.query._sort) {
        return;
    };
    const model = getModelByField(req.query._sort, req.resource);
    if (!model) return;
    req.queryOptions[model].order.push([req.query._sort, (req.query._order || 'ASC').toUpperCase()]);
}
// ?_page=1&_limit=10
const parsePagination = (req) => {
    const page = Number(req.query._page || 1);
    const limit = Number(req.query._limit || 10);
    req.queryOptions.limit = limit;
    req.queryOptions.offset = (page - 1) * limit;
}
// ?parent_id[gte]=10
// &full_name=Huy
// &birthday[lte]=2025-01-01
const OPERATOR_MAP = {
    gte: Op.gte,
    lte: Op.lte,
    gt: Op.gt,
    lt: Op.lt,
    ne: Op.ne,
    like: Op.like
};
const parseFilters = (req) => {
    for (const [key, value] of Object.entries(req.query)) {
        if (key.startsWith("_") || key === "q") {
            continue;
        }
        const match = key.match(/(.*?)\[(.*?)\]/);

        let field;
        let operator;

        if (match) {
            field = match[1];
            operator = match[2];
        } else {
            field = key;
        }

        const model = getModelByField(field, req.resource);

        if (!model) {
            continue;
        }

        const where = req.queryOptions[model].where;

        if (operator) {
            const op = OPERATOR_MAP[operator];

            if (!op) {
                continue;
            }

            where[field] = {
                ...(where[field] || {}),
                [op]: value
            };
        }
        else {
            where[field] = value;
        }
    }
};
// ?q=huy
const SEARCH_FIELDS = {
    user: [
        "user_name",
        "full_name",
        "phone",
        "email"
    ],
};
const parseSearch = (req) => {
    if (!req.query.q) {
        return;
    };
    req.queryOptions.user.where[Op.or] =
        SEARCH_FIELDS.user.map(field => ({
            [field]: {
                [Op.like]: `%${req.query.q}%`
            }
        }));
};
const buildQuery = (req, res, next) => {

    req.queryOptions = createQueryOptions();
    if (!req.resource) {
        req.resource = req.path.split("/").filter(Boolean)[0];
    }
    parseFields(req);
    parseSort(req);
    parsePagination(req);
    parseFilters(req);
    parseSearch(req);

    next();
};
module.exports = buildQuery;