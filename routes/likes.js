const express = require('express')
const router = express.Router()
const likesCtrl = require('../controllers/likes')
const auth = require('../middleware/auth')

router.post('/', auth, likesCtrl.like)
router.get('/', auth, likesCtrl.getAllLikes)

module.exports = router;