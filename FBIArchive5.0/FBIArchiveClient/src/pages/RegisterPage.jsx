import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Auth } from '../api/agent';
import Layout from '../components/Layout';

export default function RegisterPage() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            await Auth.register(formData.name, formData.email, formData.password);
            alert("Agent created. Please log in now.");
            navigate('/');
        } catch (err) {
            setError('Registration error. Email might be already taken.');
        }
    };

    return (
        <Layout title="AGENT REGISTRATION">
            <input placeholder="Your name" onChange={e => setFormData({ ...formData, name: e.target.value })} />
            <input placeholder="Work Email" onChange={e => setFormData({ ...formData, email: e.target.value })} />
            <input type="password" placeholder="Password" onChange={e => setFormData({ ...formData, password: e.target.value })} />

            {error && <p className="error">{error}</p>}

            <button onClick={handleSubmit}>Create Account</button>
            <Link to="/"><button className="link">Already have access? Log in</button></Link>
        </Layout>
    );
}