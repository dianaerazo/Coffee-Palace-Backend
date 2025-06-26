// your-backend-project/src/services/ingredienteService.js
// This service handles business logic and interactions with Supabase for 'ingrediente'.

import supabase from '../config/supabase.js'; // Import Supabase client configured for ES Modules

const ingredienteService = {
  // Fetches all ingredients from the 'ingrediente' table in Supabase.
  getAllIngredientes: async () => {
    const { data, error } = await supabase
      .from('ingrediente') // Your Supabase table name for ingredients
      .select('*'); // Select all columns

    if (error) {
      console.error('Error in getAllIngredientes service:', error);
      throw new Error(`Failed to fetch ingredients: ${error.message}`);
    }
    return data;
  },

  // Adds a new ingredient to the 'ingrediente' table.
  // Expects an object with a 'nombre' property (e.g., { nombre: 'New Ingredient' }).
  addIngrediente: async (ingredienteData) => {
    const { data, error } = await supabase
      .from('ingrediente')
      .insert([ingredienteData]) // Insert a new record
      .select(); // Return the inserted record

    if (error) {
      console.error('Error in addIngrediente service:', error);
      throw new Error(`Failed to create ingredient: ${error.message}`);
    }
    return data[0]; // Return the first (and only) inserted record
  },

  // Deletes an ingredient by its ID from the 'ingrediente' table.
  deleteIngrediente: async (id) => {
    const { error } = await supabase
      .from('ingrediente')
      .delete() // Perform delete operation
      .eq('id', id); // Filter by 'id' column

    if (error) {
      console.error(`Error in deleteIngrediente service for ID ${id}:`, error);
      throw new Error(`Failed to delete ingredient: ${error.message}`);
    }
    // No content is returned for a successful deletion (HTTP 204).
    return { message: 'Ingredient deleted successfully' };
  },
};

// Export the service object as the default export for ES modules.
export default ingredienteService;