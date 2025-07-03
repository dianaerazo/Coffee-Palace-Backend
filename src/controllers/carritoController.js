// your-backend-project/src/controllers/carritoController.js
import carritoService from '../services/carritoService.js';

const carritoController = {
    /**
     * Añade una unidad de producto al carrito.
     * POST /api/carrito
     * @body {string} id_producto - ID del producto a añadir.
     * @body {string} auth_id_usuario - ID de autenticación del usuario (UUID de Firebase/Supabase).
     */
    addCartItem: async (req, res, next) => {
        try {
            const { id_producto, id_usuario: auth_id_usuario } = req.body;

            if (!id_producto || !auth_id_usuario) {
                res.status(400);
                throw new Error('id_producto y id_usuario (auth ID) son requeridos.');
            }

            const newCartItem = await carritoService.addCartItem(id_producto, auth_id_usuario);
            res.status(201).json(newCartItem);
        } catch (error) {
            next(error);
        }
    },

    /**
     * Obtiene todos los ítems del carrito para un usuario.
     * GET /api/carrito/user/:authId
     * @param {string} req.params.authId - ID de autenticación del usuario (UUID).
     */
    getCartItemsForUser: async (req, res, next) => {
        try {
            // CORRECCIÓN: Extraemos 'authId' porque así se llama en la ruta

            const { authId } = req.params; // <-- ¡CAMBIO AQUÍ!


            if (!authId || typeof authId !== 'string' || authId.length === 0) { // <-- ¡CAMBIO AQUÍ!
                res.status(400);
                throw new Error('ID de autenticación de usuario (authId) es requerido y debe ser una cadena válida.'); // Mensaje de error ajustado
            }

            // Pasamos el authId al servicio, que internamente lo llamará auth_id_usuario
            const cartItems = await carritoService.getRawCartItemsForUser(authId); // <-- ¡CAMBIO AQUÍ!
            res.status(200).json(cartItems);
        } catch (error) {
            next(error);
        }
    },

    /**
     * Elimina una entrada específica del carrito (una unidad de producto).
     * DELETE /api/carrito/:cartItemId
     * @param {number} req.params.cartItemId - ID de la entrada de carrito a eliminar.
     */
    deleteCartEntry: async (req, res, next) => {
        try {
            const { cartItemId } = req.params;
            if (!cartItemId || isNaN(parseInt(cartItemId))) {
                res.status(400);
                throw new Error('ID de entrada de carrito inválido.');
            }
            await carritoService.deleteCartEntry(parseInt(cartItemId));
            res.status(204).send(); // No Content
        } catch (error) {
            next(error);
        }
    },

    /**
     * Vacía todo el carrito de un usuario.
     * DELETE /api/carrito/user/:authId/clear
     * @param {string} req.params.authId - ID de autenticación del usuario (UUID).
     */
    clearUserCart: async (req, res, next) => {
        try {
            const { authId } = req.params;
            await carritoService.clearUserCart(authId);
            res.status(204).send(); // No Content
        } catch (error) {
            next(error);
        }
    }
};

export default carritoController;