var express = require('express');
var app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const redis = require('redis');
const client = redis.createClient();
const { getData, appendRow } = require('./googleSheet.js');

client.on('connect', () => {
  console.log('Redis client connected');
});

app.use(express.static('views'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/application.html');
});

app.post('/getData', (req, res) => {
  getData().then(function(data) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
    // client.set('dataList', JSON.stringify(data), redis.print);
  })
})

io.on('connection', (socket) => {
  socket.on('appendRow', (data) => {
    if (!dataValid(data)) {
      return
    }
    appendRow(data).then(function(res) {
      if (res) {
        // client.get('dataList', (error, result) => {
        //   if (error) {
        //     console.log(error);
        //     throw error;
        //   }
        //   console.log(result)
        // });
        // client.set('dataList', , redis.print);
        io.emit('emitData', data);
      }
    })
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});

function dataValid(data) {
  return data.name != null && data.name != '' &&
    data.cellphone != null && data.cellphone != ''    
}