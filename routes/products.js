const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   GET /api/products
// @desc    Obtener todos los productos
router.get('/', async (req, res, next) => {
  try {
    const products = await Product.find().populate('user', 'email');
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/products
// @desc    Crear producto
router.post('/', [
  protect,
  [
    check('name', 'El nombre es requerido').not().isEmpty(),
    check('description', 'La descripción es requerida').not().isEmpty(),
    check('price', 'El precio debe ser un número válido').isNumeric()
  ]
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, description, price } = req.body;
    const product = await Product.create({ name, description, price, user: req.user.id });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/products/:id
// @desc    Actualizar producto
router.put('/:id', protect, async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }

    // Verificar que el usuario sea el creador
    if (product.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'No autorizado' });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json(product);
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/products/:id
// @desc    Eliminar producto
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }

    // Verificar que el usuario sea el creador
    if (product.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'No autorizado' });
    }

    await product.remove();
    res.json({ msg: 'Producto eliminado' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
