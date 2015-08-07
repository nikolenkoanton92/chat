$(document).ready(function() {
  var socket = io().connect('http://localhost/anton');

  $('form').submit(function() {
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });

  socket.on('chat message', function(msg) {
    $('#messages').append($('<li>').text(msg));
  });

  socket.on('connected', function(message) {
    var msg = JSON.parse(message);
    console.log(msg)
    console.log(msg.username)
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
    // $('#messages').append($('<li>').text(msg));
    $('#messages').append($('<li>').text(msg.username + ' :' + ' ' + msg.message));
  });
});
