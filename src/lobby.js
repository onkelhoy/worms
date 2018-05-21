import './style/lobby.scss'
let user_info = window.sessionStorage.user
if (!user_info)
  user_info = {name: 'Hank'} // default
else
  user_info = JSON.parse(user_info)

socket.on('new_player', add_player)
socket.on('player_leave', remove_player)
socket.on('message', message)

// DOM setup
const chat = document.querySelector('.chat > .messages')
const popup_elm = document.querySelector('.popup')
document.querySelector('.chat > textarea').onkeyup = function (e) {
  if (e.keyCode === 13 && !e.shiftKey) {
    socket.emit('message', {user: {id:socket.id, name:user_info.name}, msg: this.value})
    this.value = ''
  }
}

function message (msg) {
  let textwrapper = document.createElement('div')
  let person = document.createElement('p')
  person.classList.add('person')
  person.innerText = msg.user.name + ' says'
  let text = document.createElement('p')
  text.innerText = msg.msg // for now.. later with p elements

  textwrapper.appendChild(person)
  textwrapper.appendChild(text)
  if (msg.user.id === socket.id) {
    textwrapper.classList.add('me')
    person.innerText = 'you say'
  }

  let date = document.createElement('span')
  let d = new Date()
  date.innerText = `${d.getHours()}:${d.getMinutes()}`
  person.appendChild(date)
  chat.appendChild(textwrapper) 
} 
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