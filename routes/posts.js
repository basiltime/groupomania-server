const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const postsCtrl = require('../controllers/posts')
const imageUpload = require('../middleware/imageUpload')


router.get('/', auth, postsCtrl.newsfeed)
router.post('/', imageUpload, postsCtrl.createPost)


module.exports = router