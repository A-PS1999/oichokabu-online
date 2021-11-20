const router = require('express').Router();
const AuthRoute = require('./authRoute.js');

router.use(AuthRoute);

module.exports = router;