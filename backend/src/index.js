import e from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import {connectDB} from "./lib/db.js";
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import cors from "cors";
import {app,server} from "./lib/socket.js";

dotenv.config();

// const app = e();    //! no need now as we created in the socket.js file


app.use(e.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5174",
    credentials: true,
}));

const PORT = process.env.PORT || 5001;

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

server.listen(PORT,()=>{
    console.log("server is lsitening on port:" + PORT);
    connectDB();
})

/* 
for App.listen()
    Express internally creates an HTTP server and binds it to the specified port. 
    You don't explicitly interact with the HTTP server; Express abstracts it away.
    Limitations:
    Can't easily integrate additional services (like Socket.IO), as you don't have direct control over the HTTP server.

for server.listen()
    The app instance is still responsible for defining how HTTP requests are processed (e.g., routing, middleware).
    The server simply routes the HTTP requests to the app for processing.
    Socket.IO requires direct access to an HTTP server instance to enable WebSocket communication. By explicitly creating the server, you can attach io (Socket.IO instance) to it.


*/