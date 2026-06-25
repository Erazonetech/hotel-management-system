import Order from'../models/Order.js';
import Table from'../models/Table.js';
import MenuItem from'../models/MenuItem.js';
import { asyncHandler } from'../middleware/errorHandler.js';
import { emitToRole, emitToUser } from'../utils/socket.js';
import { sendOrderConfirmation } from'../utils/emailService.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { items, table, orderType, guestInfo, specialRequests } = req.body;
  
  console.log('Received order data:', req.body); // Debug log
  
  // Validate required fields
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Order must contain at least one item'
    });
  }
  
  // Validate and calculate totals
  let subtotal = 0;
  const orderItems = [];
  
  for (const item of items) {
    // Validate item has required fields
    if (!item.menuItem) {
      return res.status(400).json({
        success: false,
        error: 'Each order item must have a menuItem ID'
      });
    }
    
    const quantity = Number(item.quantity) || 1;
    const price = Number(item.price) || 0;
    
    if (price <= 0) {
      return res.status(400).json({
        success: false,
        error: `Invalid price for item: ${item.name || 'Unknown'}`
      });
    }
    
    const itemTotal = price * quantity;
    subtotal += itemTotal;
    
    orderItems.push({
      menuItem: item.menuItem,
      name: item.name || 'Menu Item',
      quantity: quantity,
      price: price,
      specialInstructions: item.specialInstructions || ''
    });
  }
  
  // Calculate tax and total with proper numbers
  const taxRate = 0.10; // 10%
  const serviceChargeRate = orderType === 'dine-in' ? 0.05 : 0; // 5% for dine-in
  
  const tax = Number((subtotal * taxRate).toFixed(2));
  const serviceCharge = Number((subtotal * serviceChargeRate).toFixed(2));
  const total = Number((subtotal + tax + serviceCharge).toFixed(2));
  
  // Create order
  const orderData = {
    items: orderItems,
    table: table || null,
    orderType: orderType || 'dine-in',
    guestInfo: guestInfo || {
      name: req.user?.name || 'Guest',
      email: req.user?.email || '',
      phone: req.user?.phone || ''
    },
    customer: req.user?._id || null,
    createdBy:req.user?._id || null,
    subtotal: Number(subtotal.toFixed(2)),
    tax: tax,
    serviceCharge: serviceCharge,
    total: total,
    specialRequests: specialRequests || '',
    handledBy: req.user?._id || null,
    status: 'pending',
    paymentStatus: 'pending',
    timeline: [{ status: 'pending', timestamp: new Date(), user: req.user?._id }]
  };
  
  console.log('Creating order with data:', orderData); // Debug log
  
  const order = await Order.create(orderData);
  
  // Update table if dine-in
  if (table && orderType === 'dine-in') {
    try {
      await Table.findByIdAndUpdate(table, {
        status: 'occupied',
        currentOrder: order._id,
        currentSessionStart: new Date()
      });
    } catch (error) {
      console.error('Error updating table:', error);
    }
  }
  
  // Emit socket event
  try {
    emitToRole('kitchen', 'new-order', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      items: order.items,
      orderType: order.orderType,
      timestamp: new Date()
    });
     emitToRole('cashier', 'new-order', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      items: order.items,
      orderType: order.orderType,
      timestamp: new Date()
    });
     emitToRole('admin', 'new-order', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      items: order.items,
      orderType: order.orderType,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Socket emit error:', error);
  }
  
  res.status(201).json({
    success: true,
    data: order
  });
});

