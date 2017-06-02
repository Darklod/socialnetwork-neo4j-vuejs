var session = require('../config/db').session;
var async = require('async');
var moment = require('moment');
var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
  var q = req.query.q.toLowerCase();

  const nodes = [];
  session.run('MATCH (n:User) RETURN n')
    .subscribe({
      onNext: record => {
        nodes.push(record.get(0));
      },
      onCompleted: () => {
        session.close();
        res.json(nodes.reduce((result, node) => {
          if (node.properties.usr.toLowerCase().indexOf(q) != -1 ||
            node.properties.first.toLowerCase().indexOf(q) != -1 ||
            node.properties.last.toLowerCase().indexOf(q) != -1) {
            result.push({
              id: node.identity.low,
              username: node.properties.usr,
              password: node.properties.pwd,
              email: node.properties.email,
              phone: node.properties.phone,
              firstname: node.properties.first,
              lastname: node.properties.last,
              description: node.properties.descr,
              cover: node.properties.cover,
              image: node.properties.image
            });
          }
          return result;
        }, []));
      },
      onError: error => {
        console.log(error);
        res.json({
          error: error
        });
      }
    });
});
router.get('/:username', (req, res) => {
  var usr = req.params.username;

  var node = undefined;
  session.run('MATCH (n:User) WHERE n.usr = $usr RETURN n', {
      "usr": usr
    })
    .subscribe({
      onNext: record => {
        node = record.get(0);
      },
      onCompleted: () => {
        session.close();
        if (!node) {
          res.status(404).json({
            message: "Not Found",
            status: 404
          });
          return;
        }
        res.json({
          id: node.identity.low,
          username: node.properties.usr,
          password: node.properties.pwd,
          email: node.properties.email,
          phone: node.properties.phone,
          firstname: node.properties.first,
          lastname: node.properties.last,
          description: node.properties.descr,
          cover: node.properties.cover,
          image: node.properties.image
        });
      },
      onError: error => {
        console.log(error);
        res.json({
          error: error
        });
      }
    });
});
router.get('/me', (req, res) => {
  var id = req.user.id;

  var node = undefined;
  session.run('MATCH (n:User) WHERE ID(n) = toInteger($id) RETURN n', {
      "id": id
    })
    .subscribe({
      onNext: record => {
        node = record.get(0);
      },
      onCompleted: () => {
        session.close();
        if (!node) {
          res.status(404).json({
            message: "Not Found",
            status: 404
          });
          return;
        }
        res.json({
          id: node.identity.low,
          username: node.properties.usr,
          password: node.properties.pwd,
          email: node.properties.email,
          phone: node.properties.phone,
          firstname: node.properties.first,
          lastname: node.properties.last,
          description: node.properties.descr,
          cover: node.properties.cover,
          image: node.properties.image
        });
      },
      onError: error => {
        console.log(error);
        res.json({
          error: error
        });
      }
    });
});
router.patch('/:id', (req, res) => {
  var user = {
    id: req.params.id,
    email: req.body.email,
    phone: req.body.phone,
    pwd: req.body.password,
    usr: req.body.username,
    first: req.body.firstname,
    last: req.body.lastname,
    descr: req.body.description,
    cover: req.body.cover,
    image: req.body.image
  };

  if (user.pwd) {
    bcrypt.hash(user.pwd, 10).then(function(hash) {
      user.pwd = hash;
      return applyChanges(res, user);
    });
  } else {
    return applyChanges(res, user);
  }
});
router.delete('/:id', (req, res) => {
  var id = req.params.id;

  session.run(
      'MATCH (n:User)-[r]-() WHERE ID(n) = toInteger($id) DELETE r,n', {
        'id': id
      })
    .then((result) => {
      session.close();
      res.json({
        success: result.summary.counters._stats.nodesDeleted > 0
      });
    })
    .catch((error) => {
      res.json({
        error: error
      });
    })
});

router.get('/:username/followers', (req, res) => {
  var username = req.params.username;

  session.run(
      'OPTIONAL MATCH (a:User)<-[r:FOLLOWS]-(b) WHERE a.usr = $username RETURN b', {
        'username': username
      })
    .then((result) => {
      var nodes = result.records.map((record) => {
        record = record.get(0);

        if (record == null) return;

        return {
          id: record.identity.low,
          firstname: record.properties.first,
          lastname: record.properties.last,
          email: record.properties.email,
          phone: record.properties.phone,
          username: record.properties.usr,
          password: record.properties.pwd,
          description: record.properties.descr,
          cover: record.properties.cover,
          image: record.properties.image
        }
      });

      res.json(nodes[0] == null ? [] : nodes);
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Internal Server Error"
      });
      console.log(error);
    });
});

