// First, mock the necessary parts of Supabase
jest.mock("../app/api/supabase/supabase", () => ({
    auth: {
        signOut: jest.fn(() => Promise.resolve()), // Simulate a successful sign-out
        getSession: jest.fn(() => Promise.resolve({ // Simulate fetching user session
            data: { session: { user: { email: "test@example.com" } } }
        }))
    }
}));

// Mock window.location.href
Object.defineProperty(window, 'location', {
    value: {
        href: jest.fn()
    },
    writable: true
});

// Import after mocks
import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../app/page'; // Adjust the import path as necessary
import connection from "../app/api/supabase/supabase";

describe('Home Component', () => {
    it('should display the user email when logged in', async () => {
        render(<Home />);
        const userEmail = await screen.findByText(/Logged in as: test@example.com/i);
        expect(userEmail).toBeInTheDocument();
    });

    it('should handle sign-out and redirect to home page', async () => {
        render(<Home />);
        const signOutButton = screen.getByText(/Sign out/i);
        fireEvent.click(signOutButton);

        expect(connection.auth.signOut).toHaveBeenCalled();
        expect(window.location.href).toBe('/');
    });
});