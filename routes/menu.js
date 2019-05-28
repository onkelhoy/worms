const express = require('express')
const router = express.Router()
const { rooms } = require('../events/main')

router.route('/')
  .get(function (req, res) {
    res.render('menu/home.pug', {
      title: 'Hello Henry',
      nsps: rooms()
    })
  })

module.exports = router