const express = require('express')
const router = express.Router()

router.use('/game', require('./game'))
router.use('/lobby', require('./lobby'))
router.use('/', require('./menu'))

router.all('*', (req, res) => {
  res.end('404 page not found')
})
module.exports = router