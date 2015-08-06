$(document).ready(function() {
  var socket = io();

  $('form').submit(function() {
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });

  socket.on('chat message', function(msg) {
    $('#messages').append($('<li>').text(msg));
  });

  socket.on('connected', function(msg) {
    $('#messages').append($('<li>').text(msg));
  });

  socket.on('disconnected', function(msg) {
    console.log(1)
    $('#messages').append($('<li>').text(msg));
  });
});
