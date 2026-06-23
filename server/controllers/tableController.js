import Table from '../models/Table.js';

// @desc    Get all tables
// @route   GET /api/tables
// @access  Private/Admin/Waiter
const getTables = async (req, res) => {
  try {
    const tables = await Table.find().sort('tableNumber');
    res.status(200).json({
      success: true,
      count: tables.length,
      data: tables
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single table
// @route   GET /api/tables/:id
// @access  Private/Admin/Waiter
const getTableById = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    
    if (!table) {
      return res.status(404).json({
        success: false,
        error: 'Table not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: table
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get available tables
// @route   GET /api/tables/available
// @access  Public
const getAvailableTables = async (req, res) => {
  try {
    const { capacity, section, date } = req.query;
    let query = { status: 'available', isActive: true };
    
    if (capacity) {
      query.capacity = { $gte: parseInt(capacity) };
    }
    
    if (section) {
      query.section = section;
    }
    
    const tables = await Table.find(query).sort('tableNumber');
    
    res.status(200).json({
      success: true,
      count: tables.length,
      data: tables
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create new table
// @route   POST /api/tables
// @access  Private/Admin
const createTable = async (req, res) => {
  try {
    const { tableNumber, capacity, section, amenities } = req.body;
    
    // Check if table number already exists
    const existingTable = await Table.findOne({ tableNumber });
    if (existingTable) {
      return res.status(400).json({
        success: false,
        error: `Table ${tableNumber} already exists`
      });
    }
    
    const table = await Table.create({
      tableNumber,
      capacity,
      section,
      amenities,
      status: 'available'
    });
    
    res.status(201).json({
      success: true,
      data: table
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update table
// @route   PUT /api/tables/:id
// @access  Private/Admin
const updateTable = async (req, res) => {
  try {
    let table = await Table.findById(req.params.id);
    
    if (!table) {
      return res.status(404).json({
        success: false,
        error: 'Table not found'
      });
    }
    
    table = await Table.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: table
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete table
// @route   DELETE /api/tables/:id
// @access  Private/Admin
const deleteTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    
    if (!table) {
      return res.status(404).json({
        success: false,
        error: 'Table not found'
      });
    }
    
    await table.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Table deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update table status
// @route   PATCH /api/tables/:id/status
// @access  Private/Admin/Waiter
const updateTableStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const table = await Table.findById(req.params.id);
    
    if (!table) {
      return res.status(404).json({
        success: false,
        error: 'Table not found'
      });
    }
    
    table.status = status;
    if (status === 'occupied') {
      table.currentSessionStart = new Date();
    } else if (status === 'available') {
      table.lastOccupiedAt = new Date();
      table.currentOrder = null;
    }
    
    await table.save();
    
    res.status(200).json({
      success: true,
      data: table
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export {
  getTables,
  getTableById,
  getAvailableTables,
  createTable,
  updateTable,
  deleteTable,
  updateTableStatus
};