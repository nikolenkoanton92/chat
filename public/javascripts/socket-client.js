$(document).ready(function() {
  var room = window.location.pathname;
  var socket = io('/project-chat'); //io('/anton');

  $('form').submit(function() {
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });

  socket.emit('join:to:room', room);

  socket.on('message', function(msg) {
    $('#messages').append($('<li>').text(msg));
  });

  socket.on('connected', function(message) {
    var msg = JSON.parse(message);
    $('#messages').append($('<li>').text(msg.message));
    $('#online-list').append($('<li>').text(msg.username));
  });

  // socket.on('online', function(username) {
  //   $('#online-list').append($('<li>').text(username));
  // });

  // socket.on('offline', function(username) {
  //   $('#online-list > li:contains(' + username + ')').remove();
  // })
  socket.on('error', function(err) {
    console.log('error : ', err);
  });
  socket.on('disconnected', function(msg) {
    $('#messages').append($('<li>').text(msg.username + ' :' + ' ' + msg.message));
  });
});
