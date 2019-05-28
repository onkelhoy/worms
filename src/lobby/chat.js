let user_info = window.sessionStorage.user
if (!user_info)
  user_info = {name: 'Hank'} // default
else
  user_info = JSON.parse(user_info)


socket.on('message', message)
const chat = document.querySelector('.chat > .messages')
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