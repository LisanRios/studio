const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor añade un nombre'],
    trim: true,
    maxlength: [50, 'El nombre no puede superar los 50 caracteres']
  },
  description: {
    type: String,
    required: [true, 'Por favor añade una descripción'],
    maxlength: [500, 'La descripción no puede superar los 500 caracteres']
  },
  price: {
    type: Number,
    required: [true, 'Por favor añade un precio'],
    min: [0, 'El precio no puede ser negativo']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Product', ProductSchema);
