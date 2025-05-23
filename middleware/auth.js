const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Niveles de acceso por rol
const rolePermissions = {
  super_admin: ['all'],
  admin: [
    'users:read',
    'users:manage', 
    'users:delete',
    'content:manage',
    'settings:view'
  ],
  editor: [
    'content:create',
    'content:edit',
    'content:delete',
    'content:view'
  ],
  user: ['content:view']
};

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorResponse('No autorizado para acceder a esta ruta', 401));
  }

  try {
    // Verificar token (usando .env)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return next(new ErrorResponse('No autorizado para acceder a esta ruta', 401));
  }
};

exports.authorize = (permissions) => {
  return (req, res, next) => {
    const userRole = req.user?.role || 'user';
    
    // Super_admin tiene acceso completo
    if (userRole === 'super_admin') return next();
    
    // Verificar permisos del rol
    const allowedPermissions = rolePermissions[userRole] || [];
    const hasPermission = permissions.some(permission => 
      allowedPermissions.includes(permission) || 
      allowedPermissions.includes('all')
    );
    
    if (!hasPermission) {
      return next(
        new ErrorResponse(`Rol ${userRole} no autorizado para esta acción`, 403)
      );
    }
    
    next();
  };
};

// Middleware específico por rol (opcional)
exports.superAdminOnly = exports.authorize(['all']);
exports.adminOnly = exports.authorize(['users:manage']);
exports.editorOnly = exports.authorize(['content:create']);
