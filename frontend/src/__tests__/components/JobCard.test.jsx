import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect, vi } from 'vitest';
import JobCard from '../../components/JobCard';

const mockJob = {
    id: '123',
    title: 'Senior Frontend Developer',
    company: {
        name: 'TechCorp Inc.',
        logo: null
    },
    location: 'San Francisco, CA',
    type: 'FULL_TIME',
    salary: {
        min: 100000,
        max: 150000,
        currency: 'USD'
    },
    skills: ['React', 'TypeScript', 'Node.js'],
    createdAt: new Date().toISOString(),
    applicants: 5
};

const renderJobCard = (props = {}) => {
    return render(
        <BrowserRouter>
            <JobCard job={mockJob} {...props} />
        </BrowserRouter>
    );
};

describe('JobCard Component', () => {
    test('renders job title', () => {
        renderJobCard();
        expect(screen.getByText('Senior Frontend Developer')).toBeInTheDocument();
    });

    test('renders company name', () => {
        renderJobCard();
        expect(screen.getByText('TechCorp Inc.')).toBeInTheDocument();
    });

    test('renders location', () => {
        renderJobCard();
        expect(screen.getByText('San Francisco, CA')).toBeInTheDocument();
    });

    test('renders job type badge', () => {
        renderJobCard();
        expect(screen.getByText('Full Time')).toBeInTheDocument();
    });

    test('renders salary range', () => {
        renderJobCard();
        expect(screen.getByText('$100k - $150k')).toBeInTheDocument();
    });

    test('renders skills tags', () => {
        renderJobCard();
        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
        expect(screen.getByText('Node.js')).toBeInTheDocument();
    });

    test('renders applicant count', () => {
        renderJobCard();
        expect(screen.getByText('5 applicants')).toBeInTheDocument();
    });

    test('has link to job details', () => {
        renderJobCard();
        const viewDetailsLink = screen.getByText('View Details');
        expect(viewDetailsLink.closest('a')).toHaveAttribute('href', '/jobs/123');
    });

    test('renders apply button when showApplyButton is true', () => {
        renderJobCard({ showApplyButton: true });
        expect(screen.getByText('Apply Now')).toBeInTheDocument();
    });

    test('calls onApply when apply button is clicked', () => {
        const onApply = vi.fn();
        renderJobCard({ onApply, showApplyButton: true });

        const applyButton = screen.getByText('Apply Now');
        fireEvent.click(applyButton);

        expect(onApply).toHaveBeenCalledWith(mockJob);
    });

    test('displays company initial when no logo', () => {
        renderJobCard();
        expect(screen.getByText('T')).toBeInTheDocument();
    });
});
