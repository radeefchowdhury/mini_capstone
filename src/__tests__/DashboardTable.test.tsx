import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardTable from '@/app/components/dashboard/DashboardTable';

describe('DashboardTable', () => {

    const headers = [
        { key: 'id', name: 'ID' },
        { key: 'name', name: 'Name' }
    ];

    const items = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
    ];

    // Test for headers rendering
    it('renders headers correctly', () => {
        render(<DashboardTable headers={headers} items={[]} />);
        headers.forEach(header => {
            expect(screen.getByText(header.name)).toBeInTheDocument();
        });
    });

    // Test for items rendering
    it('renders items correctly', () => {
        render(<DashboardTable headers={headers} items={items} />);
        items.forEach(item => {
            expect(screen.getByText(item.id.toString())).toBeInTheDocument();
            expect(screen.getByText(item.name)).toBeInTheDocument();
        });
    });

    // Test for correct data in cells
    it('renders correct data in cells according to headers', () => {
        render(<DashboardTable headers={headers} items={items} />);
        items.forEach(item => {
            headers.forEach(header => {
                expect(screen.getByText(item[header.key].toString())).toBeInTheDocument();
            });
        });
    });

});
