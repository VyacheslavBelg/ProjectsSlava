import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useChat } from './hooks/useChat';
import Lobby from './components/Lobby';
import ChatRoom from './components/ChatRoom';
import { Auth } from './components/Auth'; 

const App: React.FC = () => {
    const chat = useChat();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const { setUsername } = chat;

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const user = localStorage.getItem('username');
        if (token && user) {

            setUsername(user);
            setIsAuthenticated(true);
        }

    }, [setUsername]);
    

    const handleLoginSuccess = (username: string) => {
        chat.setUsername(username);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.clear();
        setIsAuthenticated(false);
        window.location.reload();
    };

    if (!isAuthenticated) {
        return <Auth onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Выйти</button>
            </div>

            {chat.isInRoom ? (
                <ChatRoom chat={chat} />
            ) : (
                <Lobby chat={chat} />
            )}
        </div>
    );
};

export default App;