// @desc    Get all orders (with filters)
// @route   GET /api/orders
// @access  Private/Admin/Waiter/Kitchen
const getOrders = async (req, res) => {
  try {
    const { status, role } = req.query;
    let query = {};

    // Role-specific filters
    if (role === 'cashier') {
      // Cashier sees pending, confirmed, served orders
      query.status = { $in: ['pending', 'confirmed', 'served'] };
    } else if (role === 'kitchen') {
      // Kitchen sees confirmed and preparing orders
      query.status = { $in: ['confirmed', 'preparing'] };
    } else if (role === 'waiter') {
      // Waiter sees ready and served orders
      query.status = { $in: ['ready', 'served'] };
    } else if (role === 'admin') {
      // Admin sees everything
    } else if (role === 'customer' && req.user) {
      query.customer = req.user._id;
    }

    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('customer', 'name email phone')
      .populate('table', 'tableNumber section')
      .populate('confirmedBy', 'name')
      .populate('preparedBy', 'name')
      .populate('servedBy', 'name')
      .populate('paymentProcessedBy', 'name')
      .sort('-createdAt');

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('table', 'tableNumber section capacity')
    .populate('customer', 'name email phone')
    .populate('handledBy', 'name')
    .populate('items.menuItem', 'name images');
    
  if (!order) {
    return res.status(404).json({
      success: false,
      error: 'Order not found'
    });
  }
  
  // Check authorization
  if (req.user.role === 'customer' && order.customer?._id.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to view this order'
    });
  }
  
  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

    const user = req.user;
    const oldStatus = order.status;

    // Validate workflow transitions
    const validTransitions = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['preparing', 'cancelled'],
      'preparing': ['ready', 'cancelled'],
      'ready': ['served', 'cancelled'],
      'served': ['completed', 'cancelled']
    };

    if (!validTransitions[oldStatus]?.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        error: `Invalid transition from ${oldStatus} to ${status}` 
      });
    }

    // Assign responsible staff based on status

    const statusResponsibility = {
      'confirmed': { field: 'confirmedBy', role: 'cashier' },
      'preparing': { field: 'preparedBy', role: 'kitchen' },
      'ready': { field: 'preparedBy', role: 'kitchen' },
      'served': { field: 'servedBy', role: 'waiter' },
      'completed': { field: 'paymentProcessedBy', role: 'cashier' }
    };

      // Check if user has permission for this status change
    const responsibility = statusResponsibility[status];
    if (responsibility) {
      // Allow admin to do anything
      if (user.role !== 'admin') {
        // Check if user has the required role
        const allowedRoles = {
          'confirmed': ['cashier', 'admin'],
          'preparing': ['kitchen', 'admin'],
          'ready': ['kitchen', 'admin'],
          'served': ['waiter', 'admin'],
          'completed': ['cashier', 'admin']
        };
        
        if (!allowedRoles[status]?.includes(user.role)) {
          return res.status(403).json({
            success: false,
            error: `Only ${allowedRoles[status]?.join(' or ')} can change status to ${status}`
          });
        }
      }

    if (status === 'confirmed') order.confirmedBy = user._id;
    if (status === 'preparing') order.preparedBy = user._id;
    if (status === 'served') order.servedBy = user._id;
    if (status === 'completed') {
      order.paymentProcessedBy = user._id;
      order.paymentStatus = 'paid';
      if (order.table) {
        await Table.findByIdAndUpdate(order.table, { status: 'available', currentOrder: null });
      }
    }
  }

    order.status = status;
    order.timeline.push({ status, timestamp: new Date(), note, user: user._id });
    await order.save();

    // Real-time notifications based on status
   const notificationMap = {
      'confirmed': { role: 'kitchen', event: 'order-confirmed' },
      'preparing': { role: 'cashier', event: 'order-preparing' },
      'ready': { role: 'waiter', event: 'order-ready' },
      'served': { role: 'cashier', event: 'order-served' },
      'completed': { role: 'admin', event: 'order-completed' }
    };

    const notification = notificationMap[status];
    if (notification) {
      emitToRole(notification.role, notification.event, { 
        orderId: order._id, 
        orderNumber: order.orderNumber 
      });
    }

    // Notify the customer
    if (order.customer) {
      emitToUser(order.customer.toString(), 'order-update', { 
        orderId: order._id, 
        status, 
        orderNumber: order.orderNumber 
      });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// @desc    Update order item status
// @route   PUT /api/orders/:id/items/:itemId/status
// @access  Private/Kitchen
const updateItemStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id, itemId } = req.params;
  
  const order = await Order.findById(id);
  
  if (!order) {
    return res.status(404).json({
      success: false,
      error: 'Order not found'
    });
  }
  
  const item = order.items.id(itemId);
  if (!item) {
    return res.status(404).json({
      success: false,
      error: 'Order item not found'
    });
  }
  
  item.status = status;
  
  if (status === 'preparing') {
    item.preparationStartedAt = new Date();
  } else if (status === 'ready') {
    item.preparationCompletedAt = new Date();
  } else if (status === 'served') {
    item.servedAt = new Date();
  }
  
  await order.save();
  
  // Check if all items are ready
  const allItemsReady = order.items.every(item => item.status === 'ready');
  if (allItemsReady && order.status !== 'ready-for-serve') {
    order.status = 'ready-for-serve';
    await order.save();
    
    emitToRole('waiter', 'order-ready', {
      orderId: order._id,
      orderNumber: order.orderNumber
    });
  }
  
  res.status(200).json({
    success: true,
    data: item
  });
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    return res.status(404).json({
      success: false,
      error: 'Order not found'
    });
  }
  
  // Check if order can be cancelled
  if (order.status !== 'pending' && order.status !== 'confirmed') {
    return res.status(400).json({
      success: false,
      error: 'Order cannot be cancelled at this stage'
    });
  }
  
  order.status = 'cancelled';
  order.timeline.push({ status: 'cancelled', note: req.body.reason, timestamp: new Date() });
  await order.save();
  
  // Free up table
  if (order.table) {
    await Table.findByIdAndUpdate(order.table, {
      status: 'available',
      currentOrder: null
    });
  }
  
  // Emit socket event
  emitToRole('waiter', 'order-cancelled', {
    orderId: order._id,
    orderNumber: order.orderNumber
  });
  
  res.status(200).json({
    success: true,
    message: 'Order cancelled successfully'
  });
});

export {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  updateItemStatus,
  cancelOrder
};