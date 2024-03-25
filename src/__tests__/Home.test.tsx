import { render, act, screen } from '@testing-library/react';
import Home from '../app/page'; // Adjust the import path as necessary
import connection from "../app/api/supabase/SupabaseContextProvider";
import userEvent from '@testing-library/user-event';

// First, mock the necessary parts of Supabase
jest.mock("../app/api/supabase/SupabaseContextProvider", () => ({
    auth: {
        signOut: jest.fn(() => Promise.resolve()), // Simulate a successful sign-out
        getSession: jest.fn(() => Promise.resolve({ // Simulate fetching user session
            data: { session: { user: { email: "test@example.com" } } }
        }))
    }
}));

describe('Home Component', () => {

    beforeEach(() => {
        // Reset mocks before each test
        connection.auth.signOut.mockClear();
        connection.auth.getSession.mockClear();
    });

    it('should render without crashing', async () => {
        await act(async () => {
            render(<Home />);
        });
        // If the component renders without throwing, the test will pass.
        // You can add more assertions here if needed.
    });

    it.skip('renders sign-in button when user is not signed in', async () => {
        // Mock getSession to simulate no user session
        connection.auth.getSession.mockResolvedValueOnce({ data: { session: null } });

        render(<Home />);
        const signInButton = await screen.findByRole('button', { name: /log in/i });
        expect(signInButton).toBeInTheDocument();
    });

    it.skip('renders sign-up button when user is not signed in', async () => {
        // Ensure getSession is mocked to simulate no user session for this test as well
        connection.auth.getSession.mockResolvedValueOnce({ data: { session: null } });

        render(<Home />);
        const signUpButton = await screen.findByRole('button', { name: /sign up/i });
        expect(signUpButton).toBeInTheDocument();
    });

    it.skip('displays dropdown menu when profile picture is clicked', async () => {

        connection.auth.getSession.mockResolvedValue({
            data: { session: { user: { email: "test@example.com" } } }
        });

        render(<Home />);

        const profilePicture = await screen.findByAltText('profile');
        await userEvent.click(profilePicture);

        // Check for the presence of dropdown menu items
        const profileOption = await screen.findByText('Profile');
        const dashboardOption = await screen.findByText('Dashboard');
        const rentingOption = await screen.findByText('Renting');

        expect(profileOption).toBeInTheDocument();
        expect(dashboardOption).toBeInTheDocument();
        expect(rentingOption).toBeInTheDocument();
    });



});


