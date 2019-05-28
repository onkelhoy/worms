import './style/lobby.scss'
import './lobby/chat'
import './lobby/DOM'
import Setup from './lobby/mapSetup'

socket.on('new_player', add_player)
socket.on('player_leave', remove_player)

// DOM setup
const popup_elm = document.querySelector('.popup')

function add_player (player) {
  console.log('new player')
}
function remove_player (player) {
  console.log('player left')
}
function popup (message) {
  popup_elm.timer = setTimeout(closePopup, 3000)
  popup_elm.querySelector('h3').innerText = 'New message'
  popup_elm.querySelector('p').innerText = message
  popup_elm.classList.toggle('hide')
}
function closePopup () {
  clearTimeout(popup_elm.timer)

  popup_elm.classList.toggle('hide')
}