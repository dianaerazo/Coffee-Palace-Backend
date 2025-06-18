const supabase = require('../config/config');

// Obtener todos los pedidos
const getAllOrders = async (req, res) => {
  const { data, error } = await supabase.from('orders').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Crear nuevo pedido (desde carrito o venta)
const createOrder = async (req, res) => {
  const { user_id, items, total } = req.body;
  const { error } = await supabase.from('orders').insert([
    { user_id, items, total },
  ]);

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: 'Pedido registrado' });
};

module.exports = {
  getAllOrders,
  createOrder,
};
