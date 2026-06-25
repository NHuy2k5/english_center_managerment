
const buildOrder = (orders = {}) => {

    const SORT_LITERAL_MAP = {
        total_lessons:
            sequelize.literal('total_lessons'),

        total_lessons_finished:
            sequelize.literal('total_lessons_finished'),

        total_students_registered:
            sequelize.literal('total_students_registered'),

        total_students_dropped_out:
            sequelize.literal('total_students_dropped_out')
    };

    return orders.map(([field, dir]) => {

        if (SORT_LITERAL_MAP[field]) {
            return [SORT_LITERAL_MAP[field], dir];
        }

        return [field, dir];
    });
};

module.exports = buildOrder;