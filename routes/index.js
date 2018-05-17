const express = require('express')
const router = express.Router()

router.use('/game', require('./game'))

router.route('/')
  .get(function (req, res) {
    res.render('menu/main.pug', {
      title: 'Hello Henry'
    })
  })

module.exports = router