import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    if (isAuthenticated && token) {
      const socketInstance = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
        auth: { token },
        transports: ['websocket'],
      });

      socketInstance.on('connect', () => {
        console.log('Socket connected');
      });

      socketInstance.on('order-notification', (data) => {
        toast.success(`New order received! Order #${data.order?.orderNumber}`);
      });

      socketInstance.on('order-status-updated', (data) => {
        toast.info(`Order ${data.orderId} status: ${data.status}`);
      });

      socketInstance.on('order-ready', (data) => {
        toast.success(`Order ${data.orderId} is ready!`);
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [isAuthenticated, token]);

  const emit = (event, data) => {
    if (socket) {
      socket.emit(event, data);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, emit }}>
      {children}
    </SocketContext.Provider>
  );
};