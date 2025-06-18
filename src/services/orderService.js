import supabase from '../config/supabaseClient.js';

export async function getAllOrders() {
  const { data, error } = await supabase.from('orders').select('*');
  if (error) throw error;
  return data;
}

export async function createOrder(orderData) {
  const { data, error } = await supabase.from('orders').insert([orderData]);
  if (error) throw error;
  return data;
}

