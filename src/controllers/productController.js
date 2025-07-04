
import productService from '../services/productService.js'; 
const productController = {
  getProducts: async (req, res, next) => {
    try {
      const products = await productService.getAllProducts(); 
      res.status(200).json(products); 
    } catch (error) {
      next(error); 
    }
  },

  addProduct: async (req, res, next) => {
    try {
      const productData = req.body; 
      if (!productData.nombre || !productData.descripcion || !productData.precio || !productData.categoria) {
        res.status(400); 
        throw new Error('Product name, description, price, and category are required.');
      }
      if (isNaN(parseFloat(productData.precio))) {
        res.status(400);
        throw new Error('Product price must be a valid number.');
      }

      const newProduct = await productService.addProduct(productData); 
      res.status(201).json(newProduct); 
    } catch (error) {
      next(error);
    }
  },
  getProductById: async (req, res, next) => { // Agrega 'next' para manejo de errores
    try {
      const productId = req.params.id;
      
      // Valida que el ID sea un número si es necesario
      if (isNaN(parseInt(productId))) {
        return res.status(400).json({ message: 'ID de producto inválido.' });
      }

      // ¡¡¡LLAMA AL SERVICIO REAL!!!
      const product = await productService.getProductById(parseInt(productId)); 

      if (product) {
        res.status(200).json(product);
      } else {
        // Si el servicio devuelve null, significa que el producto no fue encontrado
        res.status(404).json({ message: 'Producto no encontrado.' });
      }
    } catch (error) {
      console.error('Error al obtener el producto por ID en el controlador:', error);
      next(error); // Pasa el error al siguiente middleware de manejo de errores
    }
  },


  getCategoriasProduct: async (req, res, next) => {
    try {
      const categories = await productService.getCategoriasForProduct();
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  },

  deleteProduct: async (req, res, next) => {
    try {
      const { id } = req.params; 

      if (isNaN(parseInt(id))) {
        res.status(400);
        throw new Error('Invalid product ID provided.');
      }

      await productService.deleteProduct(parseInt(id)); 
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};

export default productController;