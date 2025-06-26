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
};

export default userService;