// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useSocket } from '../context/SocketContext';
// import { orderService } from '../services/api';
// import { motion } from 'framer-motion';
// import { FiCheckCircle, FiClock, FiRefreshCw, FiUser, FiMapPin } from 'react-icons/fi';
// import toast from 'react-hot-toast';

// const KitchenPanel = () => {
//   const { user } = useAuth();
//   const { socket } = useSocket();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState('confirmed');

//   useEffect(() => {
//     fetchOrders();
    
//     if (socket) {
//       socket.on('order-confirmed', handleOrderConfirmed);
//       socket.on('order-status-updated', fetchOrders);
      
//       return () => {
//         socket.off('order-confirmed');
//         socket.off('order-status-updated');
//       };
//     }
//   }, [socket]);

//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const res = await orderService.getOrders({ role: 'kitchen' });
//       setOrders(res.data.data || []);
//     } catch (error) {
//       toast.error('Failed to load orders');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOrderConfirmed = (data) => {
//     toast.info(`Order #${data.orderNumber} is ready for preparation`);
//     fetchOrders();
//   };

//   const updateOrderStatus = async (orderId, status) => {
//     try {
//       await orderService.updateOrderStatus(orderId, status);
//       toast.success(`Order status updated to ${status}`);
//       fetchOrders();
//     } catch (error) {
//       toast.error('Failed to update order');
//     }
//   };

//   const filteredOrders = orders.filter(o => {
//     if (filter === 'confirmed') return o.status === 'confirmed';
//     if (filter === 'preparing') return o.status === 'preparing';
//     return true;
//   });

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-96">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <div className="bg-gradient-to-r from-purple-600 to-indigo-800 text-white sticky top-0 z-20">
//         <div className="container mx-auto px-4 py-6">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-2xl font-bold">Kitchen Panel</h1>
//               <p className="text-purple-100">Prepare orders & mark as ready</p>
//             </div>
//             <button onClick={fetchOrders} className="bg-white/20 p-2 rounded-lg hover:bg-white/30">
//               <FiRefreshCw className="h-5 w-5" />
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-6">
//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//           <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
//             <p className="text-gray-500 text-sm">Orders to Prepare</p>
//             <p className="text-2xl font-bold">{orders.filter(o => o.status === 'confirmed').length}</p>
//           </div>
//           <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
//             <p className="text-gray-500 text-sm">Preparing</p>
//             <p className="text-2xl font-bold">{orders.filter(o => o.status === 'preparing').length}</p>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="flex gap-2 mb-4">
//           {['confirmed', 'preparing', 'all'].map((status) => (
//             <button
//               key={status}
//               onClick={() => setFilter(status)}
//               className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                 filter === status ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
//               }`}
//             >
//               {status.charAt(0).toUpperCase() + status.slice(1)}
//             </button>
//           ))}
//         </div>

//         {/* Orders Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {filteredOrders.length === 0 ? (
//             <div className="col-span-full bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
//               No orders in kitchen
//             </div>
//           ) : (
//             filteredOrders.map((order) => (
//               <KitchenOrderCard
//                 key={order._id}
//                 order={order}
//                 onUpdateStatus={updateOrderStatus}
//               />
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Kitchen Order Card
// const KitchenOrderCard = ({ order, onUpdateStatus }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.95 }}
//       animate={{ opacity: 1, scale: 1 }}
//       className="bg-white rounded-lg shadow-md p-4"
//     >
//       <div className="flex justify-between items-start mb-2">
//         <span className="font-mono font-bold">{order.orderNumber}</span>
//         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//           order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
//         }`}>
//           {order.status}
//         </span>
//       </div>

//       <div className="text-sm text-gray-600">
//         <p><FiUser className="inline mr-1" /> {order.customer?.name || order.guestInfo?.name || 'Guest'}</p>
//         {order.table && <p><FiMapPin className="inline mr-1" /> Table {order.table.tableNumber}</p>}
//       </div>

//       <div className="my-2 max-h-24 overflow-y-auto">
//         {order.items.map((item, i) => (
//           <div key={i} className="flex justify-between text-sm py-0.5">
//             <span>{item.quantity}x {item.name}</span>
//             <span className="text-gray-500">${(item.price * item.quantity).toFixed(2)}</span>
//           </div>
//         ))}
//       </div>

//       {order.status === 'confirmed' && (
//         <button
//           onClick={() => onUpdateStatus(order._id, 'preparing')}
//           className="w-full bg-yellow-600 text-white py-1.5 rounded-lg text-sm hover:bg-yellow-700 transition-colors"
//         >
//           <FiClock className="inline mr-1" /> Start Preparing
//         </button>
//       )}
//       {order.status === 'preparing' && (
//         <button
//           onClick={() => onUpdateStatus(order._id, 'ready')}
//           className="w-full bg-green-600 text-white py-1.5 rounded-lg text-sm hover:bg-green-700 transition-colors"
//         >
//           <FiCheckCircle className="inline mr-1" /> Mark as Ready
//         </button>
//       )}
//     </motion.div>
//   );
// };

