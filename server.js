var express = require('express'),
    app = express(),
    server = require('http').createServer(app);

var io = require('socket.io').listen(server);
var usernames = [];

server.listen(process.env.PORT || 3000);

app.get('/', function(req,res){

    res.sendFile(__dirname+'/index.html');

});

io.sockets.on('connection', function(socket){

    console.log('socket connected');

    socket.on('new user', function(data, callback){

        if (usernames.indexOf(data)!=-1) {
            
            callback(false);

        } else {
            
            callback(true);
            socket.username = data;
            usernames.push(data);
            updateUsernames();

        }
    });

    function updateUsernames (){

        io.sockets.emit('usernames', usernames);

    };


    socket.on('send message', function(data){

        io.sockets.emit('new message', {msg:data , user:socket.username});

    });

    socket.on('disconnect', function(data){
        if(!socket.username){
            return;
        }

        usernames.splice(usernames.indexOf(socket.username),1);
        updateUsernames();

    });

});