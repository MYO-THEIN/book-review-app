const express = require('express');
const router = express.Router();
const customer_routes = require('./auth_users.js').authenticated;
const genl_routes =  require('./general.js').general;

router.use("/customer", customer_routes);
router.use("/", genl_routes);

module.exports = router;