// export default KitchenPanel;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { orderService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCheckCircle, FiClock, FiRefreshCw, FiUser, FiMapPin, 
  FiAlertCircle, FiChevronDown, FiChevronUp, FiShoppingBag,
  FiPrinter, FiEye, FiClipboard, FiCheckSquare
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const KitchenPanel = () => {
  const { user } = useAuth();
  const { socket, emit } = useSocket();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('confirmed');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [stats, setStats] = useState({
    confirmed: 0,
    preparing: 0,
    totalToday: 0
  });

  useEffect(() => {
    fetchOrders();
    
    if (socket) {
      socket.on('order-confirmed', handleOrderConfirmed);
      socket.on('order-status-updated', handleOrderUpdate);
      socket.on('new-order', handleNewOrder);
      
      return () => {
        socket.off('order-confirmed');
        socket.off('order-status-updated');
        socket.off('new-order');
      };
    }
  }, [socket]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Get orders specifically for kitchen (confirmed and preparing statuses)
      const res = await orderService.getOrders({ role: 'kitchen' });
      const ordersData = res.data.data || [];
      setOrders(ordersData);
      
      // Update stats
      setStats({
        confirmed: ordersData.filter(o => o.status === 'confirmed').length,
        preparing: ordersData.filter(o => o.status === 'preparing').length,
        totalToday: ordersData.length
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderConfirmed = (data) => {
    toast.success(`📋 Order #${data.orderNumber} is ready for preparation!`);
    fetchOrders();
  };

  const handleOrderUpdate = (data) => {
    fetchOrders();
  };

  const handleNewOrder = (data) => {
    toast.info(`New order #${data.orderNumber} received`);
    fetchOrders();
  };

  const updateOrderStatus = async (orderId, status, note = '') => {
    try {
      const response = await orderService.updateOrderStatus(orderId, status, note);
      if (response.data.success) {
        const statusMessages = {
          'preparing': '⏳ Started preparing order',
          'ready': '✅ Order is ready to serve!'
        };
        toast.success(statusMessages[status] || `Order ${status}`);
        
        // Emit socket event
        emit('update-order-status', { orderId, status });
        
        // Refresh orders
        fetchOrders();
      }
    } catch (error) {
      console.error('Update status error:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update order';
      toast.error(errorMessage);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: 'bg-blue-100 text-blue-800 border border-blue-200',
      preparing: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      ready: 'bg-green-100 text-green-800 border border-green-200',
      completed: 'bg-gray-100 text-gray-800 border border-gray-200',
      cancelled: 'bg-red-100 text-red-800 border border-red-200'
    };
    return styles[status] || styles.confirmed;
  };

  const getTimeSince = (date) => {
    const minutes = Math.floor((new Date() - new Date(date)) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m ago`;
  };

  const filteredOrders = orders.filter(o => {
    if (filter === 'confirmed') return o.status === 'confirmed';
    if (filter === 'preparing') return o.status === 'preparing';
    if (filter === 'ready') return o.status === 'ready';
    return true;
  });

  // Sort orders: confirmed first, then preparing
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const order = { confirmed: 0, preparing: 1, ready: 2 };
    return (order[a.status] || 0) - (order[b.status] || 0);
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
      <div className="bg-gradient-to-r from-purple-600 to-indigo-800 text-white sticky top-0 z-20 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">Kitchen Panel</h1>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {user?.name}
                </span>
              </div>
              <p className="text-purple-100 mt-1">Manage food preparation & mark orders ready</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchOrders}
                className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors"
              >
                <FiRefreshCw className="h-5 w-5" />
              </button>
              <button className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors">
                <FiPrinter className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">To Prepare</p>
                <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FiClipboard className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.preparing}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <FiClock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Today</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalToday}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FiShoppingBag className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2">
              {['confirmed', 'preparing', 'ready', 'all'].map((status) => {
                const labels = {
                  confirmed: '📋 To Prepare',
                  preparing: '⏳ In Progress',
                  ready: '✅ Ready',
                  all: '📦 All'
                };
                const count = status === 'all' 
                  ? orders.length 
                  : orders.filter(o => o.status === status).length;
                
                return (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      filter === status 
                        ? 'bg-purple-600 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {labels[status]}
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      filter === status ? 'bg-white/20' : 'bg-gray-300'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
            
            <div className="text-sm text-gray-500">
              {sortedOrders.length} order{sortedOrders.length !== 1 ? 's' : ''} in queue
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        {sortedOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🍳</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Kitchen is Clear</h3>
            <p className="text-gray-500">No orders waiting for preparation</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {sortedOrders.map((order) => (
              <KitchenOrderCard
                key={order._id}
                order={order}
                onUpdateStatus={updateOrderStatus}
                onExpand={setExpandedOrder}
                isExpanded={expandedOrder === order._id}
                getStatusBadge={getStatusBadge}
                getTimeSince={getTimeSince}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Kitchen Order Card Component
const KitchenOrderCard = ({ 
  order, 
  onUpdateStatus, 
  onExpand, 
  isExpanded,
  getStatusBadge,
  getTimeSince 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getActionButton = () => {
    if (order.status === 'confirmed') {
      return {
        label: 'Start Preparing',
        icon: <FiClock className="inline mr-2" />,
        color: 'bg-yellow-500 hover:bg-yellow-600',
        status: 'preparing'
      };
    }
    if (order.status === 'preparing') {
      return {
        label: 'Mark as Ready',
        icon: <FiCheckCircle className="inline mr-2" />,
        color: 'bg-green-600 hover:bg-green-700',
        status: 'ready'
      };
    }
    if (order.status === 'ready') {
      return {
        label: 'Completed',
        icon: <FiCheckSquare className="inline mr-2" />,
        color: 'bg-gray-400 cursor-not-allowed',
        status: null
      };
    }
    return null;
  };

  const action = getActionButton();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
        isHovered ? 'shadow-xl' : ''
      } ${order.status === 'ready' ? 'border-2 border-green-300' : ''}`}
    >
      {/* Order Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-gray-800">
                {order.orderNumber}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                {order.status === 'ready' ? '✅ Ready' : order.status === 'preparing' ? '⏳ Cooking' : '📋 New'}
              </span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {getTimeSince(order.createdAt)}
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-purple-600">${order.total?.toFixed(2)}</div>
            <div className="text-xs text-gray-400">{order.items?.length} items</div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <FiUser className="h-3 w-3" />
            {order.customer?.name || order.guestInfo?.name || 'Guest'}
          </span>
          {order.table && (
            <span className="flex items-center gap-1">
              <FiMapPin className="h-3 w-3" />
              Table {order.table.tableNumber}
            </span>
          )}
        </div>
      </div>

      {/* Order Items Preview */}
      <div className="px-4 py-2 max-h-20 overflow-y-auto">
        <div className="grid grid-cols-2 gap-1">
          {order.items?.slice(0, 4).map((item, idx) => (
            <div key={idx} className="text-xs text-gray-600 flex justify-between">
              <span>{item.quantity}x {item.name}</span>
              <span className="text-gray-400">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          {order.items?.length > 4 && (
            <div className="text-xs text-gray-400 col-span-2 text-center">
              +{order.items.length - 4} more items
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-4 pt-2">
        {action && action.status ? (
          <button
            onClick={() => onUpdateStatus(order._id, action.status)}
            className={`w-full ${action.color} text-white py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center`}
          >
            {action.icon}
            {action.label}
          </button>
        ) : order.status === 'ready' ? (
          <div className="w-full bg-green-100 text-green-700 py-2 rounded-lg text-sm font-medium text-center flex items-center justify-center">
            <FiCheckCircle className="inline mr-2" />
            Ready for Serving
          </div>
        ) : null}
      </div>

      {/* Expand/Collapse */}
      <div className="border-t border-gray-100">
        <button
          onClick={() => onExpand(order._id)}
          className="w-full px-4 py-2 text-xs text-gray-500 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
        >
          {isExpanded ? (
            <>Hide Details <FiChevronUp className="h-3 w-3" /></>
          ) : (
            <>View Details <FiChevronDown className="h-3 w-3" /></>
          )}
        </button>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100 bg-gray-50 overflow-hidden"
          >
            <div className="p-4 space-y-3">
              {/* All Items */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">All Items</h4>
                <div className="space-y-1">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm py-1 border-b border-gray-200 last:border-0">
                      <div>
                        <span className="text-gray-600">{item.quantity}x</span>
                        <span className="ml-2 text-gray-800">{item.name}</span>
                        {item.specialInstructions && (
                          <div className="text-xs text-yellow-600 mt-0.5">
                            📝 {item.specialInstructions}
                          </div>
                        )}
                      </div>
                      <span className="text-gray-600">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${order.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span>${order.tax?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-1 border-t border-gray-200 mt-1">
                  <span>Total</span>
                  <span className="text-purple-600">${order.total?.toFixed(2)}</span>
                </div>
              </div>

              {/* Special Requests */}
              {order.specialRequests && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                  <p className="text-sm text-yellow-800">
                    <FiAlertCircle className="inline mr-1" />
                    {order.specialRequests}
                  </p>
                </div>
              )}

              {/* Timeline */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">Timeline</h4>
                <div className="space-y-1">
                  {order.timeline?.map((entry, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-gray-500">
                      <span className="capitalize">{entry.status}</span>
                      <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
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

export default KitchenPanel;