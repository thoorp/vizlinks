const routes = require('express').Router();
const impl = require('./api-impl');

//api routes
routes.get('/nodes/types', impl.types);
routes.get('/nodes/:type/names', impl.nodesByType);
routes.get('/nodes/:name(*)', impl.connectDots); // (*) handles any character including forward slash
module.exports = routes;