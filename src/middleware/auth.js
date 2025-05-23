const { verifyToken } = require('../utils/auth');

// Extract token from the Authorization header
function getTokenFromHeader(req) {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
}

// Authentication middleware for GraphQL context
function authenticate(req) {
  const token = getTokenFromHeader(req);
  if (!token) {
    return { authenticated: false };
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return { authenticated: false };
  }

  return {
    authenticated: true,
    user: decoded
  };
}

// Middleware to check if user is authenticated
function isAuthenticated(context) {
  if (!context.authenticated) {
    throw new Error('Not authenticated');
  }
  return true;
}

// Middleware to check if user has admin role
function isAdmin(context) {
  isAuthenticated(context);
  if (context.user.role !== 'ADMIN') {
    throw new Error('Not authorized. Admin role required');
  }
  return true;
}

module.exports = {
  authenticate,
  isAuthenticated,
  isAdmin
}; 