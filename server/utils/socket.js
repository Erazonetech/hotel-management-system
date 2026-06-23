import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

let io;

const initializeSocket = (server) => {
  // FIXED: Added 'new' keyword
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  // Authentication middleware for socket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('User not found'));
      }
      
      socket.user = user;
      next();
    } catch (error) {
      console.log('Socket auth error:', error.message);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user?.name || 'Unknown'} (${socket.user?.role || 'unknown'})`);
    
    // Join user to their role room
    if (socket.user) {
      socket.join(socket.user.role);
      socket.join(`user:${socket.user.id}`);
    }
    
    // Handle order events
    socket.on('new-order', (orderData) => {
      // Broadcast to kitchen and waiters
      io.to('kitchen').to('waiter').emit('order-notification', {
        type: 'NEW_ORDER',
        order: orderData,
        timestamp: new Date()
      });
    });
    
    // Handle order status update
    socket.on('update-order-status', (data) => {
      const { orderId, status, note } = data;
      
      // Broadcast status update to relevant rooms
      io.emit('order-status-updated', {
        orderId,
        status,
        note,
        updatedBy: socket.user?.name,
        timestamp: new Date()
      });
      
      // If order is ready, notify waiters specifically
      if (status === 'ready') {
        io.to('waiter').emit('order-ready', {
          orderId,
          message: `Order ${orderId} is ready for serving`
        });
      }
    });
    
    // Handle table events
    socket.on('table-status-change', (data) => {
      io.to('waiter').emit('table-updated', data);
    });
    
    // Handle customer requests
    socket.on('customer-request', (data) => {
      io.to('waiter').emit('customer-request', {
        ...data,
        timestamp: new Date()
      });
    });
    
    // Handle reservation reminders
    socket.on('reservation-reminder', (data) => {
      io.to('admin').emit('reservation-alert', data);
    });
    
    // Disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user?.name || 'Unknown'}`);
    });
  });
  
  return io;
};

// Helper functions to emit events from outside socket
const emitToRole = (role, event, data) => {
  if (io) {
    io.to(role).emit(event, data);
  }
};

const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
};

const emitToAll = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};

const getIO = () => io;

export { 
  initializeSocket, 
  emitToRole, 
  emitToUser, 
  emitToAll, 
  getIO 
};