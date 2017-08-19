const express = require('express');
const request = require('request');
const https = require('https');

const app = express();
const port = process.env.PORT || 8080;

app.get('/api/imagesearch/:searchTerm', (req, res) => {
  const searchTerm = req.params.searchTerm;
  const offset = req.query.offset;
  let url = `https://www.googleapis.com/customsearch/v1?cx=000492143642458176317:8sltgvz-ir0&q=${searchTerm}&key=AIzaSyCoycQQfVqnwrpPE7KMwGxoDQloYuToRx8&searchType=image`;
  if (offset) {
    url += '&start=' + (+offset + 1);
  }
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

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
