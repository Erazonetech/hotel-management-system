// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useSocket } from '../context/SocketContext';
// import { orderService, tableService } from '../services/api';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   FiBell, FiCheckCircle, FiClock, FiMapPin, FiUsers, 
//   FiCoffee, FiShoppingBag, FiUser, FiPhone, FiMail,
//   FiAlertCircle, FiRefreshCw, FiEye, FiCheck,
//   FiXCircle, FiPrinter, FiSearch, FiFilter
// } from 'react-icons/fi';
// import toast from 'react-hot-toast';

// const WaiterPanel = () => {
//   const { user } = useAuth();
//   const { socket, emit } = useSocket();
//   const [orders, setOrders] = useState([]);
//   const [tables, setTables] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [filter, setFilter] = useState('all');
//   const [notifications, setNotifications] = useState([]);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     fetchData();
    
//     // Socket event listeners
//     if (socket) {
//       socket.on('new-order', handleNewOrder);
//       socket.on('order-status-updated', handleOrderStatusUpdate);
//       socket.on('order-ready', handleOrderReady);
//       socket.on('table-updated', handleTableUpdate);
      
//       return () => {
//         socket.off('new-order');
//         socket.off('order-status-updated');
//         socket.off('order-ready');
//         socket.off('table-updated');
//       };
//     }
//   }, [socket]);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [ordersRes, tablesRes] = await Promise.all([
//         orderService.getOrders(),
//         tableService.getTables()
//       ]);
//       setOrders(ordersRes.data.data || []);
//       setTables(tablesRes.data.data || []);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       toast.error('Failed to load data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNewOrder = (data) => {
//     toast.success(`New order #${data.order?.orderNumber || data.orderId} received!`, {
//       duration: 5000,
//       icon: '🍽️'
//     });
//     setNotifications(prev => [{
//       id: Date.now(),
//       type: 'new_order',
//       message: `New order ${data.order?.orderNumber || data.orderId} received`,
//       timestamp: new Date(),
//       orderId: data.orderId
//     }, ...prev].slice(0, 20));
//     fetchData();
//   };

//   const handleOrderStatusUpdate = (data) => {
//     toast.info(`Order ${data.orderId} status changed to ${data.status}`);
//     fetchData();
//   };

//   const handleOrderReady = (data) => {
//     toast.success(`Order ${data.orderId} is ready to serve!`, {
//       duration: 10000,
//       icon: '✅'
//     });
//     setNotifications(prev => [{
//       id: Date.now(),
//       type: 'order_ready',
//       message: `Order ${data.orderId} is ready to serve`,
//       timestamp: new Date(),
//       orderId: data.orderId
//     }, ...prev].slice(0, 20));
//     fetchData();
//   };

//   const handleTableUpdate = (data) => {
//     fetchData();
//   };

//   const updateOrderStatus = async (orderId, status) => {
//     try {
//       await orderService.updateOrderStatus(orderId, status);
//       toast.success(`Order status updated to ${status}`);
//       emit('update-order-status', { orderId, status });
//       fetchData();
//     } catch (error) {
//       toast.error('Failed to update order status');
//     }
//   };

//   const updateTableStatus = async (tableId, status) => {
//     try {
//       await tableService.updateTableStatus(tableId, status);
//       toast.success(`Table ${status}`);
//       emit('table-status-change', { tableId, status });
//       fetchData();
//     } catch (error) {
//       toast.error('Failed to update table status');
//     }
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
//       confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
//       preparing: 'bg-purple-100 text-purple-800 border-purple-200',
//       'ready-for-serve': 'bg-green-100 text-green-800 border-green-200',
//       completed: 'bg-gray-100 text-gray-800 border-gray-200',
//       cancelled: 'bg-red-100 text-red-800 border-red-200'
//     };
//     return colors[status] || colors.pending;
//   };

