var express = require('express');
var app = express();

var server = app.listen(3001, () => {
    console.log('Websocket server started at 3001')
});

var io = require('socket.io')(server);

var loggedUsers = [];

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('login', function(data){
    console.log(data.firstname + " " + data.lastname + " logged");
    loggedUsers.push({socket, data})
  });

  socket.on('newMessage', function(data){
     console.log('new message received');
     
     socket.broadcast.emit('newMessage', data); //  all clients except sender
     /*loggedUsers.forEach((x) => { 
        //if (x.socket.id !== socket.id) {
        x.socket.emit('newMessage', data);
        //} 
     });*/ 
  });
});