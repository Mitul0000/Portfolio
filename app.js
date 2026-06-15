const dns = require("dns");
dns.setServers(["1.1.1.1", "1.0.0.1", "8.8.8.8"]);
//External modules
const express = require("express");
const cors = require('cors');
//Internal modules
const MongoDBConnect = require("./config/db");
const authRoutes = require("./router/authRoutes");
const requestToolRoutes = require("./router/toolRequestRoutes");
const {commentRoutes} = require('./router/commentRoutes');
const {blogRoutes} = require('./router/blogRoutes');
const {toolRoutes} = require('./router/toolsController')
const app = express();
app.use(cors({
  origin: '*'
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth/',authRoutes);
app.use('/api/request/',requestToolRoutes);
app.use('/api/blog/',blogRoutes);
app.use('/api/comment/',commentRoutes);
app.use('/api/tools/',toolRoutes);


const port = 3000;

MongoDBConnect.then(() => {
  app.listen(port, () => {
    console.log(`Server started successfully at http://localhost:${port}`);
  });
}).catch((err) => {
  console.error("Failed to connect to MongoDB:", err);
});