//   const getTableStatusColor = (status) => {
//     const colors = {
//       available: 'bg-green-100 text-green-800',
//       occupied: 'bg-red-100 text-red-800',
//       reserved: 'bg-yellow-100 text-yellow-800',
//       cleaning: 'bg-blue-100 text-blue-800'
//     };
//     return colors[status] || colors.available;
//   };

//   const getFilteredOrders = () => {
//     let filtered = orders;
    
//     if (filter !== 'all') {
//       filtered = filtered.filter(order => order.status === filter);
//     }
    
//     if (searchTerm) {
//       filtered = filtered.filter(order => 
//         order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         order.guestInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }
    
//     return filtered;
//   };

//   const getPendingCount = () => {
//     return orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length;
//   };

//   const getReadyCount = () => {
//     return orders.filter(o => o.status === 'ready-for-serve').length;
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-96">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white sticky top-0 z-20">
//         <div className="container mx-auto px-4 py-6">
//           <div className="flex flex-wrap justify-between items-center gap-4">
//             <div>
//               <h1 className="text-2xl font-bold">Waiter Panel</h1>
//               <p className="text-primary-100">Welcome back, {user?.name}!</p>
//             </div>
            
//             <div className="flex items-center gap-3">
//               {/* Notification Bell */}
//               <div className="relative">
//                 <button
//                   onClick={() => setShowNotifications(!showNotifications)}
//                   className="relative bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors"
//                 >
//                   <FiBell className="h-5 w-5" />
//                   {notifications.length > 0 && (
//                     <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                       {notifications.length}
//                     </span>
//                   )}
//                 </button>
                
//                 {/* Notifications Dropdown */}
//                 {showNotifications && (
//                   <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-30 max-h-96 overflow-y-auto">
//                     <div className="p-3 border-b font-semibold">Notifications</div>
//                     {notifications.length === 0 ? (
//                       <div className="p-4 text-center text-gray-500">No notifications</div>
//                     ) : (
//                       notifications.map(notif => (
//                         <div key={notif.id} className="p-3 border-b hover:bg-gray-50 cursor-pointer">
//                           <p className="text-sm">{notif.message}</p>
//                           <p className="text-xs text-gray-400 mt-1">
//                             {new Date(notif.timestamp).toLocaleTimeString()}
//                           </p>
//                         </div>
//                       ))
//                     )}
//                   </div>
//                 )}
//               </div>
              
//               <button
//                 onClick={fetchData}
//                 className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors"
//               >
//                 <FiRefreshCw className="h-5 w-5" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="container mx-auto px-4 py-6">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="bg-white rounded-lg shadow-md p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm">Total Orders Today</p>
//                 <p className="text-2xl font-bold">{orders.length}</p>
//               </div>
//               <FiShoppingBag className="h-8 w-8 text-primary-500" />
//             </div>
//           </div>
          
//           <div className="bg-yellow-50 rounded-lg shadow-md p-4 border border-yellow-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-yellow-700 text-sm">Pending Orders</p>
//                 <p className="text-2xl font-bold text-yellow-700">{getPendingCount()}</p>
//               </div>
//               <FiClock className="h-8 w-8 text-yellow-500" />
//             </div>
//           </div>
          
//           <div className="bg-green-50 rounded-lg shadow-md p-4 border border-green-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-green-700 text-sm">Ready to Serve</p>
//                 <p className="text-2xl font-bold text-green-700">{getReadyCount()}</p>
//               </div>
//               <FiCheckCircle className="h-8 w-8 text-green-500" />
//             </div>
//           </div>
          
//           <div className="bg-blue-50 rounded-lg shadow-md p-4 border border-blue-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-blue-700 text-sm">Active Tables</p>
//                 <p className="text-2xl font-bold text-blue-700">
//                   {tables.filter(t => t.status === 'occupied').length}
//                 </p>
//               </div>
//               <FiMapPin className="h-8 w-8 text-blue-500" />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-6">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Orders Section */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-lg shadow-md">
//               <div className="p-4 border-b">
//                 <div className="flex flex-wrap justify-between items-center gap-4">
//                   <h2 className="text-xl font-bold">Active Orders</h2>
                  
