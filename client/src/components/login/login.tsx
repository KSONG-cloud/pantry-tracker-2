import { useState } from 'react';
import { useNavigate } from 'react-router';
import { authApi } from '../../api/account.api';

// Types
import type { User } from '../../types/account';

interface LoginProps {
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const Login = ({ setUser }: LoginProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await authApi.login(email, password);

        const data = await res.json();

        if (res.ok) {
            setUser(data.user);
            navigate('/pantry');
        } else {
            console.error('Login failed:', data);
            alert('Login failed: ' + data.message);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
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
                <button type="submit">Login</button>
            </form>
        </div>
    );
};
