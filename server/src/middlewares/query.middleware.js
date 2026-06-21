const FIELD_MAP = {
    // User
    user_name: "user",
    phone: "user",
    email: "user",
    full_name: "user",
    birthday: "user",
    address: "user",
    sex: "user",
    avatar_id: "user",
    avatar_link: "user",

    // Student
    parent_id: "student",

    // Teacher Parent
    balance: {
        parents: "parent",
        teachers: "teacher"
    },

    // Teacher
    description: "teacher",
    thumbnail_link: "teacher",
    thumbnail_id: "teacher",
    status: "teacher",

    // Student, Teacher, Parent
    created_at: {
        students: "student",
        parents: "parent",
        teachers: "teacher"
    },
    updated_at: {
        students: "student",
        parents: "parent",
        teachers: "teacher"
    }
};
const getModelByField = (field, resouce) => {
    const config = FIELD_MAP[field];
    if (!config) {
        return;
    }
    if (typeof config === 'string') {
        return config;
    }
    return config[resouce] || null
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
    }
});
// ?_fields=full_name,phone,parent_id
const parseFields = (req) => {
    const resouce = req.path.split("/").filter((item) => item !== '')[0];
    if (!req.query._fields) {
        return;
    };
    const fields = req.query._fields.split(",");
    for (const field of fields) {
        const model = getModelByField(field, resouce);
        if (!model) continue;
        res.queryOptions[model].attributes.push(field);
    };
}
// ?_sort=full_name&_order=desc
const parseSort = (req) => {
    const resouce = req.path.split("/").filter((item) => item !== '')[0];
    if (!req.query._sort) {
        return;
    };
    const model = getModelByField(field, resouce);
    if (!model) return;
    res.queryOptions[model].order.push([req.query._sort, (req.query._order || ASC).toUpperCase()]);
}
// ?_page=1&_limit=10
const parsePagination = (req) => {
    const resouce = req.path.split("/").filter((item) => item !== '')[0];
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
    const resouce = req.path.split("/").filter((item) => item !== '')[0];
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

        const model = getModelByField(field, resource);

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
    ]
};
const parseSearch = (req) => {
    if (!req.query.q) {
        return;
    };
    req.queryOptions.user.where[Op.or] =
        SEARCH_FIELDS.user.map(field => ({
            [field]: {
                [Op.like]: `%${q}%`
            }
        }));
};
const buildQuery = (req, res, next) => {

    req.queryOptions = createQueryOptions();

    parseFields(req);
    parseSort(req);
    parsePagination(req);
    parseFilters(req);
    parseSearch(req);

    next();
}; 
module.exports = buildQuery;