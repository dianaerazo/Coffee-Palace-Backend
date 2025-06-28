
import supabase from '../config/supabase.js'; 

const categoryService = {
  getAllCategories: async () => {
    const { data, error } = await supabase
      .from('categoria') 
      .select('*'); 

    if (error) {
      console.error('Error in getAllCategories service:', error);
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }
    return data;
  },

  
  addCategory: async (categoryData) => {
    const { data, error } = await supabase
      .from('categoria')
      .insert([categoryData])
      .select(); 

    if (error) {
      console.error('Error in addCategory service:', error);
      throw new Error(`Failed to create category: ${error.message}`);
    }
    return data[0];
  },

  deleteCategory: async (id) => {
    const { error } = await supabase
      .from('categoria')
      .delete() 
      .eq('id', id); 

    if (error) {
      console.error(`Error in deleteCategory service for ID ${id}:`, error);
      throw new Error(`Failed to delete category: ${error.message}`);
    }
    return { message: 'Category deleted successfully' };
  },
};

export default categoryService;
