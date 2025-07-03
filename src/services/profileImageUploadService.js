import supabaseStorage from '../config/supabaseStorage.js';
import { v4 as uuidv4 } from 'uuid';

// Define el nombre del bucket para imágenes de perfil
const PROFILE_BUCKET_NAME = 'product-images'; // <-- Puedes cambiar esto a tu gusto

const profileImageUploadService = {
  /**
   * Sube una imagen de perfil a Supabase Storage.
   * La organiza en carpetas por authId del usuario.
   * @param {Buffer} fileBuffer - El buffer del archivo de la imagen.
   * @param {string} mimeType - El tipo MIME del archivo.
   * @param {string} originalFileName - El nombre original del archivo.
   * @param {string} authId - El ID de autenticación del usuario.
   * @returns {Promise<string>} - La URL pública de la imagen subida.
   */
  uploadProfileImage: async (fileBuffer, mimeType, originalFileName, authId) => {
    const fileExtension = originalFileName.split('.').pop();
    // Usa el authId para crear una carpeta específica para el usuario
    const fileNameInStorage = `${authId}/${uuidv4()}.${fileExtension}`;

    try {
      // Intenta subir al bucket de perfiles
      const { data, error } = await supabaseStorage
        .storage
        .from(PROFILE_BUCKET_NAME)
        .upload(fileNameInStorage, fileBuffer, {
          contentType: mimeType,
          upsert: true // Usamos upsert: true para permitir sobrescribir si el archivo ya existe (aunque con uuid es poco probable)
        });

      if (error) {
        console.error('Error al subir la imagen de perfil a Supabase Storage:', error);
        throw new Error(`Fallo al subir la imagen de perfil: ${error.message}`);
      }

      // Obtiene la URL pública
      const { data: publicUrlData } = supabaseStorage
        .storage
        .from(PROFILE_BUCKET_NAME)
        .getPublicUrl(fileNameInStorage);

      if (!publicUrlData || !publicUrlData.publicUrl) {
        throw new Error('No se pudo obtener la URL pública de la imagen de perfil.');
      }

      console.log('Imagen de perfil subida con éxito. URL:', publicUrlData.publicUrl);
      return publicUrlData.publicUrl;
    } catch (e) {
      console.error('Error en profileImageUploadService.uploadProfileImage:', e);
      throw e;
    }
  }
};

export default profileImageUploadService;