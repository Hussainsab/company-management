
import express from 'express';
import userRoutes from './src/modules/user/user.routes'
import authRouter from './src/modules/auth/auth.routes'
import { authenticate } from './src/middlewares/auth.middleware';
const app = express();

app.use(express.json());

app.use('/auth',authRouter)
app.use('/users',authenticate, userRoutes)