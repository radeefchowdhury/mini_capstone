import { render, screen, fireEvent } from '@testing-library/react';
import PopupPanel from '@/app/components/dashboard/PopupPanel';
import '@testing-library/jest-dom';

describe('PopupPanel', () => {
    // Test for rendering based on visibility prop
    it('renders when visible is true', () => {
        render(
            <PopupPanel title="Test Panel" visible={true} setVisible={() => {}} />
        );
        expect(screen.getByText('Test Panel')).toBeInTheDocument();
    });

    it('does not render when visible is false', () => {
        render(
            <PopupPanel title="Test Panel" visible={false} setVisible={() => {}} />
        );
        expect(screen.queryByText('Test Panel')).not.toBeInTheDocument();
    });

    // Test for title display
    it('displays the title', () => {
        render(
            <PopupPanel title="Panel Title" visible={true} setVisible={() => {}} />
        );
        expect(screen.getByText('Panel Title')).toBeInTheDocument();
    });


    // Test for the buttonTitle and onClick prop
    it('button calls onClick prop when clicked, if buttonTitle is provided', () => {
        const handleClick = jest.fn();
        render(
            <PopupPanel title="Click Test" buttonTitle="Click Me" onClick={handleClick} visible={true} setVisible={() => {}} />
        );
        fireEvent.click(screen.getByText(/click me/i));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    // Test for the visibility of the action button based on buttonTitle prop
    it('action button is visible if buttonTitle is provided', () => {
        render(
            <PopupPanel title="Button Visibility Test" buttonTitle="Action Button" visible={true} setVisible={() => {}} />
        );
        expect(screen.getByText('Action Button')).toBeInTheDocument();
    });

    it('action button is not rendered if buttonTitle is not provided', () => {
        render(
            <PopupPanel title="No Button Test" visible={true} setVisible={() => {}} />
        );
        expect(screen.queryByRole('button', { name: 'Action Button' })).not.toBeInTheDocument();
    });
});
