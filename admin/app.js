const express = require('express');
const authRoute = require('@admin/routes/auth.route');

const admin = express();

admin.use('/auth', authRoute);

module.exports = admin;
