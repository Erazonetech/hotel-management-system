import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPackage, FiClock, FiCheckCircle, FiXCircle, 
  FiSearch, FiFilter, FiCalendar, FiDollarSign,
  FiShoppingBag, FiArrowRight, FiRefreshCw
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const OrderStatus = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderService.getOrders();
      setOrders(response.data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { label: 'Pending', icon: FiClock, color: 'bg-yellow-100 text-yellow-800', step: 1 },
      confirmed: { label: 'Confirmed', icon: FiCheckCircle, color: 'bg-blue-100 text-blue-800', step: 2 },
      preparing: { label: 'Preparing', icon: FiPackage, color: 'bg-purple-100 text-purple-800', step: 3 },
      'ready-for-serve': { label: 'Ready', icon: FiCheckCircle, color: 'bg-green-100 text-green-800', step: 4 },
      completed: { label: 'Completed', icon: FiCheckCircle, color: 'bg-green-100 text-green-800', step: 5 },
      cancelled: { label: 'Cancelled', icon: FiXCircle, color: 'bg-red-100 text-red-800', step: 0 }
    };
    return configs[status] || configs.pending;
  };

  const getFilteredOrders = () => {
    if (filter === 'all') return orders;
    return orders.filter(order => order.status === filter);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Orders</h1>
              <p className="text-primary-100">Track and manage your orders</p>
            </div>
            <button
              onClick={fetchOrders}
              className="mt-4 md:mt-0 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FiRefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex flex-wrap gap-3">
            {['all', 'pending', 'confirmed', 'preparing', 'ready-for-serve', 'completed', 'cancelled'].map((status) => {
              const config = getStatusConfig(status);
              const count = status === 'all' ? orders.length : orders.filter(o => o.status === status).length;
              return (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                    filter === status
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status !== 'all' && <config.icon className="h-4 w-4" />}
                  <span className="capitalize">{status.replace('-', ' ')}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    filter === status ? 'bg-white/20' : 'bg-gray-300'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Orders Found</h2>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? "You haven't placed any orders yet"
                : `No ${filter} orders found`}
            </p>
            <button
              onClick={() => navigate('/menu')}
              className="btn-primary inline-flex items-center gap-2"
            >
              <FiShoppingBag className="h-5 w-5" />
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order, index) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Order Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Order #{order.orderNumber}</span>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusConfig.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig.label}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <FiCalendar className="h-3 w-3" />
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary-600">
                        ${order.total?.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.items?.length || 0} items
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="px-6 py-4">
                    <div className="space-y-3">
                      {order.items?.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <span className="text-gray-400 text-sm">{item.quantity}x</span>
                            <span className="text-gray-800">{item.name}</span>
                          </div>
                          <span className="text-gray-600">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      {order.items?.length > 3 && (
                        <div className="text-gray-400 text-sm text-center pt-2">
                          + {order.items.length - 3} more items
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Footer */}
                  <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      {order.orderType === 'dine-in' ? '🍽️ Dine In' : '📦 Takeaway'}
                    </div>
                    <button
                      onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
                    >
                      {selectedOrder === order._id ? 'Hide Details' : 'View Details'}
                      <FiArrowRight className={`h-4 w-4 transition-transform ${selectedOrder === order._id ? 'rotate-90' : ''}`} />
                    </button>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {selectedOrder === order._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t bg-white px-6 py-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Order Timeline */}
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-3">Order Timeline</h4>
                            <div className="space-y-3">
                              {order.timeline?.map((event, idx) => (
                                <div key={idx} className="flex gap-3">
                                  <div className="relative">
                                    <div className="w-2 h-2 rounded-full bg-primary-500 mt-2"></div>
                                    {idx < order.timeline.length - 1 && (
                                      <div className="absolute top-4 left-0 w-0.5 h-full bg-gray-200"></div>
                                    )}
                                  </div>
                                  <div className="flex-1 pb-4">
                                    <p className="text-sm font-medium text-gray-800 capitalize">
                                      {event.status?.replace('-', ' ')}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      {formatDate(event.timestamp)}
                                    </p>
                                    {event.note && (
                                      <p className="text-xs text-gray-500 mt-1">{event.note}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Order Details */}
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-3">Order Summary</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span>${order.subtotal?.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Tax (10%)</span>
                                <span>${order.tax?.toFixed(2)}</span>
                              </div>
                              {order.serviceCharge > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Service Charge</span>
                                  <span>${order.serviceCharge?.toFixed(2)}</span>
                                </div>
                              )}
                              <div className="flex justify-between font-bold pt-2 border-t">
                                <span>Total</span>
                                <span className="text-primary-600">${order.total?.toFixed(2)}</span>
                              </div>
                            </div>

                            {order.specialRequests && (
                              <div className="mt-4">
                                <h4 className="font-semibold text-gray-800 mb-1">Special Requests</h4>
                                <p className="text-sm text-gray-600">{order.specialRequests}</p>
                              </div>
                            )}

                            {order.paymentStatus === 'pending' && order.status !== 'cancelled' && (
                              <button className="mt-4 w-full bg-primary-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                                Make Payment
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderStatus;