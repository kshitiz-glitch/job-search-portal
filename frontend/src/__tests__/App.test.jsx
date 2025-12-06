import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';

// Mock axios
vi.mock('../api/axios', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        defaults: { headers: { common: {} } }
    }
}));

// Simple test for routing setup
describe('App Routing', () => {
    test('AuthProvider renders without crashing', () => {
        const TestComponent = () => <div>Test Content</div>;

        render(
            <BrowserRouter>
                <AuthProvider>
                    <TestComponent />
                </AuthProvider>
            </BrowserRouter>
        );

        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    test('BrowserRouter provides routing context', () => {
        const { container } = render(
            <BrowserRouter>
                <div data-testid="router-test">Router Works</div>
            </BrowserRouter>
        );

        expect(screen.getByTestId('router-test')).toBeInTheDocument();
    });
});
