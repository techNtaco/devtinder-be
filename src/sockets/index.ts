import { Server, Socket } from 'socket.io';

const registerSocketHandlers = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`🟢 Socket connected: ${socket.id}`);

    // Join a unique room
    socket.on('join-room', ({ roomId }) => {
      socket.join(roomId);
      console.log(`🧩 ${socket.id} joined room: ${roomId}`);
    });

    // Relay message to room
    socket.on('send-message', ({ roomId, from, message, displayName }) => {
      console.log(`[SOCKET] ${displayName} sent: ${message}`);
      io.to(roomId).emit('receive-message', { from, message, displayName });
    });

    socket.on('disconnect', () => {
      console.log(`🔴 Socket disconnected: ${socket.id}`);
    });
  });
};

export default registerSocketHandlers;
