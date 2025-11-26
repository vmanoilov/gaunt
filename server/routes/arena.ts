import express from 'express';
import { respondArena } from '../controllers/arenaController';

const router = express.Router();

router.post('/respond', respondArena);

export default router;
