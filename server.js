const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const sanitizeHtml = require('sanitize-html');
const port = process.env.PORT || 8080
const jsdom = require("jsdom");
const short = require('short-uuid');
const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('12345abcdefGHIJKL', 5)
const { JSDOM } = jsdom;
const cookieParser = require("cookie-parser");
var showdown  = require('showdown'),
    converter = new showdown.Converter()
var sanitize = (text) => {
	try {
		text = (new JSDOM(converter.makeHtml(sanitizeHtml(text)))).window.document.querySelector("p").innerHTML
	} catch {
		text = (new JSDOM(converter.makeHtml(sanitizeHtml(text)))).window.document.innerHTML
	}
	return text
} 
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/client/index.html');
});
app.use(cookieParser)
app.use('/static',express.static('client'))
const io = require('socket.io')(server);
app.get('/sanitize', (req, res) => {
	data = decodeURI(req.query.string);
	res.send(sanitize(data));
});
app.get('/data')
const users = {};

io.on('connection', socket => {
	socket.on('new-user', name => {
		users[socket.id] = name;
		socket.broadcast.emit('user-connected', name);
	});
	socket.on('send-chat-message', message => {
		message = sanitize(message)
		socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] });
	});
	socket.on('disconnect', () => {
		socket.broadcast.emit('user-disconnected', users[socket.id]);
		delete users[socket.id];
	});
	socket.emit('get')
});

server.listen(port, () => {
	console.log(`listening on *:${port}`);
});