router.get('/:username/followed', (req, res) => {
  var username = req.params.username;

  session.run(
      'OPTIONAL MATCH (a:User)-[r:FOLLOWS]->(b) WHERE a.usr = $username RETURN b', {
        'username': username
      })
    .then((result) => {
      var nodes = result.records.map((record) => {
        record = record.get(0);

        if (record == null) return;

        return {
          id: record.identity.low,
          firstname: record.properties.first,
          lastname: record.properties.last,
          email: record.properties.email,
          phone: record.properties.phone,
          username: record.properties.usr,
          password: record.properties.pwd,
          description: record.properties.descr,
          cover: record.properties.cover,
          image: record.properties.image
        }
      });

      res.json(nodes[0] == null ? [] : nodes);
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Internal Server Error"
      });
      console.log(error);
    });
});

router.get('/me/messages/:username', (req, res) => {
  var me = req.user.username;
  var username = req.params.username;

  session.run(
      'OPTIONAL MATCH (a:User)-[r:MESSAGE]->(b:User)  WHERE a.usr = $username AND b.usr = $me RETURN r,a\
       UNION\
       OPTIONAL MATCH (a:User)<-[r:MESSAGE]-(b:User) WHERE a.usr = $username AND b.usr = $me RETURN r,a', {
        'username': username,
        'me': me
      })
    .then((result) => {
      var nodes = result.records.map((record) => {
        var relationship = record.get(0);

        if (relationship == null) return;

        var node = record.get(1);
        
        return {
          id: relationship.identity.low,
          text: relationship.properties.text,
          hour: relationship.properties.hour,
          date: relationship.properties.date,
          image: relationship.properties.image,
          isLoggedUser: node.identity.low == relationship.start
        }
      });
      
      //Remove null objects
      var newArray = new Array();
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i]) {
          newArray.push(nodes[i]);
        }
      }

      newArray = newArray.sort((a, b) => {
        return moment(a.hour, 'HH:mm').toDate() -
               moment(b.hour, 'HH:mm').toDate()
      }).sort((a, b) => {
        return moment(a.date, 'DD/MM/YYYY').toDate() -
               moment(b.date, 'DD/MM/YYYY').toDate()
      })

      res.json(newArray);
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Internal Server Error"
      });
      console.log(error);
    });
});

router.post('/me/messages/:username', (req, res) => {
  var me = req.user.username;
  var username = req.params.username;
  var message = req.body;

  //controlli
  message = {
    text: message.text,
    image: message.image
  }
  message["date"] = moment().format("DD/MM/YYYY")
  message["hour"] = moment().format("HH:mm")

  session.run(
      'OPTIONAL MATCH (a:User{usr:$me}),(b:User{usr:$username}) CREATE (a)-[r:MESSAGE $msg]->(b) ', {
        'username': username,
        'me': me,
        'msg': message
      })
      .then((result) => {
        res.json({
          success: result.summary.counters._stats.nodesCreated > 0
        });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Internal Server Error"
      });
      console.log(error);
    });
});

router.get('/me/follows/:username', (req, res) => {
  var u1 = req.user.username;
  var u2 = req.params.username;

  session.run(
      'MATCH (a:User)-[r]->(b:User) WHERE a.usr = $u1 AND b.usr = $u2 RETURN r', {
        'u1': u1,
        'u2': u2
      })
    .then((result) => {
      session.close();
      res.json({
        success: result.records.length > 0
      });
    })
    .catch((error) => {
      res.json({
        error: error
      });
    });
});

router.get('/me/posts', (req, res) => {
  var usr = req.user.username;
  var limit = req.query.limit || 20;

  var cql = 'MATCH (a:User{usr:$usr})-[:POSTS]->(s:Post)\
            RETURN a.usr as username,a.image as userImage,ID(s) as id, s.text as text,\
            s.image as postImage, s.date as date,s.hour as hour,\
            size((s)<-[:LIKES]-(:User)) as likes,size((a)-[:LIKES]->(s))>0 as liked\
            ORDER BY date DESC ,hour ASC\
            UNION\
            MATCH (a:User{usr:$usr})-[f:FOLLOWS]->(b:User)-[:POSTS]->(s:Post)\
            RETURN b.usr as username,b.image as userImage,ID(s) as id,s.text as text,\
            s.image as postImage, s.date as date ,s.hour as hour,\
            size((s)<-[:LIKES]-(:User)) as likes,size((a)-[:LIKES]->(s))>0 as liked\
            ORDER BY date DESC ,hour ASC';

  session.run(cql,{usr:usr}).then((results) => {
    results = results.records.map((record) => {
      var obj = {};
      record.keys.forEach((key,i) => {
        obj[key] = record._fields[i];
      });
      obj['id'] = obj['id'].low;
      obj['likes'] = obj['likes'].low;
      return obj;
    })
    results = results.slice(0, limit).sort((a, b) => {
      return moment(b.hour, 'HH:mm').toDate() -
             moment(a.hour, 'HH:mm').toDate()
    }).sort((a, b) => {
      return moment(b.date, 'DD/MM/YYYY').toDate() -
             moment(a.date, 'DD/MM/YYYY').toDate()
    })
    res.json(results);
  });
});

