// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useSocket } from '../context/SocketContext';
// import { orderService, tableService } from '../services/api';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   FiDollarSign, FiShoppingBag, FiClock, FiCheckCircle, 
//   FiXCircle, FiSearch, FiFilter, FiPrinter, FiRefreshCw,
//   FiUser, FiPhone, FiMail, FiMapPin, FiCreditCard,
//   FiCheck, FiArrowRight, FiEye, FiDownload, FiTrendingUp
// } from 'react-icons/fi';
// import toast from 'react-hot-toast';

// const CashierPanel = () => {
//   const { user } = useAuth();
//   const { socket, emit } = useSocket();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [filter, setFilter] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [paymentModal, setPaymentModal] = useState(null);
//   const [stats, setStats] = useState({
//     todayOrders: 0,
//     todayRevenue: 0,
//     pendingPayments: 0,
//     completedToday: 0
//   });

//   useEffect(() => {
//     fetchData();
    
//     if (socket) {
//       socket.on('new-order', handleNewOrder);
//       socket.on('order-status-updated', handleOrderUpdate);
      
//       return () => {
//         socket.off('new-order');
//         socket.off('order-status-updated');
//       };
//     }
//   }, [socket]);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const ordersRes = await orderService.getOrders();
//       const allOrders = ordersRes.data.data || [];
//       setOrders(allOrders);
//       calculateStats(allOrders);
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//       toast.error('Failed to load orders');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateStats = (allOrders) => {
//     const today = new Date().toDateString();
//     const todayOrders = allOrders.filter(o => 
//       new Date(o.createdAt).toDateString() === today
//     );
//     const completedToday = todayOrders.filter(o => o.status === 'completed');
//     const pendingPayments = allOrders.filter(o => 
//       o.paymentStatus === 'pending' && o.status !== 'cancelled'
//     );
    
//     setStats({
//       todayOrders: todayOrders.length,
//       todayRevenue: completedToday.reduce((sum, o) => sum + (o.total || 0), 0),
//       pendingPayments: pendingPayments.length,
//       completedToday: completedToday.length
//     });
//   };

//   const handleNewOrder = (data) => {
//     toast.info(`New order received: ${data.order?.orderNumber || data.orderId}`);
//     fetchData();
//   };

//   const handleOrderUpdate = (data) => {
//     fetchData();
//   };

//   const processPayment = async (orderId, paymentMethod) => {
//     try {
//       // Update order payment status
//       await orderService.updateOrderStatus(orderId, 'completed');
      
//       // Update payment status (you may want a dedicated payment endpoint)
//       // For now, we'll update the order status to completed
      
//       toast.success(`Payment processed successfully via ${paymentMethod}`);
//       setPaymentModal(null);
//       fetchData();
//       emit('order-status-updated', { orderId, status: 'completed' });
//     } catch (error) {
//       toast.error('Failed to process payment');
//     }
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: 'bg-yellow-100 text-yellow-800',
//       confirmed: 'bg-blue-100 text-blue-800',
//       preparing: 'bg-purple-100 text-purple-800',
//       'ready-for-serve': 'bg-green-100 text-green-800',
//       completed: 'bg-gray-100 text-gray-800',
//       cancelled: 'bg-red-100 text-red-800'
//     };
//     return colors[status] || colors.pending;
//   };

//   const getPaymentStatusColor = (status) => {
//     const colors = {
//       pending: 'bg-red-100 text-red-800',
//       paid: 'bg-green-100 text-green-800',
//       refunded: 'bg-yellow-100 text-yellow-800'
//     };
//     return colors[status] || colors.pending;
//   };

//   const getFilteredOrders = () => {
//     let filtered = orders;
    
//     if (filter === 'pending-payment') {
//       filtered = filtered.filter(o => o.paymentStatus === 'pending' && o.status !== 'cancelled');
//     } else if (filter === 'completed') {
//       filtered = filtered.filter(o => o.status === 'completed');
//     } else if (filter === 'today') {
//       const today = new Date().toDateString();
//       filtered = filtered.filter(o => new Date(o.createdAt).toDateString() === today);
//     }
    
