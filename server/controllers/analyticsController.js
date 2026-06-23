import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import User from '../models/User.js';

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
const getDashboardAnalytics = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Today's orders
    const todayOrders = await Order.find({
      createdAt: { $gte: today, $lt: tomorrow }
    });
    
    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
    
    // Total orders
    const totalOrders = await Order.countDocuments();
    
    // Total revenue
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    // Popular items
    const popularItems = await Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.name', count: { $sum: '$items.quantity' } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    // Recent orders
    const recentOrders = await Order.find()
      .sort('-createdAt')
      .limit(10)
      .populate('customer', 'name email');
    
    res.status(200).json({
      success: true,
      data: {
        todayOrders: todayOrders.length,
        todayRevenue,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        popularItems,
        recentOrders
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get sales report
// @route   GET /api/analytics/sales
// @access  Private/Admin
const getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};
    
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const orders = await Order.find(query);
    
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = orders.length > 0 ? totalSales / orders.length : 0;
    
    // Sales by category (simplified)
    const salesByCategory = await Order.aggregate([
      { $match: query },
      { $unwind: '$items' },
      { $lookup: {
          from: 'menuitems',
          localField: 'items.menuItem',
          foreignField: '_id',
          as: 'menuItem'
        }},
      { $unwind: '$menuItem' },
      { $group: {
          _id: '$menuItem.category',
          total: { $sum: '$items.price' }
        }}
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalOrders: orders.length,
        totalSales,
        averageOrderValue,
        salesByCategory,
        orders
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export { getDashboardAnalytics, getSalesReport };