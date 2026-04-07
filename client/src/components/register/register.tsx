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
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await authApi.register(username, email, password);

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
                <button type="submit">Register</button>
            </form>
        </div>
    );
};
