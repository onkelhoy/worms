const http = require('http')
const app = require('./config/server.config')
const { init } = require('./events/main')

const server = http.createServer(app)
init(server)

function listen () {
  console.log('server running on ' + app.get('port'))
}
server.listen(app.get('port'), listen)
