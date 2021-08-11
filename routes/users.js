const express = require('express')
const router = express.Router()

const userCtrl = require('../controllers/users')


router.post('/signup', userCtrl.signup);

module.exports = router