import supabase from '../config/supabase.js';

const orderService = {
  /**
   * Fetches all seller orders with nested invoice, invoice details, and product info.
   * Supabase syntax for deep joins is 'tableName!fkColumn(fields)'.
   * 'detalle_factura!id_factura(id, id_producto, producto(*))' means:
   * - from 'detalle_factura'
   * - linked by 'id_factura' (to 'factura' table, implied)
   * - select 'id', 'id_producto' from 'detalle_factura'
   * - also select all fields from 'producto' table, linked by 'id_producto' (implied by Supabase relationship)
   *
   * @returns {Promise<Array>} A list of orders with detailed nested information.
   */
  getAllOrdersWithDetails: async () => {
    try {
      const { data, error } = await supabase
        .from('orden_vendedor') // Start from the seller order
        // Limpiamos la cadena de consulta a UNA SOLA LÍNEA (sin comentarios // o saltos de línea / espacios extra)
        .select(`id,estado,id_factura,factura(id,fecha,usuarioId,total_factura,numero_factura,usuario(id,nombre,correo),detalle_factura(id,id_factura,id_producto,producto(id,nombre,descripcion,imagen,precio)))`);

      if (error) {
        console.error('Error in getAllOrdersWithDetails service:', error);
        throw new Error(`Failed to fetch orders with details: ${error.message}`);
      }
      return data;
    } catch (e) {
      console.error('Exception in getAllOrdersWithDetails service:', e);
      throw e;
    }
  },

  /**
   * Updates the 'estado' (status) of a specific seller order.
   * @param {number} orderId - The ID of the seller order to update.
   * @param {string} newEstado - The new status ('pendiente' or 'listo').
   * @returns {Promise<Object>} The updated order object.
   */
  updateOrderStatus: async (orderId, newEstado) => {
    try {
      const { data, error } = await supabase
        .from('orden_vendedor')
        .update({ estado: newEstado })
        .eq('id', orderId)
        .select();

      if (error) {
        console.error(`Error updating order status for ID ${orderId}:`, error);
        throw new Error(`Failed to update order status: ${error.message}`);
      }
      if (!data || data.length === 0) {
        throw new Error(`Order with ID ${orderId} not found.`);
      }
      return data[0];
    } catch (e) {
      console.error('Exception in updateOrderStatus service:', e);
      throw e;
    }
  },
};

export default orderService;