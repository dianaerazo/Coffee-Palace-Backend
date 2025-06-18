const supabase = require('../config/config');

const getAllUsers = async (req, res) => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Actualizar rol o estado del usuario
const updateUser = async (req, res) => {
  const { id, role } = req.body;
  const { error } = await supabase.from('users').update({ role }).eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Usuario actualizado' });
};

module.exports = {
  getAllUsers,
  updateUser,
};
