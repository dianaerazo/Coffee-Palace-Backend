const supabase = require('../config/config');

// Obtener todos los productos (para ViewStockScreen)
const getAllProducts = async (req, res) => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Actualizar stock (desde modal de actualizar en ViewStockScreen)
const updateProductStock = async (req, res) => {
  const { id, quantity } = req.body;
  const { error } = await supabase
    .from('products')
    .update({ quantity })
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Stock actualizado' });
};

// Crear nuevo producto (si hay una pantalla de añadir productos)
const createProduct = async (req, res) => {
  const { name, description, price, quantity } = req.body;
  const { error } = await supabase.from('products').insert([
    { name, description, price, quantity },
  ]);

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: 'Producto creado' });
};

module.exports = {
  getAllProducts,
  updateProductStock,
  createProduct,
};
