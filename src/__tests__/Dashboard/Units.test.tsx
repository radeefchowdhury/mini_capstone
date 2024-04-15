import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Page from '../../app/dashboard/units/Page'; // Adjust the import path as necessary
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

// Mocking necessary API calls
jest.mock('../../app/api/property/PropertyAPI', () => ({
    getCondosFromCompany: jest.fn(() => Promise.resolve({
        data: [
            {
                id: 'condo1',
                name: 'Condo One',
                property_name: 'Property One',
                address: '123 Main St',
                number: '101',
                fee: 500,
                size: 50,
                parking_spots: [],
                lockers: [],
                files: [],
            },
        ],
        error: null,
    })),
    getCondosFromOccupant: jest.fn(() => Promise.resolve({
        data: [],
        error: null,
    })),
    getPropertyIdByName: jest.fn(() => Promise.resolve({ data: [{ id: 'property1' }], error: null })),
    registerCondoUnitWithKey: jest.fn(),
    submitCondoProfile: jest.fn(),
    updateRegistrationKey: jest.fn(),
}));

jest.mock('../../app/api/property/ParkingLockerAPI', () => ({
    getParkingLockerListFromProperty: jest.fn(() => Promise.resolve({
        data: [
            { id: 'parking1', details: 'Parking spot details' },
            { id: 'locker1', details: 'Locker details' },
        ],
        error: null,
    })),
}));

// Mock components that are not being tested
jest.mock('../../app/components/dashboard/DashboardPanel', () => {
    return ({ children }) => <div>{children}</div>;
});

jest.mock('../../app/components/dashboard/ActionButton', () => {
    return ({ onClick, title }) => <button onClick={onClick}>{title}</button>;
});

jest.mock('../../app/components/dashboard/ActionIcon', () => {
    return ({ onClick }) => <button onClick={onClick}>Edit</button>;
});

describe('Condo Units Management Page', () => {
    beforeEach(async () => {
        Storage.prototype.getItem = jest.fn().mockImplementation((key) => {
            if (key === 'user_role') return 'COMPANY';
            if (key === 'user_id') return 'userId123';
        });
        await act(async () => {
            render(<Page />);
        });
    });

    it.skip('fetches condo data on mount for a company user', async () => {
        await waitFor(() => {
            expect(screen.getByText('Condo One')).toBeInTheDocument();
        });
    });

    it.skip('allows a user to create a new condo unit', async () => {
        const registerButton = screen.getByText('Edit');
        userEvent.click(registerButton);

        await waitFor(() => {
            expect(screen.getByText(/Condo Name/i)).toBeInTheDocument();
            expect(screen.getByText(/Property Name/i)).toBeInTheDocument();
            expect(screen.getByText(/Condo Number/i)).toBeInTheDocument();
        });
    });

});
