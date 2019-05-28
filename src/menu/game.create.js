/**
 * opens the game 
 * @param {string} name
 * @return {Promise} state 
 */
function open_game (name) {
  let nsp = name.replace(/\s/g, '-')
  socket.emit('create_namespace', nsp)
}
/**
 * 
 * @param {DOM} gamelist_elm
 * @param {DOM} gameconf_elm 
 * @returns {Object}
 */
function add_game (name, gamelist_elm) {
  const game = document.createElement('li')
  const gamelink = document.createElement('a')

  gamelink.innerText = name 
  gamelink.href = '/lobby/'+name

  game.appendChild(gamelink)
  gamelist_elm.appendChild(game)

  return {name, game}
}

module.exports = { open_game, add_game }