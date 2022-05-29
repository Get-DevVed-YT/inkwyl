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

function makeStory(db, title, story, username, userlink, callback) {
  const collection = db.collection('stories');
  const id = v4();
  const link = '/story/'+id;
    collection.insertOne(
      {
        username,
        title,
        storyId: id,
        storyLink: link,
        story,
        userlink
      },
      function(err, storyCreated) {
        assert.equal(err, null);
        callback(storyCreated);
      }
    );
  }
  
  export default (req, res) => {
  if (req.method === 'POST') {
    if (!('token' in req.cookies)) {
      res.status(401).json({message: 'Unable to auth'});
      return;
    }
    let decoded;
    const token = req.cookies.token;
    if (token) {
      try {
        decoded = jwt.verify(token, jwtSecret);
      } catch (e) {
        console.error(e);
      }
    }
    
    try {
      assert.notEqual(null, req.body.userlink, 'Sign in and provide a userLink');
      assert.notEqual(null, req.body.username, 'Sign in and provide a username');
      assert.notEqual(null, req.body.story, 'Please provide a story.');
      assert.notEqual(null, req.body.title, 'Please provide a title.');
    } catch (bodyError) {
      console.log(bodyError.message)
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
        return res.status(403).res.json({error: true, message: "User not found, either banned or not registered"}) } 
        else {
      assert.equal(null, err);
      console.log('Connected to MongoDB server =>');
     var story = req.body.story;
    var userlink = req.body.userlink;
    var username = req.body.username;
    var title = req.body.title;
    var db = client.db(dbName)
    makeStory(db, title, story, username, userlink, function(result){
      console.log(result)
      var succeeded
      if(result) {
        succeeded = true
        return res.json(JSON.stringify({succeeded}))
      } else {
        return;
      }
  })
        }
    })
        }
    )
}}
