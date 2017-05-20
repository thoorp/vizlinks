const routes = require('express').Router();
const typesAll = require('./types/all');

//api routes
routes.get('/versions/all', typesAll.test);

module.exports = routes;