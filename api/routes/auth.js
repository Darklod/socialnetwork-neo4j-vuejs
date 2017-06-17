const express = require('express')
const router = express.Router();

var _ = require('lodash');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var session = require('../config/db').session;

router.post('/register', (req, res) => {
  if(!req.body.email || !req.body.password) {
    res.json({ success: false, message: 'Please enter email and password.' });
  } else {
    var user = {
      email: req.body.email,
      pwd: req.body.password,
      usr: req.body.username,
      first: req.body.firstname,
      last: req.body.lastname,
      image: req.body.image,
      cover: req.body.cover
    };

    var errors = [];
    for (var i in user){
        var key = i;
        var value = user[i];

        if(!value){
          errors.push(key + " is required");
        }
    }

    if(errors.length > 0) {
      res.status(400).json({ success: false, errors: errors  });
      return;
    }

    bcrypt.hash(user.pwd, 10).then(function(hash) {
        user.pwd = hash;

        session.run('MATCH (n:User {usr: $username}) RETURN n', { username: user })
          .then((results) => {
              if (!_.isEmpty(results.records)) {
                  res.json({ success:false, error: 'username already in use' });
              } else {
                session.run('CREATE (n:User) SET n = $user', { 'user': user })
                   .then((results) => {
                      session.close();
                      if(results.summary.counters._stats.nodesCreated > 0){
                        return res.json({ success: true, message: 'Successfully created new user.' });
                      }
                        return  res.json({ success: false, message: ''});
                   }).catch((error) => {
                      return res.json({ success: false, error: error });
                   });
              }
          })
    })
  }
});
router.post('/login', (req, res) => {
  var username = req.body.username;
  var password = req.body.password;

  session.run('MATCH (n:User{ usr: $usr }) RETURN n', { 'usr': username }).then((results) => {
       session.close();
        if(!results.records[0]){
          return res.send({ success: false, message: 'Authentication failed. Passwords did not match.' });
        }
        var hash = results.records[0]._fields[0].properties.pwd;

        bcrypt.compare(password, hash).then(function(result) {
            user = {
                id: results.records[0]._fields[0].identity.low,
                email: results.records[0]._fields[0].properties.email,
                username: results.records[0]._fields[0].properties.usr,
                firstname: results.records[0]._fields[0].properties.first,
                lastname: results.records[0]._fields[0].properties.last,
                image: results.records[0]._fields[0].properties.image,
                cover: results.records[0]._fields[0].properties.cover
            }

            var token = jwt.sign(user, config.jwtSecret, {
              expiresIn: 86400 // 24 hours in seconds
            });

            return res.json({ success: true, token: 'JWT ' + token });
         });
     }).catch((error) => {
        return res.json({ success: false, error: error });
     });
})

module.exports = router;
