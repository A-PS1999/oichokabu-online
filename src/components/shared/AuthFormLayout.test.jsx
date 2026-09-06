import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import AuthFormLayout from './AuthFormLayout';

describe('AuthFormLayout', () => {
    it('renders heading, subheading, children and footer', () => {
        renderWithProviders(
            <AuthFormLayout
                heading="Test Heading"
                subheading="Test subheading"
                className="test"
                footer={<div>Test footer</div>}
            >
                <input placeholder="Test child" />
            </AuthFormLayout>
        );

        expect(screen.getByRole('heading', { level: 2, name: /test heading/i })).toBeInTheDocument();
        expect(screen.getByText("Test subheading")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Test child")).toBeInTheDocument();
        expect(screen.getByText("Test footer")).toBeInTheDocument();
    });

    it('does not render a subheading when none is provided', () => {
        renderWithProviders(
            <AuthFormLayout heading="Test Heading" className="test">
                <input placeholder="Test child" />
            </AuthFormLayout>
        );

        expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
    });
});