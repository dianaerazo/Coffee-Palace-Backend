import supabase from '../config/supabaseClient.js';

export async function getAllProducts() {
  const { data, error } = await supabase.from('products').select('*');
  if (error) throw error;
  return data;
}

export async function updateProductStock(productId, newStock) {
  const { error } = await supabase
    .from('products')
    .update({ quantity: newStock })
    .eq('id', productId);

  if (error) throw error;
  return { success: true };
}
