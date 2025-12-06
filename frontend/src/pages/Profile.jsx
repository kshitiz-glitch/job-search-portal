import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './Profile.css';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [newSkill, setNewSkill] = useState('');

    const [profile, setProfile] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.profile?.phone || '',
        location: user?.profile?.location || '',
        title: user?.profile?.title || '',
        bio: user?.profile?.bio || '',
        company: user?.profile?.company || '',
        website: user?.profile?.website || '',
        linkedin: user?.profile?.linkedin || '',
        github: user?.profile?.github || '',
        skills: user?.profile?.skills || ['React', 'JavaScript', 'TypeScript', 'Node.js', 'CSS'],
        experience: user?.profile?.experience || [
            {
                id: '1',
                title: 'Senior Developer',
                company: 'Tech Company',
                location: 'San Francisco, CA',
                startDate: '2021-01',
                endDate: '',
                current: true,
                description: 'Leading frontend development team and building scalable applications.'
            }
        ],
        education: user?.profile?.education || [
            {
                id: '1',
                degree: 'Bachelor of Science in Computer Science',
                school: 'University of California',
                year: '2020'
            }
        ]
    });

    const tabs = [
        { id: 'profile', label: 'Profile', icon: '👤' },
        { id: 'experience', label: 'Experience', icon: '💼' },
        { id: 'education', label: 'Education', icon: '🎓' },
        { id: 'settings', label: 'Settings', icon: '⚙️' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleAddSkill = (e) => {
        e.preventDefault();
        if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
            setProfile(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()]
            }));
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setProfile(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            // In a real app, this would make an API call
            // await api.put(`/users/${user.id}/profile`, profile);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (updateUser) {
                updateUser({ ...user, ...profile, profile });
            }

            setEditing(false);
            alert('Profile saved successfully!');
        } catch (err) {
            console.error('Error saving profile:', err);
            alert('Failed to save profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="profile-page">
            <div className="container">
                {/* Profile Header */}
                <motion.div
                    className="profile-header glass-card"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="profile-header-content">
                        <div className="avatar-section">
                            <div className="avatar">
                                {profile.firstName?.charAt(0)}{profile.lastName?.charAt(0)}
                            </div>
                            <button className="avatar-upload-btn glass">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                        </div>
                        <div className="profile-info">
                            <h1>{profile.firstName} {profile.lastName}</h1>
                            <p className="profile-title">{profile.title || 'Add your professional title'}</p>
                            <div className="profile-meta">
                                {profile.location && (
                                    <span className="meta-item">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {profile.location}
                                    </span>
                                )}
                                <span className="meta-item">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    {profile.email}
                                </span>
                            </div>
                        </div>
                        <div className="profile-actions">
                            {editing ? (
                                <>
                                    <button
                                        className="btn btn-outline"
                                        onClick={() => setEditing(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleSave}
                                        disabled={saving}
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </>
                            ) : (
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setEditing(true)}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="18" height="18">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>

                <div className="profile-content">
                    {/* Tabs Navigation */}
                    <motion.div
                        className="profile-tabs glass"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <span className="tab-icon">{tab.icon}</span>
                                <span className="tab-label">{tab.label}</span>
                            </button>
                        ))}
                    </motion.div>

                    {/* Tab Content */}
                    <motion.div
                        className="profile-tab-content"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {activeTab === 'profile' && (
                            <div className="tab-panel">
                                {/* Basic Info */}
                                <div className="profile-section glass-card">
                                    <h3>Basic Information</h3>
                                    <div className="form-grid">
                                        <div className="input-group">
                                            <label className="input-label">First Name</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                className="input"
                                                value={profile.firstName}
                                                onChange={handleChange}
                                                disabled={!editing}
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label className="input-label">Last Name</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                className="input"
                                                value={profile.lastName}
                                                onChange={handleChange}
                                                disabled={!editing}
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label className="input-label">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                className="input"
                                                value={profile.email}
                                                onChange={handleChange}
                                                disabled={true}
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label className="input-label">Phone</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                className="input"
                                                value={profile.phone}
                                                onChange={handleChange}
                                                disabled={!editing}
                                                placeholder="+1 (555) 123-4567"
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label className="input-label">Location</label>
                                            <input
                                                type="text"
                                                name="location"
                                                className="input"
                                                value={profile.location}
                                                onChange={handleChange}
                                                disabled={!editing}
                                                placeholder="City, State"
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label className="input-label">Professional Title</label>
                                            <input
                                                type="text"
                                                name="title"
                                                className="input"
                                                value={profile.title}
                                                onChange={handleChange}
                                                disabled={!editing}
                                                placeholder="e.g., Senior Software Engineer"
                                            />
                                        </div>
                                        <div className="input-group full-width">
                                            <label className="input-label">Bio</label>
                                            <textarea
                                                name="bio"
                                                className="input textarea"
                                                rows="4"
                                                value={profile.bio}
                                                onChange={handleChange}
                                                disabled={!editing}
                                                placeholder="Tell us about yourself..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="profile-section glass-card">
                                    <h3>Skills</h3>
                                    <div className="skills-container">
                                        {profile.skills.map((skill, index) => (
                                            <motion.span
                                                key={index}
                                                className="skill-tag"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                            >
                                                {skill}
                                                {editing && (
                                                    <button
                                                        className="remove-skill"
                                                        onClick={() => handleRemoveSkill(skill)}
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </motion.span>
                                        ))}
                                    </div>
                                    {editing && (
                                        <form onSubmit={handleAddSkill} className="add-skill-form">
                                            <input
                                                type="text"
                                                className="input"
                                                value={newSkill}
                                                onChange={(e) => setNewSkill(e.target.value)}
                                                placeholder="Add a skill..."
                                            />
                                            <button type="submit" className="btn btn-outline">
                                                Add
                                            </button>
                                        </form>
                                    )}
                                </div>

                                {/* Social Links */}
                                <div className="profile-section glass-card">
                                    <h3>Social Links</h3>
                                    <div className="form-grid">
                                        <div className="input-group">
                                            <label className="input-label">LinkedIn</label>
                                            <input
                                                type="url"
                                                name="linkedin"
                                                className="input"
                                                value={profile.linkedin}
                                                onChange={handleChange}
                                                disabled={!editing}
                                                placeholder="https://linkedin.com/in/username"
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label className="input-label">GitHub</label>
                                            <input
                                                type="url"
                                                name="github"
                                                className="input"
                                                value={profile.github}
                                                onChange={handleChange}
                                                disabled={!editing}
                                                placeholder="https://github.com/username"
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label className="input-label">Website</label>
                                            <input
                                                type="url"
                                                name="website"
                                                className="input"
                                                value={profile.website}
                                                onChange={handleChange}
                                                disabled={!editing}
                                                placeholder="https://yourwebsite.com"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Resume Upload */}
                                <div className="profile-section glass-card">
                                    <h3>Resume</h3>
                                    <div className="resume-upload">
                                        <div className="upload-area">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="48" height="48">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <p>Drop your resume here or <span className="text-gradient">browse</span></p>
                                            <span className="upload-hint">PDF, DOC, DOCX (Max 5MB)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'experience' && (
                            <div className="tab-panel">
                                <div className="profile-section glass-card">
                                    <div className="section-header">
                                        <h3>Work Experience</h3>
                                        {editing && (
                                            <button className="btn btn-outline btn-sm">
                                                + Add Experience
                                            </button>
                                        )}
                                    </div>
                                    <div className="experience-list">
                                        {profile.experience.map((exp) => (
                                            <div key={exp.id} className="experience-item">
                                                <div className="exp-logo">
                                                    {exp.company.charAt(0)}
                                                </div>
                                                <div className="exp-content">
                                                    <h4>{exp.title}</h4>
                                                    <p className="exp-company">{exp.company}</p>
                                                    <p className="exp-meta">
                                                        {exp.location} • {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                                    </p>
                                                    <p className="exp-description">{exp.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'education' && (
                            <div className="tab-panel">
                                <div className="profile-section glass-card">
                                    <div className="section-header">
                                        <h3>Education</h3>
                                        {editing && (
                                            <button className="btn btn-outline btn-sm">
                                                + Add Education
                                            </button>
                                        )}
                                    </div>
                                    <div className="education-list">
                                        {profile.education.map((edu) => (
                                            <div key={edu.id} className="education-item">
                                                <div className="edu-icon">🎓</div>
                                                <div className="edu-content">
                                                    <h4>{edu.degree}</h4>
                                                    <p className="edu-school">{edu.school}</p>
                                                    <p className="edu-year">{edu.year}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="tab-panel">
                                <div className="profile-section glass-card">
                                    <h3>Account Settings</h3>
                                    <div className="settings-list">
                                        <div className="setting-item">
                                            <div className="setting-info">
                                                <h4>Email Notifications</h4>
                                                <p>Receive email updates about new jobs and applications</p>
                                            </div>
                                            <label className="toggle">
                                                <input type="checkbox" defaultChecked />
                                                <span className="toggle-slider"></span>
                                            </label>
                                        </div>
                                        <div className="setting-item">
                                            <div className="setting-info">
                                                <h4>Profile Visibility</h4>
                                                <p>Make your profile visible to employers</p>
                                            </div>
                                            <label className="toggle">
                                                <input type="checkbox" defaultChecked />
                                                <span className="toggle-slider"></span>
                                            </label>
                                        </div>
                                        <div className="setting-item">
                                            <div className="setting-info">
                                                <h4>Job Alerts</h4>
                                                <p>Get notified when new jobs match your preferences</p>
                                            </div>
                                            <label className="toggle">
                                                <input type="checkbox" defaultChecked />
                                                <span className="toggle-slider"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="profile-section glass-card danger-zone">
                                    <h3>Danger Zone</h3>
                                    <div className="danger-actions">
                                        <button className="btn btn-outline">
                                            Change Password
                                        </button>
                                        <button className="btn btn-danger">
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
