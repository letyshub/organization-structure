import { Router } from 'express';
import { getPositions, createPosition, updatePosition, deletePosition } from '../controllers/positionController';
import { authenticate, authorize } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', authenticate, getPositions);
router.post('/', authenticate, authorize([Role.ADMIN]), createPosition);
router.put('/:id', authenticate, authorize([Role.ADMIN]), updatePosition);
router.delete('/:id', authenticate, authorize([Role.ADMIN]), deletePosition);

export default router;
