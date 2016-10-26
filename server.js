var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongojs = require('mongojs');

var app = express();

var port = 7777;

var db = mongojs('birds', ['sightings'] );

app.use(bodyParser.json());
app.use(cors());

app.post('/api/sightings', function( req, res ) {
  db.sightings.save(req.body, function(err, response) {
    if (err) return res.status(500).json(err);
    else return res.json(response)
  });
});

app.get('/api/sightings', function( req, res ) {
  var query = {}

  if(req.query.bird) query.species = req.query.bird;
  if(req.query.number) query.number_left = parseInt(req.query.number);


  db.sightings.find(query, function(err, response) {
    if (err) res.status(500).json(err);
    else res.json(response)
  });
});

app.put('/api/sightings', function( req, res ) {
  db.sightings.findAndModify( {
      query: {
        _id: mongojs.ObjectId( req.query.id )
      },
      update: {
        $set: req.body
      }},
      function( err, response ) {
        if(err) res.status(500).json(err);
         else res.json(response)
  });
});

app.delete('/api/sightings', function( req, res ) {
  db.sightings.remove({_id: mongojs.ObjectId(req.query.id)}, function(err, response) {
    if(err) return res.status(500).json(err);
    return res.json(response)
  });
});



app.listen( port, function() {
  console.log("Now listening on port: ", port );
});
