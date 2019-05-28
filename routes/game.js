<<<<<<< HEAD
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

=======
const express = require('express')
const router = express.Router()

// setting up a game I quess 
// first security (check if client logged in)
router.use('/', function (req, res, next) {
  // check credentials
  console.log(req)

  next()
})
// and then if they has access to current match

router.get('/', function (req, res) {
  res.render('game/main.pug', {
    title: 'Worms Game'
  })
})

>>>>>>> 92864930941ff5be66afca76a24276c5a16939b8
module.exports = router