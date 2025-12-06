import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './Dashboard.css';

const EmployerDashboard = () => {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({
        activeJobs: 0,
        totalApplicants: 0,
        newToday: 0,
        interviews: 0
    });
    const [recentApplicants, setRecentApplicants] = useState([]);
    const [activeJobs, setActiveJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            // Fetch employer's jobs using correct userId field
            const jobsResponse = await api.get(`/jobs/employer/${user?.userId}`);
            const jobs = jobsResponse.data || [];

            // Fetch applications for each job to get real applicant data
            let allApplicants = [];
            let totalApplicantCount = 0;

            for (const job of jobs) {
                try {
                    const appsResponse = await api.get(`/applications/job/${job.id}`);
                    const apps = appsResponse.data || [];
                    totalApplicantCount += apps.length;
                    // Add recent applicants with job info
                    apps.forEach(app => {
                        allApplicants.push({
                            id: app.id,
                            name: app.applicant?.profile?.firstName
                                ? `${app.applicant.profile.firstName} ${app.applicant.profile.lastName || ''}`
                                : app.applicant?.email || 'Applicant',
                            position: job.title,
                            avatar: (app.applicant?.profile?.firstName?.[0] || app.applicant?.email?.[0] || 'A').toUpperCase(),
                            appliedAt: app.createdAt || app.appliedAt,
                            status: app.status || 'PENDING',
                            email: app.applicant?.email
                        });
                    });
                } catch (err) {
                    console.log(`No applications for job ${job.id}`);
                }
            }

            // Sort by applied date and take most recent 5
            allApplicants.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
            setRecentApplicants(allApplicants.slice(0, 5));

            setStats({
                activeJobs: jobs.length,
                totalApplicants: totalApplicantCount,
                newToday: allApplicants.filter(a => {
                    const today = new Date().toDateString();
                    return new Date(a.appliedAt).toDateString() === today;
                }).length,
                interviews: allApplicants.filter(a => a.status === 'INTERVIEW' || a.status === 'INTERVIEW_SCHEDULED').length
            });

            setActiveJobs(jobs.slice(0, 3));
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            // Use sample data
            setStats({ activeJobs: 0, totalApplicants: 0, newToday: 0, interviews: 0 });
            setActiveJobs([]);
            setRecentApplicants([]);
        }

        setLoading(false);
    };

    const getStatusColor = (status) => {
        const colors = {
            NEW: 'accent',
            REVIEWING: 'primary',
            SHORTLISTED: 'success',
            REJECTED: 'danger'
        };
        return colors[status] || 'primary';
    };

    return (
        <div className="dashboard-page employer">
            <div className="container">
                {/* Header */}
                <motion.div
                    className="dashboard-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="welcome-section">
                        <h1>Welcome back, <span className="text-gradient">{user?.firstName}</span>! 🏢</h1>
                        <p>Manage your job postings and find top talent</p>
                    </div>
                    <div className="header-actions">
                        <Link to="/jobs/create" className="btn btn-primary">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="18" height="18">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Post New Job
                        </Link>
                        <button onClick={logout} className="btn btn-secondary">
                            Logout
                        </button>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    className="stats-grid"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="stat-card glass-card">
                        <div className="stat-icon blue">💼</div>
                        <div className="stat-content">
                            <span className="stat-value">{stats.activeJobs}</span>
                            <span className="stat-label">Active Jobs</span>
                        </div>
                    </div>
                    <div className="stat-card glass-card">
                        <div className="stat-icon green">👥</div>
                        <div className="stat-content">
                            <span className="stat-value">{stats.totalApplicants}</span>
                            <span className="stat-label">Total Applicants</span>
                        </div>
                    </div>
                    <div className="stat-card glass-card">
                        <div className="stat-icon purple">🆕</div>
                        <div className="stat-content">
                            <span className="stat-value">{stats.newToday}</span>
                            <span className="stat-label">New Today</span>
                        </div>
                    </div>
                    <div className="stat-card glass-card">
                        <div className="stat-icon orange">📅</div>
                        <div className="stat-content">
                            <span className="stat-value">{stats.interviews}</span>
                            <span className="stat-label">Interviews Scheduled</span>
                        </div>
                    </div>
                </motion.div>

                <div className="dashboard-grid">
                    {/* Recent Applicants */}
                    <motion.div
                        className="dashboard-card glass-card"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="card-header">
                            <h2>Recent Applicants</h2>
                            <Link to="/applications" className="view-all">View All →</Link>
                        </div>
                        <div className="applicants-list">
                            {recentApplicants.map(applicant => (
                                <div key={applicant.id} className="applicant-item">
                                    <div className="applicant-avatar">
                                        {applicant.avatar}
                                    </div>
                                    <div className="applicant-info">
                                        <h4>{applicant.name}</h4>
                                        <p>Applied for {applicant.position}</p>
                                    </div>
                                    <span className={`status-badge status-${getStatusColor(applicant.status)}`}>
                                        {applicant.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Active Jobs */}
                    <motion.div
                        className="dashboard-card glass-card"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="card-header">
                            <h2>Your Active Jobs</h2>
                            <Link to="/jobs" className="view-all">Manage Jobs →</Link>
                        </div>
                        <div className="active-jobs-list">
                            {activeJobs.map(job => (
                                <Link key={job.id} to={`/jobs/${job.id}`} className="active-job-item">
                                    <div className="job-info">
                                        <h4>{job.title}</h4>
                                        <div className="job-meta">
                                            <span className="applicants-count">
                                                👥 {job.applicants || 0} applicants
                                            </span>
                                            <span className={`status-indicator ${job.status?.toLowerCase()}`}>
                                                {job.status}
                                            </span>
                                        </div>
                                    </div>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20" className="arrow-icon">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            ))}
                            {activeJobs.length === 0 && (
                                <div className="empty-state-small">
                                    <p>No active jobs</p>
                                    <Link to="/jobs/create" className="btn btn-outline btn-sm">Post a Job</Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Quick Actions */}
                <motion.div
                    className="quick-actions glass-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2>Quick Actions</h2>
                    <div className="actions-grid">
                        <Link to="/jobs/create" className="action-card">
                            <div className="action-icon">➕</div>
                            <div className="action-text">
                                <h3>Post New Job</h3>
                                <p>Create a job listing</p>
                            </div>
                        </Link>
                        <Link to="/applications" className="action-card">
                            <div className="action-icon">📥</div>
                            <div className="action-text">
                                <h3>Review Applications</h3>
                                <p>Check new candidates</p>
                            </div>
                        </Link>
                        <Link to="/profile" className="action-card">
                            <div className="action-icon">🏢</div>
                            <div className="action-text">
                                <h3>Company Profile</h3>
                                <p>Update company info</p>
                            </div>
                        </Link>
                        <Link to="/analytics" className="action-card">
                            <div className="action-icon">📊</div>
                            <div className="action-text">
                                <h3>Analytics Dashboard</h3>
                                <p>View hiring insights</p>
                            </div>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default EmployerDashboard;
