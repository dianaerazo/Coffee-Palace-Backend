import userService from '../services/userService.js';

const userController = {

  getUsers: async (req, res, next) => {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users); 
    } catch (error) {
      next(error); 
    }
  },

  addUser: async (req, res, next) => {
    try {
      const newUser = await userService.addUser(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  },

 
  deleteUser: async (req, res, next) => {
    try {
      const { id } = req.params; 
      await userService.deleteUser(parseInt(id));
      res.status(204).send(); 
    } catch (error) {
      next(error);
    }
  },
  updateUserImage: async (req, res, next) => {
    try {
      const { email } = req.params; // Get email from URL parameters
      const { imagen } = req.body; // Get the new image URL from the request body

      if (!email || !imagen) {
        return res.status(400).json({ message: 'User email and image URL are required.' });
      }

      const updatedUser = await userService.updateUserImageByEmail(email, imagen);

      if (updatedUser) {
        res.status(200).json({ message: 'Profile image updated successfully.', user: updatedUser });
      } else {
        return res.status(404).json({ message: 'User not found or image could not be updated.' });
      }
    } catch (error) {
      next(error);
    }
  },

  // New method to get a user by email
  getUsuarioByEmail: async (req, res, next) => {
    try {
      const { correo } = req.query; // Expect 'correo' as a query parameter (e.g., /api/usuarios/profile-by-email?correo=test@example.com)
      if (!correo) {
        return res.status(400).json({ message: 'The "correo" query parameter is required.' });
      }
      const user = await userService.getUsuarioByEmail(correo);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'User not found.' });
      }
    } catch (error) {
      next(error);
    }
  }
};



export default userController;