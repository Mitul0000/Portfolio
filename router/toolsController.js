//External modules
const express = require('express');
const { isAuth } = require('../middleware/isAuth');

//Internal modules
const {getAllRequest,toolRequest} = require('../controller/toolRequestController')


const requestToolRoutes = express.Router();

//private routes
requestToolRoutes.get("/get-requests",isAuth,getAllRequest);
requestToolRoutes.post("tool-request",isAuth,toolRequest);


module.exports = requestToolRoutes;
