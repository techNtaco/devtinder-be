import dotenv from 'dotenv';
import http from 'http';
import app from './app';
import { Server } from 'socket.io';
import { connectDB } from './config/db';
import registerSocketHandlers from './sockets';
import { FRONTEND_ORIGIN } from './config/constants';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: FRONTEND_ORIGIN,
    credentials: true,
  },
});

// Initialize DB and start the server
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });

// Register all socket handlers
registerSocketHandlers(io);
