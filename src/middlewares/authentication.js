const jwt = require('jsonwebtoken'); 
const supabase = require('../config/config');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token missing' });

  try {
    const user = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
    req.user = user; 
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}

function authorizeRoles(...allowedRoles) {
  return async (req, res, next) => {
    try {
      const roleId = req.user?.role;
      if (!roleId) {
        return res.status(403).json({ error: 'User role_id not found in token' });
      }

      const { data, error } = await supabase
        .from('roles')
        .select('role_name')
        .eq('id', roleId)
        .single();

      if (error || !data) {
        return res.status(403).json({ error: 'Role not found' });
      }

      const userRole = data.role_name;
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ error: 'Access denied' });
      }

      next();
    } catch (err) {
      console.error('Authorization error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

module.exports = {
  authenticateToken,
  authorizeRoles,
};
