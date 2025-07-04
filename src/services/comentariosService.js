import supabase from '../config/supabase.js'
const comentariosService = {
    getComentariosByProductoId: async (idProducto) => {
        try {
            const { data, error } = await supabase
                .from('comentario_producto')
                .select(`
                    id,
                    id_usuario,
                    id_producto,
                    texto,
                    calificacion,
                    usuario (
                        nombre,
                        imagen
                    )
                `) // <--- 'created_at' REMOVIDO de aquí
                .eq('id_producto', idProducto)
                // .order('created_at', { ascending: false }); // <--- REMOVIDO: Si no existe en la DB, no podemos ordenar por ella

            if (error) {
                console.error('[ComentariosService] Error al obtener comentarios:', error);
                throw new Error(`Error al obtener comentarios: ${error.message}`);
            }
            return data;
        } catch (e) {
            console.error('[ComentariosService] Excepción al obtener comentarios:', e.message);
            throw e;
        }
    },

    addComentario: async (idUsuario, idProducto, texto, calificacion) => {
        try {
            if (calificacion < 1 || calificacion > 5) {
                throw new Error('La calificación debe estar entre 1 y 5.');
            }

            const { data, error } = await supabase
                .from('comentario_producto')
                .insert([
                    {
                        id_usuario: idUsuario,
                        id_producto: idProducto,
                        texto: texto,
                        calificacion: calificacion
                    }
                ])
                .select(`
                    id,
                    id_usuario,
                    id_producto,
                    texto,
                    calificacion,
                    usuario (
                        nombre,
                        imagen
                    )
                `) // <--- 'created_at' REMOVIDO de aquí también
                .single();

            if (error) {
                console.error('[ComentariosService] Error al añadir comentario:', error);
                throw new Error(`Error al añadir comentario: ${error.message}`);
            }
            return data;
        } catch (e) {
            console.error('[ComentariosService] Excepción al añadir comentario:', e.message);
            throw e;
        }
    }
};

export default comentariosService;