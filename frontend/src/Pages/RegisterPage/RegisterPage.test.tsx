import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterPage from './RegisterPage';
import { useAuth } from '../../Context/useAuth';

jest.mock('../../Context/useAuth');

describe('RegisterPage', () => {
  const registerUserMock = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      registerUser: registerUserMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders registration form fields', () => {
    render(<RegisterPage />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  test('submits valid registration data', async () => {
    const user = userEvent.setup();
    registerUserMock.mockResolvedValue(undefined);

    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/username/i), 'john_doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/phone number/i), '+49123456789');

    // Select sellerType (react-select)
    // await user.selectOptions(screen.getByLabelText(/seller type/i), '1'); // it doesn't work that way for react-select!
    const sellerTypeSelect = screen.getByLabelText(/seller type/i);
    await user.click(sellerTypeSelect); // open dropdown
    const option = screen.getByText(/Institutional Seller/i);
    await user.click(option);

    await user.type(screen.getByLabelText(/password/i), 'secret123');
    await user.click(screen.getByRole('button', { name: /register/i }));

    expect(registerUserMock).toHaveBeenCalledTimes(1);
    expect(registerUserMock).toHaveBeenCalledWith(
      "john_doe",
      "john@example.com",
      "+49123456789",
      1,
      "secret123"
    );
  });
});
