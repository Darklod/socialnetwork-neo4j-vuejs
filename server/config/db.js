const db = require('./config.js').database;
const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver("bolt://" + db.host, neo4j.auth.basic(db.username,
  db.password));
const session = driver.session();

driver.onCompleted = function() {
  console.log('Driver completed');
}

driver.onError = function(error) {
  console.log('Driver instantiation failed', error);
};

exports.driver = driver;
exports.session = session;
