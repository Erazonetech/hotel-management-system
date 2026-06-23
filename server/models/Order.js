import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  },
  specialInstructions: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'served', 'cancelled'],
    default: 'pending'
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true
  },
  table: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    default: null
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  guestInfo: {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    numberOfGuests: { type: Number, default: 1 }
  },
  items: [orderItemSchema],
  orderType: {
    type: String,
    enum: ['dine-in', 'takeaway', 'delivery'],
    default: 'dine-in'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready-for-serve','served', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'online'],
    default: 'cash'
  },
  subtotal: {
    type: Number,
    required: true,
    default: 0
  },
  tax: {
    type: Number,
    required: true,
    default: 0
  },
  serviceCharge: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true,
    default: 0
  },
  specialRequests: {
    type: String,
    default: ''
  },
  // staff responsible at each stage

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  confirmedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  preparedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  servedBy: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  paymentProcessedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  handledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  timeline: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String,
    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User'
    }
  }]
}, {
  timestamps: true
});

// FIXED: No next() parameter - use async without callback
orderSchema.pre('save', async function() {
  // Generate order number if not exists
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.orderNumber = `ORD-${year}${month}${day}-${random}`;
  }
  
  // Add timeline entry if status changed
  if (this.isModified('status')) {
    if (!this.timeline) this.timeline = [];
    this.timeline.push({
      status: this.status,
      timestamp: new Date()
    });
  }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;