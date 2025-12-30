import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HiddenString from './HiddenString';

describe('HiddenString component', () => {
  test('shows truncated text and reveals full text on click', async () => {
    const user = userEvent.setup();
    render(<HiddenString text={'SensitiveDataHere'} signsVisible={6} />);

    // Initially truncated
    expect(screen.getByText(/Sensit.../i)).toBeInTheDocument();
    const btn = screen.getByRole('button', { name: /show/i });
    expect(btn).toBeInTheDocument();

    // Click show and expect full text
    await user.click(btn);
    expect(screen.getByText('SensitiveDataHere')).toBeInTheDocument();
  });
});
