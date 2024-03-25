import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Page from '../../app/dashboard/profile/page'; // Adjust the import path as necessary
import { act } from 'react-dom/test-utils';

global.URL.createObjectURL = jest.fn(() => "mock-profile-picture-url");

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

jest.mock("../../app/api/userprofile/UserProfileAPI", () => ({
    getUserSession: jest.fn(() => Promise.resolve({ user: { id: "user_id" } })),
    submitUserProfile: jest.fn(userProfile => Promise.resolve(userProfile)),
    getUserProfile: jest.fn(() => Promise.resolve({ data: [{}], error: null })),
    uploadProfilePicture: jest.fn((profilePictureFile, fileName) => Promise.resolve()),
    getProfilePictureURL: jest.fn(fileName => Promise.resolve('url_to_image')),
    getUserProfileById: jest.fn(() => Promise.resolve({ data: [{}], error: null })),
}));

describe('Edit Profile Page', () => {
    beforeEach(async () => {
        Storage.prototype.getItem = jest.fn(() => 'RENTER');
        await act(async () => {
            render(<Page />);
        });
    });


    it('renders profile information fields', async() => {
        await expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
        await expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
        await expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        await expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
    });


    it('allows the user to update profile information', async () => {
        await userEvent.type(screen.getByLabelText(/First Name/i), 'UpdatedName');
        expect(screen.getByLabelText(/First Name/i)).toHaveValue('UpdatedName');

        await userEvent.type(screen.getByLabelText(/Email/i), 'updated@example.com');
        expect(screen.getByLabelText(/Email/i)).toHaveValue('updated@example.com');
    });

    it('displays error message for invalid profile inputs', async () => {
        await userEvent.clear(screen.getByLabelText(/First Name/i));
        await userEvent.type(screen.getByLabelText(/First Name/i), 'Jo'); // Less than 3 characters
        await userEvent.click(screen.getByText(/Save/i));

        const error = await screen.findByText(/First name must be at least 3 characters long/i);
        expect(error).toBeInTheDocument();
    });

    it('handles profile picture file selection and upload', async () => {
        const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
        const input = screen.getByTestId('profile-picture-upload');

        await userEvent.upload(input, file);
        expect(input.files[0]).toStrictEqual(file);
        expect(input.files).toHaveLength(1);

        await userEvent.click(screen.getByText(/Upload/i));
        expect(screen.getByAltText('profile picture').src).toContain('http://localhost/url_to_image');
    });

    it.skip('toggles visibility of registration key', async () => {
        const parentElement = screen.getByRole('button', { name: /eye/i }).parentNode; // Assuming the text is a direct child of the button's parent
        expect(parentElement.textContent).toContain('***');

        await userEvent.click(screen.getByRole('button', { name: /eye/i }));

        expect(parentElement.textContent).not.toContain('***');
    });

});
