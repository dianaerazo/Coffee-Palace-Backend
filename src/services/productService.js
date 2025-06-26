
import supabase from '../config/supabase.js'; 

const productService = {
  getAllProducts: async () => {
    const { data, error } = await supabase
      .from('producto')
      .select('*'); 

    if (error) {
      console.error('Error in getAllProducts service:', error);
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
    return data;
  },

  
  addProduct: async (productData) => {
    const { data, error } = await supabase
      .from('producto')
      .insert([productData])
      .select();

    if (error) {
      console.error('Error in addProduct service:', error);
      throw new Error(`Failed to create product: ${error.message}`);
    }
    return data[0]; 
  },

  getCategoriasForProduct: async () => {
    const { data, error } = await supabase
      .from('categoria')
      .select('*');

    if (error) {
      console.error('Error in getCategoriasForProduct service:', error);
      throw new Error(`Failed to fetch product categories: ${error.message}`);
    }
    return data;
  },

  deleteProduct: async (id) => {
    const { error } = await supabase
      .from('producto')
      .delete() 
      .eq('id', id); 

    if (error) {
      console.error(`Error in deleteProduct service for ID ${id}:`, error);
      throw new Error(`Failed to delete product: ${error.message}`);
    }
    return { message: 'Product deleted successfully' };
  },
};

export default productService;