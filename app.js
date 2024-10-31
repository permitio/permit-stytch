const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();

const syncUserRouter = require('./routes/sync-user');
const syncTenantRouter = require('./routes/sync-tenant');
const deleteUserRouter = require('./routes/delete-user');
const deleteTenantRouter = require('./routes/delete-tenant');
const stytchMiddleware = require('./lib/middleware');


const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(stytchMiddleware);

app.use('/sync-user', syncUserRouter);
app.use('/sync-tenant', syncTenantRouter);
app.use('/delete-user', deleteUserRouter);
app.use('/delete-tenant', deleteTenantRouter);

module.exports = app;
