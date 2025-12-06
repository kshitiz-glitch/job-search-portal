import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './LandingPage.css';

const LandingPage = () => {
    return (
        <div className="landing-page">
            {/* Navbar */}
            <nav className="navbar glass">
                <div className="container flex justify-between items-center">
                    <motion.div
                        className="logo text-gradient"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        JobPortal
                    </motion.div>
                    <motion.div
                        className="nav-links flex gap-md items-center"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/register" className="btn btn-primary">Get Started</Link>
                    </motion.div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <motion.div
                        className="hero-content text-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <h1 className="hero-title">
                            Find Your <span className="text-gradient">Dream Job</span>
                            <br />
                            In The Digital Age
                        </h1>
                        <p className="hero-subtitle">
                            Connect with top companies and discover opportunities that match your skills.
                            <br />
                            AI-powered recommendations, real-time updates, and seamless application tracking.
                        </p>
                        <div className="hero-buttons flex gap-md justify-center mt-lg">
                            <Link to="/register" className="btn btn-primary btn-lg">
                                Start Your Journey
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>
                            <Link to="/jobs" className="btn btn-outline btn-lg">
                                Browse Jobs
                            </Link>
                        </div>
                    </motion.div>

                    {/* Floating Cards Animation */}
                    <div className="floating-cards">
                        <motion.div
                            className="floating-card glass-card"
                            animate={{
                                y: [0, -20, 0],
                                rotate: [0, 5, 0]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <div className="card-icon">💼</div>
                            <h3>10,000+</h3>
                            <p>Active Jobs</p>
                        </motion.div>

                        <motion.div
                            className="floating-card glass-card"
                            animate={{
                                y: [0, -25, 0],
                                rotate: [0, -5, 0]
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 0.5
                            }}
                        >
                            <div className="card-icon">🏢</div>
                            <h3>5,000+</h3>
                            <p>Companies</p>
                        </motion.div>

                        <motion.div
                            className="floating-card glass-card"
                            animate={{
                                y: [0, -15, 0],
                                rotate: [0, 3, 0]
                            }}
                            transition={{
                                duration: 4.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 1
                            }}
                        >
                            <div className="card-icon">👥</div>
                            <h3>50,000+</h3>
                            <p>Job Seekers</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="container">
                    <motion.h2
                        className="section-title text-center text-gradient"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Why Choose JobPortal?
                    </motion.h2>

                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="feature-card glass-card"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="feature-icon">{feature.icon}</div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta">
                <div className="container">
                    <motion.div
                        className="cta-content glass-card text-center"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2>Ready to Take the Next Step?</h2>
                        <p>Join thousands of professionals finding their perfect match</p>
                        <Link to="/register" className="btn btn-primary btn-lg mt-md">
                            Create Free Account
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container text-center">
                    <p>&copy; 2025 JobPortal. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

const features = [
    {
        icon: '🤖',
        title: 'AI-Powered Matching',
        description: 'Our intelligent algorithm matches you with jobs that fit your skills and preferences perfectly.'
    },
    {
        icon: '⚡',
        title: 'Real-Time Updates',
        description: 'Get instant notifications about new opportunities and application status changes.'
    },
    {
        icon: '📊',
        title: 'Application Tracking',
        description: 'Track all your applications in one place with our intuitive dashboard.'
    },
    {
        icon: '💬',
        title: 'Direct Messaging',
        description: 'Connect directly with employers through our built-in chat system.'
    },
    {
        icon: '🎯',
        title: 'Smart Filters',
        description: 'Find exactly what you\'re looking for with advanced search and filtering options.'
    },
    {
        icon: '🔒',
        title: 'Secure & Private',
        description: 'Your data is protected with enterprise-grade security measures.'
    }
];

export default LandingPage;
