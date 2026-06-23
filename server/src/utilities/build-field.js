const buildComputedAttributes = (virtualAttributes = []) => {
    const attrs = [];

    for (const field of virtualAttributes) {

        switch (field) {

            case 'total_students_registered':
                attrs.push([
                    sequelize.literal(`
                        (
                            SELECT COUNT(*)
                            FROM student_class sc
                            WHERE sc.class_id = Class.id
                        )
                    `),
                    field
                ]);
                break;

            case 'total_students_dropped_out':
                attrs.push([
                    sequelize.literal(`
                        (
                            SELECT COUNT(*)
                            FROM student_class sc
                            WHERE sc.class_id = Class.id
                            AND sc.left_at IS NOT NULL
                        )
                    `),
                    field
                ]);
                break;

            case 'total_lessons':
                attrs.push([
                    sequelize.literal(`
                        (
                            SELECT COUNT(*)
                            FROM lessons l
                            WHERE l.class_id = Class.id
                        )
                    `),
                    field
                ]);
                break;

            case 'total_lessons_finished':
                attrs.push([
                    sequelize.literal(`
                        (
                            SELECT COUNT(*)
                            FROM lessons l
                            WHERE l.class_id = Class.id
                            AND l.end < NOW()
                        )
                    `),
                    field
                ]);
                break;
        }
    }

    return attrs;
};
module.exports = buildComputedAttributes