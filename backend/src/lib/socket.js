import {Server} from 'socket.io';
import http from 'http';
import e from 'express';

const app = e();
const server = http.createServer(app);  //The server object is an HTTP server created using Node.js's http module (http.createServer(app)). It is responsible for handling HTTP requests and responses. It works with the app instance from Express to serve APIs, webpages, or other resources.

const io = new Server(server,{         //The io object is an instance of the Socket.IO server, which works on top of the HTTP server (server) to handle WebSocket connections
    cors:{
        origin:['http://localhost:5173']
    }
});

export function getReceiverSocketId(userId){
    return userSocketMap[userId];
}

// used to store the online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection",(socket)=>{
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;        //The query property of the handshake object in Socket.IO is used to pass custom parameters (such as userId, here) from the client (frontend) to the server during the connection initialization.

    if(userId){
        userSocketMap[userId] = socket.id;
    }

    // io.emit() is used to send a message to all connected clients, including the newly connected client.
    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    // if(userId){
    //     userSocketMap[userId] = socket.id;
    // }

    socket.on("disconnect",()=>{
        console.log("A user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    })
})

export {io,app,server};



/*
for io.on()
    io.on() listens for the connection event, which occurs when a new client establishes a WebSocket connection with the server.

for socket.on()
    socket.on() listens for specific custom events (e.g., messages, actions) sent by the connected client over the WebSocket connection.

    Usage: It's used inside the io.on("connection", ...) callback because it operates on the specific socket object of the connected client. This ensures that event handlers are set up for each individual client.

    Each client gets its own socket object upon connecting.
    Writing socket.on() inside io.on("connection", ...) ensures that the event handlers apply only to the specific client represented by that socket.

*/