const express = require('express')
const router = express.Router()
const commentCtrl = require('../controllers/comments')
const auth = require('../middleware/auth')

router.post('/', auth, commentCtrl.createComment)
router.get('/', auth, commentCtrl.getAllComments)

module.exports = router;
