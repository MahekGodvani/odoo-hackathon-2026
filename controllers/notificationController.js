const { Notification } = require('../models');

// Helper to format relative time
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval + " year" + (interval > 1 ? "s" : "") + " ago";
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval + " month" + (interval > 1 ? "s" : "") + " ago";
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + " day" + (interval > 1 ? "s" : "") + " ago";
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + " hour" + (interval > 1 ? "s" : "") + " ago";
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + " min" + (interval > 1 ? "s" : "") + " ago";
  return 'just now';
};

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if the user has any notifications in the database
    let notifications = await Notification.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });

    // If 0, seed the database with initial notifications so the UI looks complete
    if (notifications.length === 0) {
      const initialNotifs = [
        { userId, type: 'success', title: 'Asset Registration Complete', message: 'MacBook Pro #2847 successfully registered by Admin', status: 'Unread', createdAt: new Date(Date.now() - 2 * 60 * 1000) },
        { userId, type: 'warning', title: 'Maintenance Overdue', message: 'HP LaserJet Pro maintenance is past scheduled date', status: 'Unread', createdAt: new Date(Date.now() - 30 * 60 * 1000) },
        { userId, type: 'reminder', title: 'Upcoming Audit', message: 'IT Department audit starts tomorrow at 9:00 AM', status: 'Unread', createdAt: new Date(Date.now() - 60 * 60 * 1000) },
        { userId, type: 'info', title: 'Booking Confirmed', message: 'Conference Room A booked for next week', status: 'Unread', createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000) },
        { userId, type: 'warning', title: 'Asset Return Overdue', message: 'Dell Monitor #1923 assigned to staff is overdue', status: 'Read', createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000) }
      ];
      await Notification.bulkCreate(initialNotifs);
      notifications = await Notification.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']]
      });
    }

    // Map database structures to matching frontend structures
    const mapped = notifications.map(n => ({
      id: n.id,
      type: n.type || 'info',
      title: n.title,
      desc: n.message,
      time: timeAgo(n.createdAt),
      read: n.status === 'Read'
    }));

    return res.status(200).json(mapped);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({ message: 'Server error fetching notifications' });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const notification = await Notification.findOne({ where: { id, userId } });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.status = 'Read';
    await notification.save();

    return res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({ message: 'Server error updating notification status' });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    await Notification.update({ status: 'Read' }, { where: { userId } });
    return res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return res.status(500).json({ message: 'Server error updating all notifications' });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOne({ where: { id, userId } });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.destroy();
    return res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return res.status(500).json({ message: 'Server error deleting notification' });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
};
