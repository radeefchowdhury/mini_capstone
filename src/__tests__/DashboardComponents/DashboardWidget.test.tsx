import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardWidget from '@/app/components/dashboard/DashboardWidget';

describe('DashboardWidget', () => {
    // Define a mock icon component for testing purposes
    const MockIcon = () => <div>Icon</div>;

    // Test for rendering the title and value
    it('renders the title and value correctly', () => {
        const title = "Test Widget";
        const value = "123";
        render(<DashboardWidget icon={MockIcon} icon_color="bg-blue-500" title={title} value={value} />);
        expect(screen.getByText(title)).toBeInTheDocument();
        expect(screen.getByText(value)).toBeInTheDocument();
    });

    // Test for rendering the icon with the correct color
    it('renders the icon with the correct color', () => {
        const iconColor = "bg-blue-500";
        render(<DashboardWidget icon={MockIcon} icon_color={iconColor} title="Test Widget" value="123" />);
        const iconDiv = screen.getByText('Icon').parentNode;
        expect(iconDiv).toHaveClass(iconColor);
    });
});
