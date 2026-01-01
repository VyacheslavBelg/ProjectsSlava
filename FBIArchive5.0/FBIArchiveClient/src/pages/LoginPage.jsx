import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Auth } from '../api/agent';
import Layout from '../components/Layout';

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            const response = await Auth.login(formData.email, formData.password);
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard'); 
        } catch (err) {
            setError('Access denied. Please check the data you entered.');
        }
    };

    return (
        <Layout title="ARCHIVE ACCESS">
            <input
                placeholder="Work Email"
                onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
            <input
                type="password"
                placeholder="Password"
                onChange={e => setFormData({ ...formData, password: e.target.value })}
            />

            {error && <p className="error">{error}</p>}

            <button onClick={handleSubmit}>Identify</button>
            <Link to="/register"><button className="link">No access? Register</button></Link>
        </Layout>
    );
}