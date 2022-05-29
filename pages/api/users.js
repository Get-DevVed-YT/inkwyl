const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const bcrypt = require('bcrypt');
const v4 = require('uuid').v4;
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const saltRounds = 10;
const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;


const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

function findUser(db, email, callback) {
  const collection = db.collection('users');
  collection.findOne({email}, callback);
}

function findUserbyName(db, username, callback) {
  const collection = db.collection('users');
  collection.findOne({username}, callback);
}

function findUserbyId(db, userId, callback) {
  const collection = db.collection('users');
  collection.findOne({userId}, callback);
}

function createUser(db, username, email, password, bio, id, link, callback) {
  const collection = db.collection('users');
  bcrypt.hash(password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    collection.insertOne(
      {
        username,
        userId: id,
        userLink: link,
        email,
        password: hash,
        bio
      },
      function(err, userCreated) {
        assert.equal(err, null);
        callback(userCreated);
      },
    );
  });
}

export default (req, res) => {
  if (req.method === 'POST') {
    // signup
    try {
      assert.notEqual(null, req.body.email, 'Email required');
      assert.notEqual(null, req.body.password, 'Password required');
      assert.notEqual(null, req.body.username, 'Email required');
      assert.equal(req.body.password, req.body.passwordConfirmation, 'Password and password confirmation are not the same.');
    } catch (bodyError) {
      res.status(403).json({error: true, message: bodyError.message});
      return;
    }

    // verify email does not exist already
    client.connect(function(err) {
      assert.equal(null, err);
      console.log('Connected to MongoDB server =>');
      const db = client.db(dbName);
      const email = req.body.email;
      const password = req.body.password;
      const username = req.body.username;
      const bio = req.body.bio || "No bio given.";
      if(password.length >= 6){
      findUser(db, email, function(err, user) {
        if (err) {
          res.status(500).json({error: true, message: 'Error finding User'});
          return;
        }
        if (!user) {
        findUserbyName(db, username, function(err, user) {
        if (err) {
          res.status(500).json({error: true, message: 'Error finding User'});
          return;
        }
        if (!user) {
          var id = v4()
         var link = "/user/" + id
          // proceed to Create
          createUser(db, username, email, password, bio, id, link, function(creationResult) {
            if (creationResult.ops.length === 1) {
              const user = creationResult.ops[0];
              const token = jwt.sign(
                {userId: user.userId, email: user.email, username: user.username, bio: user.bio, link: user.userLink},
                jwtSecret
              );
              res.status(200).json({token});
              return;
            }
          });
        } else {
          // User exists
          res.status(403).json({error: true, message: 'Username exists'});
          return;
        }
      });
        } else {
          // User exists
          res.status(403).json({error: true, message: 'Email exists'});
          return;
        }
      });
      } else {
        res.status(403).json({error: true, message: 'Password must be 6 characters or more'});
          return;
      }
    });
  }
};