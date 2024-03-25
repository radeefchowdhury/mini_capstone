import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Page from '../../app/dashboard/properties/Page'; // Adjust the import path as necessary
import { act } from 'react-dom/test-utils';

jest.mock("../../app/api/supabase/SupabaseContextProvider", () => ({
    auth: {
        getSession: jest.fn(() => Promise.resolve({
            data: { session: { user: { id: "user_id" } } }
        })),
    },
    from: jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({ data: [{} as user], error: null }),
        upsert: jest.fn().mockResolvedValue({ data: null, error: null }),
    }),
    storage: {
        from: jest.fn().mockReturnValue({
            upload: jest.fn().mockResolvedValue({ error: null }),
            getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'url_to_image' }, error: null })
        })
    }
}));

// Mock necessary imports
jest.mock("../../app/api/property/PropertyAPI", () => ({
    getPropertiesFromCompany: jest.fn(() => Promise.resolve({
        data: [
            // Example property data
            {
                id: 'property1',
                name: 'Property One',
                address: '123 Main St',
                unit_count: 10,
                parking_spots: [{ id: 'park1' }],
                lockers: [{ id: 'locker1' }],
                units: [{ id: 'unit1', files: [{ id: 'file1' }] }],
            },
        ],
        error: null,
    })),
    submitPropertyProfile: jest.fn(),
}));

jest.mock("../../app/components/dashboard/DashboardPanel", () => {
    return ({ children }) => <div>{children}</div>;
});

jest.mock("../../app/components/dashboard/ActionButton", () => {
    return ({ onClick, title }) => <button onClick={onClick}>{title}</button>;
});

jest.mock("../../app/components/dashboard/ActionIcon", () => {
    return ({ onClick }) => <button onClick={onClick}>Edit Property</button>;
});

describe('Property Management Page', () => {
    beforeEach(async () => {
        Storage.prototype.getItem = jest.fn().mockImplementation((key) => {
            if (key === 'user_role') return 'COMPANY';
            if (key === 'user_id') return 'userId123';
        });
        await act(async () => {
            render(<Page />);
        });
    });

    it('fetches property data on mount', async () => {
        await waitFor(() => {
            expect(screen.getByText('Property One')).toBeInTheDocument();
        });
    });

    it('opens property file view when "View Files" button is clicked', async () => {
        const viewFilesButton = screen.getByText('View Files (1)');
        userEvent.click(viewFilesButton);

        await waitFor(() => {
            expect(screen.getByText(/File Name/i)).toBeInTheDocument();
            expect(screen.getByText(/File Type/i)).toBeInTheDocument();
            expect(screen.getByText(/Condo Name/i)).toBeInTheDocument();
        });
    });

    it('opens parking locker view when "View Parking" button is clicked', async () => {
        const viewParkingButton = screen.getByText('View Parking (1)');
        userEvent.click(viewParkingButton);

        await waitFor(() => {
            expect(screen.getByText(/Parking ID/i)).toBeInTheDocument();
            expect(screen.getByText(/Parking Fee/i)).toBeInTheDocument();
            expect(screen.getByText(/Status/i)).toBeInTheDocument();
        });
    });

    it('allows user to switch to create new property form', async () => {
        const viewRegisterButton = screen.getByText(/Edit Property/i);
        userEvent.click(viewRegisterButton);

        await waitFor(() => {
            expect(screen.getByText(/Parking Count/i)).toBeInTheDocument();
            expect(screen.getByText(/Locker Count/i)).toBeInTheDocument();
        });
    });


});