//                   {/* Search */}
//                   <div className="relative">
//                     <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                     <input
//                       type="text"
//                       placeholder="Search orders..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
//                 </div>
                
//                 {/* Filters */}
//                 <div className="flex flex-wrap gap-2 mt-4">
//                   {['all', 'pending', 'confirmed', 'preparing', 'ready-for-serve', 'completed'].map((status) => (
//                     <button
//                       key={status}
//                       onClick={() => setFilter(status)}
//                       className={`px-3 py-1 rounded-full text-sm transition-colors ${
//                         filter === status
//                           ? 'bg-primary-600 text-white'
//                           : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                       }`}
//                     >
//                       {status === 'ready-for-serve' ? 'Ready' : status.charAt(0).toUpperCase() + status.slice(1)}
//                     </button>
//                   ))}
//                 </div>
//               </div>
              
//               <div className="divide-y max-h-[600px] overflow-y-auto">
//                 {getFilteredOrders().length === 0 ? (
//                   <div className="p-8 text-center text-gray-500">
//                     No orders found
//                   </div>
//                 ) : (
//                   getFilteredOrders().map((order) => (
//                     <OrderCard
//                       key={order._id}
//                       order={order}
//                       onUpdateStatus={updateOrderStatus}
//                       onSelect={setSelectedOrder}
//                       isSelected={selectedOrder === order._id}
//                       getStatusColor={getStatusColor}
//                     />
//                   ))
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Tables Section */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-lg shadow-md mb-6">
//               <div className="p-4 border-b">
//                 <h2 className="text-xl font-bold">Tables</h2>
//               </div>
//               <div className="p-4 grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
//                 {tables.map((table) => (
//                   <TableCard
//                     key={table._id}
//                     table={table}
//                     onUpdateStatus={updateTableStatus}
//                     getStatusColor={getTableStatusColor}
//                   />
//                 ))}
//               </div>
//             </div>

//             {/* Quick Actions */}
//             <div className="bg-white rounded-lg shadow-md">
//               <div className="p-4 border-b">
//                 <h2 className="text-xl font-bold">Quick Actions</h2>
//               </div>
//               <div className="p-4 space-y-3">
//                 <button className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors">
//                   Request Kitchen Update
//                 </button>
//                 <button className="w-full border border-primary-600 text-primary-600 py-2 rounded-lg hover:bg-primary-50 transition-colors">
//                   Print Order Summary
//                 </button>
//                 <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors">
//                   View Daily Report
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Order Card Component
// const OrderCard = ({ order, onUpdateStatus, onSelect, isSelected, getStatusColor }) => {
//   const statusOptions = ['pending', 'confirmed', 'preparing', 'ready-for-serve', 'completed'];
//   const currentIndex = statusOptions.indexOf(order.status);

