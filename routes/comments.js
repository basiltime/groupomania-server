const express = require('express')
const router = express.Router()

/* GET const page. */
router.get('/', function(req, res, next) {
  res.send('Home')
});

module.exports = router;
