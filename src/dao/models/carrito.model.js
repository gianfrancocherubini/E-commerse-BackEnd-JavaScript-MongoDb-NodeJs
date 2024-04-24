

import mongoose from 'mongoose';

const cartsColeccion = 'carts';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',
    required: true,
  },
  quantity: {
    type: Number,
    required: true, 
  },
});

const cartSchema = new mongoose.Schema({
  items: [cartItemSchema],
}, {
  timestamps: true, 
  strict: false,    
});

export const Cart = mongoose.model('carts', cartSchema);

