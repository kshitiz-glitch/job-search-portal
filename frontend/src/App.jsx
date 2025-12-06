import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import JobListings from './pages/JobListings';
import JobDetails from './pages/JobDetails';
import Applications from './pages/Applications';
import Profile from './pages/Profile';
import CreateJob from './pages/CreateJob';
import SavedJobs from './pages/SavedJobs';
import Analytics from './pages/Analytics';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <JobSeekerDashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="/employer/dashboard" element={
                        <ProtectedRoute role="EMPLOYER">
                            <EmployerDashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="/jobs" element={
                        <ProtectedRoute>
                            <JobListings />
                        </ProtectedRoute>
                    } />

                    <Route path="/jobs/create" element={
                        <ProtectedRoute role="EMPLOYER">
                            <CreateJob />
                        </ProtectedRoute>
                    } />

                    <Route path="/jobs/:id" element={
                        <ProtectedRoute>
                            <JobDetails />
                        </ProtectedRoute>
                    } />

                    <Route path="/applications" element={
                        <ProtectedRoute>
                            <Applications />
                        </ProtectedRoute>
                    } />

                    <Route path="/saved-jobs" element={
                        <ProtectedRoute>
                            <SavedJobs />
                        </ProtectedRoute>
                    } />

                    <Route path="/analytics" element={
                        <ProtectedRoute role="EMPLOYER">
                            <Analytics />
                        </ProtectedRoute>
                    } />

                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