router.post('/me/posts', (req, res) => {
  var post = {
    text: req.body.text,
    date: moment().format('DD/MM/YYYY'),
    hour: moment().format('HH:mm'),
    image: req.body.image
  }
  var tags = req.body.tags;

  var error = "";
  if (post.text == undefined) {
    error = "text field is required";
  } else if (post.text == "") {
    error = "text field cannot be empty"
  }
  if (error != "") {
    return res.status(500).json({
      success: false,
      error: error
    });
  }

  var id = req.user.id;

  var cql = 'MATCH (a:User) WHERE ID(a) = toInteger($id) \
             CREATE (b:Post) SET b = $post \
             CREATE (a)-[:POSTS]->(b)';

  var data = { post: post};
  data["id"] = id;

  if(tags) {
    tags = '{tag:"' + tags.join('"},{tag:"') + '"}';
    cql = 'MATCH (u:User) WHERE ID(u) = toInteger($id) \
           CREATE (p:Post) SET p = $post \
           CREATE (u)-[:POSTS]->(p)\
           FOREACH (props IN [' + tags + '] |\
            MERGE (t:Tag{tag:props.tag})\
            CREATE (p)-[:HAS]->(t))'
  }

  console.log(cql);

  session.run(cql, data)
    .then((results) => {
      console.log(results);
      res.json({
        success: true
      });
    }).catch((error) => {
      console.log(error);
      res.status(500).json({
        success: false,
        error: error
      });
    });
});

router.get('/posts/:tag', (req, res) => {
  var tag = req.params.tag;
  var usr = req.user.username;

  var cql = 'MATCH (u:User{usr:$usr}),(a:Post)-[r:HAS]->(b:Tag) WHERE b.tag = $tag RETURN a.date as date,\
			       a.image as image, a.hour as hour, a.text as text, ID(a) as id,\
             size((a)<-[:LIKES]-(:User)) as likes, size((u)-[:LIKES]->(a))>0 as liked\
             ORDER BY a.date DESC ,a.hour ASC';

  session.run(cql, {tag: tag, usr: usr})
    .then((results) => {
        results = results.records.map((record) => {
          var obj = {};
          record.keys.forEach((key,i) => {
            obj[key] = record._fields[i];
          });
          obj['id'] = obj['id'].low;
          obj['likes'] = obj['likes'].low;
          return obj;
        })
      res.json(results);
    }).catch((error) => {
      console.log(error);
      res.status(500).json({
        success: false,
        error: error
      });
    });
});

router.get('/:username/posts', (req, res) => {
  var usr = req.params.username;

  session.run(
      'OPTIONAL MATCH (a:User)-[r:POSTS]->(b:Post) WHERE a.usr = $usr RETURN b', {
        'usr': usr
      })
    .then((result) => {
      var posts = result.records.map((record) => {
        record = record.get(0);

        if (record == null) return;

        return {
          id: record.identity.low,
          date: record.properties.date,
          hour: record.properties.hour,
          text: record.properties.text,
          image: record.properties.image
        }
      });

      res.json(posts[0] == null ? [] : posts);
    })
    .catch((error) => {
      res.json({
        status: 500,
        message: "Internal Server Error",
        error
      });
    });
});

router.post('/me/likes/:post', (req, res) => {
  var id = req.params.post;
  var usr = req.user.username;

  session.run(
    'OPTIONAL MATCH (a:User{usr:$usr}),(b:Post) WHERE ID(b) = toInteger($id) CREATE (a)-[r:LIKES]->(b)', {
      'usr': usr,
      'id': id
    })
  .then((result) => {
    res.json({success: result.summary.counters._stats.nodesCreated > 0});
  })
  .catch((error) => {
    res.json({
      status: 500,
      message: "Internal Server Error",
      error
    });
  });
});

router.delete('/me/likes/:post', (req, res) => {
  var id = req.params.post;
  var usr = req.user.username;

  session.run(
    'OPTIONAL MATCH (a:User{usr:$usr})-[r:LIKES]->(b:Post) WHERE ID(b) = toInteger($id) DELETE r', {
      'usr': usr,
      'id': id
    })
  .then((result) => {
    console.log(result.records);
    res.json({success: result.summary.counters._stats.nodesDeleted > 0});
  })
  .catch((error) => {
    res.json({
      status: 500,
      message: "Internal Server Error",
      error
    });
  });
});

//   POST   /me/follows/:user
//   DELETE /me/follows/:user

function applyChanges(res, user) {
  var cql = "SET ";
  for (var prop in user) {
    if (user[prop]) {
      cql += "n." + prop + " = \"" + user[prop] + "\",";
    }
  }
  cql = cql.slice(0, -1); //Remove last comma

  session.run('MATCH (n:User) WHERE ID(n) = toInteger($id) ' + cql, user)
    .then((result) => {
      session.close();
      return res.json({
        success: result.summary.counters._stats.propertiesSet > 0
      });
    }).catch((error) => {
      return res.json({
        error: error
      });
    });
}

module.exports = router;
