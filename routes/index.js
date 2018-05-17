const express = require('express')
const router = express.Router()

router.route('/')
  .get((req, res) => {
    res.send('hello henry')
  })
  .post((req, res) => {
    res.end('bajs')
  })

module.exports = router