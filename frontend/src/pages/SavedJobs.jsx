import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './SavedJobs.css';

const SavedJobs = () => {
    const { user } = useAuth();
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSavedJobs();
    }, [user]);

    const fetchSavedJobs = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users/me/saved-jobs');
            setSavedJobs(response.data || []);
        } catch (err) {
            console.error('Error fetching saved jobs:', err);
            // Sample data for demonstration
            setSavedJobs([
                {
                    id: '1',
                    title: 'Senior Frontend Developer',
                    company: { name: 'TechCorp Inc.' },
                    location: 'San Francisco, CA',
                    type: 'FULL_TIME',
                    salary: { min: 120000, max: 180000 },
                    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: '2',
                    title: 'Full Stack Engineer',
                    company: { name: 'StartupXYZ' },
                    location: 'Remote',
                    type: 'REMOTE',
                    salary: { min: 100000, max: 150000 },
                    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: '3',
                    title: 'React Developer',
                    company: { name: 'Digital Agency' },
                    location: 'New York, NY',
                    type: 'FULL_TIME',
                    salary: { min: 90000, max: 130000 },
                    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const removeSavedJob = async (jobId) => {
        try {
            await api.delete(`/users/me/saved-jobs/${jobId}`);
            setSavedJobs(prev => prev.filter(job => job.id !== jobId));
        } catch (err) {
            console.error('Error removing saved job:', err);
            // For demo, just remove from local state
            setSavedJobs(prev => prev.filter(job => job.id !== jobId));
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const formatSalary = (min, max) => {
        if (!min && !max) return 'Not specified';
        return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
    };

    return (
        <div className="saved-jobs-page">
            <div className="container">
                <motion.div
                    className="page-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div>
                        <h1 className="text-gradient">Saved Jobs</h1>
                        <p>Jobs you've bookmarked for later</p>
                    </div>
                    <Link to="/jobs" className="btn btn-primary">
                        Browse More Jobs
                    </Link>
                </motion.div>

                {loading ? (
                    <div className="saved-jobs-grid">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="saved-job-card glass-card skeleton">
                                <div className="skeleton-line large shimmer"></div>
                                <div className="skeleton-line medium shimmer"></div>
                                <div className="skeleton-line small shimmer"></div>
                            </div>
                        ))}
                    </div>
                ) : savedJobs.length === 0 ? (
                    <motion.div
                        className="empty-state glass-card"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="empty-icon">💼</div>
                        <h3>No Saved Jobs Yet</h3>
                        <p>Start browsing and save jobs you're interested in!</p>
                        <Link to="/jobs" className="btn btn-primary">
                            Explore Jobs
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div
                        className="saved-jobs-grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <AnimatePresence>
                            {savedJobs.map((job, index) => (
                                <motion.div
                                    key={job.id}
                                    className="saved-job-card glass-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <button
                                        className="remove-btn"
                                        onClick={() => removeSavedJob(job.id)}
                                        title="Remove from saved"
                                    >
                                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                        </svg>
                                    </button>

                                    <div className="job-logo">
                                        {job.company?.name?.charAt(0) || 'C'}
                                    </div>

                                    <div className="job-content">
                                        <h3>{job.title}</h3>
                                        <p className="company-name">{job.company?.name}</p>

                                        <div className="job-meta">
                                            <span>📍 {job.location}</span>
                                            <span>💰 {formatSalary(job.salary?.min, job.salary?.max)}</span>
                                        </div>

                                        <div className="job-footer">
                                            <span className={`job-type ${job.type?.toLowerCase()}`}>
                                                {job.type?.replace('_', ' ')}
                                            </span>
                                            <span className="saved-date">
                                                Saved {formatDate(job.createdAt)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="job-actions">
                                        <Link to={`/jobs/${job.id}`} className="btn btn-primary btn-sm">
                                            View Details
                                        </Link>
                                        <button className="btn btn-outline btn-sm">
                                            Apply Now
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default SavedJobs;
