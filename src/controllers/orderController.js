// your-backend-project/src/controllers/orderController.js
import orderService from '../services/orderService.js';

const orderController = {
  // Handler for GET /api/orders
  getOrders: async (req, res, next) => {
    try {
      const orders = await orderService.getAllOrdersWithDetails();
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  },

  // Handler for PATCH /api/orders/:id/status
  updateOrderStatus: async (req, res, next) => {
    try {
      const { id } = req.params; // Order ID from URL
      const { estado } = req.body; // New status from request body

      // Basic validation
      if (!id || isNaN(parseInt(id))) {
        res.status(400);
        throw new Error('ID de orden inválido.');
      }
      if (!estado || (estado !== 'pendiente' && estado !== 'listo')) {
        res.status(400);
        throw new Error('El estado debe ser "pendiente" o "listo".');
      }

      const updatedOrder = await orderService.updateOrderStatus(parseInt(id), estado);
      res.status(200).json(updatedOrder); // Return the updated order
    } catch (error) {
      next(error);
    }
  },
   /**
     * Handler for POST /api/ordenes (create a new order)
     * @body {string} userId - ID del usuario
     * @body {number} totalAmount - Monto total de la orden
     * @body {Array<{productId: number, quantity: number}>} products - Lista de productos en la orden
     */
    createOrder: async (req, res, next) => {
        try {
            const { userId, totalAmount, products } = req.body;

            if (!userId || !totalAmount || !products || !Array.isArray(products) || products.length === 0) {
                res.status(400);
                throw new Error('Datos de orden incompletos o inválidos.');
            }

            const newInvoice = await orderService.createOrder(userId, totalAmount, products);
            res.status(201).json({ message: 'Orden creada exitosamente', invoice: newInvoice });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Handler for GET /api/ordenes/user/:userId (get orders for a specific user)
     * @param {string} req.params.userId - ID del usuario
     */
    getUserOrders: async (req, res, next) => {
        try {
            const { userId } = req.params;
            const orders = await orderService.getUserOrders(userId);
            res.status(200).json(orders);
        } catch (error) {
            next(error);
        }
    },

};

export default orderController;