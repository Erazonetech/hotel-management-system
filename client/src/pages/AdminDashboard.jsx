// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { menuService, orderService, tableService, analyticsService } from '../services/api';
// import { motion } from 'framer-motion';
// import { 
//   FiUsers, FiShoppingBag, FiDollarSign, FiTrendingUp, 
//   FiEdit, FiTrash2, FiPlus, FiSearch, FiX, 
//   FiCheckCircle, FiClock, FiAlertCircle, FiGrid, FiList,
//   FiStar, FiCalendar, FiMapPin, FiPhone, FiMail
// } from 'react-icons/fi';
// import toast from 'react-hot-toast';

// const AdminDashboard = () => {
//   const { user } = useAuth();
//   const [activeTab, setActiveTab] = useState('overview');
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     totalOrders: 0,
//     totalRevenue: 0,
//     pendingOrders: 0
//   });
//   const [menuItems, setMenuItems] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [tables, setTables] = useState([]);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [editingItem, setEditingItem] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [formData, setFormData] = useState({
//   name: '',
//   description: '',
//   price: '',
//   category: '',
//   preparationTime: 15,
//   isAvailable: true,
//   isPopular: false,
//   discount: 0,
//   isVegetarian: false,
//   isVegan: false,
//   isGlutenFree: false
//   });

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     setLoading(true);
//     try {
//       // Fetch menu items
//       const menuRes = await menuService.getMenuItems();
//       setMenuItems(menuRes.data.data || []);
      
//       // Fetch categories
//       const catRes = await menuService.getCategories();
//       setCategories(catRes.data.data || []);
      
//       // Fetch orders
//       const orderRes = await orderService.getOrders();
//       setOrders(orderRes.data.data || []);
      
//       // Fetch tables
//       const tableRes = await tableService.getTables();
//       setTables(tableRes.data.data || []);
      
//       // Calculate stats
//       const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
//       const pendingOrders = orders.filter(o => o.status === 'pending').length;
      
//       setStats({
//         totalOrders: orders.length,
//         totalRevenue: totalRevenue,
//         pendingOrders: pendingOrders,
//         totalUsers: 124 // This would come from a users API endpoint
//       });
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//       toast.error('Failed to load dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const handleAddMenuItem = async () => {
//   //   try {
//   //     const response = await menuService.createMenuItem(formData);
//   //     if (response.data.success) {
//   //       toast.success('Menu item added successfully');
//   //       setShowAddModal(false);
//   //       fetchDashboardData();
//   //       setFormData({
//   //         name: '',
//   //         description: '',
//   //         price: '',
//   //         category: '',
//   //         images: [],
//   //         preparationTime: 15,
//   //         isAvailable: true,
//   //         isPopular: false,
//   //         discount: 0
//   //       });
//   //     }
//   //   } catch (error) {
//   //     toast.error('Failed to add menu item');
//   //   }
//   // };

//   const handleAddMenuItem = async () => {
//   // Validate required fields
//   if (!formData.name || !formData.description || !formData.price || !formData.category) {
//     toast.error('Please fill in all required fields');
//     return;
//   }

//   try {
//     const menuItemData = {
//       name: formData.name,
//       description: formData.description,
//       price: parseFloat(formData.price),
//       category: formData.category,
//       preparationTime: parseInt(formData.preparationTime) || 15,
//       isAvailable: formData.isAvailable,
//       isPopular: formData.isPopular,
//       discount: parseFloat(formData.discount) || 0,
//       stock: 100,
//       images: ['placeholder.jpg'],
//       dietary: {
//         isVegetarian: formData.isVegetarian || false,
//         isVegan: formData.isVegan || false,
//         isGlutenFree: formData.isGlutenFree || false
//       }
//     };

//     console.log('Sending menu item data:', menuItemData); // Debug log

//     const response = await menuService.createMenuItem(menuItemData);
    
