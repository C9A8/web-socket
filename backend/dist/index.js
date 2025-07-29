"use strict";
// import express from 'express';
// import http from 'http';
// import { WebSocketServer, WebSocket, RawData } from 'ws';
// const app = express();
// const server = http.createServer(app);
// const wss = new WebSocketServer({server});
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// let client:number = 0;
// wss.on("connection",(socket:WebSocket)=>{
//     client++;
//     console.log(`client ${client} is conneted to wss`);
//     socket.on("message",(message:RawData)=>{
//         const msgstring  = message.toString();
//         console.log(`Received ${message}`);
//         wss.clients.forEach((clients)=>{
//             if(clients !== socket && clients.readyState === WebSocket.OPEN){
//                 clients.send(msgstring);
//             }
//         });
//     });
//     socket.on("close",()=>{
//         client--;
//         console.log("client disconnected")
//     });
//     //
//     socket.send("Hello from server")
// });
// import { Request, Response } from "express";
// app.get("/", (req: Request, res: Response) => {
//     res.json({message:"lol"})
// })
// server.listen(3000,()=>{console.log("app is running on server 3000")});
const map = new Map([[1, "a"], [2, "b"]]);
map.set(3, "tiger");
map.get(3);
map.has(1);
map.size;
// console.log(map.values(),map.keys());
// const set = new Set();
// set.add(1);
// set.add(2);
// set.add(3);
// set.add(4);
// set.add(()=>{console.log("lol")});
// console.log(set.size,set);
// set.forEach((items)=>{
//     if(typeof items === "function"){
//         items();
//     }
// })
// const arr = [1,1,2,3,4,5,5,5,6,6,7,78];
// const sets = new Set();
// arr.forEach((items)=>{
//   sets.add(items);
// })
// console.log(sets,arr);
// import  express  from "express";
// import http from 'http';
// //
// import { WebSocketServer,WebSocket } from "ws";
// const app = express();
// //
// const server = http.createServer(app);
// //
// const wss = new WebSocketServer({server});
// //
// wss.on("connection",(ws:WebSocket)=>{
//     console.log("Client is connected to server");
// })
// //
// server.listen(8080,()=>{console.log("Server is running on PORT : 8080")})
// import express, { Request, Response } from 'express';
// import http from 'http';
// import { WebSocketServer, WebSocket, RawData } from 'ws';
// // Create Express app and HTTP server
// const app = express();
// const server = http.createServer(app);
// // Attach WebSocket server to HTTP server
// const wss = new WebSocketServer({ server });
// // === Room Management ===
// const rooms: Map<string, Set<WebSocket>> = new Map();
// // Handle client connections
// wss.on('connection', (ws: WebSocket) => {
//   let currentRoom: string | null = null;
//   ws.on('message', (message: string | RawData) => {
//     let data: any;
//     try {
//       data = JSON.parse(message.toString());
//     } catch (err) {
//       ws.send(JSON.stringify({ error: 'Invalid JSON' }));
//       return;
//     }
//     const { type, room, content } = data;
//     // === Join Room ===
//     if (type === 'join' && room) {
//       if (!rooms.has(room)) {
//         rooms.set(room, new Set());
//       }
//       rooms.get(room)!.add(ws);
//       currentRoom = room;
//       ws.send(JSON.stringify({ type: 'system', message: `Joined room: ${room}` }));
//     }
//     // === Broadcast to Room ===
//     else if (type === 'message' && currentRoom) {
//       const clients = rooms.get(currentRoom);
//       if (clients) {
//         for (let client of clients) {
//           if (client !== ws && client.readyState === WebSocket.OPEN) {
//             client.send(JSON.stringify({
//               type: 'message',
//               from: currentRoom,
//               content
//             }));
//           }
//         }
//       }
//     }
//   });
//   // === Cleanup on Disconnect ===
//   ws.on('close', () => {
//     if (currentRoom && rooms.has(currentRoom)) {
//       rooms.get(currentRoom)!.delete(ws);
//       if (rooms.get(currentRoom)!.size === 0) {
//         rooms.delete(currentRoom); // Remove empty room
//       }
//     }
//   });
// });
// // Example HTTP route
// app.get("/", (_req: Request, res: Response) => {
//   res.json({ message: "lol" });
// });
// server.listen(3000, () => {
//   console.log('Server running on http://localhost:3000');
// });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const ws_1 = require("ws");
dotenv_1.default.config();
const PORT = process.env.PORT || 5050;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const wss = new ws_1.WebSocketServer({ server });
//Implementing room using ws
const rooms = new Map();
wss.on("connection", (ws) => {
    let currentRoom;
    // Checking the inputs are correct or not
    ws.on("message", (message) => {
        var _a;
        let data;
        try {
            data = JSON.parse(message.toString());
        }
        catch (error) {
            ws.send(JSON.stringify({ error: "Invalid json input" }));
            return;
        }
        const { type, room, content } = data;
        //room creation
        if (type === "join" && room) {
            if (!rooms.has(room)) {
                rooms.set(room, new Set());
            }
            (_a = rooms.get(room)) === null || _a === void 0 ? void 0 : _a.add(ws);
            currentRoom = room;
            ws.send(JSON.stringify({ type: "system", message: `Joined room ${room}` }));
        }
        // Broadcast message to all clinet connneted to room
        else if (type === "message" && currentRoom) {
            const clients = rooms.get(currentRoom);
            if (clients) {
                for (let client of clients) {
                    if (client !== ws && client.readyState === ws_1.WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            type: "message",
                            from: currentRoom,
                            content: content
                        }));
                    }
                }
            }
        }
    });
});
app.get("/", (req, res) => {
    res.send("hello");
});
server.listen(PORT, () => { console.log(`Server is running on ${PORT}`); });
