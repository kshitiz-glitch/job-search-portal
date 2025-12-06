import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './JobCard.css';

const JobCard = ({ job, onApply, showApplyButton = true, isApplied = false }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    };

    const formatSalary = (salary) => {
        if (!salary) return 'Competitive';
        if (typeof salary === 'object') {
            return `$${(salary.min / 1000).toFixed(0)}k - $${(salary.max / 1000).toFixed(0)}k`;
        }
        return salary;
    };

    const getJobTypeClass = (type) => {
        const types = {
            'FULL_TIME': 'badge-primary',
            'PART_TIME': 'badge-secondary',
            'CONTRACT': 'badge-accent',
            'REMOTE': 'badge-success',
            'INTERNSHIP': 'badge-warning'
        };
        return types[type] || 'badge-primary';
    };

    const formatJobType = (type) => {
        if (!type) return 'Full Time';
        return type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <motion.div
            className="job-card glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
        >
            <div className="job-card-header">
                <div className="company-logo">
                    {job.company?.logo ? (
                        <img src={job.company.logo} alt={job.company?.name || 'Company'} />
                    ) : (
                        <div className="logo-placeholder">
                            {(job.company?.name || job.postedBy?.profile?.company || 'C').charAt(0)}
                        </div>
                    )}
                </div>
                <div className="job-card-title-section">
                    <h3 className="job-title">{job.title}</h3>
                    <p className="company-name">{job.company?.name || job.postedBy?.profile?.company || 'Company'}</p>
                </div>
                <span className={`badge ${getJobTypeClass(job.type)}`}>
                    {formatJobType(job.type)}
                </span>
            </div>

            <div className="job-card-meta">
                <div className="meta-item">
                    <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{job.location || 'Remote'}</span>
                </div>
                <div className="meta-item">
                    <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{formatSalary(job.salary)}</span>
                </div>
                <div className="meta-item">
                    <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{formatDate(job.createdAt)}</span>
                </div>
            </div>

            <p className="job-description">
                {job.description?.length > 150
                    ? `${job.description.substring(0, 150)}...`
                    : job.description || 'No description available'}
            </p>

            {job.skills && job.skills.length > 0 && (
                <div className="job-skills">
                    {job.skills.slice(0, 4).map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                    ))}
                    {job.skills.length > 4 && (
                        <span className="skill-tag more">+{job.skills.length - 4} more</span>
                    )}
                </div>
            )}

            <div className="job-card-footer">
                <div className="applicant-count">
                    <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{job.applicants || 0} applicants</span>
                </div>
                <div className="job-card-actions">
                    <Link to={`/jobs/${job.id}`} className="btn btn-outline btn-sm">
                        View Details
                    </Link>
                    {showApplyButton && (
                        isApplied ? (
                            <button
                                className="btn btn-success btn-sm"
                                disabled
                                style={{ opacity: 0.8 }}
                            >
                                ✓ Applied
                            </button>
                        ) : (
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => onApply && onApply(job)}
                            >
                                Apply Now
                            </button>
                        )
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default JobCard;
