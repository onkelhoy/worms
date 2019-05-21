const express = require('express')
const router = express.Router()

// setting up a game I quess 
// first security (check if client logged in)
router.use('/', function (req, res, next) {
  // check credentials
<<<<<<< HEAD
=======
  console.log(process.env.MODE)
>>>>>>> 32eb3481bd9daa2e4c88332ada991eb65160669a
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