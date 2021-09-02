const express = require('express')
const router = express.Router()
const likesCtrl = require('../controllers/likes')


router.post('/', likesCtrl.like)
router.get('/', likesCtrl.getAllLikes)

module.exports = router;