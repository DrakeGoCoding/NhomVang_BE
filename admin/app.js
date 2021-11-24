const express = require('express');
const authRoute = require('@admin/routes/auth.route');
const newsRoute = require('@admin/routes/news.route');
const userRoute = require('@admin/routes/user.route');
const { authenticate, restrictTo } = require('@middlewares/auth.middleware');

const admin = express();

admin.use('/auth', authRoute);

admin.use(authenticate);
admin.use(restrictTo("admin"));

admin.use('/news', newsRoute);
admin.use('/users', userRoute);

module.exports = admin;
