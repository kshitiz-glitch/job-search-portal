import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './CreateJob.css';

const CreateJob = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [newSkill, setNewSkill] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: '',
        responsibilities: '',
        location: '',
        type: 'FULL_TIME',
        salary: {
            min: '',
            max: ''
        },
        skills: [],
        benefits: '',
        expiresAt: ''
    });

    const jobTypes = [
        { value: 'FULL_TIME', label: 'Full Time', icon: '⏰' },
        { value: 'PART_TIME', label: 'Part Time', icon: '🕐' },
        { value: 'CONTRACT', label: 'Contract', icon: '📝' },
        { value: 'REMOTE', label: 'Remote', icon: '🏠' },
        { value: 'INTERNSHIP', label: 'Internship', icon: '🎓' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'salaryMin' || name === 'salaryMax') {
            setFormData(prev => ({
                ...prev,
                salary: {
                    ...prev.salary,
                    [name === 'salaryMin' ? 'min' : 'max']: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAddSkill = (e) => {
        e.preventDefault();
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()]
            }));
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate user.userId exists (backend returns 'userId' not 'id')
        if (!user?.userId) {
            alert('User session error. Please logout and login again.');
            console.error('User ID is missing:', user);
            return;
        }

        try {
            setLoading(true);

            const jobData = {
                title: formData.title,
                description: formData.description,
                location: formData.location,
                type: formData.type,
                postedBy: { id: user.userId },
                salary: {
                    min: parseInt(formData.salary.min) || 0,
                    max: parseInt(formData.salary.max) || 0
                },
                requirements: formData.requirements.split('\n').filter(r => r.trim()),
                responsibilities: formData.responsibilities.split('\n').filter(r => r.trim()),
                benefits: formData.benefits.split('\n').filter(b => b.trim()),
                skills: formData.skills,
                status: 'ACTIVE',
                expiresAt: formData.expiresAt ? `${formData.expiresAt}T23:59:59` : null
            };

            console.log('Posting job with data:', jobData);
            await api.post('/jobs', jobData);
            alert('Job posted successfully!');
            navigate('/employer/dashboard');
        } catch (err) {
            console.error('Error posting job:', err);
            alert('Failed to post job. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        if (step < 3) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const isStep1Valid = formData.title && formData.description && formData.location;
    const isStep2Valid = formData.requirements || formData.skills.length > 0;

    return (
        <div className="create-job-page">
            <div className="container">
                {/* Back Link */}
                <Link to="/employer/dashboard" className="back-link">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12.5 15L7.5 10L12.5 5" />
                    </svg>
                    Back to Dashboard
                </Link>

                <motion.div
                    className="create-job-container"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Header */}
                    <div className="page-header">
                        <h1 className="text-gradient">Post a New Job</h1>
                        <p>Fill in the details to find the perfect candidate</p>
                    </div>

                    {/* Progress Steps */}
                    <div className="progress-steps">
                        <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                            <div className="step-number">1</div>
                            <span>Basic Info</span>
                        </div>
                        <div className="step-line"></div>
                        <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                            <div className="step-number">2</div>
                            <span>Requirements</span>
                        </div>
                        <div className="step-line"></div>
                        <div className={`step ${step >= 3 ? 'active' : ''}`}>
                            <div className="step-number">3</div>
                            <span>Preview</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="job-form glass-card">
                        {/* Step 1: Basic Info */}
                        {step === 1 && (
                            <motion.div
                                className="form-step"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <h2>Basic Information</h2>

                                <div className="input-group">
                                    <label className="input-label">Job Title *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        className="input"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="e.g., Senior Frontend Developer"
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Job Description *</label>
                                    <textarea
                                        name="description"
                                        className="input textarea"
                                        rows="5"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Describe the role, team, and what makes this opportunity exciting..."
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="input-group">
                                        <label className="input-label">Location *</label>
                                        <input
                                            type="text"
                                            name="location"
                                            className="input"
                                            value={formData.location}
                                            onChange={handleChange}
                                            placeholder="e.g., San Francisco, CA or Remote"
                                            required
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label className="input-label">Job Type *</label>
                                        <div className="job-type-selector">
                                            {jobTypes.map(type => (
                                                <label
                                                    key={type.value}
                                                    className={`type-option ${formData.type === type.value ? 'active' : ''}`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="type"
                                                        value={type.value}
                                                        checked={formData.type === type.value}
                                                        onChange={handleChange}
                                                    />
                                                    <span className="type-icon">{type.icon}</span>
                                                    <span>{type.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="input-group">
                                        <label className="input-label">Minimum Salary ($)</label>
                                        <input
                                            type="number"
                                            name="salaryMin"
                                            className="input"
                                            value={formData.salary.min}
                                            onChange={handleChange}
                                            placeholder="e.g., 80000"
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Maximum Salary ($)</label>
                                        <input
                                            type="number"
                                            name="salaryMax"
                                            className="input"
                                            value={formData.salary.max}
                                            onChange={handleChange}
                                            placeholder="e.g., 120000"
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Application Deadline</label>
                                    <input
                                        type="date"
                                        name="expiresAt"
                                        className="input"
                                        value={formData.expiresAt}
                                        onChange={handleChange}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Requirements */}
                        {step === 2 && (
                            <motion.div
                                className="form-step"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <h2>Requirements & Skills</h2>

                                <div className="input-group">
                                    <label className="input-label">Key Requirements</label>
                                    <p className="input-hint">Enter each requirement on a new line</p>
                                    <textarea
                                        name="requirements"
                                        className="input textarea"
                                        rows="5"
                                        value={formData.requirements}
                                        onChange={handleChange}
                                        placeholder="5+ years of experience in web development
Bachelor's degree in Computer Science
Excellent communication skills"
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Responsibilities</label>
                                    <p className="input-hint">Enter each responsibility on a new line</p>
                                    <textarea
                                        name="responsibilities"
                                        className="input textarea"
                                        rows="5"
                                        value={formData.responsibilities}
                                        onChange={handleChange}
                                        placeholder="Lead frontend development initiatives
Collaborate with design team
Mentor junior developers"
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Required Skills</label>
                                    <div className="skills-container">
                                        {formData.skills.map((skill, index) => (
                                            <span key={index} className="skill-tag">
                                                {skill}
                                                <button
                                                    type="button"
                                                    className="remove-skill"
                                                    onClick={() => handleRemoveSkill(skill)}
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="add-skill-form">
                                        <input
                                            type="text"
                                            className="input"
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            placeholder="Add a skill (e.g., React, Python)"
                                            onKeyPress={(e) => e.key === 'Enter' && handleAddSkill(e)}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline"
                                            onClick={handleAddSkill}
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Benefits & Perks</label>
                                    <p className="input-hint">Enter each benefit on a new line</p>
                                    <textarea
                                        name="benefits"
                                        className="input textarea"
                                        rows="4"
                                        value={formData.benefits}
                                        onChange={handleChange}
                                        placeholder="💰 Competitive salary
🏥 Health insurance
🏖️ Unlimited PTO"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Preview */}
                        {step === 3 && (
                            <motion.div
                                className="form-step"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <h2>Preview Your Job Posting</h2>

                                <div className="job-preview">
                                    <div className="preview-header">
                                        <div className="preview-logo">
                                            {user?.profile?.company?.charAt(0) || 'C'}
                                        </div>
                                        <div className="preview-info">
                                            <h3>{formData.title || 'Job Title'}</h3>
                                            <p>{user?.profile?.company || 'Your Company'}</p>
                                            <div className="preview-meta">
                                                <span>📍 {formData.location || 'Location'}</span>
                                                <span>💼 {jobTypes.find(t => t.value === formData.type)?.label}</span>
                                                {formData.salary.min && formData.salary.max && (
                                                    <span>💰 ${(formData.salary.min / 1000).toFixed(0)}k - ${(formData.salary.max / 1000).toFixed(0)}k</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="preview-section">
                                        <h4>Description</h4>
                                        <p>{formData.description || 'No description provided'}</p>
                                    </div>

                                    {formData.requirements && (
                                        <div className="preview-section">
                                            <h4>Requirements</h4>
                                            <ul>
                                                {formData.requirements.split('\n').filter(r => r.trim()).map((req, i) => (
                                                    <li key={i}>{req}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {formData.skills.length > 0 && (
                                        <div className="preview-section">
                                            <h4>Required Skills</h4>
                                            <div className="preview-skills">
                                                {formData.skills.map((skill, i) => (
                                                    <span key={i} className="skill-tag">{skill}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {formData.benefits && (
                                        <div className="preview-section">
                                            <h4>Benefits</h4>
                                            <ul>
                                                {formData.benefits.split('\n').filter(b => b.trim()).map((benefit, i) => (
                                                    <li key={i}>{benefit}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Form Actions */}
                        <div className="form-actions">
                            {step > 1 && (
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={prevStep}
                                >
                                    Previous
                                </button>
                            )}

                            {step < 3 ? (
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={nextStep}
                                    disabled={step === 1 && !isStep1Valid}
                                >
                                    Continue
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Publishing...' : 'Publish Job'}
                                </button>
                            )}
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default CreateJob;