//     if (searchTerm) {
//       filtered = filtered.filter(o => 
//         o.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         o.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         o.guestInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }
    
//     return filtered;
//   };

//   const formatDate = (date) => {
//     return new Date(date).toLocaleString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const filteredOrders = getFilteredOrders();

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
//       <div className="bg-gradient-to-r from-green-600 to-emerald-800 text-white sticky top-0 z-20">
//         <div className="container mx-auto px-4 py-6">
//           <div className="flex flex-wrap justify-between items-center gap-4">
//             <div>
//               <h1 className="text-2xl font-bold">Cashier Panel</h1>
//               <p className="text-green-100">Welcome back, {user?.name}!</p>
//             </div>
//             <div className="flex gap-2">
//               <button
//                 onClick={fetchData}
//                 className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors"
//               >
//                 <FiRefreshCw className="h-5 w-5" />
//               </button>
//               <button className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors">
//                 <FiPrinter className="h-5 w-5" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="container mx-auto px-4 py-6">
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <div className="bg-white rounded-lg shadow-md p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm">Today's Orders</p>
//                 <p className="text-2xl font-bold">{stats.todayOrders}</p>
//               </div>
//               <FiShoppingBag className="h-8 w-8 text-blue-500" />
//             </div>
//           </div>
          
//           <div className="bg-white rounded-lg shadow-md p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm">Today's Revenue</p>
//                 <p className="text-2xl font-bold text-green-600">
//                   ${stats.todayRevenue.toFixed(2)}
//                 </p>
//               </div>
//               <FiDollarSign className="h-8 w-8 text-green-500" />
//             </div>
//           </div>
          
//           <div className="bg-white rounded-lg shadow-md p-4 border border-yellow-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-yellow-700 text-sm">Pending Payments</p>
//                 <p className="text-2xl font-bold text-yellow-700">
//                   {stats.pendingPayments}
//                 </p>
//               </div>
//               <FiClock className="h-8 w-8 text-yellow-500" />
//             </div>
//           </div>
          
//           <div className="bg-white rounded-lg shadow-md p-4 border border-green-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-green-700 text-sm">Completed Today</p>
//                 <p className="text-2xl font-bold text-green-700">
//                   {stats.completedToday}
//                 </p>
//               </div>
//               <FiCheckCircle className="h-8 w-8 text-green-500" />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-6">
//         <div className="bg-white rounded-lg shadow-md">
//           {/* Filters */}
//           <div className="p-4 border-b">
//             <div className="flex flex-wrap justify-between items-center gap-4">
//               <div className="flex flex-wrap gap-2">
//                 <button
//                   onClick={() => setFilter('all')}
//                   className={`px-3 py-1 rounded-full text-sm transition-colors ${
//                     filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
//                   }`}
//                 >
//                   All Orders
//                 </button>
//                 <button
//                   onClick={() => setFilter('pending-payment')}
//                   className={`px-3 py-1 rounded-full text-sm transition-colors ${
//                     filter === 'pending-payment' ? 'bg-yellow-600 text-white' : 'bg-yellow-100 hover:bg-yellow-200'
//                   }`}
//                 >
//                   Pending Payment
//                 </button>
//                 <button
//                   onClick={() => setFilter('today')}
//                   className={`px-3 py-1 rounded-full text-sm transition-colors ${
//                     filter === 'today' ? 'bg-blue-600 text-white' : 'bg-blue-100 hover:bg-blue-200'
//                   }`}
//                 >
//                   Today
//                 </button>
//                 <button
//                   onClick={() => setFilter('completed')}
//                   className={`px-3 py-1 rounded-full text-sm transition-colors ${
//                     filter === 'completed' ? 'bg-green-600 text-white' : 'bg-green-100 hover:bg-green-200'
//                   }`}
//                 >
//                   Completed
//                 </button>
//               </div>
              
