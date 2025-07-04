import supabase from '../config/supabase.js';

const searchService = {
  /**
   *
   * @param {string} query - Término de búsqueda general (para nombres, categorías o ingredientes).
   * @param {string} categoryId - ID de la categoría de producto para filtrar.
   * @param {Array<string>} ingredientIds - IDs de ingredientes para filtrar recetas.
   * @returns {Promise<{products: Array, recipes: Array}>} Lista de productos y recetas que coinciden.
   */
  searchItems: async (query, categoryId, ingredientIds) => {
    let products = [];
    let recipes = [];
    let productError = null;
    let recipeError = null;

    // --- Búsqueda de Productos ---
    try {
      let productQuery = supabase.from('producto').select('*');

      // 1. Filtrar productos por nombre si hay un query
      if (query) {
        productQuery = productQuery.ilike('nombre', `%${query}%`);
      }

      // 2. Filtrar productos por categoryId (si se pasó desde el frontend)
      if (categoryId) {
        productQuery = productQuery.eq('id_categoria', categoryId);
      }

      
      if (query && !categoryId) { // Solo si no se ha filtrado ya por un categoryId explícito
        const { data: matchedCategories, error: catError } = await supabase
          .from('categoria')
          .select('id')
          .ilike('nombre', `%${query}%`); // Buscar categorías cuyo nombre contenga el query

        if (catError) {
          console.error('Error buscando categorías por nombre:', catError);
        } else if (matchedCategories && matchedCategories.length > 0) {
          const matchedCategoryIds = matchedCategories.map(cat => cat.id);
          
          const { data: productsByCategory, error: productsByCategoryError } = await supabase
            .from('producto')
            .select('*')
            .in('categoria', matchedCategoryIds); // Buscar productos que pertenecen a estas categorías

          if (productsByCategoryError) {
            console.error('Error buscando productos por categorías coincidentes:', productsByCategoryError);
          } else if (productsByCategory) {
            products.push(...productsByCategory);
          }
        }
      }

      const { data: queriedProducts, error: currentProductError } = await productQuery;
      if (currentProductError) {
        productError = currentProductError;
      } else {
        products.push(...(queriedProducts || []));
      }

    } catch (error) {
      console.error('Error general en la búsqueda de productos:', error);
      productError = error;
    }


    try {
     
      let recipeQuery = supabase
        .from('receta')
        .select(`
          *,
          receta_ingrediente(
            id_ingrediente
          )
        `);

      if (query) {
        recipeQuery = recipeQuery.ilike('nombre', `%${query}%`);
      }

      const { data: queriedRecipes, error: currentRecipeError } = await recipeQuery;
      if (currentRecipeError) {
        recipeError = currentRecipeError;
      } else {
        recipes.push(...(queriedRecipes || []));
      }

      if (ingredientIds && ingredientIds.length > 0) {
      
        recipes = recipes.filter(rec => {
          const recetaIngredientIds = rec.receta_ingrediente.map(ri => ri.id_ingrediente);
          return ingredientIds.some(id => recetaIngredientIds.includes(id));
        });
      }

     
      if (query && (!ingredientIds || ingredientIds.length === 0)) { // Solo si no se ha filtrado ya por ingredientIds explícitos
        const { data: matchedIngredients, error: ingError } = await supabase
          .from('ingrediente')
          .select('id')
          .ilike('nombre', `%${query}%`); // Buscar ingredientes cuyo nombre contenga el query

        if (ingError) {
          console.error('Error buscando ingredientes por nombre:', ingError);
        } else if (matchedIngredients && matchedIngredients.length > 0) {
          const matchedIngredientIds = matchedIngredients.map(ing => ing.id);

         
          const { data: recipesByIngredient, error: recipesByIngredientError } = await supabase
            .from('receta')
            .select(`
              *,
              receta_ingrediente!inner(
                id_ingrediente
              )
            `); 
         
          const { data: finalRecipesByIngredient, error: finalRecipesByIngredientError } = await supabase
            .from('receta')
            .select(`
              *,
              receta_ingrediente!inner(
                id_ingrediente
              )
            `)
            .in('receta_ingrediente.id_ingrediente', matchedIngredientIds);


          if (finalRecipesByIngredientError) { // Usar el nuevo nombre de variable
            console.error('Error buscando recetas por ingredientes coincidentes:', finalRecipesByIngredientError);
          } else if (finalRecipesByIngredient) { // Usar el nuevo nombre de variable
            recipes.push(...finalRecipesByIngredient);
          }
        }
      }

    } catch (error) {
      console.error('Error general en la búsqueda de recetas:', error);
      recipeError = error;
    }


    if (productError || recipeError) {
      throw new Error(`Fallo en la búsqueda: ${productError?.message || ''} ${recipeError?.message || ''}`.trim());
    }

    const uniqueProducts = Array.from(new Map(products.map(p => [p.id, p])).values());
    const uniqueRecipes = Array.from(new Map(recipes.map(r => [r.id, r])).values());

    return { products: uniqueProducts, recipes: uniqueRecipes };
  }
};

export default searchService;