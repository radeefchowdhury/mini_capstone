import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../app/signup/page'; // Adjust the import path as necessary
import SignUp from '../app/components/Authentification/SignUp';
import { act } from 'react-dom/test-utils';

// Assuming there's a mock function or additional setup needed for testing, include it here
// For this example, we'll assume no additional mocks are needed outside of what's provided in the components

jest.mock("../app/api/supabase/supabase", () => ({
    auth: {
        signUp: jest.fn(() => Promise.resolve({
            user: {}, // Mock user object or whatever the signUp function is supposed to return
            error: null // or an error object if you want to simulate an error response
        })),
        signOut: jest.fn(() => Promise.resolve()), // Simulate a successful sign-out
        getSession: jest.fn(() => Promise.resolve({ // Simulate fetching user session
            data: { session: { user: { email: "test@example.com" } } }
        })),
    },
    // Add a mock implementation for the `from` method
    from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(), // Chainable method, returns self
        insert: jest.fn().mockResolvedValue({ data: [], error: null }), // Resolve with mock data
        update: jest.fn().mockResolvedValue({ data: [], error: null }), // Resolve with mock data
        delete: jest.fn().mockResolvedValue({ data: [], error: null }), // Resolve with mock data
        // Add other methods as needed
    }),
}));



describe('Signup Page', () => {
    beforeEach(() => {
        render(<Home />);
    });

    let originalLocation;

    beforeAll(() => {
        // Save the original location
        const originalLocation = window.location;

        delete window.location;
        window.location = { ...originalLocation, assign: jest.fn(), href: "" };

        // If using TypeScript, you might need to cast window.location to any before assigning to it
    });

    afterAll(() => {
        // Restore the original location
        window.location = originalLocation;
    });


    it('renders the main heading', () => {
        expect(screen.getByText(/Get your free account now./i)).toBeInTheDocument();
    });

    it('displays the promotional message correctly', () => {
        expect(screen.getByText(/Let’s get you all set up so you can verify your personal account and begin setting up your profile./i)).toBeInTheDocument();
    });

    it('shows a link to the log in page', () => {
        const loginLink = screen.getByRole('link', { name: /log in/i });
        expect(loginLink).toHaveAttribute('href', 'login');
    });

    it('allows the user to select account type', async () => {
        const renterButton = screen.getByRole('button', { name: /I wish to rent/i });
        const ownerButton = screen.getByRole('button', { name: /I own a condo/i });

        await userEvent.click(ownerButton);
        expect(ownerButton).toHaveClass('bg-[#5752DA] text-white');
        expect(renterButton).not.toHaveClass('bg-[#5752DA] text-white');

        await userEvent.click(renterButton);
        expect(renterButton).toHaveClass('bg-[#5752DA] text-white');
        expect(ownerButton).not.toHaveClass('bg-[#5752DA] text-white');
    });

    it('updates input fields on user input', async () => {
        await userEvent.type(screen.getByLabelText(/First Name/i), 'Jane');
        expect(screen.getByLabelText(/First Name/i)).toHaveValue('Jane');

        await userEvent.type(screen.getByLabelText(/Last Name/i), 'Doe');
        expect(screen.getByLabelText(/Last Name/i)).toHaveValue('Doe');
    });


    it('shows password mismatch error', async () => {
        await userEvent.type(screen.getByLabelText(/First Name/i), 'Test'); // Adjust according to actual label text
        await userEvent.type(screen.getByLabelText(/Last Name/i), 'Test');
        await userEvent.type(screen.getByLabelText(/Phone number/i), '123-456-7890'); // Adjust according to actual label text
        await userEvent.type(screen.getByLabelText(/Email address/i), 'test123@gmail.com');
        await userEvent.type(screen.getByLabelText('Password'), 'password');
        await userEvent.type(screen.getByLabelText(/Confirm password/i), 'different');
        await userEvent.click(screen.getByTestId('signup-button'));

        // Use findByText for potentially asynchronous updates
        const mismatchError = await screen.findByText(/Passwords do not match. Please try again./i);
        expect(mismatchError).toBeInTheDocument();
    });


    it('submits the form successfully when passwords match', async () => {
        const signUpSpy = jest.spyOn(require("../app/api/supabase/supabase").auth, 'signUp');

        await userEvent.type(screen.getByLabelText(/First Name/i), 'Test'); // Adjust according to actual label text
        await userEvent.type(screen.getByLabelText(/Last Name/i), 'Test');
        await userEvent.type(screen.getByLabelText(/Phone number/i), '123-456-7890'); // Adjust according to actual label text
        await userEvent.type(screen.getByLabelText(/Email address/i), 'test123@gmail.com');
        await userEvent.type(screen.getByLabelText('Password'), 'password');
        await userEvent.type(screen.getByLabelText(/Confirm password/i), 'password');

        await act(async () => {
            await userEvent.click(screen.getByTestId('signup-button'));
        });

        expect(signUpSpy).toHaveBeenCalledWith({
            email: 'test123@gmail.com',
            password: 'password'
        });
    });


});
