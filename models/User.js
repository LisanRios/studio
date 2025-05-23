const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Por favor añade un email'],
    unique: true,
    match: [
      /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
      'Por favor añade un email válido'
    ]
  },
  password: {
    type: String,
    required: [true, 'Por favor añade una contraseña'],
    minlength: 6,
    select: false
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'disabled'],
    default: 'pending'
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'editor', 'user'],
    default: 'user',
    description: 'Roles disponibles: super_admin (máximos privilegios), admin (gestión usuarios), editor (creación contenido), user (básico)'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encriptar contraseña antes de guardar
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Generar JWT (usando .env)
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Verificar contraseña
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
