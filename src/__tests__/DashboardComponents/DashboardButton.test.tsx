import { render, act, screen, fireEvent } from '@testing-library/react';
import ActionButton from '@/app/components/dashboard/ActionButton';



describe('ActionButton', () => {
    // Test for rendering
    it('renders correctly', () => {
        const { title } = 'Test Button';
        render(<ActionButton text={title} onClick={() => {}} />);
        expect(screen.getByRole('button', { name: title })).toBeInTheDocument();
    });

    // Test click event
    it('calls onClick prop when clicked', () => {
        const handleClick = jest.fn();
        render(<ActionButton text="Click Me" onClick={handleClick} />);
        fireEvent.click(screen.getByText(/click me/i));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    // Test for displaying title prop
    it('displays the title prop', () => {
        const title = 'Dynamic Title';
        render(<ActionButton text={title} onClick={() => {}} />);
        expect(screen.getByRole('button')).toHaveTextContent(title);
    });

    // Optionally, test for the presence of custom classes
    it('has the correct classes applied', () => {
        const { container } = render(<ActionButton text="Styled Button" onClick={() => {}} />);
        expect(container.firstChild).toHaveClass('flex items-center justify-center py-1 px-3 mx-auto bg-blue-500 text-white text-sm rounded-md');
    });
});