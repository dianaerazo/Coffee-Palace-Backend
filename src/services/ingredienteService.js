

import supabase from '../config/supabase.js'; 

const ingredienteService = {
  getAllIngredientes: async () => {
    const { data, error } = await supabase
      .from('ingrediente') 
      .select('*'); 

    if (error) {
      console.error('Error in getAllIngredientes service:', error);
      throw new Error(`Failed to fetch ingredients: ${error.message}`);
    }
    return data;
  },

  
  addIngrediente: async (ingredienteData) => {
    const { data, error } = await supabase
      .from('ingrediente')
      .insert([ingredienteData]) 
      .select(); 

    if (error) {
      console.error('Error in addIngrediente service:', error);
      throw new Error(`Failed to create ingredient: ${error.message}`);
    }
    return data[0]; 
  },

  deleteIngrediente: async (id) => {
    const { error } = await supabase
      .from('ingrediente')
      .delete() 
      .eq('id', id); 

    if (error) {
      console.error(`Error in deleteIngrediente service for ID ${id}:`, error);
      throw new Error(`Failed to delete ingredient: ${error.message}`);
    }
    return { message: 'Ingredient deleted successfully' };
  },
};

export default ingredienteService;