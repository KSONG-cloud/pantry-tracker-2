import { useLocation, Link } from 'react-router';

const CheckEmailScreen = () => {
    // We can grab the email address passed from the Register screen to make the UI friendly!
    const location = useLocation();
    console.log('Location in CheckEmailScreen:', location);
    const userEmail = location.state?.email || 'your inbox';

    return (
        <div
            style={{
                textAlign: 'center',
                marginTop: '50px',
                fontFamily: 'sans-serif',
            }}
        >
            <h2>✉️ Check Your Email</h2>
            <p>
                We just sent a verification link to <strong>{userEmail}</strong>
                .
            </p>
            <p>Please click the link in that email to activate your account.</p>

            <p style={{ fontSize: '12px', color: 'gray', marginTop: '30px' }}>
                Didn't receive an email? Check your spam folder or{' '}
                <Link to="/register">try again</Link>.
            </p>
        </div>
    );
};

export { CheckEmailScreen };
