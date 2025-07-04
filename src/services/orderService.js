import supabase from '../config/supabase.js';
import carritoService from './carritoService.js'; // Asegúrate de que esta importación sea correcta

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
            // Se asume que 'factura.id_usuario' es la columna correcta que referencia a 'usuario.id'
            const { data, error } = await supabase
                .from('orden_vendedor') // Start from the seller order
                .select(`
                    id,
                    estado,
                    id_factura,
                    factura(
                        id,
                        fecha,
                        usuarioId,
                        total_factura,
                        numero_factura,
                        usuario_obj:usuarioId(id,nombre,correo), 
                        detalle_factura(
                            id,
                            id_factura,
                            id_producto,
                            producto(id,nombre,descripcion,imagen,precio)
                        )
                    )
                `);

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

    /**
     * Crea una orden completa: factura, detalle_factura y orden_vendedor.
     * Después de la creación exitosa, vacía el carrito del usuario.
     * @param {string} auth_id_usuario - ID de autenticación del usuario (UUID de Supabase Auth).
     * @param {number} totalAmount - Monto total de la factura.
     * @param {Array<{productId: number, quantity: number}>} products - Lista de productos en la orden.
     * @returns {Promise<Object>} La factura creada.
     */
    createOrder: async (auth_id_usuario, totalAmount, products) => {
        const connection = supabase; // Usamos el cliente de Supabase

        try {
            // PASO CRÍTICO: Obtener el ID interno numérico del usuario
            // La columna 'usuario' de 'factura' espera un BIGINT que es el ID numérico de tu tabla 'usuario'
            const { data: userData, error: userError } = await connection
                .from('usuario')
                .select('id') // Selecciona el ID numérico interno
                .eq('auth_id', auth_id_usuario) // Filtra por el auth_id (UUID) proporcionado
                .single(); // Espera un único resultado

            if (userError || !userData) {
                console.error('Error finding user by auth_id in createOrder service:', userError);
                throw new Error(`Usuario no encontrado con auth ID: ${auth_id_usuario}`);
            }

            const internal_user_id = userData.id; // Este es el ID numérico que se usará en 'factura.id_usuario'

            // Generar número de factura (ejemplo simple, puedes mejorar la lógica)
            const numeroFactura = `FAC-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

            // 1. Crear la factura
            const { data: facturaData, error: facturaError } = await connection
                .from('factura')
                .insert([{
                    fecha: new Date().toISOString(), // Formato ISO para fecha/hora
                    usuarioId: internal_user_id, // ¡USAR EL ID NUMÉRICO AQUÍ!
                    total_factura: totalAmount,
                    numero_factura: numeroFactura
                }])
                .select(); // Necesitamos el ID de la factura creada para los detalles

            if (facturaError) {
                console.error('Error creating invoice (factura):', facturaError);
                throw new Error(`Failed to create invoice: ${facturaError.message}`);
            }
            const facturaId = facturaData[0].id;

            // 2. Crear los detalles de la factura
            const detalleFacturaEntries = [];
            products.forEach(p => {
                // Asumiendo que 'detalle_factura' tiene 'cantidad' o que cada instancia
                // de producto con cantidad N se representa por N filas si no hay columna 'cantidad'.
                // Si tu 'detalle_factura' tiene una columna 'cantidad', ajusta esto.
                // Si no tiene 'cantidad' y quieres una fila por producto, entonces quita el bucle for.
                for (let i = 0; i < p.quantity; i++) { // Este bucle insertará una fila por cada unidad del producto.
                    detalleFacturaEntries.push({
                        id_factura: facturaId,
                        id_producto: p.productId
                    });
                }
            });

            if (detalleFacturaEntries.length > 0) {
                const { error: detalleError } = await connection
                    .from('detalle_factura')
                    .insert(detalleFacturaEntries);

                if (detalleError) {
                    console.error('Error creating invoice details (detalle_factura):', detalleError);
                    // Importante: Si los detalles fallan, revertir la factura principal
                    await connection.from('factura').delete().eq('id', facturaId);
                    throw new Error(`Failed to create invoice details: ${detalleError.message}`);
                }
            }


            // 3. Crear la orden del vendedor (orden_vendedor)
            // Esta tabla enlaza la factura con el estado para el vendedor.
            const { data: ordenVendedorData, error: ordenVendedorError } = await connection
                .from('orden_vendedor')
                .insert([{
                    id_factura: facturaId,
                    estado: 'pendiente' // Estado inicial de la orden del vendedor
                }])
                .select();

            if (ordenVendedorError) {
                console.error('Error creating seller order (orden_vendedor):', ordenVendedorError);
                // Importante: Si la orden_vendedor falla, revertir factura y detalles
                await connection.from('detalle_factura').delete().eq('id_factura', facturaId);
                await connection.from('factura').delete().eq('id', facturaId);
                throw new Error(`Failed to create seller order: ${ordenVendedorError.message}`);
            }

            // 4. Vaciar el carrito del usuario
            // Se asume que carritoService.clearUserCart acepta el auth_id_usuario
            await carritoService.clearUserCart(auth_id_usuario);

            return facturaData[0]; // Devuelve la factura creada
        } catch (e) {
            console.error('Exception in createOrder service:', e);
            throw e;
        }
    },

    /**
     * Obtiene las órdenes de un usuario específico.
     * @param {string} auth_id_usuario - ID de autenticación del usuario (UUID de Supabase Auth).
     * @returns {Promise<Array>} Lista de órdenes del vendedor con sus detalles.
     */
    getUserOrders: async (auth_id_usuario) => {
        try {
            // También aquí necesitas el ID interno para filtrar por el usuario en la tabla 'factura'
            const { data: userData, error: userError } = await supabase
                .from('usuario')
                .select('id')
                .eq('auth_id', auth_id_usuario)
                .single();

            if (userError || !userData) {
                console.error('Error finding user by auth_id in getUserOrders service:', userError);
                throw new Error(`Usuario no encontrado con auth ID: ${auth_id_usuario}`);
            }
            const internal_user_id = userData.id;

            const { data, error } = await supabase
                .from('orden_vendedor')
                .select(`
                    id,
                    estado,
                    id_factura,
                    factura(
                        id,
                        fecha,
                        usuarioId, 
                        total_factura,
                        numero_factura,
                        usuario_obj:usuarioId(id,nombre,correo), 
                        detalle_factura(
                            id,
                            id_factura,
                            id_producto,
                            producto(id, nombre, precio, imagen)
                        )
                    )
                `)
                .eq('factura.usuarioId', internal_user_id); // Filtra por el ID interno del usuario en la tabla 'factura'

            if (error) {
                console.error(`Error in getUserOrders service for user ${auth_id_usuario}:`, error);
                throw new Error(`Failed to fetch user orders: ${error.message}`);
            }
            return data;
        } catch (e) {
            console.error('Exception in getUserOrders service:', e);
            throw e;
        }
    }
};
//id_usuario
export default orderService;