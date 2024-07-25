import express from 'express';
const router = express.Router();
import userRouter from './user';
import jobRouter from './job';

router.get('/', (req, res) => {
  return res.status(200).json({
    message: 'server is running 🚀'
  });
});
router.use('/', userRouter);
router.use('/', jobRouter);

export default router;
