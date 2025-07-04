import supabase from '../config/supabase.js';

const userService = {
 
  getAllUsers: async () => {
    const { data, error } = await supabase
      .from('usuario')
      .select('*'); 

    if (error) {
      console.error('Error en getAllUsers service:', error);
      throw new Error(`No se pudieron obtener los usuarios: ${error.message}`);
    }
    return data;
  },

  addUser: async (userData) => {
    const { data, error } = await supabase
      .from('usuario')
      .insert([userData])
      .select();

    if (error) {
      console.error('Error en addUser service:', error);
      throw new Error(`No se pudo crear el usuario: ${error.message}`);
    }
    return data[0];
  },

  deleteUser: async (id) => {
    const { error } = await supabase
      .from('usuario')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error en deleteUser service para el ID ${id}:`, error);
      throw new Error(`No se pudo eliminar el usuario: ${error.message}`);
    }
    return { message: 'Usuario eliminado correctamente' };
  },
  /**
   * Updates the 'imagen' field for a user in the 'usuario' table.
   * @param {string} email - The email of the user to update.
   * @param {string} imageUrl - The new URL for the profile image.
   * @returns {Promise<Object|null>} - The updated user object, or null if not found/updated.
   */
  updateUserImageByEmail: async (email, imageUrl) => {
    try {
      const { data, error } = await supabase
        .from('usuario') // Your table name is 'usuario'
        .update({ imagen: imageUrl }) // Update the 'imagen' column
        .eq('correo', email) // Where the 'correo' column matches the provided email
        .select() // Return the updated data
        .single(); // Expect a single result

      if (error) {
        console.error('Error updating user image in DB:', error);
        throw new Error(`Failed to update user image: ${error.message}`);
      }
      return data;
    } catch (e) {
      console.error('Error in userService.updateUserImageByEmail:', e);
      throw e;
    }
  },

  /**
   * Retrieves a user by their email from the 'usuario' table.
   * @param {string} email - The email of the user to retrieve.
   * @returns {Promise<Object|null>} - The user object, or null if not found.
   */
  getUsuarioByEmail: async (email) => {
    try {
      const { data, error } = await supabase
        .from('usuario') // Your table name is 'usuario'
        .select('*')
        .eq('correo', email)
        .single();

      // Supabase returns an error with code 'PGRST116' if no rows are found for .single()
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user by email from DB:', error);
        throw new Error(`Failed to get user by email: ${error.message}`);
      }
      return data; // Will be null if no user is found
    } catch (e) {
      console.error('Error in userService.getUsuarioByEmail:', e);
      throw e;
    }
  }
};


export default userService;