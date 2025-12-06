import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './JobDetails.css';

const JobDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const [applied, setApplied] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        fetchJobDetails();
        if (user?.userId && id) {
            checkIfApplied();
        }
    }, [id, user?.userId]);

    const checkIfApplied = async () => {
        try {
            const response = await api.get(`/applications/applicant/${user.userId}`);
            const hasApplied = response.data.some(app => app.job?.id === id);
            setApplied(hasApplied);
        } catch (err) {
            // User may not have any applications yet
            console.log('No applications found or error checking:', err.message);
        }
    };

    const fetchJobDetails = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/jobs/${id}`);
            setJob(response.data);
        } catch (err) {
            console.error('Error fetching job:', err);
            // Use sample data for demonstration
            setJob(getSampleJob());
        } finally {
            setLoading(false);
        }
    };

    const getSampleJob = () => ({
        id: id,
        title: 'Senior Frontend Developer',
        company: { name: 'TechCorp Inc.', logo: null },
        postedBy: {
            profile: {
                company: 'TechCorp Inc.',
                firstName: 'John',
                lastName: 'Smith'
            }
        },
        location: 'San Francisco, CA',
        type: 'FULL_TIME',
        salary: { min: 120000, max: 180000 },
        description: `We are looking for an experienced Senior Frontend Developer to join our growing team. You will be responsible for building and maintaining high-performance web applications using modern technologies.

As a Senior Frontend Developer, you will work closely with our design and backend teams to deliver exceptional user experiences. You'll have the opportunity to mentor junior developers and contribute to our technical architecture decisions.

