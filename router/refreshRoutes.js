//External modules
const express = require('express');


//Internal modules
const {getPaidTools,getFreeTools} = require('../controller/toolsController')


const toolRoutes = express.Router();

//public routes
toolRoutes.get("/paid-tools",getPaidTools);
toolRoutes.post("/free-tools",getFreeTools);


module.exports = toolRoutes;
