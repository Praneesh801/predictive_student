import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['placement_eligible', 'placement_drive', 'placement_result', 'skill_improvement', 'general'],
    default: 'general',
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  notificationMethod: {
    type: String,
    enum: ['email', 'in_app', 'both'],
    default: 'in_app',
  },
  relatedId: mongoose.Schema.Types.ObjectId,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  readAt: Date,
});

const Notification = mongoose.model('Notification', NotificationSchema);
export default Notification;
