
import { Router } from 'express';
import Joi from 'joi';
import { NotificationService } from '../services/NotificationService';
import { validateRequest } from '../middleware/validation';

const router = Router();
const notificationService = NotificationService.getInstance();

const sendNotificationSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  type: Joi.string().valid('email', 'sms', 'push').required(),
  channel: Joi.string().required(),
  subject: Joi.string().optional(),
  message: Joi.string().required(),
  templateId: Joi.string().optional(),
  templateData: Joi.object().optional(),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
  scheduledAt: Joi.date().optional(),
  metadata: Joi.object().optional()
});

router.post('/send', validateRequest(sendNotificationSchema), async (req, res) => {
  try {
    await notificationService.sendNotification(req.body);
    
    res.json({
      success: true,
      message: 'Notification queued successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
