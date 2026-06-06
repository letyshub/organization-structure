import { Router } from 'express';
import { getTeams, createTeam, updateTeam, deleteTeam } from '../controllers/teamController';
import { authenticate, authorize } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', authenticate, getTeams);
router.post('/', authenticate, authorize([Role.ADMIN]), createTeam);
router.put('/:id', authenticate, authorize([Role.ADMIN]), updateTeam);
router.delete('/:id', authenticate, authorize([Role.ADMIN]), deleteTeam);

export default router;
