// your-backend-project/src/services/recetaService.js
// Maneja la lógica de negocio y la interacción con Supabase para 'receta' y 'receta_ingrediente'.

import supabase from '../config/supabase.js'; // Importa el cliente de Supabase

const recetaService = {
  /**
   * Obtiene todos los ingredientes disponibles para usar en recetas.
   * @returns {Promise<Array>} Lista de ingredientes.
   */
  getAllIngredientesForReceta: async () => {
    const { data, error } = await supabase
      .from('ingrediente')
      .select('*');

    if (error) {
      console.error('Error en getAllIngredientesForReceta service:', error);
      throw new Error(`Fallo al obtener ingredientes: ${error.message}`);
    }
    return data;
  },

  /**
   * Agrega una nueva receta y asocia sus ingredientes.
   * @param {Object} recetaData - Datos de la receta (nombre, descripcion, imagen, instrucciones).
   * @param {Array<number>} ingredientesIds - IDs de los ingredientes seleccionados.
   * @returns {Promise<Object>} La receta insertada.
   */
  addReceta: async (recetaData, ingredientesIds) => {
    // 1. Insertar la Receta en la tabla 'receta'
    const { data: insertedReceta, error: recetaError } = await supabase
      .from('receta')
      .insert([recetaData])
      .select(); // Devolver el registro insertado para obtener el ID

    if (recetaError) {
      console.error('Error al insertar receta:', recetaError);
      throw new Error(`Fallo al agregar la receta: ${recetaError.message}`);
    }

    const recetaId = insertedReceta[0].id; // Obtener el ID de la receta recién creada

    // 2. Preparar los datos para la tabla pivote 'receta_ingrediente'
    const relacionesIngredientes = ingredientesIds.map(ingredienteId => ({
      id_receta: recetaId,
      id_ingrediente: ingredienteId,
    }));

    // 3. Insertar las relaciones en la tabla 'receta_ingrediente'
    const { data: insertedRelations, error: relationsError } = await supabase
      .from('receta_ingrediente')
      .insert(relacionesIngredientes)
      .select();

    if (relationsError) {
      console.error('Error al insertar relaciones de receta_ingrediente:', relationsError);
      // Opcional: Si falla la inserción de relaciones, podrías querer borrar la receta que acabas de crear
      // await supabase.from('receta').delete().eq('id', recetaId);
      throw new Error(`Fallo al agregar los ingredientes de la receta: ${relationsError.message}`);
    }

    return insertedReceta[0]; // Devuelve la receta creada
  },

  /**
   * Obtiene todas las recetas, posiblemente con sus ingredientes asociados (si se hace un JOIN en el futuro).
   * Por ahora, selecciona solo las columnas de la receta.
   * @returns {Promise<Array>} Lista de recetas.
   */
  getAllRecetas: async () => {
    const { data, error } = await supabase
      .from('receta')
      .select('*'); // Selecciona todas las columnas de la receta. Para ingredientes, necesitarías otra query o JOIN.

    if (error) {
      console.error('Error en getAllRecetas service:', error);
      throw new Error(`Fallo al obtener recetas: ${error.message}`);
    }
    return data;
  },

  /**
   * Obtiene todas las relaciones de receta_ingrediente.
   * Útil para mapear ingredientes a recetas si no se hace un JOIN directo al obtener todas las recetas.
   * @returns {Promise<Array>} Lista de objetos { id, id_receta, id_ingrediente }.
   */
  getAllRecetaIngredienteRelations: async () => {
    const { data, error } = await supabase
      .from('receta_ingrediente')
      .select('*'); // Selecciona todas las columnas de la tabla pivote

    if (error) {
      console.error('Error en getAllRecetaIngredienteRelations service:', error);
      throw new Error(`Fallo al obtener relaciones receta-ingrediente: ${error.message}`);
    }
    return data;
  },

  /**
   * Elimina una receta y sus relaciones con ingredientes.
   * @param {number} idReceta - ID de la receta a eliminar.
   * @returns {Promise<Object>} Mensaje de éxito.
   */
  deleteReceta: async (idReceta) => {
    // Inicia una transacción si quieres asegurar que ambos borrados ocurran o ninguno.
    // Supabase no tiene transacciones en tiempo real en JS SDK para Storage, pero para DB sí.
    // Esto es un borrado en cascada manual.

    // Primero, eliminar las relaciones en la tabla pivote
    const { error: deleteRelationsError } = await supabase
      .from('receta_ingrediente')
      .delete()
      .eq('id_receta', idReceta);

    if (deleteRelationsError) {
      console.error(`Error al eliminar relaciones de receta_ingrediente para ID ${idReceta}:`, deleteRelationsError);
      throw new Error(`Fallo al eliminar relaciones de receta: ${deleteRelationsError.message}`);
    }

    // Luego, eliminar la receta principal
    const { error: deleteRecetaError } = await supabase
      .from('receta')
      .delete()
      .eq('id', idReceta);

    if (deleteRecetaError) {
      console.error(`Error al eliminar receta con ID ${idReceta}:`, deleteRecetaError);
      throw new Error(`Fallo al eliminar la receta: ${deleteRecetaError.message}`);
    }

    return { message: 'Receta eliminada correctamente' };
  },
};

export default recetaService;