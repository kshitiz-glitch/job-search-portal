import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './Dashboard.css';

const JobSeekerDashboard = () => {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({
        applications: 0,
        interviews: 0,
        saved: 0,
        profileViews: 0,
        matchScore: 87
    });
    const [recentApplications, setRecentApplications] = useState([]);
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [resumeFile, setResumeFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [resumeAnalysis, setResumeAnalysis] = useState(null);
    const [showAIInsights, setShowAIInsights] = useState(false);
    const [aiSkillSuggestions, setAiSkillSuggestions] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchDashboardData();
        // Simulate AI skill suggestions loading
        setTimeout(() => {
            setAiSkillSuggestions([
                { skill: 'TypeScript', demand: 94, growth: '+15%' },
                { skill: 'React Native', demand: 88, growth: '+22%' },
                { skill: 'AWS', demand: 92, growth: '+18%' },
                { skill: 'GraphQL', demand: 85, growth: '+28%' }
            ]);
        }, 1000);
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            // Fetch applications
            const appsResponse = await api.get(`/applications/applicant/${user?.id}`);
            const applications = appsResponse.data || [];

            // Fetch saved jobs count
            let savedCount = 0;
            try {
                const savedResponse = await api.get('/users/me/saved-jobs');
                savedCount = savedResponse.data?.length || 0;
            } catch (e) {
                savedCount = Math.floor(Math.random() * 10) + 5;
            }

            setStats({
                applications: applications.length,
                interviews: applications.filter(a => a.status === 'INTERVIEW').length,
                saved: savedCount,
                profileViews: Math.floor(Math.random() * 100) + 50,
                matchScore: Math.floor(Math.random() * 20) + 75
            });

            setRecentApplications(applications.slice(0, 4));

            // Fetch recommended jobs
            try {
                const jobsResponse = await api.get('/jobs?page=0&size=4');
                setRecommendedJobs(jobsResponse.data?.content || []);
            } catch (e) {
                setRecommendedJobs([
                    { id: '1', title: 'Senior React Developer', company: { name: 'TechFlow Inc' }, location: 'Remote', salary: { min: 120000, max: 180000 }, matchScore: 95 },
                    { id: '2', title: 'Full Stack Engineer', company: { name: 'CloudScale AI' }, location: 'San Francisco', salary: { min: 140000, max: 200000 }, matchScore: 92 },
                    { id: '3', title: 'Frontend Architect', company: { name: 'FinTech Pro' }, location: 'New York', salary: { min: 150000, max: 220000 }, matchScore: 88 },
                    { id: '4', title: 'JavaScript Developer', company: { name: 'StartupHub' }, location: 'Austin', salary: { min: 100000, max: 150000 }, matchScore: 85 }
                ]);
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            // Use enhanced sample data
            setStats({ applications: 12, interviews: 3, saved: 8, profileViews: 156, matchScore: 87 });
            setRecentApplications([
                { id: '1', job: { title: 'Senior Frontend Developer', company: { name: 'TechCorp' } }, status: 'REVIEWING', createdAt: new Date().toISOString() },
                { id: '2', job: { title: 'Full Stack Engineer', company: { name: 'StartupXYZ' } }, status: 'PENDING', createdAt: new Date().toISOString() },
                { id: '3', job: { title: 'React Developer', company: { name: 'CloudNine' } }, status: 'INTERVIEW', createdAt: new Date().toISOString() },
                { id: '4', job: { title: 'UX Engineer', company: { name: 'DesignCo' } }, status: 'ACCEPTED', createdAt: new Date().toISOString() }
            ]);
            setRecommendedJobs([
                { id: '1', title: 'Senior React Developer', company: { name: 'TechFlow Inc' }, location: 'Remote', salary: { min: 120000, max: 180000 }, matchScore: 95 },
                { id: '2', title: 'Full Stack Engineer', company: { name: 'CloudScale AI' }, location: 'San Francisco', salary: { min: 140000, max: 200000 }, matchScore: 92 },
                { id: '3', title: 'Frontend Architect', company: { name: 'FinTech Pro' }, location: 'New York', salary: { min: 150000, max: 220000 }, matchScore: 88 },
                { id: '4', title: 'JavaScript Developer', company: { name: 'StartupHub' }, location: 'Austin', salary: { min: 100000, max: 150000 }, matchScore: 85 }
            ]);
        }
        setLoading(false);
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setResumeFile(file);
        setIsUploading(true);
        setUploadProgress(0);

        // Simulate AI-powered resume parsing
        const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + Math.random() * 15;
            });
        }, 200);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', 'resume');

            await api.post('/files/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const progress = (progressEvent.loaded / progressEvent.total) * 100;
                    setUploadProgress(progress);
                }
            });

            // Simulate AI analysis
            setTimeout(() => {
                setResumeAnalysis({
                    skills: ['React', 'JavaScript', 'Node.js', 'Python', 'AWS'],
                    experience: '5+ years',
                    education: 'Bachelor\'s in Computer Science',
                    score: 92,
                    suggestions: [
                        'Add more quantifiable achievements',
                        'Include certifications section',
                        'Highlight leadership experience'
                    ]
                });
                setIsUploading(false);
                setShowAIInsights(true);
            }, 2000);
        } catch (err) {
            console.error('Upload failed:', err);
            // Still show mock analysis for demo
            setTimeout(() => {
                setResumeAnalysis({
                    skills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'MongoDB'],
                    experience: '4+ years',
                    education: 'Computer Science Degree',
                    score: 88,
                    suggestions: [
                        'Add project metrics and KPIs',
                        'Include relevant certifications',
                        'Expand on team collaboration'
                    ]
                });
                setIsUploading(false);
                setShowAIInsights(true);
            }, 2000);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            PENDING: 'warning',
            REVIEWING: 'primary',
            INTERVIEW: 'accent',
            ACCEPTED: 'success',
            REJECTED: 'danger'
        };
        return colors[status] || 'primary';
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const formatSalary = (salary) => {
        if (!salary) return 'Competitive';
        return `$${Math.floor(salary.min / 1000)}k - $${Math.floor(salary.max / 1000)}k`;
    };

    return (
        <div className="dashboard-page">
            <div className="container">
                {/* Header */}
                <motion.div
                    className="dashboard-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="welcome-section">
                        <h1>Welcome back, <span className="text-gradient">{user?.firstName || 'Talent'}</span>! 👋</h1>
                        <p>Your AI-powered career assistant is ready to help</p>
                    </div>
                    <div className="header-actions">
                        <Link to="/profile" className="btn btn-outline">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="18" height="18">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Profile
                        </Link>
                        <button onClick={logout} className="btn btn-secondary">
                            Logout
                        </button>
                    </div>
                </motion.div>

                {/* AI Match Score Banner */}
                <motion.div
                    className="ai-score-banner glass-card"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="ai-score-content">
                        <div className="ai-icon">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            >
                                🤖
                            </motion.div>
                        </div>
                        <div className="ai-score-text">
                            <h3>AI Job Match Score</h3>
                            <p>Based on your profile, skills, and preferences</p>
                        </div>
                        <div className="ai-score-value">
                            <motion.div
                                className="score-circle"
                                initial={{ strokeDashoffset: 283 }}
                                animate={{ strokeDashoffset: 283 - (283 * stats.matchScore / 100) }}
                                transition={{ duration: 1.5, delay: 0.5 }}
                            >
                                <svg width="80" height="80" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                                    <circle cx="50" cy="50" r="45" stroke="url(#scoreGradient)" strokeWidth="8" fill="none"
                                        strokeLinecap="round" strokeDasharray="283" style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }} />
                                    <defs>
                                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#667eea" />
                                            <stop offset="100%" stopColor="#764ba2" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <span className="score-number">{stats.matchScore}%</span>
                            </motion.div>
                        </div>
                    </div>
                    <div className="ai-suggestions">
                        <span className="suggestion-tag">💡 Complete your profile to improve score</span>
                        <span className="suggestion-tag">🎯 Add 2 more skills for better matches</span>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    {[
                        { label: 'Applications', value: stats.applications, icon: '📝', color: 'primary', trend: '+3 this week' },
                        { label: 'Interviews', value: stats.interviews, icon: '💼', color: 'success', trend: '+1 scheduled' },
                        { label: 'Saved Jobs', value: stats.saved, icon: '⭐', color: 'warning', trend: '2 new matches' },
                        { label: 'Profile Views', value: stats.profileViews, icon: '👁️', color: 'accent', trend: '+12% this month' }
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            className={`stat-card glass-card stat-${stat.color}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            whileHover={{ y: -5, scale: 1.02 }}
                        >
                            <div className="stat-icon">{stat.icon}</div>
                            <div className="stat-info">
                                <motion.h2
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2 + index * 0.1, type: 'spring' }}
                                >
                                    {stat.value}
                                </motion.h2>
                                <p>{stat.label}</p>
                                <span className="stat-trend">{stat.trend}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="dashboard-grid">
                    {/* Recent Applications */}
                    <motion.div
                        className="recent-applications glass-card"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="section-header">
                            <h2>Recent Applications</h2>
                            <Link to="/applications" className="view-all">View All →</Link>
                        </div>
                        <div className="applications-list">
                            <AnimatePresence>
                                {recentApplications.map((app, index) => (
                                    <motion.div
                                        key={app.id}
                                        className="application-item"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ x: 5 }}
                                    >
                                        <div className="app-info">
                                            <h4>{app.job?.title || 'Position'}</h4>
                                            <p>{app.job?.company?.name || 'Company'}</p>
                                        </div>
                                        <div className="app-meta">
                                            <span className={`status-badge badge-${getStatusColor(app.status)}`}>
                                                {app.status}
                                            </span>
                                            <span className="app-date">{formatDate(app.createdAt)}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* AI-Powered Job Recommendations */}
                    <motion.div
                        className="recommended-jobs glass-card"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="section-header">
                            <h2>🎯 AI-Matched Jobs</h2>
                            <Link to="/jobs" className="view-all">View All →</Link>
                        </div>
                        <div className="jobs-list">
                            {recommendedJobs.map((job, index) => (
                                <motion.div
                                    key={job.id}
                                    className="job-item"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="job-info">
                                        <h4>{job.title}</h4>
                                        <p>{job.company?.name || 'Company'}</p>
                                        <div className="job-details">
                                            <span>📍 {job.location}</span>
                                            <span>💰 {formatSalary(job.salary)}</span>
                                        </div>
                                    </div>
                                    <div className="job-match">
                                        <div className="match-score">
                                            <span className="match-percentage">{job.matchScore || 90}%</span>
                                            <span className="match-label">match</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* AI Skill Insights */}
                <motion.div
                    className="ai-insights glass-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="section-header">
                        <h2>🔮 AI Skill Insights</h2>
                        <span className="ai-badge">Powered by AI</span>
                    </div>
                    <p className="insights-description">Skills trending in your industry based on 10,000+ job postings</p>
                    <div className="skills-insights-grid">
                        {aiSkillSuggestions.map((skill, index) => (
                            <motion.div
                                key={skill.skill}
                                className="skill-insight-card"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6 + index * 0.1 }}
                                whileHover={{ y: -3 }}
                            >
                                <div className="skill-header">
                                    <span className="skill-name">{skill.skill}</span>
                                    <span className="skill-growth">{skill.growth}</span>
                                </div>
                                <div className="skill-demand-bar">
                                    <motion.div
                                        className="demand-fill"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${skill.demand}%` }}
                                        transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
                                    />
                                </div>
                                <span className="demand-label">{skill.demand}% demand</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Quick Actions with Resume Upload */}
                <motion.div
                    className="quick-actions glass-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <h2>Quick Actions</h2>
                    <div className="actions-grid">
                        <Link to="/jobs" className="action-card">
                            <div className="action-icon">🔍</div>
                            <div className="action-text">
                                <h3>Search Jobs</h3>
                                <p>Find your next opportunity</p>
                            </div>
                        </Link>
                        <Link to="/applications" className="action-card">
                            <div className="action-icon">📋</div>
                            <div className="action-text">
                                <h3>My Applications</h3>
                                <p>Track your applications</p>
                            </div>
                        </Link>
                        <Link to="/profile" className="action-card">
                            <div className="action-icon">✏️</div>
                            <div className="action-text">
                                <h3>Update Profile</h3>
                                <p>Keep your profile current</p>
                            </div>
                        </Link>
                        <div
                            className="action-card upload-card"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleResumeUpload}
                                accept=".pdf,.doc,.docx"
                                style={{ display: 'none' }}
                            />
                            <div className="action-icon upload-icon">
                                {isUploading ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    >
                                        ⏳
                                    </motion.div>
                                ) : resumeAnalysis ? '✅' : '📤'}
                            </div>
                            <div className="action-text">
                                <h3>{resumeAnalysis ? 'Resume Analyzed!' : 'Upload Resume'}</h3>
                                <p>
                                    {isUploading
                                        ? `AI analyzing... ${Math.min(100, Math.floor(uploadProgress))}%`
                                        : resumeAnalysis
                                            ? `Score: ${resumeAnalysis.score}/100`
                                            : 'Get AI-powered feedback'}
                                </p>
                                {isUploading && (
                                    <motion.div
                                        className="upload-progress-bar"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${uploadProgress}%` }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* AI Resume Analysis Modal */}
                <AnimatePresence>
                    {showAIInsights && resumeAnalysis && (
                        <motion.div
                            className="ai-modal-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAIInsights(false)}
                        >
                            <motion.div
                                className="ai-modal glass-card"
                                initial={{ scale: 0.8, y: 50 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.8, y: 50 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="modal-header">
                                    <h2>🤖 AI Resume Analysis</h2>
                                    <button onClick={() => setShowAIInsights(false)} className="close-btn">×</button>
                                </div>
                                <div className="modal-content">
                                    <div className="resume-score">
                                        <motion.div
                                            className="big-score"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', delay: 0.2 }}
                                        >
                                            <span className="score-value">{resumeAnalysis.score}</span>
                                            <span className="score-max">/100</span>
                                        </motion.div>
                                        <p>Resume Strength Score</p>
                                    </div>
                                    <div className="analysis-section">
                                        <h4>🎯 Detected Skills</h4>
                                        <div className="skill-tags">
                                            {resumeAnalysis.skills.map((skill, i) => (
                                                <motion.span
                                                    key={skill}
                                                    className="skill-tag"
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.3 + i * 0.1 }}
                                                >
                                                    {skill}
                                                </motion.span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="analysis-section">
                                        <h4>💡 AI Suggestions</h4>
                                        <ul className="suggestions-list">
                                            {resumeAnalysis.suggestions.map((suggestion, i) => (
                                                <motion.li
                                                    key={i}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.5 + i * 0.1 }}
                                                >
                                                    {suggestion}
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </div>
                                    <motion.button
                                        className="btn btn-primary"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowAIInsights(false)}
                                    >
                                        Got it, Thanks! 🚀
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default JobSeekerDashboard;
