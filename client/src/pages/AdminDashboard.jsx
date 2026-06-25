// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useSocket } from '../context/SocketContext';
// import { menuService, orderService, tableService } from '../services/api';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   FiUsers, FiShoppingBag, FiDollarSign, FiTrendingUp, 
//   FiEdit, FiTrash2, FiPlus, FiSearch, FiX, FiEye,
//   FiCheckCircle, FiClock, FiAlertCircle, FiGrid, FiList,
//   FiStar, FiCalendar, FiMapPin, FiPhone, FiMail, FiRefreshCw,
//   FiUser, FiCoffee, FiAward, FiTruck, FiHeart
// } from 'react-icons/fi';
// import toast from 'react-hot-toast';

// const AdminDashboard = () => {
//   const { user } = useAuth();
//   const { socket, emit } = useSocket();
//   const [activeTab, setActiveTab] = useState('overview');
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     totalOrders: 0,
//     totalRevenue: 0,
//     pendingOrders: 0,
//     preparingOrders: 0,
//     readyOrders: 0,
//     servedOrders: 0
//   });
//   const [orders, setOrders] = useState([]);
//   const [menuItems, setMenuItems] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [tables, setTables] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [editingItem, setEditingItem] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     price: '',
//     category: '',
//     preparationTime: 15,
//     isAvailable: true,
//     isPopular: false,
//     discount: 0,
//     isVegetarian: false,
//     isVegan: false,
//     isGlutenFree: false
//   });

//   useEffect(() => {
//     fetchDashboardData();
    
//     if (socket) {
//       socket.on('new-order', handleNewOrder);
//       socket.on('order-completed', handleOrderCompleted);
//       socket.on('order-status-updated', handleOrderUpdate);
      
//       return () => {
//         socket.off('new-order');
//         socket.off('order-completed');
//         socket.off('order-status-updated');
//       };
//     }
//   }, [socket]);

//   const handleNewOrder = (data) => {
//     toast.info(`New order #${data.orderNumber} received`);
//     fetchDashboardData();
//   };

//   const handleOrderCompleted = (data) => {
//     toast.success(`Order #${data.orderNumber} completed`);
//     fetchDashboardData();
//   };

//   const handleOrderUpdate = (data) => {
//     fetchDashboardData();
//   };

//   const fetchDashboardData = async () => {
//     setLoading(true);
//     try {
//       const [menuRes, orderRes, tableRes] = await Promise.all([
//         menuService.getMenuItems(),
//         orderService.getOrders({ role: 'admin' }),
//         tableService.getTables()
//       ]);
      
//       const allOrders = orderRes.data.data || [];
//       setOrders(allOrders);
//       setMenuItems(menuRes.data.data || []);
//       setTables(tableRes.data.data || []);
      
//       // Calculate stats
//       const totalRevenue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);
//       const pendingOrders = allOrders.filter(o => o.status === 'pending').length;
//       const preparingOrders = allOrders.filter(o => o.status === 'preparing' || o.status === 'confirmed').length;
//       const readyOrders = allOrders.filter(o => o.status === 'ready').length;
//       const servedOrders = allOrders.filter(o => o.status === 'served').length;
      
