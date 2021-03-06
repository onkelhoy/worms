const express = require('express')
const router = express.Router()

// setting up a game I quess 
// first security (check if client logged in)
router.use('/', function (req, res, next) {
  // check credentials

  console.log(process.env.MODE)
  if (process.env.MODE !== 'dev')
    return res.redirect('/')

  next()
})
// and then if they has access to current match

router.get('/', function (req, res) {
  res.render('test/main.pug', {
    title: 'Testing Worms Game'
  })
})

module.exports = router