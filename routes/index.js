<<<<<<< HEAD
const express = require('express')
const router = express.Router()

router.use('/game', require('./game'))
router.use('/lobby', require('./lobby'))
router.use('/', require('./menu'))

router.all('*', (req, res) => {
  res.end('404 page not found')
})
=======
const express = require('express')
const router = express.Router()

router.use('/game', require('./game'))
router.use('/test', require('./test'))
router.use('/lobby', require('./lobby'))
router.use('/', require('./menu'))

router.all('*', (req, res) => {
  res.end('404 page not found')
})
>>>>>>> 92864930941ff5be66afca76a24276c5a16939b8
module.exports = router