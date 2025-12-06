import { renderHook, act } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '../../context/AuthContext';

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock the API using Vitest
vi.mock('../../api/axios', () => ({
    default: {
        post: vi.fn(),
        get: vi.fn(),
        defaults: { headers: { common: {} } }
    }
}));

import api from '../../api/axios';

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

describe('AuthContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorageMock.getItem.mockReturnValue(null);
    });

    test('provides initial state with no user', () => {
        const { result } = renderHook(() => useAuth(), { wrapper });

        expect(result.current.user).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
    });

    test('loads user from localStorage on mount', () => {
        const storedUser = {
            id: '123',
            email: 'test@example.com',
            role: 'JOB_SEEKER'
        };
        localStorageMock.getItem.mockImplementation((key) => {
            if (key === 'token') return 'test-token';
            if (key === 'user') return JSON.stringify(storedUser);
            return null;
        });

        const { result } = renderHook(() => useAuth(), { wrapper });

        expect(result.current.user).toEqual(storedUser);
        expect(result.current.isAuthenticated).toBe(true);
    });

    test('logout clears user and token', async () => {
        const storedUser = {
            id: '123',
            email: 'test@example.com',
            role: 'JOB_SEEKER'
        };
        localStorageMock.getItem.mockImplementation((key) => {
            if (key === 'token') return 'test-token';
            if (key === 'user') return JSON.stringify(storedUser);
            return null;
        });

        const { result } = renderHook(() => useAuth(), { wrapper });

        act(() => {
            result.current.logout();
        });

        expect(result.current.user).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
    });
});
