// your-backend-project/src/controllers/searchController.js
import searchService from '../services/searchService.js'; // Asegúrate de que la importación sea correcta

const searchController = {
  searchItems: async (req, res, next) => {
    try {
      const { query, categoryId, ingredientIds } = req.query;

      // Convertir ingredientIds de string a array de IDs si viene como string separado por comas
      // Esto es importante si envías múltiples IDs de ingredientes desde el frontend en un solo parámetro de query
      let parsedIngredientIds = null;
      if (ingredientIds) {
        try {
          // Intenta parsear como JSON array (si el frontend lo envía así)
          parsedIngredientIds = JSON.parse(ingredientIds);
        } catch (e) {
          // Si no es JSON, asume que es una cadena separada por comas
          parsedIngredientIds = ingredientIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
        }
      }
      // Asegúrate de que categoryId sea un número si lo esperas así en el servicio
      const parsedCategoryId = categoryId ? parseInt(categoryId) : null;


      // *** LÍNEA CORREGIDA ***
      const results = await searchService.searchItems(query, parsedCategoryId, parsedIngredientIds);

      res.status(200).json(results);
    } catch (error) {
      console.error('Error in searchController.searchItems:', error);
      next(error);
    }
  }
};

export default searchController;