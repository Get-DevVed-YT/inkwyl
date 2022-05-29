const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

function findStorybyId(db, storyId, callback) {
  const collection = db.collection('stories');
  collection.findOne({storyId}, callback);
}

export default (req, res) => {
    try {
      assert.notEqual(null, req.query, 'storyId required');
    } catch (bodyError) {
      res.status(403).send(bodyError.message);
    }

    client.connect(function(err) {
      assert.equal(null, err);
      console.log('Connected to MongoDB server =>');
      const db = client.db(dbName);
      const { storyId } = req.query;
      console.log(storyId);

      findStorybyId(db, storyId, function(err, storyObj) {
        if (err) {
          res.status(500).json({error: true, message: 'Error finding Story'});
          return;
        }
        if (!storyObj) {
          res.status(404).json({error: true, message: 'Story not found'});
          return;
        } else {
          const username = storyObj.username
          const userlink = storyObj.userlink
          const title = storyObj.title
          const story = storyObj.story
          const storyLink = storyObj.storyLink
          res.json(JSON.stringify({
            username,
            userlink,
            title,
            story,
            storyLink
          }
          ))
        }
      });
    });
};