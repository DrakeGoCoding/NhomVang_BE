const express = require('express');
const authRoute = require('@admin/routes/auth.route');
const newsRoute = require('@admin/routes/news.route');

const admin = express();

admin.use('/auth', authRoute);
admin.use('/news', newsRoute);

module.exports = admin;
