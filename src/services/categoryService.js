
import supabase from '../config/supabase.js'; // Use 'import' and add .js extension for local modules

const categoryService = {
  // Fetches all categories from the 'categoria' table in Supabase.
  getAllCategories: async () => {
    const { data, error } = await supabase
      .from('categoria') // Your Supabase table name
      .select('*'); // Select all columns

    if (error) {
      console.error('Error in getAllCategories service:', error);
      // Re-throw a custom error for consistent error handling in controllers.
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }
    return data;
  },

  // Adds a new category to the 'categoria' table.
  // Expects an object with a 'nombre' property (e.g., { nombre: 'New Name' }).
  addCategory: async (categoryData) => {
    const { data, error } = await supabase
      .from('categoria')
      .insert([categoryData]) // Insert a new record
      .select(); // Return the inserted record

    if (error) {
      console.error('Error in addCategory service:', error);
      throw new Error(`Failed to create category: ${error.message}`);
    }
    return data[0]; // Return the first (and only) inserted record
  },

  // Deletes a category by its ID from the 'categoria' table.
  deleteCategory: async (id) => {
    const { error } = await supabase
      .from('categoria')
      .delete() // Perform delete operation
      .eq('id', id); // Filter by 'id' column

    if (error) {
      console.error(`Error in deleteCategory service for ID ${id}:`, error);
      throw new Error(`Failed to delete category: ${error.message}`);
    }
    // No content is returned for a successful deletion (HTTP 204 status).
    return { message: 'Category deleted successfully' };
  },
};

// Export the service object as the default export for ES modules.
export default categoryService;
