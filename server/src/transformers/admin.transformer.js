exports.transformAdmin = (admin) => {
    const data = admin.toJSON();
    const {admin_user,...adminData} = data;
     const result = {
        ...adminData,
        ...admin_user,
    };
    return result;
};