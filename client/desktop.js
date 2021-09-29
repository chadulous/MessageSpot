const socket = io('https://nodedotjs-chat-app.herokuapp.com/')
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
var dark = true;
function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
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
var themecookie = getCookie('dark')
setCookie('dark', dark, 365)
console.log(themecookie)
dark = eval(themecookie)
if(!dark) {
    var element = document.body.querySelectorAll('*');
    var icon = document.body.querySelector('.mode');
    element.forEach(
      function(currentValue, currentIndex, listObj) {
        currentValue.classList.toggle('dark')
      },
      "this"
    );
    document.body.classList.toggle('dark');
    icon.classList.toggle("bi-moon-fill");
    icon.classList.toggle("bi-brightness-high-fill");
}
var uname
var namecookie = getCookie('uname')
var checkuname = () => {
    if (uname === undefined) {
        window.setTimeout(checkuname, 100);
    }
    else {
        return
    }
}
var popuppromt = () => {
    var popup = document.body.querySelector('.popup')
    popup.querySelector('.popuptext').addEventListener('submit', e => {
        e.preventDefault()
        uname = popup.querySelector('.popuptext').querySelector('input').value
        popup.classList.toggle("show")
    })
    checkuname()
}
if(namecookie === undefined) {
    uname = getName()
    setCookie('uname', uname, 5)
}
else {
    uname = namecookie
}
appendMessage(`${uname} (you) Joined`)
socket.emit('new-user', `${uname} (desktop)`)
socket.on('chat-message', (data) => {
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
        const message = httpGet(`/sanitize?string=${encodeURI(messageInput.value)}`)
        appendMessage(`<p>${uname} (you): ${message}</p>`)
        socket.emit('send-chat-message', message)
        messageInput.value = ''
    }
})
function appendMessage(message) {
    const messageElement = document.createElement('div')
    messageElement.classList.add('card')
    if(dark) {
        messageElement.classList.add('dark')
    }
    messageElement.innerHTML = message;
    if(dark) {
        messageElement.querySelectorAll('*').forEach(
            function(currentValue, currentIndex, listObj) {
            currentValue.classList.add('dark')
            },
            "this"
        );
    }
    messageContainer.append(messageElement)
}