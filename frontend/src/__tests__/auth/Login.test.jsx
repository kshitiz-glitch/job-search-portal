import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { AuthProvider } from '../../context/AuthContext';
import Login from '../../pages/auth/Login';

// Mock the API using Vitest
vi.mock('../../api/axios', () => ({
    default: {
        post: vi.fn(),
        get: vi.fn(),
        defaults: { headers: { common: {} } }
    }
}));

const renderLogin = () => {
    return render(
        <BrowserRouter>
            <AuthProvider>
                <Login />
            </AuthProvider>
        </BrowserRouter>
    );
};

describe('Login Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders login form', () => {
        renderLogin();

        expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter your password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    });

    test('shows validation error for empty fields', async () => {
        renderLogin();

        const submitButton = screen.getByRole('button', { name: /Sign In/i });
        fireEvent.click(submitButton);

        // HTML5 validation should prevent submission
        const emailInput = screen.getByPlaceholderText(/you@example.com/i);
        expect(emailInput).toBeRequired();
    });

    test('has link to registration page', () => {
        renderLogin();

        const registerLink = screen.getByText(/Sign up/i);
        expect(registerLink).toBeInTheDocument();
        expect(registerLink.closest('a')).toHaveAttribute('href', '/register');
    });
});
