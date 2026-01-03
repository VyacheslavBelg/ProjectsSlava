import React, { useState } from 'react';
import api from '../api';

interface AuthProps {
    onLoginSuccess: (username: string) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const endpoint = isLogin ? '/Auth/login' : '/Auth/register';

            if (!isLogin) {
                await api.post(endpoint, { username, password });
                alert("Sucsesfuly registration. Now log in");
                setIsLogin(true);
                return;
            }

            const response = await api.post(endpoint, { username, password });
            const { accessToken, refreshToken, username: user } = response.data;


            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('username', user);

            onLoginSuccess(user);

        } catch (err: any) {
            setError(err.response?.data || "Error");
        }
    };

    return (
        <div className="card p-4 mx-auto mt-5" style={{ maxWidth: '400px' }}>
            <h3 className="text-center">{isLogin ? "Log in" : "Register"}</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Name</label>
                    <input
                        className="form-control"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                    {isLogin ? "Log in" : "Register"}
                </button>
            </form>

            <div className="text-center mt-3">
                <button
                    className="btn btn-link"
                    onClick={() => setIsLogin(!isLogin)}
                >
                    {isLogin ? "Dont have account? Create" : "I already have account. Enter"}
                </button>
            </div>
        </div>
    );
};