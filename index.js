// Import our external dependencies in order to let everything work.
var express = require('express');
var socket = require('socket.io');

// Setup the Express application to get our HTML up.
var app = express();
var server = app.listen(9000, function(){
    console.log('[APP=>EXPRESS] JexChat is listening on port 9000.');
});

// A placeholder while waiting for messages to be send and recieved.
var messages = [];

// Static files for the Express app to display.
app.use(express.static('public'));

// Setup the Websocket to allow connections between multiple clients.
var io = socket(server);
io.on('connection', function(socket){

    var address = socket.handshake.address;
    console.log('[INFO=>WS] Connected to client: ' + address.address + ':' + address.port);

    console.log('[INFO=>WS] Socket connection created with ID: ', socket.id);
	
	socket.emit('initial-connection', messages);
	
    // Handle chat event
    // When I hear chat message sent to me, fire callback 
    // function to receive data and pass function
    socket.on('chat', function(data){

        // Checks to make sure that data is valid to send to socket.
        try {
            if (!data.message || !data.handle) return console.error('Null message/handle sent to socket.');
            if (data.message.length < 1) return console.error('Message too short to be sent to socket.');
            if (data.handle.length < 3) return console.error('Handle too short to be sent to socket.');
        } catch (e) { console.error(e) }

        // Log the chat event to the console.
        console.log('[APP=>MESSAGE] Message recieved: ' + data.message + ' at ' + new Date().toLocaleDateString());

		messages.push(data);
        io.sockets.emit('chat', data);
    });

    // Broadcast a typing event when someone on the app is typing.

    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data);
    });
});