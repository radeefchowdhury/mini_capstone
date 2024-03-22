import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActionIcon from '../app/components/Dashboard/ActionIcon'; 

// Mock Icon component
const MockIcon = React.forwardRef((props, ref) => (
    <svg {...props} ref={ref}>
        <title>Mock Icon</title>
    </svg>
));

describe('ActionIcon', () => {
    // Test for rendering
    it('renders the icon correctly', () => {
        render(<ActionIcon Icon={MockIcon} onClick={() => {}} />);
        expect(screen.getByTitle('Mock Icon')).toBeInTheDocument();
    });

    // Test click event
    it('calls onClick prop when the icon is clicked', () => {
        const handleClick = jest.fn();
        render(<ActionIcon Icon={MockIcon} onClick={handleClick} />);
        fireEvent.click(screen.getByTitle('Mock Icon'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    // Test for the presence of custom classes
    it('has the correct classes applied to the icon', () => {
        const { container } = render(<ActionIcon Icon={MockIcon} onClick={() => {}} />);
        expect(container.firstChild).toHaveClass('flex items-center justify-center py-1 px-3 mx-auto bg-blue-500 text-white text-sm rounded-md');
    });
});
