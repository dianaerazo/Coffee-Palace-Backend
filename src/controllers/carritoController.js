import checkoutService from '../services/carritoService.js';

const checkoutController = {
    createOrder: async (req, res, next) => {
        try {
            const { userId } = req.body;

            if (!userId || isNaN(parseInt(userId))) {
                res.status(400);
                throw new Error('Se requiere un userId numérico válido.');
            }

            const orderId = await checkoutService.createOrder(parseInt(userId));
            res.status(201).json({ orderId });
        } catch (error) {
            next(error);
        }
    },

    captureOrder: async (req, res, next) => {
        try {
            const { userId, orderId } = req.body;

            if (!userId || isNaN(parseInt(userId))) {
                res.status(400);
                throw new Error('Se requiere un userId numérico válido.');
            }
            if (!orderId || typeof orderId !== 'string') {
                res.status(400);
                throw new Error('orderId es obligatorio y debe ser una cadena.');
            }

            const result = await checkoutService.captureOrder(
                parseInt(userId),
                orderId,
            );
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
};

export default checkoutController;