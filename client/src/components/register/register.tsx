import { useState } from 'react';
import { useNavigate } from 'react-router';
import { authApi } from '../../api/account.api';

// Types
import type { User } from '../../types/account';

interface RegisterProps {
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const Register = ({ setUser }: RegisterProps) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await authApi.register(username, email, password);

        const data = await res.json();

        if (res.ok) {
            setUser(data.user);
            navigate('/check-email', { state: { email } });
        } else {
            console.error('Login failed:', data);
            alert('Login failed: ' + data.message);
        }
    };

    // Handle email validation
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        if (emailError) {
            setEmailError(false);
            setEmailErrorMessage('');
        }
    };

    const validateEmailFormat = async () => {
        if (email.length === 0) return;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const isValidFormat = emailRegex.test(email);

        if (!isValidFormat) {
            setEmailError(true);
            setEmailErrorMessage(
                'Please enter a valid email format. For example: john@example.com'
            );
            return;
        }

        // setEmailError(false);  Do I even need this line???

        try {
            const res = await authApi.checkEmail(email);

            if (!res.ok) throw new Error('Server failed');

            const data = await res.json();

            if (data.emailExists) {
                setEmailError(true);
                setEmailErrorMessage(
                    'This email is already registered. Please log in.'
                );
            } else {
                setEmailErrorMessage('');
            }
        } catch (error) {
            console.error('Could not verify email:', error);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={handleEmailChange}
                        onBlur={validateEmailFormat}
                        style={{ borderColor: emailError ? 'red' : undefined }}
                    />
                    {emailError && (
                        <p
                            style={{
                                color: 'red',
                                fontSize: '12px',
                                marginTop: '4px',
                            }}
                        >
                            {emailErrorMessage}
                        </p>
                    )}
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};
