let io = null

function init (_io) {
  io = _io
}
/**
 * Creates a new namespace based on the nsp_name
 * @param {string} nsp_name 
 */
function create (nsp_name) {
  nsp_name = nsp_name.replace(/\s/g, '-')
  
  if (io.nsps['/'+nsp_name] !== undefined) {
    this.emit('message', 'game room already exists')
    return 
  }
  

  let nsp = io.of('/'+nsp_name)
  nsp.connections = 0
  io.emit('new_game', nsp_name)
  
  nsp.on('connection', welcome)
}

function welcome (client) {
  this.connections++
  client.broadcast.emit('new_player', {id: client.id})
  client.on('message', msg => {
    this.emit('message', msg)
  })

  client.on('disconnect', leave)
}
function leave () {
  let nsp = this.nsp
  nsp.connections--
  if (nsp.connections === 0) 
    destroy(nsp.name)
  else // notify the rest
    nsp.emit('player_leave', this.id)
}
function destroy (name) {
  delete io.nsps[name]
  io.emit('game_remove', name)
}

module.exports = { init, create }