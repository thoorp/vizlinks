const routes = require('express').Router();
const impl = require('./api-impl');

//api routes
routes.get('/test', impl.test);
routes.get('/nodes/types', impl.types);
routes.get('/nodes/types/:name', impl.typeDetails);
module.exports = routes;