//   const getNextStatus = () => {
//     if (currentIndex < statusOptions.length - 1) {
//       return statusOptions[currentIndex + 1];
//     }
//     return null;
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${isSelected ? 'bg-blue-50' : ''}`}
//       onClick={() => onSelect(order._id)}
//     >
//       <div className="flex justify-between items-start mb-2">
//         <div>
//           <span className="font-mono text-sm text-gray-500">{order.orderNumber}</span>
//           <div className="flex items-center gap-2 mt-1">
//             <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
//               {order.status === 'ready-for-serve' ? 'Ready' : order.status}
//             </span>
//             <span className="text-xs text-gray-400">
//               {new Date(order.createdAt).toLocaleTimeString()}
//             </span>
//           </div>
//         </div>
//         <div className="text-right">
//           <div className="font-bold text-primary-600">${order.total?.toFixed(2)}</div>
//           <div className="text-xs text-gray-500">{order.items?.length} items</div>
//         </div>
//       </div>
      
//       <div className="text-sm text-gray-600 mb-2">
//         {order.customer?.name || order.guestInfo?.name || 'Guest'}
//       </div>
      
//       <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
//         {order.table && (
//           <span className="flex items-center gap-1">
//             <FiMapPin className="h-3 w-3" /> Table {order.table.tableNumber}
//           </span>
//         )}
//         <span className="flex items-center gap-1">
//           <FiUsers className="h-3 w-3" /> {order.guestInfo?.numberOfGuests || 2} guests
//         </span>
//       </div>
      
//       {/* Order Items Preview */}
//       <div className="text-xs text-gray-500 mb-3">
//         {order.items?.slice(0, 2).map((item, idx) => (
//           <div key={idx}>{item.quantity}x {item.name}</div>
//         ))}
//         {order.items?.length > 2 && <div>+{order.items.length - 2} more</div>}
//       </div>
      
//       {/* Action Buttons */}
//       <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
//         {getNextStatus() && (
//           <button
//             onClick={() => onUpdateStatus(order._id, getNextStatus())}
//             className="flex-1 bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700"
//           >
//             Mark as {getNextStatus() === 'ready-for-serve' ? 'Ready' : getNextStatus()}
//           </button>
//         )}
//         {order.status === 'ready' && (
//           <button
//             onClick={(e) => { e.stopPropagation(); onUpdateStatus(order._id, 'served'); }}
//             className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-indigo-700"
//           >
//             <FiCheckCircle className="inline mr-1" /> Serve to Customer
//           </button>
//         )}
//         {order.status !== 'completed' && order.status !== 'cancelled' && (
//           <button
//             onClick={() => onUpdateStatus(order._id, 'cancelled')}
//             className="px-3 py-1 border border-red-500 text-red-500 rounded text-sm hover:bg-red-50"
//           >
//             Cancel
//           </button>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// // Table Card Component
// const TableCard = ({ table, onUpdateStatus, getStatusColor }) => {
//   const statuses = ['available', 'occupied', 'reserved', 'cleaning'];
  
//   return (
//     <div className="border rounded-lg p-3 hover:shadow-md transition-shadow">
//       <div className="flex justify-between items-start mb-2">
//         <div>
//           <div className="font-bold text-lg">Table {table.tableNumber}</div>
//           <div className="text-xs text-gray-500">Capacity: {table.capacity}</div>
//         </div>
//         <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(table.status)}`}>
//           {table.status}
//         </div>
//       </div>
      
//       <select
//         value={table.status}
//         onChange={(e) => onUpdateStatus(table._id, e.target.value)}
//         className="w-full mt-2 text-sm border rounded p-1"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {statuses.map(status => (
//           <option key={status} value={status}>
//             {status.charAt(0).toUpperCase() + status.slice(1)}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// };


