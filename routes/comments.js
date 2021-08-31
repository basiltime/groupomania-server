const express = require('express')
const router = express.Router()
const commentCtrl = require('../controllers/comments')


router.post('/', commentCtrl.createComment)
router.get('/', commentCtrl.getAllComments)

module.exports = router;
