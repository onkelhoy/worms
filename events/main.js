let nsp = require('./nsp')
let io = null 

/**
 * initialize function (void) 
 * Needs the http or (server as we call it in server.js)
 * @param {server} http 
 */
function init (http) {
  io = require('socket.io')(http)
  nsp.init(io)

  // Ah look, welcome new one!
  io.on('connection', welcome)
}

/**
 * the welcome function (void)
 * @param {socket} client 
 */
function welcome (client) {
  console.log('client connected ' + client.id)

  client.on('create_namespace', nsp.create)
  client.on('disconnect', goodbye.bind(null, client))
}
/**
 * The goodbye funciton (when someone leaves)
 * must notify all clients if person is in game-lobby
 * @param {socket} client 
 */
function goodbye (client) {
  console.log(client.id + ' disconnected')
}

function rooms () {
  return Object.keys(io.nsps)
}
function exists (nsp) {
  return io.nsps['/'+nsp] != undefined
}


module.exports = { init, rooms, exists } 