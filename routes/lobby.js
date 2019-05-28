const express = require('express')
const { exists } = require('../events/main')
const router = express.Router()
const fs = require('fs')
const path = require('path')

router.route('/:id')
  .get((req, res, next) => {
    if (!exists(req.params.id))
      return next()

    req.session.nsp_id = req.params.id
    res.redirect('/lobby')
  })

router.route('/')
  .get((req, res, next) => {
    if (!req.session.nsp_id || !exists(req.session.nsp_id))
      return next()

    let tex_files = fs.readdirSync(path.resolve(__dirname, '../public/content/texture'))
    const vars = {
      id: req.session.nsp_id,
      title: 'lobby',
      textures: tex_files
    }
    res.render('menu/lobby.pug', vars)
  })

router.all('*', function (req, res) {
  res.redirect('/') // use middleware (connect-flash) to send message on redirect 
})

module.exports = router