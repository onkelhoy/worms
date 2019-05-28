import { open_game, add_game } from './game.create'

const gameconf_elm = document.querySelector('div.game-config')
const gamelist_elm = document.querySelector('ul.gamelist')

document.querySelector('button.game-config').onclick = () => {
  gameconf_elm.classList.remove('hide')
}
document.querySelector('button.create-game').onclick = function () {
  let name = document.querySelector('.name').value
  open_game(name)
}


socket.on('message', msg => {
  console.log(msg)
})
socket.on('new_game', name => add_game(name, gamelist_elm))