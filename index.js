const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
require('dotenv').config();


const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server,{
    cors: {
        origin:"http://localhost:3000",
        methods:["GET","POST"]
    }
});

app.get('/', (req, res) => {
    res.send("You are on home page");
});

io.on('connection', (socket) => {
    socket.on('join_room',(data) => {
        console.log(`User with ID:${socket.id} joined room#${data}`);
    })
    socket.on('send_message',(data) => {
        socket.to(data.roomID).emit("receive_message",data);
    })
    socket.on('disconnect',() => {
        console.log(`${socket.id} disconnected`)
    })
});

server.listen(process.env.PORT, () => {
    console.log(`Server running on ${process.env.PORT}`);
});