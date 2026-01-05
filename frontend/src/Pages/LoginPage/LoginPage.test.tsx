import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from './LoginPage';
import { useAuth } from '@context/useAuth';

jest.mock('@context/useAuth');

describe('LoginPage', () => {
  const loginUserMock = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      loginUser: loginUserMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form fields', () => {
    render(<LoginPage />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('submits valid credentials', async () => {
    const user = userEvent.setup();
    loginUserMock.mockResolvedValue(undefined);

    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/password/i), 'secret123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(loginUserMock).toHaveBeenCalledTimes(1);
    expect(loginUserMock).toHaveBeenCalledWith(
      'john@example.com',
      'secret123'
    );
  });
});
