import Notification from '../models/Notification.js';
import { mockDB, generateId } from '../config/mockDB.js';

export const createNotification = async (req, res) => {
  try {
    const { userId, title, message, type, notificationMethod } = req.body;

    try {
      const notification = new Notification({
        userId,
        title,
        message,
        type: type || 'general',
        notificationMethod: notificationMethod || 'in_app',
      });

      await notification.save();

      return res.status(201).json({
        message: 'Notification created successfully',
        notification,
      });
    } catch (mongoError) {
      // Fall back to mock DB
      const notification = {
        _id: generateId(),
        userId,
        title,
        message,
        type: type || 'general',
        notificationMethod: notificationMethod || 'in_app',
        isRead: false,
        createdAt: new Date(),
      };
      mockDB.notifications.push(notification);
      return res.status(201).json({
        message: 'Notification created successfully (Demo)',
        notification,
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    try {
      const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
      return res.json(notifications);
    } catch (mongoError) {
      // Fall back to mock DB
      const notifications = mockDB.notifications
        .filter(n => n.userId === userId)
        .sort((a, b) => b.createdAt - a.createdAt);
      return res.json(notifications);
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    try {
      const notification = await Notification.findByIdAndUpdate(
        notificationId,
        {
          isRead: true,
          readAt: new Date(),
        },
        { new: true }
      );

      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }

      return res.json({
        message: 'Notification marked as read',
        notification,
      });
    } catch (mongoError) {
      // Fall back to mock DB
      const notificationIndex = mockDB.notifications.findIndex(n => n._id === notificationId);
      if (notificationIndex === -1) {
        return res.status(404).json({ message: 'Notification not found' });
      }

      const notification = {
        ...mockDB.notifications[notificationIndex],
        isRead: true,
        readAt: new Date(),
      };
      mockDB.notifications[notificationIndex] = notification;

      return res.json({
        message: 'Notification marked as read (Demo)',
        notification,
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getUnreadNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    try {
      const notifications = await Notification.find({ userId, isRead: false });
      return res.json(notifications);
    } catch (mongoError) {
      // Fall back to mock DB
      const notifications = mockDB.notifications.filter(n => n.userId === userId && !n.isRead);
      return res.json(notifications);
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    try {
      const notification = await Notification.findByIdAndDelete(notificationId);
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }
      return res.json({ message: 'Notification deleted successfully' });
    } catch (mongoError) {
      // Fall back to mock DB
      const index = mockDB.notifications.findIndex(n => n._id === notificationId);
      if (index === -1) {
        return res.status(404).json({ message: 'Notification not found' });
      }
      mockDB.notifications.splice(index, 1);
      return res.json({ message: 'Notification deleted successfully (Demo)' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