//     if (response.data.success) {
//       toast.success('Menu item added successfully');
//       setShowAddModal(false);
//       fetchDashboardData(); // Refresh the menu list
//       // Reset form
//       setFormData({
//         name: '',
//         description: '',
//         price: '',
//         category: '',
//         preparationTime: 15,
//         isAvailable: true,
//         isPopular: false,
//         discount: 0,
//         isVegetarian: false,
//         isVegan: false,
//         isGlutenFree: false
//       });
//     } else {
//       toast.error(response.data.error || 'Failed to add menu item');
//     }
//   } catch (error) {
//     console.error('Add menu item error:', error.response?.data || error);
//     const errorMessage = error.response?.data?.error || 'Failed to add menu item. Please try again.';
//     toast.error(errorMessage);
//   }
// };

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

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: 'bg-yellow-100 text-yellow-800',
//       confirmed: 'bg-blue-100 text-blue-800',
//       preparing: 'bg-purple-100 text-purple-800',
//       'ready-for-serve': 'bg-green-100 text-green-800',
//       completed: 'bg-gray-100 text-gray-800',
//       cancelled: 'bg-red-100 text-red-800'
//     };
//     return colors[status] || 'bg-gray-100 text-gray-800';
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
//       <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
//         <div className="container mx-auto px-4 py-8">
//           <h1 className="text-3xl font-bold">Admin Dashboard</h1>
//           <p className="text-primary-100 mt-2">Welcome back, {user?.name}!</p>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-8">
//         {/* Tab Navigation */}
//         <div className="bg-white rounded-lg shadow-md mb-8 overflow-x-auto">
//           <div className="flex">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
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
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {[
//                 { label: 'Total Orders', value: stats.totalOrders, icon: FiShoppingBag, color: 'bg-blue-500' },
//                 { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: FiDollarSign, color: 'bg-green-500' },
//                 { label: 'Pending Orders', value: stats.pendingOrders, icon: FiClock, color: 'bg-yellow-500' },
//                 { label: 'Total Users', value: stats.totalUsers, icon: FiUsers, color: 'bg-purple-500' }
//               ].map((stat, index) => (
//                 <motion.div
//                   key={index}
//                   whileHover={{ scale: 1.02 }}
//                   className="bg-white rounded-lg shadow-md p-6"
//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-gray-500 text-sm">{stat.label}</p>
//                       <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
//                     </div>
//                     <div className={`${stat.color} p-3 rounded-full text-white`}>
//                       <stat.icon className="h-6 w-6" />
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>

//             {/* Recent Orders */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-4 py-2 text-left">Order #</th>
//                       <th className="px-4 py-2 text-left">Customer</th>
//                       <th className="px-4 py-2 text-left">Total</th>
//                       <th className="px-4 py-2 text-left">Status</th>
//                       <th className="px-4 py-2 text-left">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {orders.slice(0, 5).map((order) => (
//                       <tr key={order._id} className="border-t">
//                         <td className="px-4 py-3">{order.orderNumber || 'N/A'}</td>
//                         <td className="px-4 py-3">{order.customer?.name || 'Guest'}</td>
//                         <td className="px-4 py-3">${order.total?.toFixed(2) || '0.00'}</td>
//                         <td className="px-4 py-3">
//                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
//                             {order.status}
//                           </span>
//                         </td>
//                         <td className="px-4 py-3">
//                           <select
//                             onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
//                             value={order.status}
//                             className="text-sm border rounded px-2 py-1"
//                           >
//                             <option value="pending">Pending</option>
//                             <option value="confirmed">Confirmed</option>
//                             <option value="preparing">Preparing</option>
//                             <option value="ready-for-serve">Ready</option>
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

//             {/* Popular Items */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-xl font-bold mb-4">Popular Items</h2>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {menuItems.filter(item => item.isPopular).slice(0, 4).map((item) => (
//                   <div key={item._id} className="text-center p-4 bg-gray-50 rounded-lg">
//                     <div className="text-4xl mb-2">🍽️</div>
//                     <p className="font-semibold">{item.name}</p>
//                     <p className="text-primary-600 font-bold">${item.price}</p>
//                   </div>
//                 ))}
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
//                       <th className="px-4 py-3 text-left">Name</th>
//                       <th className="px-4 py-3 text-left">Category</th>
//                       <th className="px-4 py-3 text-left">Price</th>
//                       <th className="px-4 py-3 text-left">Status</th>
//                       <th className="px-4 py-3 text-left">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {menuItems.map((item) => (
//                       <tr key={item._id} className="border-t hover:bg-gray-50">
//                         <td className="px-4 py-3 font-medium">{item.name}</td>
//                         <td className="px-4 py-3">{item.category?.name || 'Uncategorized'}</td>
//                         <td className="px-4 py-3">${item.price}</td>
//                         <td className="px-4 py-3">
//                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                             {item.isAvailable ? 'Available' : 'Unavailable'}
//                           </span>
//                         </td>
//                         <td className="px-4 py-3">
//                           <div className="flex gap-2">
//                             <button
//                               onClick={() => handleDeleteMenuItem(item._id)}
//                               className="text-red-600 hover:text-red-800"
//                             >
//                               <FiTrash2 className="h-5 w-5" />
//                             </button>
//                           </div>
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
//                     <th className="px-4 py-3 text-left">Order #</th>
//                     <th className="px-4 py-3 text-left">Customer</th>
//                     <th className="px-4 py-3 text-left">Items</th>
//                     <th className="px-4 py-3 text-left">Total</th>
//                     <th className="px-4 py-3 text-left">Status</th>
//                     <th className="px-4 py-3 text-left">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {orders.map((order) => (
//                     <tr key={order._id} className="border-t">
//                       <td className="px-4 py-3">{order.orderNumber || 'N/A'}</td>
//                       <td className="px-4 py-3">{order.customer?.name || 'Guest'}</td>
//                       <td className="px-4 py-3">{order.items?.length || 0} items</td>
//                       <td className="px-4 py-3">${order.total?.toFixed(2) || '0.00'}</td>
//                       <td className="px-4 py-3">
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
//                           {order.status}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3">
//                         <select
//                           onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
//                           value={order.status}
//                           className="text-sm border rounded px-2 py-1"
//                         >
//                           <option value="pending">Pending</option>
//                           <option value="confirmed">Confirmed</option>
//                           <option value="preparing">Preparing</option>
//                           <option value="ready-for-serve">Ready</option>
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
//             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
//           >
//             {tables.map((table) => (
//               <div key={table._id} className="bg-white rounded-lg shadow-md p-6">
//                 <div className="flex justify-between items-start mb-4">
//                   <div>
//                     <h3 className="text-xl font-bold">Table {table.tableNumber}</h3>
//                     <p className="text-gray-500">Capacity: {table.capacity} persons</p>
//                   </div>
//                   <div className={`px-3 py-1 rounded-full text-xs font-medium ${
//                     table.status === 'available' ? 'bg-green-100 text-green-800' :
//                     table.status === 'occupied' ? 'bg-red-100 text-red-800' :
//                     'bg-yellow-100 text-yellow-800'
//                   }`}>
//                     {table.status}
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2 text-gray-600">
//                   <FiMapPin className="h-4 w-4" />
//                   <span className="text-sm capitalize">{table.section} Section</span>
//                 </div>
//               </div>
//             ))}
//           </motion.div>
//         )}
//       </div>

//       {/* Add Menu Item Modal */}
//       {/* {showAddModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center p-4 border-b">
//               <h2 className="text-xl font-bold">Add Menu Item</h2>
//               <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
//                 <FiX className="h-6 w-6" />
//               </button>
//             </div>
//             <div className="p-4 space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Name</label>
//                 <input
//                   type="text"
//                   value={formData.name}
//                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                   className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Description</label>
//                 <textarea
//                   value={formData.description}
//                   onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                   className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
//                   rows="3"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Price</label>
//                 <input
//                   type="number"
//                   value={formData.price}
//                   onChange={(e) => setFormData({ ...formData, price: e.target.value })}
//                   className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Category</label>
//                 <select
//                   value={formData.category}
//                   onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//                   className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
//                 >
//                   <option value="">Select Category</option>
//                   {categories.map((cat) => (
//                     <option key={cat._id} value={cat._id}>{cat.name}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     checked={formData.isAvailable}
//                     onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
//                   />
//                   <span className="text-sm font-medium">Available</span>
//                 </label>
//               </div>
//               <div>
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     checked={formData.isPopular}
//                     onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
//                   />
//                   <span className="text-sm font-medium">Popular Item</span>
//                 </label>
//               </div>
//             </div>
//             <div className="flex gap-3 p-4 border-t">
//               <button
//                 onClick={handleAddMenuItem}
//                 className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700"
//               >
//                 Add Item
//               </button>
//               <button
//                 onClick={() => setShowAddModal(false)}
//                 className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )} */}
//       {showAddModal && (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//     <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//       <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
//         <h2 className="text-xl font-bold">Add Menu Item</h2>
//         <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
//           <FiX className="h-6 w-6" />
//         </button>
//       </div>
      
//       <div className="p-4 space-y-4">
//         <div>
//           <label className="block text-sm font-medium mb-1">Name *</label>
//           <input
//             type="text"
//             value={formData.name}
//             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//             className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
//             required
//           />
//         </div>
        
//         <div>
//           <label className="block text-sm font-medium mb-1">Description *</label>
//           <textarea
//             value={formData.description}
//             onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//             className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
//             rows="3"
//             required
//           />
//         </div>
        
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">Price *</label>
//             <input
//               type="number"
//               step="0.01"
//               value={formData.price}
//               onChange={(e) => setFormData({ ...formData, price: e.target.value })}
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
//               required
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium mb-1">Category *</label>
//             <select
//               value={formData.category}
//               onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
//               required
//             >
//               <option value="">Select Category</option>
//               {categories.map((cat) => (
//                 <option key={cat._id} value={cat._id}>{cat.name}</option>
//               ))}
//             </select>
//           </div>
//         </div>
        
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">Preparation Time (min)</label>
//             <input
//               type="number"
//               value={formData.preparationTime}
//               onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium mb-1">Discount (%)</label>
//             <input
//               type="number"
//               step="1"
//               value={formData.discount}
//               onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
//             />
//           </div>
//         </div>
        
//         <div className="space-y-2">
//           <label className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={formData.isAvailable}
//               onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
//               className="rounded text-primary-500"
//             />
//             <span className="text-sm font-medium">Item Available</span>
//           </label>
          
//           <label className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={formData.isPopular}
//               onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
//               className="rounded text-primary-500"
//             />
//             <span className="text-sm font-medium">Popular Item</span>
//           </label>
//         </div>
        
//         <div>
//           <label className="block text-sm font-medium mb-2">Dietary Options</label>
//           <div className="flex flex-wrap gap-4">
//             <label className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={formData.isVegetarian}
//                 onChange={(e) => setFormData({ ...formData, isVegetarian: e.target.checked })}
//                 className="rounded text-primary-500"
//               />
//               <span className="text-sm">Vegetarian</span>
//             </label>
//             <label className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={formData.isVegan}
//                 onChange={(e) => setFormData({ ...formData, isVegan: e.target.checked })}
//                 className="rounded text-primary-500"
//               />
//               <span className="text-sm">Vegan</span>
//             </label>
//             <label className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={formData.isGlutenFree}
//                 onChange={(e) => setFormData({ ...formData, isGlutenFree: e.target.checked })}
//                 className="rounded text-primary-500"
//               />
//               <span className="text-sm">Gluten Free</span>
//             </label>
//           </div>
//         </div>
//       </div>
      
//       <div className="flex gap-3 p-4 border-t sticky bottom-0 bg-white">
//         <button
//           onClick={handleAddMenuItem}
//           className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
//         >
//           Add Item
//         </button>
//         <button
//           onClick={() => setShowAddModal(false)}
//           className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors"
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   </div>
// )}
//     </div>
//   );
// };

// export default AdminDashboard;
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { menuService, orderService, tableService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUsers, FiShoppingBag, FiDollarSign, FiTrendingUp, 
  FiEdit, FiTrash2, FiPlus, FiSearch, FiX, FiEye,
  FiCheckCircle, FiClock, FiAlertCircle, FiGrid, FiList,
  FiStar, FiCalendar, FiMapPin, FiPhone, FiMail, FiRefreshCw,
  FiUser, FiCoffee, FiAward, FiTruck, FiHeart
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
    servedOrders: 0
  });
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [tables, setTables] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  useEffect(() => {
    fetchDashboardData();
    
    if (socket) {
      socket.on('new-order', handleNewOrder);
      socket.on('order-completed', handleOrderCompleted);
      socket.on('order-status-updated', handleOrderUpdate);
      
      return () => {
        socket.off('new-order');
        socket.off('order-completed');
        socket.off('order-status-updated');
      };
    }
  }, [socket]);

  const handleNewOrder = (data) => {
    toast.info(`New order #${data.orderNumber} received`);
    fetchDashboardData();
  };

  const handleOrderCompleted = (data) => {
    toast.success(`Order #${data.orderNumber} completed`);
    fetchDashboardData();
  };

  const handleOrderUpdate = (data) => {
    fetchDashboardData();
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
      
      // Calculate stats
      const totalRevenue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      const pendingOrders = allOrders.filter(o => o.status === 'pending').length;
      const preparingOrders = allOrders.filter(o => o.status === 'preparing' || o.status === 'confirmed').length;
      const readyOrders = allOrders.filter(o => o.status === 'ready').length;
      const servedOrders = allOrders.filter(o => o.status === 'served').length;
      
      setStats({
        totalOrders: allOrders.length,
        totalRevenue: totalRevenue,
        pendingOrders: pendingOrders,
        preparingOrders: preparingOrders,
        readyOrders: readyOrders,
        servedOrders: servedOrders,
        totalUsers: 124 // This would come from a users API
      });
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
        await menuService.deleteMenuItem(id);
        toast.success('Menu item deleted');
        fetchDashboardData();
      } catch (error) {
        toast.error('Failed to delete item');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      toast.success(`Order status updated to ${status}`);
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update order status');
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

  const tabs = [
    { id: 'overview', name: 'Overview', icon: FiTrendingUp },
    { id: 'menu', name: 'Menu Management', icon: FiGrid },
    { id: 'orders', name: 'Orders', icon: FiShoppingBag },
    { id: 'tables', name: 'Tables', icon: FiMapPin },
    { id: 'users', name: 'Users', icon: FiUsers }
  ];

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
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white sticky top-0 z-20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-primary-100">Welcome back, {user?.name}!</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={fetchDashboardData}
                className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors"
              >
                <FiRefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-6 overflow-x-auto">
          <div className="flex">
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
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: 'Total Orders', value: stats.totalOrders, icon: FiShoppingBag, color: 'bg-blue-500' },
                { label: 'Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: FiDollarSign, color: 'bg-green-500' },
                { label: 'Pending', value: stats.pendingOrders, icon: FiClock, color: 'bg-yellow-500' },
                { label: 'Preparing', value: stats.preparingOrders, icon: FiAlertCircle, color: 'bg-purple-500' },
                { label: 'Ready', value: stats.readyOrders, icon: FiCheckCircle, color: 'bg-green-500' },
                { label: 'Served', value: stats.servedOrders, icon: FiUsers, color: 'bg-indigo-500' }
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
                      <stat.icon className="h-4 w-4" />
                    </div>
                  </div>
                </motion.div>
              ))}
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

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm">Order #</th>
                      <th className="px-4 py-2 text-left text-sm">Customer</th>
                      <th className="px-4 py-2 text-left text-sm">Items</th>
                      <th className="px-4 py-2 text-left text-sm">Total</th>
                      <th className="px-4 py-2 text-left text-sm">Status</th>
                      <th className="px-4 py-2 text-left text-sm">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 10).map((order) => (
                      <tr key={order._id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm font-mono">{order.orderNumber}</td>
                        <td className="px-4 py-2 text-sm">{order.customer?.name || order.guestInfo?.name || 'Guest'}</td>
                        <td className="px-4 py-2 text-sm">{order.items?.length || 0}</td>
                        <td className="px-4 py-2 text-sm font-semibold">${order.total?.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm">
                          <select
                            onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                            value={order.status}
                            className="text-xs border rounded px-2 py-1"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="preparing">Preparing</option>
                            <option value="ready">Ready</option>
                            <option value="served">Served</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
              <h2 className="text-2xl font-bold">Menu Items</h2>
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
                      <th className="px-4 py-3 text-left text-sm">Name</th>
                      <th className="px-4 py-3 text-left text-sm">Category</th>
                      <th className="px-4 py-3 text-left text-sm">Price</th>
                      <th className="px-4 py-3 text-left text-sm">Status</th>
                      <th className="px-4 py-3 text-left text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems.map((item) => (
                      <tr key={item._id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium">{item.name}</td>
                        <td className="px-4 py-3 text-sm">{item.category?.name || 'Uncategorized'}</td>
                        <td className="px-4 py-3 text-sm">${item.price}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {item.isAvailable ? 'Available' : 'Unavailable'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <button
                            onClick={() => handleDeleteMenuItem(item._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm">Order #</th>
                    <th className="px-4 py-3 text-left text-sm">Customer</th>
                    <th className="px-4 py-3 text-left text-sm">Items</th>
                    <th className="px-4 py-3 text-left text-sm">Total</th>
                    <th className="px-4 py-3 text-left text-sm">Status</th>
                    <th className="px-4 py-3 text-left text-sm">Payment</th>
                    <th className="px-4 py-3 text-left text-sm">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-mono">{order.orderNumber}</td>
                      <td className="px-4 py-3 text-sm">{order.customer?.name || order.guestInfo?.name || 'Guest'}</td>
                      <td className="px-4 py-3 text-sm">{order.items?.length || 0}</td>
                      <td className="px-4 py-3 text-sm font-semibold">${order.total?.toFixed(2)}</td>
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
                        <select
                          onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                          value={order.status}
                          className="text-xs border rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="served">Served</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Tables Tab */}
        {activeTab === 'tables' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {tables.map((table) => (
              <div key={table._id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold">Table {table.tableNumber}</h3>
                    <p className="text-gray-500 text-sm">Capacity: {table.capacity}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getTableStatusColor(table.status)}`}>
                    {table.status}
                  </div>
                </div>
                <div className="text-xs text-gray-400 capitalize">{table.section} Section</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold">Users</h2>
            </div>
            <div className="p-4 text-center text-gray-500">
              User management coming soon
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
                    <label className="block text-sm font-medium mb-1">Preparation Time (min)</label>
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
    </div>
  );
};

export default AdminDashboard;