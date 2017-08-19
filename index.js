const express = require('express');
const request = require('request');
const https = require('https');

const app = express();
const port = process.env.PORT || 8080;

app.get('/api/imagesearch/:searchTerm', (req, res) => {
  const searchTerm = req.params.searchTerm;
  request.get(`https://www.googleapis.com/customsearch/v1?cx=000492143642458176317:8sltgvz-ir0&q=${searchTerm}&key=AIzaSyCoycQQfVqnwrpPE7KMwGxoDQloYuToRx8&searchType=image`, (err, response, body) => {
    if (!err && response.statusCode === 200) {
      res.end(body);
    } else {
      res.end();
    }
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