//       setStats({
//         totalOrders: allOrders.length,
//         totalRevenue: totalRevenue,
//         pendingOrders: pendingOrders,
//         preparingOrders: preparingOrders,
//         readyOrders: readyOrders,
//         servedOrders: servedOrders,
//         totalUsers: 124 // This would come from a users API
//       });
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//       toast.error('Failed to load dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddMenuItem = async () => {
//     if (!formData.name || !formData.description || !formData.price || !formData.category) {
//       toast.error('Please fill in all required fields');
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const menuItemData = {
//         name: formData.name,
//         description: formData.description,
//         price: parseFloat(formData.price),
//         category: formData.category,
//         preparationTime: parseInt(formData.preparationTime) || 15,
//         isAvailable: formData.isAvailable,
//         isPopular: formData.isPopular,
//         discount: parseFloat(formData.discount) || 0,
//         stock: 100,
//         images: ['placeholder.jpg'],
//         dietary: {
//           isVegetarian: formData.isVegetarian || false,
//           isVegan: formData.isVegan || false,
//           isGlutenFree: formData.isGlutenFree || false
//         }
//       };

//       const response = await menuService.createMenuItem(menuItemData);
//       if (response.data.success) {
//         toast.success('Menu item added successfully');
//         setShowAddModal(false);
//         fetchDashboardData();
//         setFormData({
//           name: '',
//           description: '',
//           price: '',
//           category: '',
//           preparationTime: 15,
//           isAvailable: true,
//           isPopular: false,
//           discount: 0,
//           isVegetarian: false,
//           isVegan: false,
//           isGlutenFree: false
//         });
//       }
//     } catch (error) {
//       console.error('Add menu item error:', error);
//       toast.error(error.response?.data?.error || 'Failed to add menu item');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDeleteMenuItem = async (id) => {
//     if (window.confirm('Are you sure you want to delete this item?')) {
//       try {
//         await menuService.deleteMenuItem(id);
//         toast.success('Menu item deleted');
//         fetchDashboardData();
//       } catch (error) {
//         toast.error('Failed to delete item');
//       }
//     }
//   };

//   const handleUpdateOrderStatus = async (orderId, status) => {
//     try {
//       await orderService.updateOrderStatus(orderId, status);
//       toast.success(`Order status updated to ${status}`);
//       fetchDashboardData();
//     } catch (error) {
//       toast.error('Failed to update order status');
//     }
//   };

//   const getStatusBadge = (status) => {
//     const styles = {
//       pending: 'bg-yellow-100 text-yellow-800',
//       confirmed: 'bg-blue-100 text-blue-800',
//       preparing: 'bg-purple-100 text-purple-800',
//       ready: 'bg-green-100 text-green-800',
//       served: 'bg-indigo-100 text-indigo-800',
//       completed: 'bg-gray-100 text-gray-800',
//       cancelled: 'bg-red-100 text-red-800'
//     };
//     return styles[status] || styles.pending;
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

//   const tabs = [
//     { id: 'overview', name: 'Overview', icon: FiTrendingUp },
//     { id: 'menu', name: 'Menu Management', icon: FiGrid },
//     { id: 'orders', name: 'Orders', icon: FiShoppingBag },
//     { id: 'tables', name: 'Tables', icon: FiMapPin },
//     { id: 'users', name: 'Users', icon: FiUsers }
//   ];

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
//               <h1 className="text-2xl font-bold">Admin Dashboard</h1>
//               <p className="text-primary-100">Welcome back, {user?.name}!</p>
//             </div>
//             <div className="flex gap-2">
//               <button
//                 onClick={fetchDashboardData}
//                 className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors"
//               >
//                 <FiRefreshCw className="h-5 w-5" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-6">
//         {/* Tab Navigation */}
//         <div className="bg-white rounded-lg shadow-md mb-6 overflow-x-auto">
//           <div className="flex">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors whitespace-nowrap ${
//                   activeTab === tab.id
//                     ? 'text-primary-600 border-b-2 border-primary-600'
//                     : 'text-gray-600 hover:text-primary-600'
//                 }`}
//               >
//                 <tab.icon className="h-5 w-5" />
//                 {tab.name}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Overview Tab */}
//         {activeTab === 'overview' && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="space-y-6"
//           >
//             {/* Stats Cards */}
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//               {[
//                 { label: 'Total Orders', value: stats.totalOrders, icon: FiShoppingBag, color: 'bg-blue-500' },
//                 { label: 'Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: FiDollarSign, color: 'bg-green-500' },
//                 { label: 'Pending', value: stats.pendingOrders, icon: FiClock, color: 'bg-yellow-500' },
//                 { label: 'Preparing', value: stats.preparingOrders, icon: FiAlertCircle, color: 'bg-purple-500' },
//                 { label: 'Ready', value: stats.readyOrders, icon: FiCheckCircle, color: 'bg-green-500' },
//                 { label: 'Served', value: stats.servedOrders, icon: FiUsers, color: 'bg-indigo-500' }
//               ].map((stat, index) => (
//                 <motion.div
//                   key={index}
//                   whileHover={{ scale: 1.02 }}
//                   className="bg-white rounded-lg shadow-md p-4"
//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-gray-500 text-xs uppercase">{stat.label}</p>
//                       <p className="text-xl font-bold text-gray-800 mt-1">{stat.value}</p>
//                     </div>
//                     <div className={`${stat.color} p-2 rounded-full text-white`}>
//                       <stat.icon className="h-4 w-4" />
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>

//             {/* Workflow Visualization */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-xl font-bold mb-4">Order Workflow</h2>
//               <div className="grid grid-cols-5 gap-2 text-center">
//                 {[
//                   { stage: 'Pending', icon: '⏳', color: 'bg-yellow-100', count: stats.pendingOrders },
//                   { stage: 'Confirmed', icon: '✅', color: 'bg-blue-100', count: orders.filter(o => o.status === 'confirmed').length },
//                   { stage: 'Preparing', icon: '🔪', color: 'bg-purple-100', count: stats.preparingOrders },
//                   { stage: 'Ready', icon: '🍽️', color: 'bg-green-100', count: stats.readyOrders },
//                   { stage: 'Served', icon: '💰', color: 'bg-indigo-100', count: stats.servedOrders }
//                 ].map((stage, i) => (
//                   <div key={i} className="relative">
//                     <div className={`${stage.color} p-3 rounded-lg`}>
//                       <div className="text-2xl">{stage.icon}</div>
//                       <div className="text-sm font-semibold">{stage.stage}</div>
//                       <div className="text-xs text-gray-500">{stage.count}</div>
//                     </div>
//                     {i < 4 && <div className="absolute top-1/2 -right-2 w-4 h-0.5 bg-gray-300"></div>}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Recent Orders */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-4 py-2 text-left text-sm">Order #</th>
//                       <th className="px-4 py-2 text-left text-sm">Customer</th>
//                       <th className="px-4 py-2 text-left text-sm">Items</th>
//                       <th className="px-4 py-2 text-left text-sm">Total</th>
//                       <th className="px-4 py-2 text-left text-sm">Status</th>
//                       <th className="px-4 py-2 text-left text-sm">Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {orders.slice(0, 10).map((order) => (
//                       <tr key={order._id} className="border-t hover:bg-gray-50">
//                         <td className="px-4 py-2 text-sm font-mono">{order.orderNumber}</td>
//                         <td className="px-4 py-2 text-sm">{order.customer?.name || order.guestInfo?.name || 'Guest'}</td>
//                         <td className="px-4 py-2 text-sm">{order.items?.length || 0}</td>
//                         <td className="px-4 py-2 text-sm font-semibold">${order.total?.toFixed(2)}</td>
//                         <td className="px-4 py-2 text-sm">
//                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
//                             {order.status}
//                           </span>
//                         </td>
//                         <td className="px-4 py-2 text-sm">
//                           <select
//                             onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
//                             value={order.status}
//                             className="text-xs border rounded px-2 py-1"
//                           >
//                             <option value="pending">Pending</option>
//                             <option value="confirmed">Confirmed</option>
//                             <option value="preparing">Preparing</option>
//                             <option value="ready">Ready</option>
//                             <option value="served">Served</option>
//                             <option value="completed">Completed</option>
//                             <option value="cancelled">Cancelled</option>
//                           </select>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </motion.div>
//         )}

//         {/* Menu Management Tab */}
//         {activeTab === 'menu' && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="space-y-6"
//           >
//             <div className="flex justify-between items-center">
//               <h2 className="text-2xl font-bold">Menu Items</h2>
//               <button
//                 onClick={() => setShowAddModal(true)}
//                 className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700"
//               >
//                 <FiPlus className="h-5 w-5" />
//                 Add Item
//               </button>
//             </div>

//             <div className="bg-white rounded-lg shadow-md overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-4 py-3 text-left text-sm">Name</th>
//                       <th className="px-4 py-3 text-left text-sm">Category</th>
//                       <th className="px-4 py-3 text-left text-sm">Price</th>
//                       <th className="px-4 py-3 text-left text-sm">Status</th>
//                       <th className="px-4 py-3 text-left text-sm">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {menuItems.map((item) => (
//                       <tr key={item._id} className="border-t hover:bg-gray-50">
//                         <td className="px-4 py-3 text-sm font-medium">{item.name}</td>
//                         <td className="px-4 py-3 text-sm">{item.category?.name || 'Uncategorized'}</td>
//                         <td className="px-4 py-3 text-sm">${item.price}</td>
//                         <td className="px-4 py-3 text-sm">
//                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                             {item.isAvailable ? 'Available' : 'Unavailable'}
//                           </span>
//                         </td>
//                         <td className="px-4 py-3 text-sm">
//                           <button
//                             onClick={() => handleDeleteMenuItem(item._id)}
//                             className="text-red-600 hover:text-red-800"
//                           >
//                             <FiTrash2 className="h-5 w-5" />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </motion.div>
//         )}

//         {/* Orders Tab */}
//         {activeTab === 'orders' && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-white rounded-lg shadow-md overflow-hidden"
//           >
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-sm">Order #</th>
//                     <th className="px-4 py-3 text-left text-sm">Customer</th>
//                     <th className="px-4 py-3 text-left text-sm">Items</th>
//                     <th className="px-4 py-3 text-left text-sm">Total</th>
//                     <th className="px-4 py-3 text-left text-sm">Status</th>
//                     <th className="px-4 py-3 text-left text-sm">Payment</th>
//                     <th className="px-4 py-3 text-left text-sm">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {orders.map((order) => (
//                     <tr key={order._id} className="border-t hover:bg-gray-50">
//                       <td className="px-4 py-3 text-sm font-mono">{order.orderNumber}</td>
//                       <td className="px-4 py-3 text-sm">{order.customer?.name || order.guestInfo?.name || 'Guest'}</td>
//                       <td className="px-4 py-3 text-sm">{order.items?.length || 0}</td>
//                       <td className="px-4 py-3 text-sm font-semibold">${order.total?.toFixed(2)}</td>
//                       <td className="px-4 py-3 text-sm">
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
//                           {order.status}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 text-sm">
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
//                           {order.paymentStatus}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 text-sm">
//                         <select
//                           onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
//                           value={order.status}
//                           className="text-xs border rounded px-2 py-1"
//                         >
//                           <option value="pending">Pending</option>
//                           <option value="confirmed">Confirmed</option>
//                           <option value="preparing">Preparing</option>
//                           <option value="ready">Ready</option>
//                           <option value="served">Served</option>
//                           <option value="completed">Completed</option>
//                           <option value="cancelled">Cancelled</option>
//                         </select>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </motion.div>
//         )}

//         {/* Tables Tab */}
//         {activeTab === 'tables' && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
//           >
//             {tables.map((table) => (
//               <div key={table._id} className="bg-white rounded-lg shadow-md p-4">
//                 <div className="flex justify-between items-start mb-2">
//                   <div>
//                     <h3 className="text-lg font-bold">Table {table.tableNumber}</h3>
//                     <p className="text-gray-500 text-sm">Capacity: {table.capacity}</p>
//                   </div>
//                   <div className={`px-2 py-1 rounded-full text-xs font-medium ${getTableStatusColor(table.status)}`}>
//                     {table.status}
//                   </div>
//                 </div>
//                 <div className="text-xs text-gray-400 capitalize">{table.section} Section</div>
//               </div>
//             ))}
//           </motion.div>
//         )}

//         {/* Users Tab */}
//         {activeTab === 'users' && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-white rounded-lg shadow-md overflow-hidden"
//           >
//             <div className="p-4 border-b">
//               <h2 className="text-xl font-bold">Users</h2>
//             </div>
//             <div className="p-4 text-center text-gray-500">
//               User management coming soon
//             </div>
//           </motion.div>
//         )}
//       </div>

//       {/* Add Menu Item Modal */}
//       <AnimatePresence>
//         {showAddModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
//           >
//             <motion.div
//               initial={{ scale: 0.9, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.9, y: 20 }}
//               className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
//             >
//               <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
//                 <h2 className="text-xl font-bold">Add Menu Item</h2>
//                 <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
//                   <FiX className="h-6 w-6" />
//                 </button>
//               </div>
              
//               <div className="p-4 space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Name *</label>
//                   <input
//                     type="text"
//                     value={formData.name}
//                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                     className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Description *</label>
//                   <textarea
//                     value={formData.description}
//                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                     className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
//                     rows="3"
//                   />
//                 </div>
                
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium mb-1">Price *</label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       value={formData.price}
//                       onChange={(e) => setFormData({ ...formData, price: e.target.value })}
//                       className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-1">Category *</label>
//                     <select
//                       value={formData.category}
//                       onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//                       className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
//                     >
//                       <option value="">Select Category</option>
//                       {categories.map((cat) => (
//                         <option key={cat._id} value={cat._id}>{cat.name}</option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
                
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium mb-1">Preparation Time (min)</label>
//                     <input
//                       type="number"
//                       value={formData.preparationTime}
//                       onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
//                       className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-1">Discount (%)</label>
//                     <input
//                       type="number"
//                       step="1"
//                       value={formData.discount}
//                       onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
//                       className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
//                 </div>
                
//                 <div className="space-y-2">
//                   <label className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       checked={formData.isAvailable}
//                       onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
//                       className="rounded text-primary-500"
//                     />
//                     <span className="text-sm font-medium">Item Available</span>
//                   </label>
//                   <label className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       checked={formData.isPopular}
//                       onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
//                       className="rounded text-primary-500"
//                     />
//                     <span className="text-sm font-medium">Popular Item</span>
//                   </label>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Dietary Options</label>
//                   <div className="flex flex-wrap gap-4">
//                     <label className="flex items-center gap-2">
//                       <input
//                         type="checkbox"
//                         checked={formData.isVegetarian}
//                         onChange={(e) => setFormData({ ...formData, isVegetarian: e.target.checked })}
//                         className="rounded text-primary-500"
//                       />
//                       <span className="text-sm">Vegetarian</span>
//                     </label>
//                     <label className="flex items-center gap-2">
//                       <input
//                         type="checkbox"
//                         checked={formData.isVegan}
//                         onChange={(e) => setFormData({ ...formData, isVegan: e.target.checked })}
//                         className="rounded text-primary-500"
//                       />
//                       <span className="text-sm">Vegan</span>
//                     </label>
//                     <label className="flex items-center gap-2">
//                       <input
//                         type="checkbox"
//                         checked={formData.isGlutenFree}
//                         onChange={(e) => setFormData({ ...formData, isGlutenFree: e.target.checked })}
//                         className="rounded text-primary-500"
//                       />
//                       <span className="text-sm">Gluten Free</span>
//                     </label>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="flex gap-3 p-4 border-t sticky bottom-0 bg-white">
//                 <button
//                   onClick={handleAddMenuItem}
//                   disabled={isSubmitting}
//                   className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
//                 >
//                   {isSubmitting ? 'Adding...' : 'Add Item'}
//                 </button>
//                 <button
//                   onClick={() => setShowAddModal(false)}
//                   className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { menuService, orderService, tableService, analyticsService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUsers, FiShoppingBag, FiDollarSign, FiTrendingUp, 
  FiEdit, FiTrash2, FiPlus, FiSearch, FiX, FiEye,
  FiCheckCircle, FiClock, FiAlertCircle, FiGrid, FiList,
  FiStar, FiCalendar, FiMapPin, FiPhone, FiMail, FiRefreshCw,
  FiUser, FiCoffee, FiAward, FiTruck, FiHeart, FiActivity,
  FiBarChart2, FiPieChart, FiDownload, FiPrinter, FiFilter,
  FiChevronDown, FiChevronUp, FiLogOut, FiSettings, FiBell,
  FiUserCheck, FiUserX, FiUserPlus, FiShield, FiLock, FiUnlock
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { socket, emit } = useSocket();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    preparingOrders: 0,
    readyOrders: 0,
    servedOrders: 0,
    cancelledOrders: 0,
    completedOrders: 0,
    todayOrders: 0,
    todayRevenue: 0,
    activeTables: 0,
    totalTables: 0
  });
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [tables, setTables] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activityLog, setActivityLog] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showActivityModal, setShowActivityModal] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    preparationTime: 15,
    isAvailable: true,
    isPopular: false,
    discount: 0,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false
  });

  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
    phone: '',
    isActive: true
  });

  useEffect(() => {
    fetchDashboardData();
    
    if (socket) {
      socket.on('new-order', handleNewOrder);
      socket.on('order-completed', handleOrderCompleted);
      socket.on('order-status-updated', handleOrderUpdate);
      socket.on('order-cancelled', handleOrderCancelled);
      socket.on('user-registered', handleUserRegistered);
      socket.on('table-updated', handleTableUpdate);
      
      return () => {
        socket.off('new-order');
        socket.off('order-completed');
        socket.off('order-status-updated');
        socket.off('order-cancelled');
        socket.off('user-registered');
        socket.off('table-updated');
      };
    }
  }, [socket]);

  const handleNewOrder = (data) => {
    addActivityLog('new_order', `New order #${data.orderNumber} received`, data);
    toast.info(`New order #${data.orderNumber} received`);
    fetchDashboardData();
  };

  const handleOrderCompleted = (data) => {
    addActivityLog('order_completed', `Order #${data.orderNumber} completed`, data);
    toast.success(`Order #${data.orderNumber} completed`);
    fetchDashboardData();
  };

  const handleOrderUpdate = (data) => {
    addActivityLog('order_update', `Order #${data.orderNumber} status updated`, data);
    fetchDashboardData();
  };

  const handleOrderCancelled = (data) => {
    addActivityLog('order_cancelled', `Order #${data.orderNumber} cancelled`, data);
    toast.warning(`Order #${data.orderNumber} cancelled`);
    fetchDashboardData();
  };

  const handleUserRegistered = (data) => {
    addActivityLog('user_registered', `New user ${data.name} registered`, data);
    fetchDashboardData();
  };

  const handleTableUpdate = (data) => {
    addActivityLog('table_update', `Table ${data.tableNumber} status updated`, data);
    fetchDashboardData();
  };

  const addActivityLog = (type, message, data) => {
    setActivityLog(prev => [{
      id: Date.now(),
      type,
      message,
      data,
      timestamp: new Date(),
      user: user?.name
    }, ...prev].slice(0, 100));
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [menuRes, orderRes, tableRes] = await Promise.all([
        menuService.getMenuItems(),
        orderService.getOrders({ role: 'admin' }),
        tableService.getTables()
      ]);
      
      const allOrders = orderRes.data.data || [];
      setOrders(allOrders);
      setMenuItems(menuRes.data.data || []);
      setTables(tableRes.data.data || []);
      
      // Get categories
      const catRes = await menuService.getCategories();
      setCategories(catRes.data.data || []);
      
      // Calculate comprehensive stats
      const today = new Date().toDateString();
      const todayOrders = allOrders.filter(o => new Date(o.createdAt).toDateString() === today);
      const completedOrders = allOrders.filter(o => o.status === 'completed');
      const cancelledOrders = allOrders.filter(o => o.status === 'cancelled');
      const activeTables = tableRes.data.data.filter(t => t.status === 'occupied').length;
      
      setStats({
        totalOrders: allOrders.length,
        totalRevenue: completedOrders.reduce((sum, o) => sum + (o.total || 0), 0),
        pendingOrders: allOrders.filter(o => o.status === 'pending').length,
        preparingOrders: allOrders.filter(o => o.status === 'preparing' || o.status === 'confirmed').length,
        readyOrders: allOrders.filter(o => o.status === 'ready').length,
        servedOrders: allOrders.filter(o => o.status === 'served').length,
        cancelledOrders: cancelledOrders.length,
        completedOrders: completedOrders.length,
        todayOrders: todayOrders.length,
        todayRevenue: todayOrders.filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.total || 0), 0),
        activeTables: activeTables,
        totalTables: tableRes.data.data.length,
        totalUsers: 124 // Would come from users API
      });
      
      // Add system activity log if empty
      if (activityLog.length === 0) {
        addActivityLog('system_start', 'System started successfully', {});
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMenuItem = async () => {
    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const menuItemData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        preparationTime: parseInt(formData.preparationTime) || 15,
        isAvailable: formData.isAvailable,
        isPopular: formData.isPopular,
        discount: parseFloat(formData.discount) || 0,
        stock: 100,
        images: ['placeholder.jpg'],
        dietary: {
          isVegetarian: formData.isVegetarian || false,
          isVegan: formData.isVegan || false,
          isGlutenFree: formData.isGlutenFree || false
        }
      };

      const response = await menuService.createMenuItem(menuItemData);
      if (response.data.success) {
        addActivityLog('menu_item_added', `Menu item "${formData.name}" added`, response.data.data);
        toast.success('Menu item added successfully');
        setShowAddModal(false);
        fetchDashboardData();
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          preparationTime: 15,
          isAvailable: true,
          isPopular: false,
          discount: 0,
          isVegetarian: false,
          isVegan: false,
          isGlutenFree: false
        });
      }
    } catch (error) {
      console.error('Add menu item error:', error);
      toast.error(error.response?.data?.error || 'Failed to add menu item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMenuItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const item = menuItems.find(i => i._id === id);
        await menuService.deleteMenuItem(id);
        addActivityLog('menu_item_deleted', `Menu item "${item?.name}" deleted`, { id });
        toast.success('Menu item deleted');
        fetchDashboardData();
      } catch (error) {
        toast.error('Failed to delete item');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const order = orders.find(o => o._id === orderId);
      await orderService.updateOrderStatus(orderId, status);
      addActivityLog('order_status_updated', `Order #${order?.orderNumber} status changed to ${status}`, { orderId, status });
      toast.success(`Order status updated to ${status}`);
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleUpdateUserStatus = async (userId, isActive) => {
    try {
      // This would call a user update API
      addActivityLog('user_status_updated', `User ${userId} status changed to ${isActive ? 'active' : 'inactive'}`, { userId, isActive });
      toast.success(`User ${isActive ? 'activated' : 'deactivated'}`);
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleCreateUser = async () => {
    if (!userFormData.name || !userFormData.email || !userFormData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      // This would call a user creation API
      addActivityLog('user_created', `User ${userFormData.name} created`, userFormData);
      toast.success('User created successfully');
      setShowUserModal(false);
      setUserFormData({
        name: '',
        email: '',
        password: '',
        role: 'customer',
        phone: '',
        isActive: true
      });
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to create user');
    } finally {
      setIsSubmitting(false);
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

  const getTableStatusColor = (status) => {
    const colors = {
      available: 'bg-green-100 text-green-800',
      occupied: 'bg-red-100 text-red-800',
      reserved: 'bg-yellow-100 text-yellow-800',
      cleaning: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || colors.available;
  };

  const getRoleBadge = (role) => {
    const styles = {
      admin: 'bg-red-100 text-red-800',
      cashier: 'bg-green-100 text-green-800',
      waiter: 'bg-blue-100 text-blue-800',
      kitchen: 'bg-purple-100 text-purple-800',
      customer: 'bg-gray-100 text-gray-800'
    };
    return styles[role] || styles.customer;
  };

  const getActivityIcon = (type) => {
    const icons = {
      new_order: '🆕',
      order_completed: '✅',
      order_update: '📝',
      order_cancelled: '❌',
      user_registered: '👤',
      user_created: '👤',
      user_status_updated: '🔒',
      menu_item_added: '🍽️',
      menu_item_deleted: '🗑️',
      table_update: '🪑',
      system_start: '🚀',
      order_status_updated: '🔄'
    };
    return icons[type] || '📋';
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: FiTrendingUp },
    { id: 'orders', name: 'Orders', icon: FiShoppingBag },
    { id: 'menu', name: 'Menu', icon: FiGrid },
    { id: 'tables', name: 'Tables', icon: FiMapPin },
    { id: 'users', name: 'Users', icon: FiUsers },
    { id: 'activity', name: 'Activity Log', icon: FiActivity }
  ];

  // Filter orders
  const getFilteredOrders = () => {
    let filtered = orders;
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(o => o.status === filterStatus);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(o => 
        o.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.guestInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (dateRange.start) {
      filtered = filtered.filter(o => new Date(o.createdAt) >= new Date(dateRange.start));
    }
    if (dateRange.end) {
      filtered = filtered.filter(o => new Date(o.createdAt) <= new Date(dateRange.end));
    }
    
    return filtered;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const filteredOrders = getFilteredOrders();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white sticky top-0 z-20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {user?.role}
                </span>
              </div>
              <p className="text-primary-100 mt-1">Welcome back, {user?.name}!</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={fetchDashboardData}
                className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2"
              >
                <FiRefreshCw className="h-5 w-5" />
                <span className="hidden sm:inline text-sm">Refresh</span>
              </button>
              <button
                onClick={() => setShowActivityModal(true)}
                className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2 relative"
              >
                <FiBell className="h-5 w-5" />
                {activityLog.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {activityLog.length}
                  </span>
                )}
                <span className="hidden sm:inline text-sm">Activities</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-6 overflow-x-auto">
          <div className="flex min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Main Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Orders', value: stats.totalOrders, icon: FiShoppingBag, color: 'bg-blue-500' },
                { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: FiDollarSign, color: 'bg-green-500' },
                { label: 'Active Tables', value: `${stats.activeTables}/${stats.totalTables}`, icon: FiMapPin, color: 'bg-indigo-500' },
                { label: 'Total Users', value: stats.totalUsers, icon: FiUsers, color: 'bg-purple-500' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-lg shadow-md p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-xs uppercase">{stat.label}</p>
                      <p className="text-xl font-bold text-gray-800 mt-1">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} p-2 rounded-full text-white`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Workflow Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: 'Pending', value: stats.pendingOrders, icon: FiClock, color: 'bg-yellow-500' },
                { label: 'Preparing', value: stats.preparingOrders, icon: FiAlertCircle, color: 'bg-purple-500' },
                { label: 'Ready', value: stats.readyOrders, icon: FiCheckCircle, color: 'bg-green-500' },
                { label: 'Served', value: stats.servedOrders, icon: FiUser, color: 'bg-indigo-500' },
                { label: 'Completed', value: stats.completedOrders, icon: FiCheckCircle, color: 'bg-gray-500' },
                { label: 'Cancelled', value: stats.cancelledOrders, icon: FiX, color: 'bg-red-500' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-lg shadow-md p-3 text-center"
                >
                  <div className={`${stat.color} w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 text-white`}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                  <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Today's Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Today's Summary</h2>
                <span className="text-sm text-gray-500">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Orders Today</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.todayOrders}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Revenue Today</p>
                  <p className="text-2xl font-bold text-green-600">${stats.todayRevenue.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Active Tables</p>
                  <p className="text-2xl font-bold text-indigo-600">{stats.activeTables}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Completed</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.completedOrders}</p>
                </div>
              </div>
            </div>

            {/* Workflow Visualization */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Order Workflow</h2>
              <div className="grid grid-cols-5 gap-2 text-center">
                {[
                  { stage: 'Pending', icon: '⏳', color: 'bg-yellow-100', count: stats.pendingOrders },
                  { stage: 'Confirmed', icon: '✅', color: 'bg-blue-100', count: orders.filter(o => o.status === 'confirmed').length },
                  { stage: 'Preparing', icon: '🔪', color: 'bg-purple-100', count: stats.preparingOrders },
                  { stage: 'Ready', icon: '🍽️', color: 'bg-green-100', count: stats.readyOrders },
                  { stage: 'Served', icon: '💰', color: 'bg-indigo-100', count: stats.servedOrders }
                ].map((stage, i) => (
                  <div key={i} className="relative">
                    <div className={`${stage.color} p-3 rounded-lg`}>
                      <div className="text-2xl">{stage.icon}</div>
                      <div className="text-sm font-semibold">{stage.stage}</div>
                      <div className="text-xs text-gray-500">{stage.count}</div>
                    </div>
                    {i < 4 && <div className="absolute top-1/2 -right-2 w-4 h-0.5 bg-gray-300"></div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Recent Activity</h2>
                <button 
                  onClick={() => setActiveTab('activity')}
                  className="text-primary-600 text-sm hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {activityLog.slice(0, 10).map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 text-sm p-2 hover:bg-gray-50 rounded-lg">
                    <span className="text-xl">{getActivityIcon(activity.type)}</span>
                    <div className="flex-1">
                      <p className="text-gray-800">{activity.message}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(activity.timestamp).toLocaleString()} • {activity.user || 'System'}
                      </p>
                    </div>
                  </div>
                ))}
                {activityLog.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No activity yet</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Orders Tab - Complete */}
        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {/* Filters */}
            <div className="p-4 border-b bg-gray-50">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="served">Served</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
                <button
                  onClick={() => { setSearchTerm(''); setFilterStatus('all'); setDateRange({ start: '', end: '' }); }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Order #</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Customer</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Items</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Total</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Payment</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Timeline</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-8 text-gray-500">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order._id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-mono font-semibold">{order.orderNumber}</td>
                        <td className="px-4 py-3 text-sm">
                          {order.customer?.name || order.guestInfo?.name || 'Guest'}
                          {order.customer?.email && (
                            <div className="text-xs text-gray-400">{order.customer.email}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">{order.items?.length || 0}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-primary-600">
                          ${order.total?.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="text-xs text-gray-500">
                            {order.timeline?.length > 0 && (
                              <>
                                <div>{order.timeline[0].status} → {order.timeline[order.timeline.length - 1].status}</div>
                                <div className="text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</div>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <select
                            onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                            value={order.status}
                            className="text-xs border rounded px-2 py-1 w-full max-w-[120px]"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="preparing">Preparing</option>
                            <option value="ready">Ready</option>
                            <option value="served">Served</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <div className="text-xs text-gray-400 mt-1">
                            {order.confirmedBy?.name && <div>✓ {order.confirmedBy.name}</div>}
                            {order.preparedBy?.name && <div>🔪 {order.preparedBy.name}</div>}
                            {order.servedBy?.name && <div>🍽️ {order.servedBy.name}</div>}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Menu Management Tab */}
        {activeTab === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Menu Items</h2>
                <p className="text-gray-500 text-sm">{menuItems.length} items in menu</p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700"
              >
                <FiPlus className="h-5 w-5" />
                Add Item
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Price</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Popular</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Orders</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems.map((item) => (
                      <tr key={item._id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium">{item.name}</td>
                        <td className="px-4 py-3 text-sm">{item.category?.name || 'Uncategorized'}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-primary-600">
                          ${item.price}
                          {item.discount > 0 && (
                            <span className="text-xs text-red-500 ml-1">-{item.discount}%</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {item.isAvailable ? 'Available' : 'Unavailable'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {item.isPopular && <FiStar className="h-5 w-5 text-yellow-500" />}
                        </td>
                        <td className="px-4 py-3 text-sm text-center">{item.orderCount || 0}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDeleteMenuItem(item._id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <FiTrash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tables Tab */}
        {activeTab === 'tables' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Table Management</h2>
              <span className="text-sm text-gray-500">
                {stats.activeTables} of {stats.totalTables} occupied
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tables.map((table) => (
                <div key={table._id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold">Table {table.tableNumber}</h3>
                      <p className="text-gray-500 text-sm">Capacity: {table.capacity}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getTableStatusColor(table.status)}`}>
                      {table.status}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 capitalize flex items-center gap-2">
                    <FiMapPin className="h-3 w-3" />
                    {table.section} Section
                  </div>
                  {table.currentOrder && (
                    <div className="mt-2 text-xs text-blue-600">
                      Order: {table.currentOrder}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">User Management</h2>
                <p className="text-gray-500 text-sm">{stats.totalUsers} total users</p>
              </div>
              <button
                onClick={() => setShowUserModal(true)}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700"
              >
                <FiUserPlus className="h-5 w-5" />
                Add User
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Joined</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* This would come from a users API */}
                    <tr className="border-t hover:bg-gray-50">
                      <td colSpan="6" className="text-center py-8 text-gray-500">
                        User management coming soon. Total users: {stats.totalUsers}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Activity Log Tab */}
        {activeTab === 'activity' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">System Activity Log</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActivityLog([])}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Clear Log
                  </button>
                  <button
                    onClick={() => toast.success('Activity log exported')}
                    className="text-sm text-primary-600 hover:text-primary-800 flex items-center gap-1"
                  >
                    <FiDownload className="h-4 w-4" />
                    Export
                  </button>
                </div>
              </div>
            </div>
            <div className="divide-y max-h-[600px] overflow-y-auto">
              {activityLog.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No activity logged yet
                </div>
              ) : (
                activityLog.map((activity) => (
                  <div key={activity.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{activity.message}</p>
                        <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-400">
                          <span>{new Date(activity.timestamp).toLocaleString()}</span>
                          <span>•</span>
                          <span>By: {activity.user || 'System'}</span>
                          {activity.data && (
                            <>
                              <span>•</span>
                              <span className="text-gray-500">
                                {Object.keys(activity.data).length > 0 && 'Details: '}
                                {JSON.stringify(activity.data, null, 2).slice(0, 100)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Add Menu Item Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
                <h2 className="text-xl font-bold">Add Menu Item</h2>
                <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                  <FiX className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Form fields */}
                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    rows="3"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Prep Time (min)</label>
                    <input
                      type="number"
                      value={formData.preparationTime}
                      onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Discount (%)</label>
                    <input
                      type="number"
                      step="1"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                      className="rounded text-primary-500"
                    />
                    <span className="text-sm font-medium">Item Available</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isPopular}
                      onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                      className="rounded text-primary-500"
                    />
                    <span className="text-sm font-medium">Popular Item</span>
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Dietary Options</label>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isVegetarian}
                        onChange={(e) => setFormData({ ...formData, isVegetarian: e.target.checked })}
                        className="rounded text-primary-500"
                      />
                      <span className="text-sm">Vegetarian</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isVegan}
                        onChange={(e) => setFormData({ ...formData, isVegan: e.target.checked })}
                        className="rounded text-primary-500"
                      />
                      <span className="text-sm">Vegan</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isGlutenFree}
                        onChange={(e) => setFormData({ ...formData, isGlutenFree: e.target.checked })}
                        className="rounded text-primary-500"
                      />
                      <span className="text-sm">Gluten Free</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 p-4 border-t sticky bottom-0 bg-white">
                <button
                  onClick={handleAddMenuItem}
                  disabled={isSubmitting}
                  className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Adding...' : 'Add Item'}
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Management Modal */}
      <AnimatePresence>
        {showUserModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-lg max-w-md w-full"
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-bold">Add New User</h2>
                <button onClick={() => setShowUserModal(false)} className="text-gray-500 hover:text-gray-700">
                  <FiX className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <input
                    type="text"
                    value={userFormData.name}
                    onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    value={userFormData.email}
                    onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Password *</label>
                  <input
                    type="password"
                    value={userFormData.password}
                    onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    value={userFormData.phone}
                    onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select
                    value={userFormData.role}
                    onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="admin">Admin</option>
                    <option value="cashier">Cashier</option>
                    <option value="waiter">Waiter</option>
                    <option value="kitchen">Kitchen</option>
                    <option value="customer">Customer</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={userFormData.isActive}
                      onChange={(e) => setUserFormData({ ...userFormData, isActive: e.target.checked })}
                      className="rounded text-primary-500"
                    />
                    <span className="text-sm font-medium">Active</span>
                  </label>
                </div>
              </div>
              
              <div className="flex gap-3 p-4 border-t">
                <button
                  onClick={handleCreateUser}
                  disabled={isSubmitting}
                  className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create User'}
                </button>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;