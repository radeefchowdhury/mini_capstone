import { render, act, screen } from '@testing-library/react';
import Home from '../app/login/page'; // Adjust the import path as necessary
import connection from "../app/api/supabase/supabase";
import userEvent from '@testing-library/user-event';

// First, mock the necessary parts of Supabase
jest.mock("../app/api/supabase/supabase", () => ({
    auth: {
        signOut: jest.fn(() => Promise.resolve()), // Simulate a successful sign-out
        getSession: jest.fn(() => Promise.resolve({ // Simulate fetching user session
            data: { session: { user: { email: "test@example.com" } } }
        }))
    }
}));

describe('Home Page', () => {
    it('renders the main promotional message', () => {
        render(<Home />);
        expect(screen.getByText(/Welcome to Home Haven/i)).toBeInTheDocument();
    });

    it('has the background image set', () => {
        render(<Home />);
        const backgroundImageDiv = screen.getByTestId('background-image');
        // This will check if the backgroundImage includes the specified URL, regardless of minor formatting differences.
        expect(backgroundImageDiv.style.backgroundImage).toContain('https://images.rentals.ca/property-pictures/large/mississauga-on/253705/apartment-17442588.jpg');
    });



    it('displays the logo', () => {
        render(<Home />);
        expect(screen.getByTitle(/logo/i)).toBeInTheDocument();
    });


    it('renders the login component', () => {
        render(<Home />);
        expect(screen.getByText(/Sign in to access your account/i)).toBeInTheDocument();
    });

    it('shows a link to the sign-up page', () => {
        render(<Home />);
        const signUpLink = screen.getByRole('link', { name: /sign up/i });
        expect(signUpLink).toHaveAttribute('href', 'signup');
    });
});