//               <div className="relative">
//                 <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search orders..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Orders List */}
//           <div className="divide-y max-h-[600px] overflow-y-auto">
//             {filteredOrders.length === 0 ? (
//               <div className="p-8 text-center text-gray-500">
//                 No orders found
//               </div>
//             ) : (
//               filteredOrders.map((order) => (
//                 <OrderRow
//                   key={order._id}
//                   order={order}
//                   onSelect={setSelectedOrder}
//                   isSelected={selectedOrder === order._id}
//                   onProcessPayment={() => setPaymentModal(order)}
//                   getStatusColor={getStatusColor}
//                   getPaymentStatusColor={getPaymentStatusColor}
//                   formatDate={formatDate}
//                 />
//               ))
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Payment Modal */}
//       <AnimatePresence>
//         {paymentModal && (
//           <PaymentModal
//             order={paymentModal}
//             onClose={() => setPaymentModal(null)}
//             onProcessPayment={processPayment}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// // Order Row Component
// const OrderRow = ({ 
//   order, 
//   onSelect, 
//   isSelected, 
//   onProcessPayment,
//   getStatusColor,
//   getPaymentStatusColor,
//   formatDate 
// }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${isSelected ? 'bg-blue-50' : ''}`}
//       onClick={() => onSelect(order._id)}
//     >
//       <div className="flex flex-wrap items-center justify-between gap-4">
//         <div className="flex-1 min-w-[150px]">
//           <div className="flex items-center gap-3">
//             <span className="font-mono text-sm font-semibold">{order.orderNumber}</span>
//             <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
//               {order.status === 'ready-for-serve' ? 'Ready' : order.status}
//             </span>
//             <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
//               {order.paymentStatus}
//             </span>
//           </div>
//           <div className="text-sm text-gray-600 mt-1">
//             {order.customer?.name || order.guestInfo?.name || 'Guest'}
//           </div>
//           <div className="text-xs text-gray-400 mt-1">
//             {formatDate(order.createdAt)}
//           </div>
//         </div>
        
//         <div className="flex items-center gap-4">
//           <div className="text-right">
//             <div className="font-bold text-primary-600 text-lg">
//               ${order.total?.toFixed(2)}
//             </div>
//             <div className="text-xs text-gray-500">
//               {order.items?.length} items
//             </div>
//           </div>
          
//           {order.paymentStatus === 'pending' && order.status !== 'cancelled' && (
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onProcessPayment();
//               }}
//               className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center gap-2"
//             >
//               <FiDollarSign className="h-4 w-4" />
//               Process Payment
//             </button>
//           )}
          
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onSelect(order._id);
//             }}
//             className="text-gray-400 hover:text-gray-600"
//           >
//             <FiEye className="h-5 w-5" />
//           </button>
//         </div>
//       </div>
      
//       {/* Expanded Details */}
//       <AnimatePresence>
//         {isSelected && (
//           <motion.div
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: 'auto', opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             className="mt-4 pt-4 border-t border-gray-200"
//           >
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <h4 className="font-semibold text-gray-700 mb-2">Order Items</h4>
//                 <div className="space-y-1 text-sm">
//                   {order.items?.map((item, idx) => (
//                     <div key={idx} className="flex justify-between">
//                       <span>{item.quantity}x {item.name}</span>
//                       <span>${(item.price * item.quantity).toFixed(2)}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <div>
//                 <h4 className="font-semibold text-gray-700 mb-2">Customer Details</h4>
//                 <div className="space-y-1 text-sm text-gray-600">
//                   <p><FiUser className="inline mr-2" /> {order.customer?.name || order.guestInfo?.name}</p>
//                   <p><FiMail className="inline mr-2" /> {order.customer?.email || order.guestInfo?.email}</p>
//                   <p><FiPhone className="inline mr-2" /> {order.customer?.phone || order.guestInfo?.phone}</p>
//                   {order.table && (
//                     <p><FiMapPin className="inline mr-2" /> Table {order.table.tableNumber}</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// };

