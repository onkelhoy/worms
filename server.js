const http = require('http')
const app = require('./config/server.config')

const server = http.createServer(app)

function listen () {
  console.log('server running on ' + app.get('port'))
}
server.listen(app.get('port'), listen)
