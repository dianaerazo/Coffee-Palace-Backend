import comentariosService from '../services/comentariosService.js';
import supabase from '../config/supabase.js'
const comentariosController = {
    /**
     * Obtiene comentarios para un producto específico.
     * Ruta: GET /api/comentarios/producto/:idProducto
     * Espera: idProducto en los parámetros de la URL.
     */
    getComentariosByProductoId: async (req, res, next) => {
        try {
            const { idProducto } = req.params;
            if (!idProducto) {
                res.status(400);
                throw new Error('ID de producto es requerido.');
            }
            const comentarios = await comentariosService.getComentariosByProductoId(idProducto);
            res.status(200).json(comentarios);
        } catch (error) {
            next(error);
        }
    },

    /**
     * Añade un nuevo comentario.
     * Ruta: POST /api/comentarios
     * Espera: id_producto, texto, calificacion en el cuerpo de la solicitud.
     * El id_usuario (INT) se obtiene del token de autenticación (UUID) haciendo un lookup.
     */
    addComentario: async (req, res, next) => {
        try {
            const { id_producto, texto, calificacion } = req.body;

            // 1. Obtener el ID de autenticación (UUID) del usuario actual desde el token JWT
            const { data: { user }, error: authUserError } = await supabase.auth.getUser(req.headers.authorization?.split(' ')[1]);
            
            if (authUserError || !user) {
                res.status(401);
                throw new Error('Usuario no autenticado o token inválido.');
            }
            const authUserId = user.id; // Este es el UUID de Supabase Auth (e.g., 'abcdef-1234-...')

            // 2. Buscar el ID numérico (INT) de la tabla 'usuario' usando el 'auth_id' (UUID)
            const { data: userData, error: userLookupError } = await supabase
                .from('usuario')
                .select('id') // Seleccionamos el ID INT de la tabla 'usuario'
                .eq('auth_id', authUserId) // Buscamos por el 'auth_id' (UUID)
                .single();

            if (userLookupError || !userData) {
                // Esto podría pasar si un usuario se autentica pero aún no tiene un perfil en tu tabla 'usuario'.
                res.status(404);
                throw new Error('Perfil de usuario no encontrado en la tabla "usuario". Asegúrate de haber iniciado sesión y tener un perfil.');
            }
            const idUsuarioInt = userData.id; // ¡Este es el ID INT que necesitamos para comentario_producto!

            // Validaciones adicionales
            if (!id_producto || !texto || !calificacion || !idUsuarioInt) {
                res.status(400);
                throw new Error('ID de producto, texto, calificación y ID de usuario son requeridos para añadir un comentario.');
            }

            // 3. Llamar al servicio con el ID de usuario INT
            const nuevoComentario = await comentariosService.addComentario(idUsuarioInt, id_producto, texto, calificacion);
            res.status(201).json({ message: 'Comentario añadido exitosamente.', comentario: nuevoComentario });
        } catch (error) {
            next(error);
        }
    }
};

export default comentariosController;