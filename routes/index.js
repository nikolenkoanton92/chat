var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/anton', function(req, res, next) {
  var server = process.env.VCAP_APP_HOST ? process.env.VCAP_APP_HOST + ":" + process.env.VCAP_APP_PORT : 'localhost:3000';
  console.log('req.session.username')
  console.log(req.session.username)
  if (req.session.username) {
    var username = req.session.username;
    res.render('index', {
      title: 'Express',
      server: server,
      username: username
    });
  } else {
    res.redirect('/login');
  }
});

router.get('/login', function(req, res) {
  res.render('login');
});

router.post('/login', function(req, res) {
  console.log(req.body)
  req.session.username = req.body.username;
  res.redirect('/anton');

});

module.exports = router;
