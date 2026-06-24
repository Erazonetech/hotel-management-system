import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { orderService } from '../services/api';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiClock, FiRefreshCw, FiUser, FiMapPin } from 'react-icons/fi';
import toast from 'react-hot-toast';

const KitchenPanel = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('confirmed');

  useEffect(() => {
    fetchOrders();
    
    if (socket) {
      socket.on('order-confirmed', handleOrderConfirmed);
      socket.on('order-status-updated', fetchOrders);
      
      return () => {
        socket.off('order-confirmed');
        socket.off('order-status-updated');
      };
    }
  }, [socket]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getOrders({ role: 'kitchen' });
      setOrders(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderConfirmed = (data) => {
    toast.info(`Order #${data.orderNumber} is ready for preparation`);
    fetchOrders();
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      toast.success(`Order status updated to ${status}`);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  const filteredOrders = orders.filter(o => {
    if (filter === 'confirmed') return o.status === 'confirmed';
    if (filter === 'preparing') return o.status === 'preparing';
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-800 text-white sticky top-0 z-20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Kitchen Panel</h1>
              <p className="text-purple-100">Prepare orders & mark as ready</p>
            </div>
            <button onClick={fetchOrders} className="bg-white/20 p-2 rounded-lg hover:bg-white/30">
              <FiRefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
            <p className="text-gray-500 text-sm">Orders to Prepare</p>
            <p className="text-2xl font-bold">{orders.filter(o => o.status === 'confirmed').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
            <p className="text-gray-500 text-sm">Preparing</p>
            <p className="text-2xl font-bold">{orders.filter(o => o.status === 'preparing').length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          {['confirmed', 'preparing', 'all'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.length === 0 ? (
            <div className="col-span-full bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
              No orders in kitchen
            </div>
          ) : (
            filteredOrders.map((order) => (
              <KitchenOrderCard
                key={order._id}
                order={order}
                onUpdateStatus={updateOrderStatus}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Kitchen Order Card
const KitchenOrderCard = ({ order, onUpdateStatus }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-lg shadow-md p-4"
    >
      <div className="flex justify-between items-start mb-2">
        <span className="font-mono font-bold">{order.orderNumber}</span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {order.status}
        </span>
      </div>

      <div className="text-sm text-gray-600">
        <p><FiUser className="inline mr-1" /> {order.customer?.name || order.guestInfo?.name || 'Guest'}</p>
        {order.table && <p><FiMapPin className="inline mr-1" /> Table {order.table.tableNumber}</p>}
      </div>

      <div className="my-2 max-h-24 overflow-y-auto">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm py-0.5">
            <span>{item.quantity}x {item.name}</span>
            <span className="text-gray-500">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {order.status === 'confirmed' && (
        <button
          onClick={() => onUpdateStatus(order._id, 'preparing')}
          className="w-full bg-yellow-600 text-white py-1.5 rounded-lg text-sm hover:bg-yellow-700 transition-colors"
        >
          <FiClock className="inline mr-1" /> Start Preparing
        </button>
      )}
      {order.status === 'preparing' && (
        <button
          onClick={() => onUpdateStatus(order._id, 'ready')}
          className="w-full bg-green-600 text-white py-1.5 rounded-lg text-sm hover:bg-green-700 transition-colors"
        >
          <FiCheckCircle className="inline mr-1" /> Mark as Ready
        </button>
      )}
    </motion.div>
  );
};

export default KitchenPanel;