//External modules
const express = require('express');
const { isAuth } = require('../middleware/isAuth');

//Internal modules
const {getAllBlogs,getBlog} = require('../controller/blogController')


const blogRoutes = express.Router();

//public routes
blogRoutes.get('/get-all',getAllBlogs);
blogRoutes.get('/get/:blogId',getBlog);


module.exports = blogRoutes;
