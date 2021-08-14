const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const userCtrl = require('../controllers/users')


router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login)
router.get('/:id', auth, userCtrl.viewAccount)
router.delete('/:id', auth, userCtrl.deleteAccount)
module.exports = router