import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardPanel from '../app/components/Dashboard/DashboardPanel';

describe('DashboardPanel', () => {
    // Test for rendering the title
    it('renders the title correctly', () => {
        render(<DashboardPanel title="Test Panel" />);
        expect(screen.getByText('Test Panel')).toBeInTheDocument();
    });

    // Test for rendering children
    it('renders children content', () => {
        const childrenContent = 'Panel Content';
        render(<DashboardPanel title="Test Panel">{childrenContent}</DashboardPanel>);
        expect(screen.getByText(childrenContent)).toBeInTheDocument();
    });

    // Test for rendering the action button if buttonTitle is provided
    it('renders the action button when buttonTitle is provided', () => {
        render(<DashboardPanel title="Test Panel" buttonTitle="Click Me" />);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeVisible();
    });


    // Test click event of the action button
    it('calls onClick prop when the action button is clicked', () => {
        const handleClick = jest.fn();
        render(<DashboardPanel title="Test Panel" buttonTitle="Action" onClick={handleClick} />);
        fireEvent.click(screen.getByText('Action'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
