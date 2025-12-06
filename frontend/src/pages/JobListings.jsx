import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/JobCard';
import api from '../api/axios';
import './JobListings.css';

const JobListings = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        type: '',
        location: '',
        salary: ''
    });
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showFilters, setShowFilters] = useState(false);
    const [appliedJobs, setAppliedJobs] = useState(new Set());

    const jobTypes = [
        { value: '', label: 'All Types' },
        { value: 'FULL_TIME', label: 'Full Time' },
        { value: 'PART_TIME', label: 'Part Time' },
        { value: 'CONTRACT', label: 'Contract' },
        { value: 'REMOTE', label: 'Remote' },
        { value: 'INTERNSHIP', label: 'Internship' }
    ];

    const salaryRanges = [
        { value: '', label: 'Any Salary' },
        { value: '0-50000', label: '$0 - $50k' },
        { value: '50000-100000', label: '$50k - $100k' },
        { value: '100000-150000', label: '$100k - $150k' },
        { value: '150000+', label: '$150k+' }
    ];

    useEffect(() => {
        fetchJobs();
        if (user?.userId) {
            fetchAppliedJobs();
        }
    }, [currentPage, searchTerm, user?.userId]);

    const fetchAppliedJobs = async () => {
        try {
            const response = await api.get(`/applications/applicant/${user.userId}`);
            const appliedJobIds = new Set(response.data.map(app => app.job?.id).filter(Boolean));
            setAppliedJobs(appliedJobIds);
        } catch (err) {
            // Silently handle error - user may not have any applications yet
            console.log('No applications found or error fetching:', err.message);
        }
    };

    const fetchJobs = async () => {
        try {
            setLoading(true);
            let response;

            if (searchTerm) {
                response = await api.get(`/jobs/search?keyword=${searchTerm}&page=${currentPage}&size=9`);
            } else {
                response = await api.get(`/jobs?page=${currentPage}&size=9`);
            }

            setJobs(response.data.content || response.data || []);
            setTotalPages(response.data.totalPages || 1);
            setError(null);
        } catch (err) {
            console.error('Error fetching jobs:', err);
            setError('Failed to load jobs. Please try again.');
            // Set sample data for demonstration
            setJobs(getSampleJobs());
        } finally {
            setLoading(false);
        }
    };

    const getSampleJobs = () => [
        {
            id: '1',
            title: 'Senior Frontend Developer',
            company: { name: 'TechCorp Inc.' },
            location: 'San Francisco, CA',
            type: 'FULL_TIME',
            salary: { min: 120000, max: 180000 },
            description: 'We are looking for an experienced Frontend Developer to join our team and help build amazing user experiences using React, TypeScript, and modern web technologies.',
            skills: ['React', 'TypeScript', 'CSS', 'Node.js', 'GraphQL'],
            applicants: 45,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: '2',
            title: 'Full Stack Engineer',
            company: { name: 'StartupXYZ' },
            location: 'Remote',
            type: 'REMOTE',
            salary: { min: 100000, max: 150000 },
            description: 'Join our fast-growing startup as a Full Stack Engineer. You will work on challenging problems and have direct impact on our product direction.',
            skills: ['JavaScript', 'Python', 'AWS', 'PostgreSQL'],
            applicants: 78,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: '3',
            title: 'UX/UI Designer',
            company: { name: 'DesignStudio' },
            location: 'New York, NY',
            type: 'FULL_TIME',
            salary: { min: 90000, max: 130000 },
            description: 'We need a creative UX/UI Designer to craft beautiful and intuitive interfaces. Experience with Figma and design systems is required.',
            skills: ['Figma', 'Adobe XD', 'UI Design', 'User Research'],
            applicants: 32,
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: '4',
            title: 'DevOps Engineer',
            company: { name: 'CloudTech' },
            location: 'Austin, TX',
            type: 'FULL_TIME',
            salary: { min: 130000, max: 170000 },
            description: 'Looking for a DevOps Engineer to help us build and maintain our cloud infrastructure. Experience with Kubernetes and CI/CD pipelines is essential.',
            skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'Jenkins'],
            applicants: 21,
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: '5',
            title: 'Product Manager',
            company: { name: 'InnovateCo' },
            location: 'Seattle, WA',
            type: 'FULL_TIME',
            salary: { min: 140000, max: 190000 },
            description: 'Lead product strategy and execution for our flagship product. You will work closely with engineering, design, and business teams.',
            skills: ['Product Strategy', 'Agile', 'Data Analysis', 'Leadership'],
            applicants: 55,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: '6',
            title: 'Data Scientist',
            company: { name: 'AI Labs' },
            location: 'Boston, MA',
            type: 'CONTRACT',
            salary: { min: 110000, max: 160000 },
            description: 'Join our data science team to build machine learning models that power our AI products. Strong background in statistics and ML is required.',
            skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL'],
            applicants: 67,
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(0);
        fetchJobs();
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        let filteredJobs = getSampleJobs();

        if (filters.type) {
            filteredJobs = filteredJobs.filter(job => job.type === filters.type);
        }
        if (filters.location) {
            filteredJobs = filteredJobs.filter(job =>
                job.location.toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        setJobs(filteredJobs);
        setShowFilters(false);
    };

    const clearFilters = () => {
        setFilters({ type: '', location: '', salary: '' });
        setSearchTerm('');
        fetchJobs();
    };

    const handleApply = async (job) => {
        try {
            await api.post('/applications', {
                jobId: job.id,
                applicantId: user.userId,
                coverLetter: '',
                resumeFileName: null
            });
            // Add to applied jobs set
            setAppliedJobs(prev => new Set([...prev, job.id]));
            alert('Application submitted successfully!');
        } catch (err) {
            console.error('Error applying:', err);
            const errorMessage = err.response?.data?.error || 'Failed to submit application. You may have already applied.';
            alert(errorMessage);
        }
    };

    return (
        <div className="job-listings-page">
            {/* Header */}
            <motion.div
                className="listings-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="container">
                    <h1 className="text-gradient">Find Your Dream Job</h1>
                    <p>Discover {jobs.length}+ opportunities waiting for you</p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="search-bar glass">
                        <div className="search-input-wrapper">
                            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search jobs, companies, or keywords..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Search Jobs
                        </button>
                    </form>
                </div>
            </motion.div>

            <div className="container listings-container">
                {/* Filters Sidebar */}
                <motion.aside
                    className={`filters-sidebar glass-card ${showFilters ? 'active' : ''}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="filters-header">
                        <h3>Filters</h3>
                        <button className="clear-filters" onClick={clearFilters}>
                            Clear All
                        </button>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Job Type</label>
                        <div className="filter-options">
                            {jobTypes.map(type => (
                                <label
                                    key={type.value}
                                    className={`filter-option ${filters.type === type.value ? 'active' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name="jobType"
                                        value={type.value}
                                        checked={filters.type === type.value}
                                        onChange={(e) => handleFilterChange('type', e.target.value)}
                                    />
                                    <span>{type.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Location</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="Enter location..."
                            value={filters.location}
                            onChange={(e) => handleFilterChange('location', e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Salary Range</label>
                        <select
                            className="input"
                            value={filters.salary}
                            onChange={(e) => handleFilterChange('salary', e.target.value)}
                        >
                            {salaryRanges.map(range => (
                                <option key={range.value} value={range.value}>
                                    {range.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={applyFilters}>
                        Apply Filters
                    </button>
                </motion.aside>

                {/* Mobile Filter Toggle */}
                <button
                    className="mobile-filter-toggle btn btn-outline"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filters
                </button>

                {/* Jobs Grid */}
                <main className="jobs-main">
                    {loading ? (
                        <div className="jobs-grid">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="job-card-skeleton glass-card">
                                    <div className="skeleton-header">
                                        <div className="skeleton-logo shimmer"></div>
                                        <div className="skeleton-title">
                                            <div className="skeleton-line shimmer"></div>
                                            <div className="skeleton-line short shimmer"></div>
                                        </div>
                                    </div>
                                    <div className="skeleton-meta">
                                        <div className="skeleton-line shimmer"></div>
                                    </div>
                                    <div className="skeleton-description">
                                        <div className="skeleton-line shimmer"></div>
                                        <div className="skeleton-line shimmer"></div>
                                        <div className="skeleton-line short shimmer"></div>
                                    </div>
                                    <div className="skeleton-footer">
                                        <div className="skeleton-line short shimmer"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : error && jobs.length === 0 ? (
                        <div className="error-state glass-card">
                            <div className="error-icon">⚠️</div>
                            <h3>Oops! Something went wrong</h3>
                            <p>{error}</p>
                            <button className="btn btn-primary" onClick={fetchJobs}>
                                Try Again
                            </button>
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="empty-state glass-card">
                            <div className="empty-icon">🔍</div>
                            <h3>No jobs found</h3>
                            <p>Try adjusting your search or filters to find more opportunities</p>
                            <button className="btn btn-outline" onClick={clearFilters}>
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="jobs-header">
                                <p className="jobs-count">
                                    Showing <strong>{jobs.length}</strong> jobs
                                </p>
                                <select className="sort-select input">
                                    <option value="recent">Most Recent</option>
                                    <option value="salary">Highest Salary</option>
                                    <option value="applicants">Most Popular</option>
                                </select>
                            </div>

                            <AnimatePresence>
                                <motion.div
                                    className="jobs-grid"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ staggerChildren: 0.1 }}
                                >
                                    {jobs.map((job, index) => (
                                        <motion.div
                                            key={job.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <JobCard
                                                job={job}
                                                onApply={handleApply}
                                                showApplyButton={user?.role === 'JOB_SEEKER'}
                                                isApplied={appliedJobs.has(job.id)}
                                            />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </AnimatePresence>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button
                                        className="btn btn-outline"
                                        disabled={currentPage === 0}
                                        onClick={() => setCurrentPage(p => p - 1)}
                                    >
                                        Previous
                                    </button>
                                    <div className="page-numbers">
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i}
                                                className={`page-number ${currentPage === i ? 'active' : ''}`}
                                                onClick={() => setCurrentPage(i)}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        className="btn btn-outline"
                                        disabled={currentPage === totalPages - 1}
                                        onClick={() => setCurrentPage(p => p + 1)}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default JobListings;
