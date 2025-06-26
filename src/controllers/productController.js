// your-backend-project/src/controllers/productController.js
// Logic for handling HTTP requests for products, calling the service, and sending responses.

import productService from '../services/productService.js'; // Import the product service

const productController = {
  // Handler for GET /api/products
  getProducts: async (req, res, next) => {
    try {
      const products = await productService.getAllProducts(); // Call the service
      res.status(200).json(products); // Send data as JSON response with 200 (OK) status
    } catch (error) {
      next(error); // Pass the error to the error handling middleware
    }
  },

  // Handler for POST /api/products
  addProduct: async (req, res, next) => {
    try {
      const productData = req.body; // Expects JSON product data in the request body

      // Basic input validation
      if (!productData.nombre || !productData.descripcion || !productData.precio || !productData.categoria) {
        res.status(400); // Bad Request
        throw new Error('Product name, description, price, and category are required.');
      }
      if (isNaN(parseFloat(productData.precio))) {
        res.status(400);
        throw new Error('Product price must be a valid number.');
      }

      const newProduct = await productService.addProduct(productData); // Call the service with data
      res.status(201).json(newProduct); // Send the new product with 201 (Created) status
    } catch (error) {
      next(error);
    }
  },

  // Handler for GET /api/products/categories (for fetching categories to associate with a product)
  getCategoriasProduct: async (req, res, next) => {
    try {
      const categories = await productService.getCategoriasForProduct(); // Call the service
      res.status(200).json(categories); // Send categories as JSON response
    } catch (error) {
      next(error);
    }
  },

  // Handler for DELETE /api/products/:id
  deleteProduct: async (req, res, next) => {
    try {
      const { id } = req.params; // Get ID from URL parameters

      // Validate that the ID is a number before passing it to the service
      if (isNaN(parseInt(id))) {
        res.status(400);
        throw new Error('Invalid product ID provided.');
      }

      await productService.deleteProduct(parseInt(id)); // Call service to delete, parsing ID to integer
      res.status(204).send(); // Send 204 (No Content) status for successful deletion
    } catch (error) {
      next(error);
    }
  },
};

// Export the controller object as the default export for ES modules.
export default productController;