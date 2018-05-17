const express = require('express')
const router = express.Router()

// setting up a game I quess 
// first security (check if client logged in)
router.use('/', function (req, res, next) {
  // check credentials

  next()
})
// and then if they has access to current match

router.get('/', function (req, res) {
  res.render('game/main.pug', {
    title: 'HAHA BAJS'
  })
})

module.exports = router