import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'JOB_SEEKER'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await register(formData);

        if (result.success) {
            navigate(formData.role === 'EMPLOYER' ? '/employer/dashboard' : '/dashboard');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="auth-page">
            <Link to="/" className="back-button glass">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back to Home
            </Link>

            <motion.div
                className="auth-container glass-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="auth-header">
                    <h1 className="text-gradient">Create Account</h1>
                    <p>Join thousands of professionals finding their dream jobs</p>
                </div>

                {error && (
                    <motion.div
                        className="error-message"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-row">
                        <div className="input-group">
                            <label className="input-label">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                className="input"
                                placeholder="John"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                className="input"
                                placeholder="Doe"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className="input"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="input"
                            placeholder="At least 6 characters"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">I am a</label>
                        <div className="role-selector">
                            <label className={`role-option glass ${formData.role === 'JOB_SEEKER' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="JOB_SEEKER"
                                    checked={formData.role === 'JOB_SEEKER'}
                                    onChange={handleChange}
                                />
                                <div className="role-content">
                                    <div className="role-icon">👤</div>
                                    <div>
                                        <div className="role-title">Job Seeker</div>
                                        <div className="role-desc">Looking for opportunities</div>
                                    </div>
                                </div>
                            </label>

                            <label className={`role-option glass ${formData.role === 'EMPLOYER' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="EMPLOYER"
                                    checked={formData.role === 'EMPLOYER'}
                                    onChange={handleChange}
                                />
                                <div className="role-content">
                                    <div className="role-icon">🏢</div>
                                    <div>
                                        <div className="role-title">Employer</div>
                                        <div className="role-desc">Hiring talented people</div>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login" className="auth-link">Sign in</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
