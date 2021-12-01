const router = require('express').Router();
const userController = require('@admin/controllers/user.controller');

router.delete('/:username', userController.deleteUser);

router
	.route('/')
	.get(userController.getAllUsers)
	.post(userController.createUser)
	.put(userController.updateUser);

module.exports = router;
