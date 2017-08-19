const express = require('express');
const request = require('request');
const https = require('https');
const mongo = require('mongodb').MongoClient;

let db;
const app = express();
const port = process.env.PORT || 8080;
const dbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/imagesearch';

app.get('/api/latest/imagesearch', (req, res) => {
  db.collection('history')
  .find({

  }, {
      _id: 0
  })
  .sort({
    when: -1
  })
  .limit(10)
  .toArray((err, docs) => {
    if (err) {
      console.error(err);
      res.end(err);
    }
    res.json(docs);
  });
});

app.get('/api/imagesearch/:searchTerm', (req, res) => {
  const searchTerm = req.params.searchTerm;
  const offset = req.query.offset;
  let url = `https://www.googleapis.com/customsearch/v1?cx=000492143642458176317:8sltgvz-ir0&q=${searchTerm}&key=AIzaSyCoycQQfVqnwrpPE7KMwGxoDQloYuToRx8&searchType=image`;
  if (offset) {
    url += '&start=' + (+offset + 1);
  }
  logSearch(searchTerm);
  request.get(url, (err, response, body) => {
    if (!err && response.statusCode === 200) {
      const items = JSON.parse(body).items;
      res.json(items.map(item => {
        return {
          url: item.link,
          snippet: item.snippet,
          thumbnail: item.image.thumbnailLink,
          context: item.image.contextLink
        }
      }));
    } else {
      res.end();
    }
  });
});

mongo.connect(dbUri, (err, connection) => {
  if (err) throw err;
  db = connection;

  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
});

function logSearch(searchTerm) {
  db.collection('history').insert({
    term: searchTerm,
    when: new Date()
  }, (err, data) => {
    if (err) console.error(err);
  });
}
