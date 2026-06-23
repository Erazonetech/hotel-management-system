import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
  tableNumber: {
    type: Number,
    required: true,
    unique: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  },
  section: {
    type: String,
    enum: ['indoor', 'outdoor', 'bar', 'private', 'terrace'],
    default: 'indoor'
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'reserved', 'cleaning', 'maintenance'],
    default: 'available'
  },
  currentOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  qrCode: String,
  amenities: [{
    type: String,
    enum: ['wheelchair-accessible', 'high-chair', 'power-outlet', 'view']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastOccupiedAt: Date,
  currentSessionStart: Date
}, {
  timestamps: true
});

const Table = mongoose.model('Table', tableSchema);

export default Table