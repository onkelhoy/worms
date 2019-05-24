const express = require('express')
const fs = require('fs')
const path = require('path')
const { exists } = require('../events/main')
const router = express.Router()

router.route('/:id')
  .get((req, res, next) => {
    if (!exists(req.params.id))
      return next()

    req.session.nsp_id = req.params.id
    res.redirect('/lobby')
  })

router.route('/')
  .get((req, res, next) => {
    // if (!req.session.nsp_id || !exists(req.session.nsp_id))
      // return next() // add this back later
    const vars = {
      id: req.session.nsp_id,
      title: 'lobby'
    }

    if (true) 
    { // check if host 
      vars['textures']    = fs.readdirSync(path.resolve(__dirname, '../public/content/texture/'))
      vars['masks']       = fs.readdirSync(path.resolve(__dirname, '../public/content/mask/'))
      vars['backgrounds'] = fs.readdirSync(path.resolve(__dirname, '../public/content/backgrounds/'))
    }

    res.render('menu/lobby.pug', vars)
  })

router.all('*', function (req, res) {
  res.redirect('/') // use middleware (connect-flash) to send message on redirect 
})

module.exports = router