// export default WaiterPanel;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { orderService, tableService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiBell, FiCheckCircle, FiClock, FiMapPin, FiUsers, 
  FiCoffee, FiShoppingBag, FiUser, FiPhone, FiMail,
  FiAlertCircle, FiRefreshCw, FiEye, FiCheck,
  FiXCircle, FiPrinter, FiSearch, FiFilter
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const WaiterPanel = () => {
  const { user } = useAuth();
  const { socket, emit } = useSocket();
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
    
    if (socket) {
      socket.on('new-order', handleNewOrder);
      socket.on('order-ready', handleOrderReady);
      socket.on('order-status-updated', handleOrderUpdate);
      socket.on('table-updated', handleTableUpdate);
      
      return () => {
        socket.off('new-order');
        socket.off('order-ready');
        socket.off('order-status-updated');
        socket.off('table-updated');
      };
    }
  }, [socket]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, tablesRes] = await Promise.all([
        orderService.getOrders({ role: 'waiter' }),
        tableService.getTables()
      ]);
      setOrders(ordersRes.data.data || []);
      setTables(tablesRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleNewOrder = (data) => {
    toast.info(`New order #${data.orderNumber} received`);
    fetchData();
  };

  const handleOrderReady = (data) => {
    toast.success(`Order #${data.orderNumber} is ready to serve!`, {
      duration: 10000,
      icon: '✅'
    });
    setNotifications(prev => [{
      id: Date.now(),
      type: 'order_ready',
      message: `Order #${data.orderNumber} is ready to serve`,
      timestamp: new Date(),
      orderId: data.orderId
    }, ...prev].slice(0, 20));
    fetchData();
  };

  const handleOrderUpdate = (data) => {
    fetchData();
  };

  const handleTableUpdate = (data) => {
    fetchData();
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const statusMap = {
        'serve': 'served'
      };
      const finalStatus = statusMap[status] || status;
      
      await orderService.updateOrderStatus(orderId, finalStatus);
      toast.success(`Order ${finalStatus}`);
      emit('update-order-status', { orderId, status: finalStatus });
      fetchData();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const updateTableStatus = async (tableId, status) => {
    try {
      await tableService.updateTableStatus(tableId, status);
      toast.success(`Table ${status}`);
      emit('table-status-change', { tableId, status });
      fetchData();
    } catch (error) {
      toast.error('Failed to update table status');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      ready: 'bg-green-100 text-green-800 border-green-300',
      served: 'bg-indigo-100 text-indigo-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return styles[status] || styles.pending;
  };

  const getTableStatusColor = (status) => {
    const colors = {
      available: 'bg-green-100 text-green-800',
      occupied: 'bg-red-100 text-red-800',
      reserved: 'bg-yellow-100 text-yellow-800',
      cleaning: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || colors.available;
  };

  const getFilteredOrders = () => {
    let filtered = orders;
    
    if (filter !== 'all') {
      filtered = filtered.filter(order => order.status === filter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.guestInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const getReadyCount = () => {
    return orders.filter(o => o.status === 'ready').length;
  };

  const getServedCount = () => {
    return orders.filter(o => o.status === 'served').length;
  };

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
      <div className="bg-gradient-to-r from-indigo-600 to-blue-800 text-white sticky top-0 z-20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Waiter Panel</h1>
              <p className="text-indigo-100">Welcome back, {user?.name}!</p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <FiBell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-30 max-h-96 overflow-y-auto">
                    <div className="p-3 border-b font-semibold text-gray-800">Notifications</div>
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">No notifications</div>
                    ) : (
                      notifications.map(notif => (
                        <div key={notif.id} className="p-3 border-b hover:bg-gray-50 cursor-pointer">
                          <p className="text-sm text-gray-800">{notif.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(notif.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              
              <button
                onClick={fetchData}
                className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors"
              >
                <FiRefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <FiShoppingBag className="h-8 w-8 text-indigo-500" />
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg shadow-md p-4 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-700 text-sm">Ready to Serve</p>
                <p className="text-2xl font-bold text-yellow-700">{getReadyCount()}</p>
              </div>
              <FiClock className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg shadow-md p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-700 text-sm">In Progress (Served)</p>
                <p className="text-2xl font-bold text-purple-700">{getServedCount()}</p>
              </div>
              <FiCheckCircle className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg shadow-md p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-700 text-sm">Active Tables</p>
                <p className="text-2xl font-bold text-green-700">
                  {tables.filter(t => t.status === 'occupied').length}
                </p>
              </div>
              <FiMapPin className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Orders Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-4 border-b">
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <h2 className="text-xl font-bold">Active Orders</h2>
                  
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {['all', 'ready', 'served'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilter(status)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        filter === status
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="divide-y max-h-[600px] overflow-y-auto">
                {getFilteredOrders().length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No orders to display
                  </div>
                ) : (
                  getFilteredOrders().map((order) => (
                    <WaiterOrderCard
                      key={order._id}
                      order={order}
                      onUpdateStatus={updateOrderStatus}
                      onSelect={setSelectedOrder}
                      isSelected={selectedOrder === order._id}
                      getStatusBadge={getStatusBadge}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Tables Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md mb-6">
              <div className="p-4 border-b">
                <h2 className="text-xl font-bold">Table Management</h2>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                {tables.map((table) => (
                  <TableCard
                    key={table._id}
                    table={table}
                    onUpdateStatus={updateTableStatus}
                    getStatusColor={getTableStatusColor}
                  />
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-4 border-b">
                <h2 className="text-xl font-bold">Quick Actions</h2>
              </div>
              <div className="p-4 space-y-3">
                <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Request Kitchen Update
                </button>
                <button className="w-full border border-indigo-600 text-indigo-600 py-2 rounded-lg hover:bg-indigo-50 transition-colors">
                  Print Order Summary
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  View Daily Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Waiter Order Card Component
const WaiterOrderCard = ({ order, onUpdateStatus, onSelect, isSelected, getStatusBadge }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${isSelected ? 'bg-indigo-50' : ''}`}
      onClick={() => onSelect(order._id)}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm">{order.orderNumber}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
              {order.status}
            </span>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {order.customer?.name || order.guestInfo?.name || 'Guest'}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {new Date(order.createdAt).toLocaleString()}
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold text-indigo-600">${order.total?.toFixed(2)}</div>
          <div className="text-xs text-gray-500">{order.items?.length} items</div>
        </div>
      </div>

      {/* Order Items Preview */}
      <div className="text-sm text-gray-600 mt-2">
        {order.items?.slice(0, 2).map((item, idx) => (
          <div key={idx}>{item.quantity}x {item.name}</div>
        ))}
        {order.items?.length > 2 && <div className="text-xs text-gray-400">+{order.items.length - 2} more</div>}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
        {order.status === 'ready' && (
          <button
            onClick={() => onUpdateStatus(order._id, 'serve')}
            className="flex-1 bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1"
          >
            <FiCheckCircle className="h-4 w-4" />
            Serve to Customer
          </button>
        )}
        <button
          onClick={() => setExpanded(!expanded)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
        >
          {expanded ? 'Hide' : 'Details'}
        </button>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 pt-3 border-t border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Order Items</h4>
                <div className="space-y-1">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.name}</span>
                      <span className="text-gray-600">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${order.subtotal?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span>${order.tax?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm mt-1 pt-1 border-t">
                    <span>Total</span>
                    <span className="text-indigo-600">${order.total?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Customer Details</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><FiUser className="inline mr-2" /> {order.customer?.name || order.guestInfo?.name}</p>
                  {order.customer?.email || order.guestInfo?.email ? (
                    <p><FiMail className="inline mr-2" /> {order.customer?.email || order.guestInfo?.email}</p>
                  ) : null}
                  {order.customer?.phone || order.guestInfo?.phone ? (
                    <p><FiPhone className="inline mr-2" /> {order.customer?.phone || order.guestInfo?.phone}</p>
                  ) : null}
                  {order.table && (
                    <p><FiMapPin className="inline mr-2" /> Table {order.table.tableNumber} ({order.table.section})</p>
                  )}
                  {order.specialRequests && (
                    <p className="text-yellow-600"><FiAlertCircle className="inline mr-2" /> {order.specialRequests}</p>
                  )}
                </div>

                {/* Order Timeline */}
                <h4 className="font-semibold text-sm text-gray-700 mt-3 mb-2">Timeline</h4>
                <div className="space-y-1 text-xs text-gray-500">
                  {order.timeline?.slice(-5).map((entry, idx) => (
                    <div key={idx} className="flex justify-between">
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

// Table Card Component
const TableCard = ({ table, onUpdateStatus, getStatusColor }) => {
  const statuses = ['available', 'occupied', 'reserved', 'cleaning'];
  
  return (
    <div className="border rounded-lg p-3 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="font-bold text-lg">Table {table.tableNumber}</div>
          <div className="text-xs text-gray-500">Capacity: {table.capacity}</div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(table.status)}`}>
          {table.status}
        </div>
      </div>
      
      <select
        value={table.status}
        onChange={(e) => onUpdateStatus(table._id, e.target.value)}
        className="w-full mt-2 text-sm border rounded p-1"
        onClick={(e) => e.stopPropagation()}
      >
        {statuses.map(status => (
          <option key={status} value={status}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default WaiterPanel;