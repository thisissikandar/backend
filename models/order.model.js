import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deliveryPartnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  product: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Out for Delivery', 'Delivered'],
    default: 'Pending'
  },
  location: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Order', OrderSchema);