This is an exciting opportunity to work on products that impact millions of users worldwide.`,
        requirements: [
            '5+ years of experience in frontend development',
            'Expert knowledge of React, TypeScript, and modern CSS',
            'Experience with state management solutions (Redux, Zustand, etc.)',
            'Strong understanding of web performance optimization',
            'Experience with testing frameworks (Jest, React Testing Library)',
            'Excellent communication and collaboration skills',
            'Bachelor\'s degree in Computer Science or equivalent experience'
        ],
        responsibilities: [
            'Lead the development of complex frontend features',
            'Write clean, maintainable, and well-tested code',
            'Collaborate with designers to implement pixel-perfect UIs',
            'Optimize application performance and bundle size',
            'Mentor junior developers and conduct code reviews',
            'Participate in technical architecture discussions',
            'Stay up-to-date with the latest frontend technologies'
        ],
        benefits: [
            '💰 Competitive salary and equity package',
            '🏥 Comprehensive health, dental, and vision insurance',
            '🏖️ Unlimited PTO policy',
            '💻 Latest MacBook Pro and equipment',
            '📚 $2,000 annual learning budget',
            '🏠 Flexible remote work options',
            '🍕 Free lunches and snacks in office'
        ],
        skills: ['React', 'TypeScript', 'CSS', 'Node.js', 'GraphQL', 'Jest', 'Webpack'],
        applicants: 45,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'ACTIVE'
    });

    // File handling functions
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (file) => {
        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!validTypes.includes(file.type)) {
            alert('Please upload a PDF, DOC, or DOCX file.');
            return;
        }

        if (file.size > maxSize) {
            alert('File size must be less than 5MB.');
            return;
        }

        setResumeFile(file);
    };

    const removeFile = () => {
        setResumeFile(null);
    };

    const handleApply = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            setApplying(true);

            // Create application data with simple IDs (matching backend DTO)
            const applicationData = {
                jobId: job.id,
                applicantId: user.userId,
                coverLetter: coverLetter,
                resumeFileName: resumeFile ? resumeFile.name : null
            };

            await api.post('/applications', applicationData);
            setApplied(true);
            setShowApplyModal(false);
            alert('Application submitted successfully!');
        } catch (err) {
            console.error('Error applying:', err);
            const errorMessage = err.response?.data?.error || 'Failed to submit application. You may have already applied for this position.';
            alert(errorMessage);
        } finally {
            setApplying(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatSalary = (salary) => {
        if (!salary) return 'Competitive';
        if (typeof salary === 'object') {
            return `$${(salary.min / 1000).toFixed(0)}k - $${(salary.max / 1000).toFixed(0)}k per year`;
        }
        return salary;
    };

    const formatJobType = (type) => {
        if (!type) return 'Full Time';
        return type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    if (loading) {
        return (
            <div className="job-details-page">
                <div className="container">
                    <div className="job-details-skeleton glass-card">
                        <div className="skeleton-header">
                            <div className="skeleton-logo shimmer"></div>
                            <div className="skeleton-title-section">
                                <div className="skeleton-line large shimmer"></div>
                                <div className="skeleton-line medium shimmer"></div>
                            </div>
                        </div>
                        <div className="skeleton-body">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="skeleton-line shimmer"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="job-details-page">
                <div className="container">
                    <div className="error-state glass-card">
                        <div className="error-icon">😕</div>
                        <h2>Job Not Found</h2>
                        <p>The job you're looking for doesn't exist or has been removed.</p>
                        <Link to="/jobs" className="btn btn-primary">Browse Jobs</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="job-details-page">
            {/* Back Button */}
            <div className="container">
                <Link to="/jobs" className="back-link">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12.5 15L7.5 10L12.5 5" />
                    </svg>
                    Back to Jobs
                </Link>
            </div>

            <div className="container job-details-container">
                {/* Main Content */}
                <motion.main
                    className="job-details-main"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Header */}
                    <div className="job-details-header glass-card">
                        <div className="header-top">
                            <div className="company-logo-large">
                                {job.company?.logo ? (
                                    <img src={job.company.logo} alt={job.company?.name} />
                                ) : (
                                    <div className="logo-placeholder">
                                        {(job.company?.name || job.postedBy?.profile?.company || 'C').charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className="header-info">
                                <h1>{job.title}</h1>
                                <p className="company-name">{job.company?.name || job.postedBy?.profile?.company}</p>
                                <div className="job-meta">
                                    <span className="meta-item">
                                        <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {job.location}
                                    </span>
                                    <span className="meta-item">
                                        <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        {formatJobType(job.type)}
                                    </span>
                                    <span className="meta-item">
                                        <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {formatSalary(job.salary)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="header-actions">
                            {applied ? (
                                <div className="applied-badge">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Applied Successfully
                                </div>
                            ) : user?.role === 'JOB_SEEKER' ? (
                                <button
                                    className="btn btn-primary btn-lg"
                                    onClick={() => setShowApplyModal(true)}
                                >
                                    Apply Now
                                </button>
                            ) : user?.role === 'EMPLOYER' ? (
                                <div className="employer-notice">
                                    You're viewing as an Employer
                                </div>
                            ) : null}
                            <button className="btn btn-outline">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                                Save Job
                            </button>
                        </div>
                    </div>

                    {/* Description */}
                    <section className="job-section glass-card">
                        <h2>About This Role</h2>
                        <div className="job-description">
                            {job.description?.split('\n\n').map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>
                    </section>

                    {/* Responsibilities */}
                    {job.responsibilities && job.responsibilities.length > 0 && (
                        <section className="job-section glass-card">
                            <h2>What You'll Do</h2>
                            <ul className="requirements-list">
                                {job.responsibilities.map((item, index) => (
                                    <li key={index}>
                                        <span className="list-icon">▹</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Requirements */}
                    {job.requirements && job.requirements.length > 0 && (
                        <section className="job-section glass-card">
                            <h2>What We're Looking For</h2>
                            <ul className="requirements-list">
                                {job.requirements.map((req, index) => (
                                    <li key={index}>
                                        <span className="list-icon">✓</span>
                                        {req}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Benefits */}
                    {job.benefits && job.benefits.length > 0 && (
                        <section className="job-section glass-card">
                            <h2>Benefits & Perks</h2>
                            <div className="benefits-grid">
                                {job.benefits.map((benefit, index) => (
                                    <div key={index} className="benefit-item">
                                        {benefit}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skills */}
                    {job.skills && job.skills.length > 0 && (
                        <section className="job-section glass-card">
                            <h2>Required Skills</h2>
                            <div className="skills-grid">
                                {job.skills.map((skill, index) => (
                                    <span key={index} className="skill-tag">{skill}</span>
                                ))}
                            </div>
                        </section>
                    )}
                </motion.main>

                {/* Sidebar */}
                <motion.aside
                    className="job-details-sidebar"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {/* Job Info Card */}
                    <div className="sidebar-card glass-card">
                        <h3>Job Information</h3>
                        <div className="info-list">
                            <div className="info-item">
                                <span className="info-label">Posted</span>
                                <span className="info-value">{formatDate(job.createdAt)}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Expires</span>
                                <span className="info-value">{formatDate(job.expiresAt)}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Job Type</span>
                                <span className="info-value">{formatJobType(job.type)}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Salary</span>
                                <span className="info-value">{formatSalary(job.salary)}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Applicants</span>
                                <span className="info-value">{job.applicants || 0} people</span>
                            </div>
                        </div>
                    </div>

                    {/* Company Card */}
                    <div className="sidebar-card glass-card">
                        <h3>About the Company</h3>
                        <div className="company-info">
                            <div className="company-logo-small">
                                {(job.company?.name || job.postedBy?.profile?.company || 'C').charAt(0)}
                            </div>
                            <div>
                                <h4>{job.company?.name || job.postedBy?.profile?.company}</h4>
                                <p>Technology Company</p>
                            </div>
                        </div>
                        <p className="company-description">
                            A leading technology company focused on building innovative solutions that impact millions of users worldwide.
                        </p>
                        <button className="btn btn-outline" style={{ width: '100%' }}>
                            View Company Profile
                        </button>
                    </div>

                    {/* Share Card */}
                    <div className="sidebar-card glass-card">
                        <h3>Share This Job</h3>
                        <div className="share-buttons">
                            <button className="share-btn">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                </svg>
                            </button>
                            <button className="share-btn">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                            </button>
                            <button className="share-btn">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                                </svg>
                            </button>
                            <button className="share-btn">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </motion.aside>
            </div>

            {/* Apply Modal */}
            <AnimatePresence>
                {showApplyModal && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowApplyModal(false)}
                    >
                        <motion.div
                            className="modal glass-card"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-header">
                                <h2>Apply for {job.title}</h2>
                                <button className="modal-close" onClick={() => setShowApplyModal(false)}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="applicant-info">
                                    <div className="info-row">
                                        <span className="label">Name:</span>
                                        <span>{user?.firstName} {user?.lastName}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">Email:</span>
                                        <span>{user?.email}</span>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Cover Letter (Optional)</label>
                                    <textarea
                                        className="input textarea"
                                        rows="6"
                                        placeholder="Tell the employer why you're a great fit for this role..."
                                        value={coverLetter}
                                        onChange={(e) => setCoverLetter(e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="resume-upload">
                                    {resumeFile ? (
                                        <div className="uploaded-file">
                                            <div className="file-info">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <div>
                                                    <p className="file-name">{resumeFile.name}</p>
                                                    <span className="file-size">{(resumeFile.size / 1024).toFixed(1)} KB</span>
                                                </div>
                                            </div>
                                            <button type="button" className="remove-file" onClick={removeFile}>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            className={`upload-area ${dragActive ? 'drag-active' : ''}`}
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                            onClick={() => document.getElementById('resume-input').click()}
                                        >
                                            <input
                                                type="file"
                                                id="resume-input"
                                                accept=".pdf,.doc,.docx"
                                                onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
                                                style={{ display: 'none' }}
                                            />
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="40" height="40">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            <p>Drag & drop your resume or <span className="text-gradient browse-link">browse</span></p>
                                            <span className="upload-hint">PDF, DOC, DOCX (Max 5MB)</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-outline" onClick={() => setShowApplyModal(false)}>
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleApply}
                                    disabled={applying}
                                >
                                    {applying ? 'Submitting...' : 'Submit Application'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default JobDetails;
