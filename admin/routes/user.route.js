const router = require('express').Router();
const userController = require('@admin/controllers/user.controller');

router
	.route('/')
	.get(userController.getAllUsers)
	.post(userController.createUser)
	.put(userController.updateUser)
	.delete(userController.deleteUser)

module.exports = router;
