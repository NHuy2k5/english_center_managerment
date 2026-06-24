const { getCoupon, getCoupons, createCoupon, updateCoupon, deleteCoupon } = require("../services/coupon.service");

const getCouponsController = async (req, res) => {
    try {
        const query = req.queryOptions;
        const {status, ...result} = await getCoupons(query);
        if('data' in result) {
            return res.status(status).json(result);
        }
        return res.status(status).json(result);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const getCouponController = async (req, res) => {
    try {
        const id = Number(req.params.couponID);
        const {status, ...result} = await getCoupon(id);
        if('data' in result) {
            return res.status(status).json(result);
        }
        return res.status(status).json(result);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const addCouponController = async (req, res) => {
    try {
        const data = req.body;
        const {status, ...result} = await createCoupon(data);
        if('data' in result) {
            return res.status(status).json(result);
        }
        return res.status(status).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const updateCouponController = async (req, res) => {
    try {
        const data = req.body;
        const id = Number(req.params.couponID);
        const {status, ...result} = await updateCoupon(data, id);
        if('data' in result) {
            return res.status(status).json(result);
        }
        return res.status(status).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const deleteCouponController = async (req, res) => {
    try {
        const data = req.body;
        const id = Number(req.params.couponID);
        const result = await deleteCoupon(id);
        return res.status(status).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
module.exports = {getCouponsController, getCouponController, addCouponController, updateCouponController, deleteCouponController}