const socket = io('')
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return undefined;
}
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
var uname
var namecookie = getCookie('uname')
if(namecookie === undefined) {
    uname = prompt("What is your name? ", "Guest")
    setCookie('uname', uname, 5)
}
else {
    uname = namecookie
}
appendMessage(`${uname} (you) Joined`)
socket.emit('new-user', uname)
socket.on('chat-message', (data) => {
    console.log(data)
    appendMessage(`${data.name}: ${data.message}`)
})
socket.on('get', () => {
    socket.emit('new-user', uname)
})
socket.on('user-connected', name => {
    appendMessage(`${name} connected`)
})
socket.on('user-disconnected', name => {
    appendMessage(`${name} disconnected`)
})
messageForm.addEventListener('submit', e => {
    e.preventDefault()
    if(messageInput.value.length !== 0) {
        const message = messageInput.value
        appendMessage(`${uname} (you): ${message}`)
        socket.emit('send-chat-message', message)
        messageInput.value = ''
    }
})
function appendMessage(message) {
    const messageElement = document.createElement('div')
    messageElement.classList.add('card')
    messageElement.innerHTML = message;
    messageContainer.append(messageElement)
}