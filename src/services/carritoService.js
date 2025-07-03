// your-backend-project/src/services/carritoService.js
import supabase from '../config/supabase.js';

const carritoService = {
    /**
     * Añade una unidad de un producto al carrito de un usuario.
     * Esto inserta una nueva fila en la tabla 'carrito'.
     * @param {number} id_producto - ID del producto.
     * @param {string} auth_id_usuario - ID de autenticación del usuario (UUID de Firebase/Supabase).
     * @returns {Promise<Object>} El objeto 'carrito' insertado.
     */
    addCartItem: async (id_producto, auth_id_usuario) => { 
        try {
            // 1. Buscar el ID numérico interno del usuario basado en el auth_id_usuario (UUID)
            const { data: userData, error: userError } = await supabase
                .from('usuario') // Confirmado que la tabla se llama 'usuario' (singular)
                .select('id') 
                .eq('auth_id', auth_id_usuario) // CAMBIO AQUÍ: Usar 'auth_id' según tu tabla
                .single(); 

            if (userError || !userData) {
                console.error('Error finding user by auth_id:', userError);
                throw new Error(`Usuario no encontrado con auth ID: ${auth_id_usuario}`);
            }

            const internal_user_id = userData.id; 

            // 2. Ahora usa el ID numérico para insertar en la tabla 'carrito'
            const { data, error } = await supabase
                .from('carrito')
                .insert([{ id_producto, id_usuario: internal_user_id }]) 
                .select(); 

            if (error) {
                console.error('Error adding cart item:', error);
                throw new Error(`Failed to add item to cart: ${error.message}`);
            }
            return data[0]; 
        } catch (e) {
            console.error('Exception in addCartItem service:', e);
            throw e;
        }
    },

    /**
     * Obtiene todos los ítems brutos (sin agregar) del carrito de un usuario.
     * @param {string} auth_id_usuario - ID de autenticación del usuario (UUID).
     * @returns {Promise<Array>} Lista de objetos 'carrito'.
     */
    getRawCartItemsForUser: async (auth_id_usuario) => { 
        try {
            // 1. Buscar el ID numérico interno del usuario basado en el auth_id_usuario (UUID)
            const { data: userData, error: userError } = await supabase
                .from('usuario') // Confirmado que la tabla se llama 'usuario' (singular)
                .select('id')
                .eq('auth_id', auth_id_usuario) // CAMBIO AQUÍ: Usar 'auth_id' según tu tabla
                .single();

            if (userError || !userData) {
                console.error('Error finding user by auth_id:', userError);
                throw new Error(`Usuario no encontrado con auth ID: ${auth_id_usuario}`);
            }

            const internal_user_id = userData.id; 

            // 2. Obtener los ítems del carrito usando el ID numérico interno
            const { data, error } = await supabase
                .from('carrito')
                .select('*')
                .eq('id_usuario', internal_user_id); 

            if (error) {
                console.error('Error getting raw cart items:', error);
                throw new Error(`Failed to get raw cart items: ${error.message}`);
            }
            return data;
        } catch (e) {
            console.error('Exception in getRawCartItemsForUser service:', e);
            throw e;
        }
    },

    /**
     * Elimina una entrada específica del carrito (una unidad de producto).
     * @param {number} cartItemId - El ID de la entrada específica en la tabla 'carrito'.
     * @returns {Promise<Object>} Objeto con mensaje de éxito o error.
     */
    deleteCartEntry: async (cartItemId) => {
        try {
            const { error } = await supabase
                .from('carrito')
                .delete()
                .eq('id', cartItemId);

            if (error) {
                console.error('Error deleting cart entry:', error);
                throw new Error(`Failed to delete cart entry: ${error.message}`);
            }
            return { message: 'Cart entry deleted successfully.' };
        } catch (e) {
            console.error('Exception in deleteCartEntry service:', e);
            throw e;
        }
    },

    /**
     * Vacía todo el carrito de un usuario.
     * @param {string} auth_id_usuario - ID de autenticación del usuario (UUID).
     * @returns {Promise<Object>} Objeto con mensaje de éxito o error.
     */
    clearUserCart: async (auth_id_usuario) => { 
        try {
            // 1. Buscar el ID numérico interno del usuario basado en el auth_id_usuario (UUID)
            const { data: userData, error: userError } = await supabase
                .from('usuario') // Confirmado que la tabla se llama 'usuario' (singular)
                .select('id')
                .eq('auth_id', auth_id_usuario) // CAMBIO AQUÍ: Usar 'auth_id' según tu tabla
                .single();

            if (userError || !userData) {
                console.error('Error finding user by auth_id:', userError);
                throw new Error(`Usuario no encontrado para borrar carrito con auth ID: ${auth_id_usuario}`);
            }

            const internal_user_id = userData.id; 

            // 2. Eliminar los ítems del carrito usando el ID numérico interno
            const { error } = await supabase
                .from('carrito')
                .delete()
                .eq('id_usuario', internal_user_id); 

            if (error) {
                console.error('Error clearing user cart:', error);
                throw new Error(`Failed to clear user cart: ${error.message}`);
            }
            return { message: 'User cart cleared successfully.' };
        } catch (e) {
            console.error('Exception in clearUserCart service:', e);
            throw e;
        }
    }
};

export default carritoService;