const socket = require('socket.io');
const express = require('express');
const path = require('path');

const app = express();

let messages = [];
let users = [];

app.use(express.static(path.join(__dirname, '/client')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/index.html'));
});

/* Creating server */
const server = app.listen(8000, () => {
  console.log('Server is running on Port:', 8000)
});
const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  socket.on('login', userName => { 
    users.push({author: userName, id: socket.id});
    socket.broadcast.emit('message', ); 
  });
  
  socket.on('message', (message) => { 
    console.log('Oh, I\'ve got something from ' + socket.id) 
    messages.push(message);
    socket.broadcast.emit('message', message);
    console.log('I send message from ' + socket.id);
  });
  
  console.log('I\'ve added a listener on message event \n');
  socket.on('disconnect', () => {
    users = users.filter(user => (user.id !== socket.id));
    console.log('Oh, socket ' + socket.id + ' has left.')
  });
});