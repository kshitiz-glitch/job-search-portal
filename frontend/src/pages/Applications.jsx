import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './Applications.css';

const Applications = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [selectedApplication, setSelectedApplication] = useState(null);

    const statusConfig = {
        PENDING: { label: 'Pending', color: 'warning', icon: '⏳' },
        REVIEWED: { label: 'Under Review', color: 'primary', icon: '👀' },
        SHORTLISTED: { label: 'Shortlisted', color: 'success', icon: '⭐' },
        INTERVIEW_SCHEDULED: { label: 'Interview Scheduled', color: 'accent', icon: '📅' },
        INTERVIEW: { label: 'Interview', color: 'accent', icon: '📅' },
        ACCEPTED: { label: 'Accepted', color: 'success', icon: '✅' },
        REJECTED: { label: 'Rejected', color: 'danger', icon: '❌' }
    };

    const filters = [
        { value: 'ALL', label: 'All Applications' },
        { value: 'PENDING', label: 'Pending' },
        { value: 'REVIEWED', label: 'Under Review' },
        { value: 'SHORTLISTED', label: 'Shortlisted' },
        { value: 'INTERVIEW_SCHEDULED', label: 'Interview' },
        { value: 'ACCEPTED', label: 'Accepted' },
        { value: 'REJECTED', label: 'Rejected' }
    ];

    const [updatingStatus, setUpdatingStatus] = useState(null);

    const updateApplicationStatus = async (applicationId, newStatus, notes = '') => {
        try {
            setUpdatingStatus(applicationId);
            await api.patch(`/applications/${applicationId}/status`, {
                status: newStatus,
                notes: notes
            });
            // Update local state
            setApplications(prev => prev.map(app =>
                app.id === applicationId
                    ? { ...app, status: newStatus }
                    : app
            ));
            alert(`Application status updated to ${statusConfig[newStatus]?.label || newStatus}`);
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update application status');
        } finally {
            setUpdatingStatus(null);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [user]);

    const fetchApplications = async () => {
        if (!user?.userId) return;

        try {
            setLoading(true);

            if (user.role === 'EMPLOYER') {
                // For employers, first get their jobs, then get applications for those jobs
                const jobsResponse = await api.get(`/jobs/employer/${user.userId}`);
                const jobs = jobsResponse.data || [];

                // Fetch applications for each job
                const allApplications = [];
                for (const job of jobs) {
                    try {
                        const appsResponse = await api.get(`/applications/job/${job.id}`);
                        const jobApps = (appsResponse.data || []).map(app => ({
                            ...app,
                            job: job // Attach job info to each application
                        }));
                        allApplications.push(...jobApps);
                    } catch (err) {
                        console.error(`Error fetching applications for job ${job.id}:`, err);
                    }
                }
                setApplications(allApplications);
            } else {
                // For job seekers, get their applications
                const response = await api.get(`/applications/applicant/${user.userId}`);
                setApplications(response.data || []);
            }
        } catch (err) {
            console.error('Error fetching applications:', err);
            // Use sample data for demonstration
            setApplications(getSampleApplications());
        } finally {
            setLoading(false);
        }
    };

    const getSampleApplications = () => [
        {
            id: '1',
            job: {
                id: '1',
                title: 'Senior Frontend Developer',
                company: { name: 'TechCorp Inc.' },
                location: 'San Francisco, CA',
                type: 'FULL_TIME'
            },
            status: 'PENDING',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            coverLetter: 'I am excited to apply for this position...'
        },
        {
            id: '2',
            job: {
                id: '2',
                title: 'Full Stack Engineer',
                company: { name: 'StartupXYZ' },
                location: 'Remote',
                type: 'REMOTE'
            },
            status: 'REVIEWING',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            coverLetter: 'With my experience in full-stack development...'
        },
        {
            id: '3',
            job: {
                id: '3',
                title: 'UX/UI Designer',
                company: { name: 'DesignStudio' },
                location: 'New York, NY',
                type: 'FULL_TIME'
            },
            status: 'SHORTLISTED',
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            coverLetter: 'My passion for design...'
        },
        {
            id: '4',
            job: {
                id: '4',
                title: 'DevOps Engineer',
                company: { name: 'CloudTech' },
                location: 'Austin, TX',
                type: 'FULL_TIME'
            },
            status: 'INTERVIEW',
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            coverLetter: 'I bring extensive experience in cloud infrastructure...',
            interviewDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: '5',
            job: {
                id: '5',
                title: 'Backend Developer',
                company: { name: 'DataFlow Inc.' },
                location: 'Chicago, IL',
                type: 'FULL_TIME'
            },
            status: 'REJECTED',
            createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            coverLetter: 'I would love to join your team...',
            employerNotes: 'Thank you for your interest, but we have decided to move forward with other candidates.'
        }
    ];

    const filteredApplications = filter === 'ALL'
        ? applications
        : applications.filter(app => app.status === filter);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusTimeline = (application) => {
        const timeline = [
            { status: 'Applied', date: application.createdAt, completed: true }
        ];

        if (application.status !== 'PENDING') {
            timeline.push({
                status: statusConfig[application.status]?.label || application.status,
                date: application.updatedAt,
                completed: true
            });
        }

        return timeline;
    };

    const getStats = () => {
        return {
            total: applications.length,
            pending: applications.filter(a => a.status === 'PENDING').length,
            reviewing: applications.filter(a => a.status === 'REVIEWING').length,
            interviews: applications.filter(a => a.status === 'INTERVIEW').length,
            accepted: applications.filter(a => a.status === 'ACCEPTED').length
        };
    };

    const stats = getStats();

    return (
        <div className="applications-page">
            <div className="container">
                {/* Header */}
                <motion.div
                    className="page-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="header-content">
                        <h1 className="text-gradient">
                            {user?.role === 'EMPLOYER' ? 'Job Applications' : 'My Applications'}
                        </h1>
                        <p>
                            {user?.role === 'EMPLOYER'
                                ? 'Review and manage applicants for your job postings'
                                : 'Track and manage your job applications'}
                        </p>
                    </div>
                    {user?.role === 'EMPLOYER' ? (
                        <Link to="/jobs/create" className="btn btn-primary">
                            Post New Job
                        </Link>
                    ) : (
                        <Link to="/jobs" className="btn btn-primary">
                            Browse More Jobs
                        </Link>
                    )}
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    className="stats-grid"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="stat-card glass-card">
                        <div className="stat-icon">📝</div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.total}</span>
                            <span className="stat-label">Total Applications</span>
                        </div>
                    </div>
                    <div className="stat-card glass-card">
                        <div className="stat-icon">⏳</div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.pending}</span>
                            <span className="stat-label">Pending</span>
                        </div>
                    </div>
                    <div className="stat-card glass-card">
                        <div className="stat-icon">👀</div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.reviewing}</span>
                            <span className="stat-label">Under Review</span>
                        </div>
                    </div>
                    <div className="stat-card glass-card">
                        <div className="stat-icon">📅</div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.interviews}</span>
                            <span className="stat-label">Interviews</span>
                        </div>
                    </div>
                </motion.div>

                {/* Filters */}
                <motion.div
                    className="filters-bar glass"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {filters.map(f => (
                        <button
                            key={f.value}
                            className={`filter-btn ${filter === f.value ? 'active' : ''}`}
                            onClick={() => setFilter(f.value)}
                        >
                            {f.label}
                            {f.value !== 'ALL' && (
                                <span className="filter-count">
                                    {applications.filter(a => a.status === f.value).length}
                                </span>
                            )}
                        </button>
                    ))}
                </motion.div>

                {/* Applications List */}
                {loading ? (
                    <div className="applications-list">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="application-card glass-card skeleton">
                                <div className="skeleton-content">
                                    <div className="skeleton-line large shimmer"></div>
                                    <div className="skeleton-line medium shimmer"></div>
                                    <div className="skeleton-line small shimmer"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredApplications.length === 0 ? (
                    <motion.div
                        className="empty-state glass-card"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="empty-icon">📭</div>
                        <h3>No Applications Found</h3>
                        <p>
                            {filter === 'ALL'
                                ? "You haven't applied to any jobs yet. Start exploring opportunities!"
                                : `No applications with status "${filters.find(f => f.value === filter)?.label}"`}
                        </p>
                        <Link to="/jobs" className="btn btn-primary">
                            Browse Jobs
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div
                        className="applications-list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <AnimatePresence>
                            {filteredApplications.map((application, index) => (
                                <motion.div
                                    key={application.id}
                                    className="application-card glass-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => setSelectedApplication(
                                        selectedApplication?.id === application.id ? null : application
                                    )}
                                >
                                    <div className="application-main">
                                        <div className="application-info">
                                            <div className="company-logo">
                                                {user?.role === 'EMPLOYER'
                                                    ? (application.applicant?.profile?.firstName?.[0] || application.applicant?.email?.[0] || 'A')
                                                    : (application.job?.company?.name || 'C').charAt(0)}
                                            </div>
                                            <div className="job-info">
                                                {user?.role === 'EMPLOYER' ? (
                                                    <>
                                                        <h3>
                                                            {application.applicant?.profile?.firstName} {application.applicant?.profile?.lastName || ''}
                                                            {!application.applicant?.profile?.firstName && (application.applicant?.email || 'Applicant')}
                                                        </h3>
                                                        <p className="company-name">
                                                            Applied for: {application.job?.title}
                                                        </p>
                                                        <div className="job-meta">
                                                            <span>📧 {application.applicant?.email || 'No email'}</span>
                                                            <span>•</span>
                                                            <span>Applied {formatDate(application.createdAt || application.appliedAt)}</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <h3>{application.job?.title}</h3>
                                                        <p className="company-name">
                                                            {application.job?.company?.name}
                                                        </p>
                                                        <div className="job-meta">
                                                            <span>{application.job?.location}</span>
                                                            <span>•</span>
                                                            <span>Applied {formatDate(application.createdAt)}</span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="application-status">
                                            <span className={`status-badge status-${statusConfig[application.status]?.color}`}>
                                                <span className="status-icon">{statusConfig[application.status]?.icon}</span>
                                                {statusConfig[application.status]?.label}
                                            </span>
                                        </div>

                                        <div className="application-actions">
                                            <Link
                                                to={`/jobs/${application.job?.id}`}
                                                className="btn btn-outline btn-sm"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                View Job
                                            </Link>
                                            {/* Employer Action Buttons */}
                                            {user?.role === 'EMPLOYER' && (
                                                <div className="status-actions" onClick={(e) => e.stopPropagation()}>
                                                    {application.status === 'PENDING' && (
                                                        <>
                                                            <button
                                                                className="btn btn-success btn-sm"
                                                                onClick={() => updateApplicationStatus(application.id, 'SHORTLISTED')}
                                                                disabled={updatingStatus === application.id}
                                                            >
                                                                ⭐ Shortlist
                                                            </button>
                                                            <button
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() => updateApplicationStatus(application.id, 'REJECTED')}
                                                                disabled={updatingStatus === application.id}
                                                            >
                                                                ❌ Reject
                                                            </button>
                                                        </>
                                                    )}
                                                    {application.status === 'SHORTLISTED' && (
                                                        <>
                                                            <button
                                                                className="btn btn-accent btn-sm"
                                                                onClick={() => updateApplicationStatus(application.id, 'INTERVIEW_SCHEDULED')}
                                                                disabled={updatingStatus === application.id}
                                                            >
                                                                📅 Schedule Interview
                                                            </button>
                                                            <button
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() => updateApplicationStatus(application.id, 'REJECTED')}
                                                                disabled={updatingStatus === application.id}
                                                            >
                                                                ❌ Reject
                                                            </button>
                                                        </>
                                                    )}
                                                    {application.status === 'INTERVIEW_SCHEDULED' && (
                                                        <>
                                                            <button
                                                                className="btn btn-success btn-sm"
                                                                onClick={() => updateApplicationStatus(application.id, 'ACCEPTED')}
                                                                disabled={updatingStatus === application.id}
                                                            >
                                                                ✅ Accept
                                                            </button>
                                                            <button
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() => updateApplicationStatus(application.id, 'REJECTED')}
                                                                disabled={updatingStatus === application.id}
                                                            >
                                                                ❌ Reject
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                            <button className="expand-btn">
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    className={selectedApplication?.id === application.id ? 'rotated' : ''}
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    <AnimatePresence>
                                        {selectedApplication?.id === application.id && (
                                            <motion.div
                                                className="application-details"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="details-grid">
                                                    {/* Timeline */}
                                                    <div className="detail-section">
                                                        <h4>Application Timeline</h4>
                                                        <div className="timeline">
                                                            {getStatusTimeline(application).map((item, idx) => (
                                                                <div key={idx} className="timeline-item completed">
                                                                    <div className="timeline-dot"></div>
                                                                    <div className="timeline-content">
                                                                        <span className="timeline-status">{item.status}</span>
                                                                        <span className="timeline-date">{formatDate(item.date)}</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Cover Letter */}
                                                    {application.coverLetter && (
                                                        <div className="detail-section">
                                                            <h4>Your Cover Letter</h4>
                                                            <p className="cover-letter">{application.coverLetter}</p>
                                                        </div>
                                                    )}

                                                    {/* Interview Info */}
                                                    {application.status === 'INTERVIEW' && application.interviewDate && (
                                                        <div className="detail-section interview-info">
                                                            <h4>📅 Interview Scheduled</h4>
                                                            <p className="interview-date">{formatDate(application.interviewDate)}</p>
                                                            <p className="interview-note">Make sure to prepare and be on time!</p>
                                                        </div>
                                                    )}

                                                    {/* Employer Notes */}
                                                    {application.employerNotes && (
                                                        <div className="detail-section">
                                                            <h4>Employer Feedback</h4>
                                                            <p className="employer-notes">{application.employerNotes}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Applications;
