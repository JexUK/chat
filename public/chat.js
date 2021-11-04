// Make the connection to the Websocket in order to do, well... everything.
var socket = io.connect('http://localhost:9000');

// Query the DOM HTML elements in order to recieve data.
var message = document.getElementById('message'),
    handle = document.getElementById('handle'),
    btn = document.getElementById('send'),
    output = document.getElementById('output'),
    feedback = document.getElementById('feedback');

// Emit events to the Websocket.
btn.addEventListener('click', function(){
    socket.emit('chat', {
        message: message.value,
        handle: handle.value
    });
    message.value = "";
});

// Attach event listener to message input field
message.addEventListener('keypress', function(){
    socket.emit('typing', handle.value);
})

// get existing messages
socket.on('initial-connection', function(messages) {
	for(var m of messages) {
		appendMessage(m);
	}
});

// Listen for events
socket.on('chat', appendMessage);

// If someone is typing, send that data to other active users.
socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' + data + ' is typing...</em></p>';
});

// Retrieve old messages if a user is logging back in.
function appendMessage(data) {
	feedback.innerHTML = '';
    output.innerHTML += '<p><strong>' + data.handle + '</strong> ' + data.message + '</p>';
}