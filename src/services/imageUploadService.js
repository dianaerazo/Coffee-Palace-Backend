// your-backend-project/src/services/imageUploadService.js
// Servicio que interactúa con Supabase Storage para subir imágenes.

import supabaseStorage from '../config/supabaseStorage.js'; // Importa el cliente de Storage
import { v4 as uuidv4 } from 'uuid'; // Para generar nombres de archivo únicos (npm install uuid)

// Asegúrate de tener un bucket público en Supabase, por ejemplo 'product-images'
const BUCKET_NAME = 'product-images'; // Reemplaza con el nombre de tu bucket de Supabase Storage

const imageUploadService = {
  /**
   * Sube un archivo de imagen a Supabase Storage.
   * @param {Buffer} fileBuffer - El contenido del archivo como un Buffer.
   * @param {string} mimeType - El tipo MIME del archivo (ej. 'image/jpeg', 'image/png').
   * @param {string} originalFileName - El nombre original del archivo (para la extensión).
   * @returns {Promise<string>} La URL pública de la imagen subida.
   */
  uploadImage: async (fileBuffer, mimeType, originalFileName) => {
    // Generar un nombre de archivo único para evitar colisiones
    const fileExtension = originalFileName.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`; // ej. 'a1b2c3d4-e5f6-7890-1234-567890abcdef.png'

    try {
      const { data, error } = await supabaseStorage
        .storage
        .from(BUCKET_NAME)
        .upload(fileName, fileBuffer, {
          contentType: mimeType,
          upsert: false // No sobrescribir si ya existe un archivo con el mismo nombre
        });

      if (error) {
        console.error('Error al subir la imagen a Supabase Storage:', error);
        throw new Error(`Fallo al subir la imagen: ${error.message}`);
      }

      // Obtener la URL pública de la imagen subida
      const { data: publicUrlData } = supabaseStorage
        .storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);

      if (!publicUrlData || !publicUrlData.publicUrl) {
        throw new Error('No se pudo obtener la URL pública de la imagen.');
      }

      console.log('Imagen subida con éxito. URL:', publicUrlData.publicUrl);
      return publicUrlData.publicUrl; // Retorna la URL pública
    } catch (e) {
      console.error('Error en imageUploadService.uploadImage:', e);
      throw e; // Relanza el error para que sea manejado por el controlador
    }
  }
};

export default imageUploadService;