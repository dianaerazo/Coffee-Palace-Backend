const supabase = require('../config/config');

const uploadUserSupabase = async (req, res, next) => {
  try {
    if (!req.file) return next();

    const file = req.file;
    const filePath = `avatars/${Date.now()}-${file.originalname}`;

    const { error } = await supabase.storage
      .from('usersavatar')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      console.error('Error al subir imagen a Supabase:', error);
      return res.status(500).json({ error: 'Error al subir imagen a Supabase' });
    }

    const { data: publicUrlData } = supabase.storage
      .from('usersavatar')
      .getPublicUrl(filePath);

    req.avatarUrl = publicUrlData.publicUrl;
    next();
  } catch (err) {
    console.error('Middleware error:', err);
    res.status(500).json({ error: 'Error interno al procesar imagen de avatar' });
  }
};

module.exports = uploadUserSupabase;
