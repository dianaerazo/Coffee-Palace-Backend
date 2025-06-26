import express from 'express';
import cors from 'cors';
import mainRouter from './src/routes/index.js'; 
import errorHandler from './src/middlewares/errorHandler.js'; 

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', mainRouter);

app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use(errorHandler);

export default app;