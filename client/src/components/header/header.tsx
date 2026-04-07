// Styles
import '../../styles/header/header.css';
import '@fontsource/inter/400.css'; // normal
import '@fontsource/inter/500.css'; // medium
import '@fontsource/inter/700.css'; // bold

// Components
import { Navbar } from './navbar';
import { AccountTab } from './account_tab';

// Types
import type { User } from '../../types/account';

// React
import { useNavigate } from 'react-router';

interface HeaderProps {
    date: Date;
    user: User | null;
    onLogout: () => void;
}

const Header = ({ date, user, onLogout }: HeaderProps) => {
    const navigate = useNavigate();
    return (
        <div id="header-background">
            <div id="header-left">
                <div id="header-icon"></div>
                <div id="header-title">My Pantry</div>
            </div>
            <div id="header-middle">
                <Navbar></Navbar>
            </div>
            <div id="header-right">
                <div id="header-date">
                    {date.toLocaleDateString('en-AU', {
                        dateStyle: 'short',
                    })}
                </div>
                <div id="header-profile">
                    <AccountTab
                        user={user}
                        onRegister={() => {
                            navigate('/register');
                        }}
                        onLogin={() => {
                            navigate('/login');
                        }}
                        onLogout={() => {
                            onLogout();
                        }}
                    ></AccountTab>
                </div>
            </div>
        </div>
    );
};

export { Header };
