const router = require('express').Router();
const userController = require('@admin/controllers/user.controller');

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.put('/:username', userController.updateUser);
router.delete('/:username', userController.deleteUser);

module.exports = router;