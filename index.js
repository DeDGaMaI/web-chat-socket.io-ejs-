const express = require('express');
const app =  express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require("fs");
var online = 0

app.get('/chat', (req, res) =>{
    res.render("index.ejs");
})

io.sockets.on('connection', function(socket) {
    socket.on('username', function(username) {
        socket.username = username;
        io.emit('is_online', '🔵 <i>' + socket.username + ' joined the chat..</i>');
		fs.appendFileSync("chat.txt", "[" + Date() + "] " + socket.username + " joined the chat..\n");
		online = online + 1;
		console.log(online);
    });

    socket.on('disconnect', function(username) {
        io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
		fs.appendFileSync("chat.txt", "[" + Date() + "] " + socket.username + " left the chat..\n");
		online = online - 1;
    })

    socket.on('chat_message', function(message) {
		if(message == "online")
		{
			io.emit('chat_message',"[SERVER]: " + online);
		}
		if(message.startsWith("/write"))
		{
			io.emit('chat_message', "[SERVER]: " + message.slice(7, message.length));
		}
		else {
	        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
			fs.appendFileSync("chat.txt", "[" + Date() + "] " + socket.username + ":" + message + "\n");
		}
	});

});

const server = http.listen(8080, ()=>{
    console.log("listening on port : 8080");
})