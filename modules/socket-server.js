var ios = require('socket.io-express-session');
var redis = require('socket.io-redis');
var Redis = require('redis').createClient;
var pub = Redis(6379, '127.0.0.1');
var sub = Redis(6379, '127.0.0.1', {
  detect_buffers: false
});

var sockets = {};

module.exports = function(io, app) {
  io.adapter(redis({
    host: '127.0.0.1',
    port: 6379,
    pubClient: pub,
    subClient: sub
  }));
  var nsp = io.of('/project-chat');
  nsp.use(ios(app.session));

  nsp.on('connection', function(socket) {
    var username = socket.handshake.session.username;

    socket.on('join:to:room', function(room) {
      socket.join(room);
    });
    console.log('user connected');


    var connectedWelcomeUser = JSON.stringify({
      username: username,
      message: 'Welcome ' + username + ' to the chat'
    });

    var connectedNewUser = JSON.stringify({
      username: username,
      message: 'New User ' + username + ' Come to Chat'
    });

    pub.publish('message', 'New User ' + username + ' Come to Chat');

    // socket.emit('connected', connectedWelcomeUser);
    // socket.broadcast.emit('connected', connectedNewUser);

    socket.on('disconnect', function() {
      console.log('user disconnected');
      nsp.emit('offline', username);
      // nsp.emit('disconnected', 'User ' + username + ' disconected ');
      pub.publish('message', 'User ' + username + ' disconnected');
      socket.leave();
    });

    // socket.on('chat message', function(msg) {
    //   var message = username + ':' + ' ' + msg;
    //   nsp.emit('chat message', message);
    // });

    sub.subscribe('message');
    socket.on('chat message', function(msg) {
      console.log('------------------------')
      console.log('chat message')
      console.log(msg)
      var message = username + ' : ' + msg;
      pub.publish('message', message);
    });

    sub.on('subscribe', function(channel, count) {
      // pub.publish('message', 'Cool channel');
    });

    sub.on('message', function(channel, message) {
      console.log('sub on ----------------')
      console.log('chat message')
      console.log(channel + " : " + message)
      socket.emit(channel, message);
    });
  });
};
