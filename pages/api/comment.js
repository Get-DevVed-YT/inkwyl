const MongoClient = require('mongodb').MongoClient;
const v4 = require('uuid').v4;
const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const assert = require('assert');

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

function findUser(db, userLink, callback) {
  const collection = db.collection('users');
  collection.findOne({userLink}, callback);
} 

function makeComment(db, comment, username, userlink, storyLink, callback) {
  const collection = db.collection('comments');
    collection.insertOne(
      {
        username,
        userlink,
        storyLink,
        comment
      },
      function(err, commentCreated) {
        assert.equal(err, null);
        callback(commentCreated);
      },
    );
  };
  
  export default (req, res) => {
  if (req.method === 'POST') {
    if (!('token' in req.cookies)) {
      res.status(401).json({message: 'Unable to auth'});
      return;
    }    let decoded;
    const token = req.cookies.token;
    if (token) {
      try {
        decoded = jwt.verify(token, jwtSecret);
      } catch (e) {
        console.error(e);
      }
    }
    try {
      assert.notEqual(null, req.body.userlink, 'Sign in and provide a userlink');
      assert.notEqual(null, req.body.username, 'Sign in and provide a username');
      assert.notEqual(null, req.body.comment, 'Please provide a comment.');
      assert.notEqual(null, req.body.storyLink, 'Please provide a storyLink.');
    } catch (bodyError) {
     return res.status(403).json({error: true, message: bodyError.message});
    }
  client.connect(function(err) {
    var userlinktemp = req.body.userlink;
    var db = client.db(dbName)
    findUser(db, userlinktemp, function(err, result){
      if (err) {
        console.log(err)
        return res.json({ err })
      } else if (!result) {
        return res.status(403).res.json({error: true, message: "User not found, either banned or not registered"})
      } else {
      assert.equal(null, err);
      console.log('Connected to MongoDB server =>');
     var storyLink = req.body.storyLink;
    var userlink = req.body.userlink;
    var username = req.body.username;
    var comment = req.body.comment;
    var db = client.db(dbName)
    makeComment(db, comment, username, userlink, storyLink, function(result){
      console.log(result)
      var succeeded = true
      return res.json(JSON.stringify({succeeded}))
    });
     }
      })
    })
  }
}
