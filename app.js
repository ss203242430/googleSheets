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
  let breakFlag = false
  client.get('dataList', (error, result) => {
    if (error) {
      console.log(error)
    }
    if (!!result) {
      res.setHeader('Content-Type', 'application/json');
      res.end(result);
    } else {
      getData().then(function(dataList) {
        client.set('dataList', JSON.stringify(dataList), redis.print);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(dataList));
      })
    }
  })
})

io.on('connection', (socket) => {
  socket.on('appendRow', (data) => {
    if (!dataValid(data)) {
      return
    }
    appendRow(data).then(function(res) {
      if (res) {
        io.emit('emitData', data)
        client.get('dataList', (error, result) => {
          if (error) {
            console.log(error)
          }
          if (!!result) {
            let dataList = JSON.parse(result)
            dataList.push([data.name, data.cellphone])
            client.set('dataList', JSON.stringify(dataList), redis.print);
          } else {
            getData().then(function(dataList) {
              client.set('dataList', JSON.stringify(dataList), redis.print)
            })
          }
        });
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