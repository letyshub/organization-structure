import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';
import { Role } from '@prisma/client';
import { upload } from '../utils/upload';

const router = Router();

router.get('/', authenticate, getUsers);
router.get('/:id', authenticate, getUserById);
router.post('/', authenticate, authorize([Role.ADMIN, Role.EDITOR]), upload.single('photo'), createUser);
router.put('/:id', authenticate, authorize([Role.ADMIN, Role.EDITOR]), upload.single('photo'), updateUser);
router.delete('/:id', authenticate, authorize([Role.ADMIN, Role.EDITOR]), deleteUser);

export default router;
