import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './Analytics.css';

const Analytics = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('30d');
    const [data, setData] = useState({
        jobViews: 0,
        applications: 0,
        interviews: 0,
        hireRate: 0,
        topJobs: [],
        applicationTrend: [],
        skillDemand: []
    });

    useEffect(() => {
        fetchAnalyticsData();
    }, [timeRange, user]);

    const fetchAnalyticsData = async () => {
        try {
            setLoading(true);
            // In production, fetch from API
            // const response = await api.get(`/analytics?range=${timeRange}`);

            // Sample data for demonstration
            setData({
                jobViews: 2547,
                applications: 189,
                interviews: 23,
                hireRate: 12.2,
                topJobs: [
                    { title: 'Senior Frontend Developer', views: 856, applications: 67 },
                    { title: 'Full Stack Engineer', views: 623, applications: 45 },
                    { title: 'DevOps Engineer', views: 512, applications: 38 },
                    { title: 'UX Designer', views: 398, applications: 29 },
                    { title: 'Backend Developer', views: 287, applications: 21 }
                ],
                applicationTrend: [
                    { month: 'Jul', count: 45 },
                    { month: 'Aug', count: 52 },
                    { month: 'Sep', count: 48 },
                    { month: 'Oct', count: 71 },
                    { month: 'Nov', count: 85 },
                    { month: 'Dec', count: 89 }
                ],
                skillDemand: [
                    { skill: 'React', percentage: 85 },
                    { skill: 'TypeScript', percentage: 78 },
                    { skill: 'Node.js', percentage: 72 },
                    { skill: 'Python', percentage: 68 },
                    { skill: 'AWS', percentage: 62 }
                ]
            });
        } catch (err) {
            console.error('Error fetching analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    const maxTrend = Math.max(...data.applicationTrend.map(d => d.count));

    return (
        <div className="analytics-page">
            <div className="container">
                {/* Header */}
                <motion.div
                    className="analytics-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div>
                        <h1 className="text-gradient">Analytics Dashboard</h1>
                        <p>Track your recruitment performance and insights</p>
                    </div>
                    <div className="time-range-selector">
                        {['7d', '30d', '90d', '1y'].map(range => (
                            <button
                                key={range}
                                className={`range-btn ${timeRange === range ? 'active' : ''}`}
                                onClick={() => setTimeRange(range)}
                            >
                                {range === '7d' ? '7 Days' :
                                    range === '30d' ? '30 Days' :
                                        range === '90d' ? '90 Days' : 'Year'}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Stats Overview */}
                <motion.div
                    className="stats-overview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="stat-box glass-card">
                        <div className="stat-icon views">👁️</div>
                        <div className="stat-data">
                            <span className="stat-value">{data.jobViews.toLocaleString()}</span>
                            <span className="stat-label">Total Job Views</span>
                            <span className="stat-change positive">+12.5% from last period</span>
                        </div>
                    </div>
                    <div className="stat-box glass-card">
                        <div className="stat-icon applications">📝</div>
                        <div className="stat-data">
                            <span className="stat-value">{data.applications}</span>
                            <span className="stat-label">Applications</span>
                            <span className="stat-change positive">+8.3% from last period</span>
                        </div>
                    </div>
                    <div className="stat-box glass-card">
                        <div className="stat-icon interviews">📅</div>
                        <div className="stat-data">
                            <span className="stat-value">{data.interviews}</span>
                            <span className="stat-label">Interviews Scheduled</span>
                            <span className="stat-change positive">+15.2% from last period</span>
                        </div>
                    </div>
                    <div className="stat-box glass-card">
                        <div className="stat-icon hire-rate">✅</div>
                        <div className="stat-data">
                            <span className="stat-value">{data.hireRate}%</span>
                            <span className="stat-label">Hire Rate</span>
                            <span className="stat-change negative">-2.1% from last period</span>
                        </div>
                    </div>
                </motion.div>

                <div className="analytics-grid">
                    {/* Application Trend Chart */}
                    <motion.div
                        className="chart-card glass-card"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h3>Application Trend</h3>
                        <div className="bar-chart">
                            {data.applicationTrend.map((item, index) => (
                                <div key={index} className="bar-item">
                                    <div
                                        className="bar"
                                        style={{ height: `${(item.count / maxTrend) * 100}%` }}
                                    >
                                        <span className="bar-value">{item.count}</span>
                                    </div>
                                    <span className="bar-label">{item.month}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Top Performing Jobs */}
                    <motion.div
                        className="top-jobs-card glass-card"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h3>Top Performing Jobs</h3>
                        <div className="top-jobs-list">
                            {data.topJobs.map((job, index) => (
                                <div key={index} className="top-job-item">
                                    <span className="job-rank">#{index + 1}</span>
                                    <div className="job-details">
                                        <span className="job-title">{job.title}</span>
                                        <div className="job-stats">
                                            <span>👁️ {job.views}</span>
                                            <span>📝 {job.applications}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Skills in Demand */}
                    <motion.div
                        className="skills-card glass-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h3>Skills in Demand</h3>
                        <div className="skills-chart">
                            {data.skillDemand.map((skill, index) => (
                                <div key={index} className="skill-bar-item">
                                    <div className="skill-info">
                                        <span className="skill-name">{skill.skill}</span>
                                        <span className="skill-percent">{skill.percentage}%</span>
                                    </div>
                                    <div className="skill-bar-bg">
                                        <motion.div
                                            className="skill-bar-fill"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${skill.percentage}%` }}
                                            transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Insights */}
                    <motion.div
                        className="insights-card glass-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <h3>💡 Quick Insights</h3>
                        <div className="insights-list">
                            <div className="insight-item">
                                <span className="insight-icon success">📈</span>
                                <p>Application rate increased by <strong>23%</strong> this month</p>
                            </div>
                            <div className="insight-item">
                                <span className="insight-icon warning">⚡</span>
                                <p>Average time to hire: <strong>18 days</strong> (industry avg: 24)</p>
                            </div>
                            <div className="insight-item">
                                <span className="insight-icon info">🎯</span>
                                <p><strong>React</strong> developers are in highest demand</p>
                            </div>
                            <div className="insight-item">
                                <span className="insight-icon success">🌟</span>
                                <p>Your jobs have <strong>42% higher</strong> engagement than average</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
