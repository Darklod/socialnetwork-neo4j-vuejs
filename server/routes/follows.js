var session = require('../config/db').session;
var express = require('express')
var router = express.Router();

router.post('/', (req, res) => {
  var user1 = req.body.user1;
  var user2 = req.body.user2;

  session.run(
      'MATCH (a:User),(b:User) WHERE a.usr = $u1 AND b.usr = $u2 CREATE UNIQUE (a)-[r:FOLLOWS]->(b)', {
        'u1': user1,
        'u2': user2
      })
    .then((result) => {
      res.json({
        success: result.summary.counters._stats.relationshipsCreated > 0
      });
      session.close();
    })
    .catch((error) => {
      console.log(error);
      res.json({
        error: error
      });
    })
});
router.delete('/:id', (req, res) => {
  var id1 = req.body.id;
  var id2 = req.params.id;

  session.run(
      'MATCH (a:User)-[r]->(b:User) WHERE ID(a) = toInteger($id1) AND ID(b) = toInteger($id2) DELETE r', {
        'id1': id1,
        'id2': id2
      })
    .then((result) => {
      session.close();
      res.json({
        success: result.summary.counters._stats.relationshipsDeleted > 0
      });
    })
    .catch((error) => {
      res.json({
        error: error
      });
    });
});

module.exports = router;
