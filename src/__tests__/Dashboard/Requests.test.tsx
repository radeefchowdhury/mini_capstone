import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Page from '../../app/dashboard/requests/Page'; // Adjust the import path as necessary
import { act } from 'react-dom/test-utils';

// Mock necessary API and context provider calls
jest.mock('../../app/api/request/RequestAPI', () => ({
    getRequestDataFromOwner: jest.fn(() => Promise.resolve({
        data: [
            {
                id: 'request1',
                unit: { name: 'Condo One' },
                type: 'Maintenance',
                date: '2023-03-25',
                amount: '100',
                status: 'Pending',
            },
        ],
        error: null,
    })),
    submitRequest: jest.fn(),
    getCondoIDFromName: jest.fn(() => Promise.resolve({ data: [{ id: 'condo1' }], error: null })),
}));

jest.mock('../../app/api/property/PropertyAPI', () => ({
    getCondosFromOccupant: jest.fn(() => Promise.resolve({
        data: [{ name: 'Condo One' }, { name: 'Condo Two' }],
        error: null,
    })),
}));

// Mock components that are not being directly tested
jest.mock('../../app/components/dashboard/DashboardPanel', () => {
    return ({ children, onClick, buttonTitle }) => (
        <div>
            <button onClick={onClick}>{buttonTitle}</button>
            {children}
        </div>
    );
});

jest.mock('../../app/components/dashboard/DashboardTable', () => {
    return ({ items, headers }) => (
        <div>
            {items.map((item, index) => (
                <div key={index}>{item.condo_name} - {item.request_type}</div>
            ))}
        </div>
    );
});

describe('Requests Management Page', () => {
    beforeEach(async () => {
        Storage.prototype.getItem = jest.fn().mockImplementation((key) => {
            if (key === 'user_role') return 'OWNER';
            if (key === 'user_id') return 'userId123';
        });
        await act(async () => {
            render(<Page />);
        });
    });

    it('fetches request data on mount', async () => {
        await waitFor(() => {
            expect(screen.getByText('Condo One - Maintenance')).toBeInTheDocument();
        });
    });

    it('opens request form when "Create New Request" button is clicked', async () => {
        userEvent.click(screen.getByText('Create New Request'));
        await waitFor(() => {
            expect(screen.getByText('Type')).toBeInTheDocument();
            expect(screen.getByText('Description')).toBeInTheDocument();
        });
    });

});
