var express = require('express');
var app = express.Router();
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://admin:admin11@cw2.it8bj.mongodb.net/cw2?retryWrites=true&w=majority';
var db;
MongoClient.connect(url, (err, client) => {
  db = client.db('cw2');
  })
//res.setHeader('Access-Control-Allow-Origin', '*');
app.param('collectionName', (req, res, next, collectionName) => {
  req.collection = db.collection(collectionName);
  return next()
})
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");      
  res.setHeader("Access-Control-Allow-Methods","*");
  next();  
});
/* GET home page. */
app.get('/', (req, res, next) => {  
  res.send('Select a collection, e.g., /collection/messages')
})
/* Collection pages */
// VIEW COLLECTIONS
app.get('/collection/:collectionName', (req, res, next) => {
  req.collection.find({}).toArray((e, results) => {
    if (e) return next(e)      
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(results)    
  }
  )})
app.options('/collection/:collectionName', (req, res, next) => {
  req.collection.find({}).toArray((e, results) => {
    if (e) return next(e)      
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(results)    
  }
  )})
  
const ObjectID = require('mongodb').ObjectID;
app.get('/collection/:collectionName/:id', (req, res, next) => {    
  req.collection.findOne({ _id: new ObjectID(req.params.id) }, (e, result) => {
    if (e) return next(e)        
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.send(result)    
  })
})
// ADD NEW
app.post('/collection/:collectionName', (req, res, next) => {  
  req.collection.insert(req.body, (e, results) => {
    if (e) return next(e)    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.send(results.ops)  
  })
})
// UPDATE 
app.put('/collection/:collectionName/:id', (req, res, next) => {  
  req.collection.update(    
    {_id: new ObjectID(req.params.id)},    
    {$set: req.body},    
    {safe: true, multi: false}, 
    (e, result) => {
      if (e) return next(e)      
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Headers", "*");
      res.setHeader("Access-Control-Allow-Methods","PUT");
      res.send((result.result.n === 1) ? {msg: 'updated'} : {msg: 'error'})    
    })
  })
// DELETE
app.delete('/collection/:collectionName/:id', (req, res, next) => {  
  req.collection.deleteOne(    
    {_id: ObjectID(req.params.id)}, 
    (e, result) => {
      if (e) return next(e)        
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader("Access-Control-Allow-Headers", "*");
      res.send((result.result.n === 1) ? {msg: 'deleted'} : {msg: 'error'})  
    })
  })

module.exports = app;
