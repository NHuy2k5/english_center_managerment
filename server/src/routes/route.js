// Tài khoản nào cũng có thể thực hiện chức năng, nhưng mà phân quyền
const express = require('express');
const userController = require('../controllers/admin.controller');
const { logOut, logIn, refresh } = require('../controllers/auth.controller');
const router = express.Router();

// auth
router.post("/login", logIn);
router.post("/refresh", refresh)
router.post("/logout", logOut);

// /users
// router.get("/users", userController.show);
// // router.post("/users/:userID", userController.showDetails);
// router.post("/users/addstudent", userController.addStudent);
// router.post("/users/addparent", userController.addParent);
// router.post("/users/addteacher", userController.addTeacher);
module.exports = router;