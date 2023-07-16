import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { WebSocketServer } from 'ws';

const app = express();
const port = 6969;

// Get the current module's file path
const __filename = fileURLToPath(import.meta.url);
// Derive the directory name
const __dirname = dirname(__filename);

// Initialize the counter
let connectionCount = 0;

// Create an HTTP server using express
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Create a WebSocket server
const socketServer = new WebSocketServer({ noServer: true });

socketServer.on('connection', (socket) => {
  // Increment the counter by 1
  connectionCount++;
  
  // Event handler for client disconnections
  socket.on('close', () => {
    // Decrease the counter by 1
    connectionCount--;
  });
});

// Attach the WebSocket server to the HTTP server
const server = app.listen(port, () => {
  
});

server.on('upgrade', (request, socket, head) => {
  socketServer.handleUpgrade(request, socket, head, (ws) => {
    socketServer.emit('connection', ws, request);
  });
});

// Define a route for /connection_count
app.get('/connection_count', (req, res) => {
  // Prepare the response as JSON
  const response = {
   connectionCount
  };

  // Send the response as JSON
  res.json(response);
}); 
