const routes = require('express').Router();
const impl = require('./api-impl');

//api routes
routes.get('/nodes/types', impl.types);
routes.get('/nodes/:type/names', impl.nodesByType);
routes.get('/nodes/:name', impl.connectDots);
//routes.get('/nodes/types/:name', impl.typeDetails);
module.exports = routes;