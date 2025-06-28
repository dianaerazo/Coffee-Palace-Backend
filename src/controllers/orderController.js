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
};

export default orderController;