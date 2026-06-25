import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { orderService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCheckCircle, FiClock, FiSend, FiEye, 
  FiRefreshCw, FiDollarSign, FiXCircle, FiUser, FiMapPin
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import Receipt from '../components/common/Receipt'; // Add this import

const CashierPanel = () => {
  const { user } = useAuth();
  const { socket, emit } = useSocket();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('pending');
  const [showReceipt, setShowReceipt] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
    
    if (socket) {
      socket.on('new-order', handleNewOrder);
      socket.on('order-served', handleOrderServed);
      
      return () => {
        socket.off('new-order');
        socket.off('order-served');
      };
    }
  }, [socket]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getOrders({ role: 'cashier' });
      setOrders(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleNewOrder = (data) => {
    toast.info(`New order #${data.orderNumber} received for confirmation`);
    fetchOrders();
  };

  const handleOrderServed = (data) => {
    toast.info(`Order #${data.orderNumber} has been served. Awaiting payment.`);
    fetchOrders();
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      await orderService.updateOrderStatus(orderId, 'confirmed', 'Order confirmed by cashier');
      toast.success('Order confirmed and sent to kitchen');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to confirm order');
    }
  };

  const handleCompletePayment = async (order) => {
    try {
      // Update order status to completed
      await orderService.updateOrderStatus(order._id, 'completed', 'Payment processed by cashier');
      
      // Get the updated order with all details
      const updatedOrder = await orderService.getOrder(order._id);
      setCompletedOrder(updatedOrder.data.data);
      setShowReceipt(true);
      
      toast.success('Payment completed. Receipt generated.');
      fetchOrders();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to process payment');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      ready: 'bg-green-100 text-green-800',
      served: 'bg-indigo-100 text-indigo-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return styles[status] || styles.pending;
  };

  const filteredOrders = orders.filter(o => {
    if (filter === 'pending') return o.status === 'pending';
    if (filter === 'confirmed') return o.status === 'confirmed';
    if (filter === 'served') return o.status === 'served';
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
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-800 text-white sticky top-0 z-20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Cashier Panel</h1>
              <p className="text-green-100">Confirm orders & process payments</p>
            </div>
            <button onClick={fetchOrders} className="bg-white/20 p-2 rounded-lg hover:bg-white/30">
              <FiRefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
            <p className="text-gray-500 text-sm">Pending Confirmation</p>
            <p className="text-2xl font-bold">{orders.filter(o => o.status === 'pending').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
            <p className="text-gray-500 text-sm">In Kitchen</p>
            <p className="text-2xl font-bold">{orders.filter(o => o.status === 'confirmed' || o.status === 'preparing').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
            <p className="text-gray-500 text-sm">Awaiting Payment</p>
            <p className="text-2xl font-bold">{orders.filter(o => o.status === 'served').length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          {['pending', 'confirmed', 'served', 'all'].map((status) => (
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

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
              No orders to display
            </div>
          ) : (
            filteredOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onConfirm={handleConfirmOrder}
                onCompletePayment={handleCompletePayment}
                onSelect={setSelectedOrder}
                isSelected={selectedOrder === order._id}
                getStatusBadge={getStatusBadge}
              />
            ))
          )}
        </div>
      </div>

      {/* Receipt Modal - Moved outside the map */}
      <AnimatePresence>
        {showReceipt && completedOrder && (
          <Receipt
            order={completedOrder}
            onClose={() => {
              setShowReceipt(false);
              setCompletedOrder(null);
            }}
            onPrint={() => {
              // The Receipt component handles printing internally
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Order Card Component
const OrderCard = ({ order, onConfirm, onCompletePayment, onSelect, isSelected, getStatusBadge }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="p-4 cursor-pointer" onClick={() => onSelect(order._id)}>
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold">{order.orderNumber}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
              {order.status}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {order.paymentStatus}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-bold text-primary-600">${order.total?.toFixed(2)}</span>
            <span className="text-sm text-gray-500">{order.items?.length} items</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center mt-2 text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span><FiUser className="inline mr-1" /> {order.customer?.name || order.guestInfo?.name || 'Guest'}</span>
            {order.table && <span><FiMapPin className="inline mr-1" /> Table {order.table.tableNumber}</span>}
          </div>
          <span className="text-gray-400 text-xs">
            {new Date(order.createdAt).toLocaleString()}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-3">
          {order.status === 'pending' && (
            <button
              onClick={(e) => { e.stopPropagation(); onConfirm(order._id); }}
              className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700 flex items-center gap-1"
            >
              <FiCheckCircle className="h-4 w-4" />
              Confirm & Send to Kitchen
            </button>
          )}
          {order.status === 'served' && (
            <button
              onClick={(e) => { 
                e.stopPropagation(); 
                onCompletePayment(order); // Pass the entire order object
              }}
              className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-green-700 flex items-center gap-1"
            >
              <FiDollarSign className="h-4 w-4" />
              Complete Payment
            </button>
          )}
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t px-4 py-3 bg-gray-50"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">Order Items</h4>
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-1 border-b border-gray-200 last:border-0">
                    <span>{item.quantity}x {item.name}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="mt-2 pt-2 border-t">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>Total</span>
                    <span className="text-primary-600">${order.total?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2">Order Timeline</h4>
                <div className="space-y-1 text-sm">
                  {order.timeline?.map((entry, i) => (
                    <div key={i} className="flex justify-between text-gray-600">
                      <span className="capitalize">{entry.status}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CashierPanel;