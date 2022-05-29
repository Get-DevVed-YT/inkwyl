const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

function findUserbyId(db, userId, callback) {
  const collection = db.collection('users');
  collection.findOne({userId}, callback);
}

export default (req, res) => {
    try {
      assert.notEqual(null, req.query, 'userId required');
    } catch (bodyError) {
      res.status(403).send(bodyError.message);
    }

    client.connect(function(err) {
      assert.equal(null, err);
      console.log('Connected to MongoDB server =>');
      const db = client.db(dbName);
      const { userId } = req.query;
      console.log(userId);

      findUserbyId(db, userId, function(err, user) {
        if (err) {
          res.status(500).json({error: true, message: 'Error finding User'});
          return;
        }
        if (!user) {
          res.status(404).json({error: true, message: 'User not found'});
          return;
        } else {
          const username = user.username
          const bio = user.bio
          const userlink = user.userLink
          var verified
          if(user.verified){
            verified = true
          } else {
            verified = false
          }
          res.json(JSON.stringify({
            username,
            bio,
            userlink,
            verified
          }
          ))
        }
      });
    });
};