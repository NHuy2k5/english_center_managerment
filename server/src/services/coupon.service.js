const { Coupon, TuitionFee, ParentCoupon, sequelize } = require("../models/index");

const query = (couponQuery = {}) => {
    const hasWhere = where => where && Object.keys(where).length > 0;
    return {
        ...(couponQuery.limit != null && { limit: couponQuery.limit }),
        ...(couponQuery.offset != null && { offset: couponQuery.offset }),
        ...(couponQuery.coupon?.attributes?.length && { attributes: couponQuery.coupon.attributes }),
        order: [
            ...(couponQuery.coupon?.order || [])
        ],
        ...(hasWhere(couponQuery.coupon?.where) && {
            where: couponQuery.coupon.where
        }),
    };
}
module.exports = {
    // Lấy mã giảm giá
    /*
        [{
            id: ...,
            name: ...,
            discount:...,
            start: ...,
            end: ...,
            description: ...,
            number_of_users: ...,
        ]}
    */
    getCoupons: async (couponQuery = {}) => {
        let rows;
        let count;
        if (couponQuery.limit != null) {
            const result = await Coupon.findAndCountAll(query(couponQuery));
            rows = result.rows;
            count = result.count;
        } else {
            rows = await Coupon.findAll(query(couponQuery));
            count = rows.length;
        }
        if (count === 0) {
            return {
                status: 404,
                message: "Coupons not found"
            }
        }
        return {
            status: 200,
            data: rows,
            count,
            message: "Coupons found"
        };
    },
    getCoupon: async (id) => {
        const coupon = await Coupon.findByPk(id, query())
        if (!coupon) {
            return {
                status: 404,
                message: "Coupon not found"
            }
        }
        return {
            status: 200,
            data: coupon,
            message: "Coupon found"
        }
    },
    createCoupon: async (data) => {
        const t = await sequelize.transaction();
        try {
            // Thêm thông tin Coupon
            const startDefault = new Date();
            const endDefault = new Date();
            endDefault.setFullYear(startDefault.getFullYear() + 1);
            const coupon = await Coupon.create({
                id: data.id,
                name: data.name,
                discount: data.discount ?? 0,
                start: data.start ? new Date(data.start) : startDefault,
                end: data.end ? new Date(data.end) : endDefault,
                description: data.description ?? null,
                number_of_users: data.number_of_users,
                created_at: new Date(),
                updated_at: new Date()
            }, { transaction: t });
            await t.commit();
            const result = await Coupon.findByPk(coupon.id, query());
            return {
                status: 201,
                data: result,
                message: "Create success"
            };
        } catch (error) {
            await t.rollback();
            return {
                status: 400,
                message: error.message
            };
        }
    },
    updateCoupon: async (data, id) => {
        const couponData = {};
        const t = await sequelize.transaction();
        try {
            const coupon = await Coupon.findByPk(id, { transaction: t });
            if (!coupon) {
                await t.rollback();
                return {
                    status: 404,
                    message: "Coupon not found"
                };
            };
            if ("name" in data) {
                couponData.name = data.name;
            };
            if ("discount" in data) {
                couponData.discount = data.discount;
            };
            if ("start" in data) {
                couponData.start = new Date(data.start);
                if ("end" in data) {
                    if(new Date(data.end) >= new Date(data.start)){
                        couponData.end = new Date(data.end);
                    }
                    else{
                        throw new Error("Updated End date must be greater or eqeal updated Start date")
                    }
                };
            }
            else{
                if ("end" in data) {
                    if(new Date(data.end) >= coupon.start){
                        couponData.end = new Date(data.end);
                    }
                    else{
                        throw new Error("Updated End date must be greater or eqeal current Start date")
                    }
                };
            }
            if ("description" in data) {
                couponData.description = data.description;
            };
            if ("number_of_users" in data){
                couponData.number_of_users = data.number_of_users;
            };
            await Coupon.update(couponData,
                {
                    where: { id },
                    transaction: t
                });
            await t.commit();
            const result = await Coupon.findByPk(id, query());
            return {
                status: 200,
                data: result,
                message: "Update success"
            };
        } catch (error) {
            await t.rollback();
            return {
                status: 400,
                message: error.message
            };
        }
    },
    deleteCoupon: async (id) => {
        const t = await sequelize.transaction();
        try {
            const coupon = await Coupon.findByPk(id, { transaction: t });
            if (!coupon) {
                await t.rollback();
                return {
                    status: 404,
                    message: "Coupon not found"
                };
            };
            // Gỡ mã giảm giá ở bảng tuition_fee
            await TuitionFee.update({
                coupon_id: null
            }, 
            {
                where: {
                    coupon_id: id
                },
                transaction: t
            })
            // Xóa danh mục khóa học
            const status = await Coupon.destroy({
                where: {
                    id
                },
                transaction: t
            });
            if (!status) {
                throw new Error("Delete failed");
            }
            await t.commit();
            return {
                status: 200,
                message: "Delete success"
            };
        } catch (error) {
            await t.rollback();
            return {
                status: 400,
                message: error.message
            };
        }
    }
}