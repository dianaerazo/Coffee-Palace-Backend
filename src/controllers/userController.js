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
};

export default userController;