import express from 'express';
import UserController from './user.controller';

const router  = express.Router();

router.get('/',UserController.getUsers)

router.post('/',UserController.createUser)

router.get('/:id', UserController.getUser)

export default router;