

import supabaseStorage from '../config/supabaseStorage.js'; 
import { v4 as uuidv4 } from 'uuid'; 

const BUCKET_NAME = 'product-images';

const imageUploadService = {
  /**
   
   * @param {Buffer} fileBuffer 
   * @param {string} mimeType 
   * @param {string} originalFileName 
   * @returns {Promise<string>} 
   */
  uploadImage: async (fileBuffer, mimeType, originalFileName) => {
    const fileExtension = originalFileName.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`; 

    try {
      const { data, error } = await supabaseStorage
        .storage
        .from(BUCKET_NAME)
        .upload(fileName, fileBuffer, {
          contentType: mimeType,
          upsert: false 
        });

      if (error) {
        console.error('Error al subir la imagen a Supabase Storage:', error);
        throw new Error(`Fallo al subir la imagen: ${error.message}`);
      }

      const { data: publicUrlData } = supabaseStorage
        .storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);

      if (!publicUrlData || !publicUrlData.publicUrl) {
        throw new Error('No se pudo obtener la URL pública de la imagen.');
      }

      console.log('Imagen subida con éxito. URL:', publicUrlData.publicUrl);
      return publicUrlData.publicUrl;
    } catch (e) {
      console.error('Error en imageUploadService.uploadImage:', e);
      throw e; 
    }
  }
};

export default imageUploadService;