// // Payment Modal Component
// const PaymentModal = ({ order, onClose, onProcessPayment }) => {
//   const [paymentMethod, setPaymentMethod] = useState('cash');
//   const [processing, setProcessing] = useState(false);

//   const handlePayment = async () => {
//     setProcessing(true);
//     await onProcessPayment(order._id, paymentMethod);
//     setProcessing(false);
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
//     >
//       <motion.div
//         initial={{ scale: 0.9, y: 20 }}
//         animate={{ scale: 1, y: 0 }}
//         exit={{ scale: 0.9, y: 20 }}
//         className="bg-white rounded-xl max-w-md w-full p-6"
//       >
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold">Process Payment</h2>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//             <FiXCircle className="h-6 w-6" />
//           </button>
//         </div>
        
//         <div className="space-y-4">
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <div className="flex justify-between">
//               <span className="text-gray-600">Order #</span>
//               <span className="font-semibold">{order.orderNumber}</span>
//             </div>
//             <div className="flex justify-between mt-2">
//               <span className="text-gray-600">Total Amount</span>
//               <span className="text-2xl font-bold text-primary-600">
//                 ${order.total?.toFixed(2)}
//               </span>
//             </div>
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium mb-2">Payment Method</label>
//             <div className="grid grid-cols-2 gap-2">
//               <button
//                 onClick={() => setPaymentMethod('cash')}
//                 className={`p-3 rounded-lg border-2 flex items-center justify-center gap-2 transition-colors ${
//                   paymentMethod === 'cash'
//                     ? 'border-green-600 bg-green-50'
//                     : 'border-gray-200 hover:border-gray-300'
//                 }`}
//               >
//                 <FiCheck className="h-5 w-5" />
//                 Cash
//               </button>
//               <button
//                 onClick={() => setPaymentMethod('card')}
//                 className={`p-3 rounded-lg border-2 flex items-center justify-center gap-2 transition-colors ${
//                   paymentMethod === 'card'
//                     ? 'border-green-600 bg-green-50'
//                     : 'border-gray-200 hover:border-gray-300'
//                 }`}
//               >
//                 <FiCreditCard className="h-5 w-5" />
//                 Card
//               </button>
//               <button
//                 onClick={() => setPaymentMethod('online')}
//                 className={`p-3 rounded-lg border-2 flex items-center justify-center gap-2 transition-colors col-span-2 ${
//                   paymentMethod === 'online'
//                     ? 'border-green-600 bg-green-50'
//                     : 'border-gray-200 hover:border-gray-300'
//                 }`}
//               >
//                 <FiTrendingUp className="h-5 w-5" />
//                 Online Payment
//               </button>
//             </div>
//           </div>
          
//           <button
//             onClick={handlePayment}
//             disabled={processing}
//             className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
//           >
//             {processing ? (
//               <>
//                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                 Processing...
//               </>
//             ) : (
//               <>
//                 <FiDollarSign className="h-5 w-5" />
//                 Complete Payment
//               </>
//             )}
//           </button>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default CashierPanel;
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

const CashierPanel = () => {
  const { user } = useAuth();
  const { socket, emit } = useSocket();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('pending');

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

  const handleCompletePayment = async (orderId) => {
    try {
      await orderService.updateOrderStatus(orderId, 'completed', 'Payment processed');
      toast.success('Payment completed. Order closed.');
      fetchOrders();
    } catch (error) {
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
              onClick={(e) => { e.stopPropagation(); onCompletePayment(order._id); }}
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
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2">Order Timeline</h4>
                <div className="space-y-1 text-sm">
                  {order.timeline?.map((entry, i) => (
                    <div key={i} className="flex justify-between text-gray-600">
                      <span>{entry.status}</span>
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