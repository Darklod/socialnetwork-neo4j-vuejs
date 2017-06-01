var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var session = require('../config/db').session;
var config = require('../config/config');

module.exports = function(passport) {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = config.jwtSecret;

  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    session.run('MATCH (n:User) WHERE ID(n) = toInteger($id) RETURN n', {
        "id": jwt_payload.id
      })
      .then((results) => {
        if (results.records.length < 1)
          done(null, false);
        else {
          var record = results.records[0].get(0);

          var user = {
            id: record.identity.low,
            firstname: record.properties.first,
            lastname: record.properties.last,
            email: record.properties.email,
            username: record.properties.usr,
            password: record.properties.pwd
          }

          done(null, user);
        }
      })
      .catch((error) => {
        done(error, false);
      });
  }));
};
