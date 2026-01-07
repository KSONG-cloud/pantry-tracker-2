// Styles
import '../styles/header.css';
import '@fontsource/inter/400.css'; // normal
import '@fontsource/inter/500.css'; // medium
import '@fontsource/inter/700.css'; // bold

import { Navbar } from './header/navbar';

interface HeaderProps {
    date: Date;
}

const Header = ({ date }: HeaderProps) => {
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
                <div id="header-profile"></div>
            </div>
        </div>
    );
};

export { Header };
