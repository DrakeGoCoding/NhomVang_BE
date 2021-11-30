const router = require('express').Router();
const authController = require('@admin/controllers/auth.controller');
const { authenticate } = require('@middlewares/auth.middleware');

router.post('/login', authController.login);

router.use(authenticate);
router.get('/current', authController.getCurrentUser);

module.exports = router;
