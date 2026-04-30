// React
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router';

// API
import { authApi } from '../../api/account.api';

const VerifyScreen = () => {
    // Grab token from the URL bar
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token'); // might not be named token
    console.log('Verification token from URL:', token);

    // UI State variables
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
        'loading'
    );
    const [message, setMessage] = useState('Verifying your account...');

    // React StrictMode Guard (Prevents double-firing the API call)
    const hasFetched = useRef(false);

    useEffect(() => {
        // If there is no token, we can't verify
        if (!token) {
            setStatus('error');
            setMessage(
                'Verification token is missing. Please check your email for the correct link.'
            );
            return;
        }

        // Prevent double API calls in StrictMode
        if (hasFetched.current) return;
        hasFetched.current = true;

        // Call the API to verify the account
        const verifyAccount = async () => {
            try {
                const res = await authApi.verify(token);

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || 'Verification failed');
                }

                // Verification successful
                setStatus('success');
                setMessage(
                    data.message ||
                        'Your account has been verified! You can now log in.'
                );
            } catch (error) {
                setStatus('error');
                setMessage(
                    error instanceof Error
                        ? error.message
                        : 'An unknown error occurred during verification.'
                );
            }
        };

        verifyAccount();
    }, [token]);

    return (
        // <div style={{ padding: '20px', textAlign: 'center' }}>
        //     {status === 'loading' && <p>{message}</p>}
        //     {status === 'success' && <p style={{ color: 'green' }}>{message}</p>}
        //     {status === 'error' && <p style={{ color: 'red' }}>{message}</p>}
        // </div>

        <div
            style={{
                textAlign: 'center',
                marginTop: '50px',
                fontFamily: 'sans-serif',
            }}
        >
            <h2>Account Verification</h2>

            {/* Show a loading spinner or text while waiting for the server */}
            {status === 'loading' && <p style={{ color: 'gray' }}>{message}</p>}

            {/* Show the success message and a link to login */}
            {status === 'success' && (
                <div>
                    <p style={{ color: 'green', fontWeight: 'bold' }}>
                        ✅ {message}
                    </p>
                    <Link to="/login">
                        <button
                            style={{
                                padding: '10px 20px',
                                marginTop: '10px',
                                cursor: 'pointer',
                            }}
                        >
                            Go to Login
                        </button>
                    </Link>
                </div>
            )}

            {/* Show the error message */}
            {status === 'error' && (
                <div>
                    <p style={{ color: 'red', fontWeight: 'bold' }}>
                        ❌ {message}
                    </p>
                    <p>Please try registering again or contact support.</p>
                </div>
            )}
        </div>
    );
};

export { VerifyScreen };
