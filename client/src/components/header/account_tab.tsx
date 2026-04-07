// React
import { useState, useRef, useEffect } from 'react';

// Types
import type { User } from '../../types/account';

interface AccountTabProps {
    user: User | null;
    onLogin?: () => void;
    onRegister?: () => void;
    onLogout?: () => void;
}
export const AccountTab = ({
    user,
    onRegister,
    onLogin,
    onLogout,
}: AccountTabProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    // Close panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                panelRef.current &&
                !panelRef.current.contains(event.target as Node)
            ) {
                setIsPanelOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            {/* Account Icon + Hover Tooltip */}
            <div
                id="account-icon"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => setIsPanelOpen(true)}
            >
                <button id="account-button">
                    👤 {/* replace with your icon */}
                </button>

                {/* Hover tooltip */}
                {isHovered && !isPanelOpen && (
                    <div id="account-tab">
                        {user ? user.username : 'Not logged in'}
                        <div onClick={(e) => e.stopPropagation()}>
                            {!user && (
                                <div style={{ marginTop: '8px' }}>
                                    <button onClick={onRegister}>
                                        Register
                                    </button>
                                    <button onClick={onLogin}>Login</button>
                                </div>
                            )}
                            {user && (
                                <div style={{ marginTop: '8px' }}>
                                    <button onClick={onLogout}>Logout</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Side Panel Overlay */}
            {isPanelOpen && (
                <div id="account-panel-overlay">
                    <div ref={panelRef} id="account-panel">
                        <button
                            onClick={() => setIsPanelOpen(false)}
                            id="account-panel-close-button"
                        >
                            ✕
                        </button>
                        <h2>Account</h2>
                        <div onClick={() => setIsPanelOpen(false)}>
                            {user && (
                                <div>
                                    <p>{user.username}</p>
                                    <button onClick={onLogout}>Logout</button>
                                </div>
                            )}
                            {!user && (
                                <div>
                                    <button onClick={onRegister}>
                                        Register
                                    </button>
                                    <button onClick={onLogin}>Login</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
