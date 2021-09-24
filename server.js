const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const sanitizeHtml = require('sanitize-html');
var showdown  = require('showdown'),
    converter = new showdown.Converter()
var sanitize = (text) => {
	return converter.makeHtml(sanitizeHtml(text))
} 
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/client/index.html');
});
app.use('/static',express.static('client'))
const io = require('socket.io')(server);

const users = {};

io.on('connection', socket => {
	socket.on('new-user', name => {
		users[socket.id] = name;
		socket.broadcast.emit('user-connected', name);
	});
	socket.on('send-chat-message', message => {
		socket.broadcast.emit('chat-message', { message: sanitize(message), name: users[socket.id] });
	});
	socket.on('disconnect', () => {
		socket.broadcast.emit('user-disconnected', users[socket.id]);
		delete users[socket.id];
	});
	socket.emit('get')
});

server.listen(process.env.PORT || 8080, () => {
	console.log(`listening on *:${process.env.PORT || 8080}`);
});