// React
import { useEffect, useState } from 'react';

// Components
import ProtectedRoute from './auth/ProtectedRoutes';
import { Header } from './components/header/header';
import { Login } from './components/login/login';
import { TrackPantry } from './components/track_pantry/track_pantry';
import { Loading } from './components/loading/loading';
import { Register } from './components/register/register';

// Routes
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router';
import { authApi } from './api/account.api';

// Types
import type { User } from './types/account';

function App() {
    const today: Date = new Date();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await authApi.getAuthentication();
                const data = await res.json();
                if (res.ok) {
                    setUser(data.result);
                } else {
                    console.warn('Unexpected auth response shape:', data);
                    setUser(null);
                }
            } catch (error) {
                console.error('Error checking auth:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const handleLogOut = async () => {
        try {
            const res = await authApi.logout();
            if (res.ok) {
                setUser(null);
            } else {
                console.error('Logout failed');
                alert('Logout failed');
            }
        } catch (error) {
            console.error('Error during logout:', error);
            alert('An error occurred during logout');
        }
    };

    return (
        <Router>
            <Header date={today} user={user} onLogout={handleLogOut}></Header>
            <Routes>
                <Route path="/loading" element={<Loading />} />
                <Route path="/login" element={<Login setUser={setUser} />} />
                <Route
                    path="/register"
                    element={<Register setUser={setUser} />}
                />
                <Route
                    path="/"
                    element={
                        loading ? (
                            <Loading />
                        ) : user ? (
                            <Navigate to="/pantry" />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route
                    path="/pantry"
                    element={
                        <ProtectedRoute user={user} loading={loading}>
                            {(user) => <TrackPantry userId={user.id} />}
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
