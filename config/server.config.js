const express = require('express')
const bparser = require('body-parser')
const path = require('path')
const dotenv = require('dotenv')
const app = express()
// loading the enviroment variables
dotenv.config()
app.set('port', process.env.SERVER_PORT) // setting it to quick access

// setting the use-ings
app.use(bparser.json())
app.use(bparser.urlencoded({
  extended: true
}))
app.use(express.static(path.join(__dirname, '../public')))

app.use('/', require('../routes/index'))

// exporting the configurated app
module.exports = app 