import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import './Notifications.css';

const Notifications = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        fetchNotifications();

        // Close dropdown when clicking outside
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await api.get('/notifications');
            const notifs = response.data || [];
            setNotifications(notifs);
            setUnreadCount(notifs.filter(n => !n.read).length);
        } catch (err) {
            console.error('Error fetching notifications:', err);
            // Sample data for demonstration
            const sampleNotifications = [
                {
                    id: '1',
                    type: 'APPLICATION_STATUS',
                    title: 'Application Update',
                    message: 'Your application for Senior Frontend Developer has been reviewed',
                    read: false,
                    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                    link: '/applications'
                },
                {
                    id: '2',
                    type: 'INTERVIEW',
                    title: 'Interview Scheduled',
                    message: 'You have an interview scheduled for Dec 10th at 2:00 PM',
                    read: false,
                    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    link: '/applications'
                },
                {
                    id: '3',
                    type: 'JOB_MATCH',
                    title: 'New Job Match',
                    message: '5 new jobs match your profile and preferences',
                    read: true,
                    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                    link: '/jobs'
                },
                {
                    id: '4',
                    type: 'PROFILE',
                    title: 'Complete Your Profile',
                    message: 'Add your skills and experience to get better job matches',
                    read: true,
                    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
                    link: '/profile'
                }
            ];
            setNotifications(sampleNotifications);
            setUnreadCount(sampleNotifications.filter(n => !n.read).length);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            await api.put(`/notifications/${notificationId}/read`);
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Error marking notification as read:', err);
            // Update locally anyway for demo
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error('Error marking all as read:', err);
            // Update locally anyway for demo
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        }
    };

    const getNotificationIcon = (type) => {
        const icons = {
            APPLICATION_STATUS: '📝',
            APPLICATION_STATUS_CHANGED: '📋',
            APPLICATION_RECEIVED: '📥',
            INTERVIEW: '📅',
            JOB_MATCH: '🎯',
            JOB_RECOMMENDATION: '💡',
            PROFILE: '👤',
            MESSAGE: '💬',
            NEW_MESSAGE: '💬',
            SYSTEM: '🔔'
        };
        return icons[type] || '🔔';
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes}m ago`;

        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) return `${diffHours}h ago`;

        const diffDays = Math.floor(diffHours / 24);
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="notifications-container" ref={dropdownRef}>
            <button
                className="notifications-btn"
                onClick={() => setIsOpen(!isOpen)}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="22" height="22">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="notifications-dropdown glass"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="dropdown-header">
                            <h3>Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    className="mark-all-btn"
                                    onClick={markAllAsRead}
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>

                        <div className="notifications-list">
                            {loading ? (
                                <div className="loading-state">
                                    <div className="spinner"></div>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="empty-state">
                                    <span className="empty-icon">🔔</span>
                                    <p>No notifications yet</p>
                                </div>
                            ) : (
                                notifications.map(notification => (
                                    <Link
                                        key={notification.id}
                                        to={notification.link || '#'}
                                        className={`notification-item ${!notification.read ? 'unread' : ''}`}
                                        onClick={() => {
                                            markAsRead(notification.id);
                                            setIsOpen(false);
                                        }}
                                    >
                                        <span className="notification-icon">
                                            {getNotificationIcon(notification.type)}
                                        </span>
                                        <div className="notification-content">
                                            <span className="notification-title">
                                                {notification.title}
                                            </span>
                                            <p className="notification-message">
                                                {notification.message}
                                            </p>
                                            <span className="notification-time">
                                                {formatTime(notification.createdAt)}
                                            </span>
                                        </div>
                                        {!notification.read && (
                                            <span className="unread-dot"></span>
                                        )}
                                    </Link>
                                ))
                            )}
                        </div>

                        <Link
                            to="/notifications"
                            className="view-all-link"
                            onClick={() => setIsOpen(false)}
                        >
                            View all notifications
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Notifications;
