const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, authorize, superAdminOnly } = require('../middleware/auth');
const supabase = require('../../src/lib/supabaseClient'); // Assuming you have a supabase config file

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación de usuarios
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Usuario registrado
 *       400:
 *         description: Error en los datos
 */

// @route   POST /api/auth/register
// @desc    Registrar usuario
router.post('/register', [
  check('username', 'Username es requerido (min 3 caracteres)').isLength({ min: 3 }),
  check('password', 'Password debe tener al menos 6 caracteres').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    // 1. Verificar si username existe
    const { data: existingUser, error: lookupError } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'El username ya está en uso' });
    }

    // 2. Hashear password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 3. Crear usuario
    const newUser = {
      id: `user_${Date.now()}`,
      username,
      password_hash,
      status: 'active',
      role: 'user',
      created_at: new Date().toISOString()
    };

    const { data: user, error: insertError } = await supabase
      .from('users')
      .insert([newUser])
      .select();

    if (insertError) throw insertError;

    // 4. Generar JWT
    const token = jwt.sign(
      { id: user[0].id, role: user[0].role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.status(201).json({ 
      token, 
      user: { 
        id: user[0].id, 
        username: user[0].username, 
        role: user[0].role 
      }
    });

  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autenticar usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario autenticado
 *       400:
 *         description: Error en los datos
 */

// @route   POST /api/auth/login
// @desc    Autenticar usuario
router.post('/login', [
  check('username', 'Username es requerido').notEmpty(),
  check('password', 'Password debe tener al menos 6 caracteres').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    // 1. Buscar usuario en Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // 2. Verificar contraseña (usando bcrypt)
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // 3. Generar JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });

  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obtener perfil del usuario actual
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 *       401:
 *         description: No autorizado
 */
router.get('/me', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/auth/users
// @desc    Obtener todos los usuarios (solo admin)
router.get('/users', protect, authorize(['users:read']), async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/auth/users/:id/status
// @desc    Actualizar estado de usuario
router.put('/users/:id/status', protect, authorize(['users:manage']), async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status },
      { new: true }
    ).select('-password');
    
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/auth/users/:id
// @desc    Eliminar usuario
router.delete('/users/:id', protect, authorize(['users:delete']), async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/auth/users/:id/role
// @desc    Actualizar rol de usuario
router.put('/users/:id/role', protect, authorize(['users:manage']), async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    );
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
