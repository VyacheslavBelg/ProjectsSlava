import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Archive } from '../api/agent';

const getUserRole = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
            payload.role ||
            payload.Role;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

const isAdmin = () => {
    const role = getUserRole();
    return role === 'Admin' || role === 'Админ' || role === 'admin';
};

export default function SeriesDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [series, setSeries] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        yearPeriod: '',
        description: ''
    });
    const [admin, setAdmin] = useState(false);

    useEffect(() => {
        setAdmin(isAdmin());
        loadSeries();
    }, [id]);

    const loadSeries = async () => {
        try {
            const response = await Archive.getSeries(id);
            setSeries(response.data);
            setFormData({
                code: response.data.code || '',
                name: response.data.name || '',
                yearPeriod: response.data.yearPeriod || '',
                description: response.data.description || ''
            });
        } catch (err) {
            if (err.response?.status === 401) {
                handleLogout();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTextareaChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateSeries = async () => {
        try {
            const response = await fetch(`http://localhost:5024/api/admin/series/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    code: formData.code,
                    name: formData.name,
                    yearPeriod: formData.yearPeriod,
                    description: formData.description
                })
            });

            if (response.ok) {
                setIsEditing(false);
                await loadSeries(); 
                alert('Series updated successfully!');
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || 'Failed to update series'}`);
            }
        } catch (err) {
            console.error('Error updating series:', err);
            alert('Error updating series');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        await handleUpdateSeries();
    };

    if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading series details...</div>;
    if (!series) return <div style={{ padding: '20px', textAlign: 'center' }}>Series not found</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>SERIES DETAILS {admin && '🔧'}</h1>
                <div>
                    <button onClick={() => navigate(-1)} style={{ marginRight: '10px' }}>BACK</button>
                    {admin && !isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            style={{
                                backgroundColor: '#ff9800',
                                color: '#000',
                                fontWeight: 'bold',
                                marginRight: '10px'
                            }}
                        >
                            EDIT SERIES
                        </button>
                    )}
                    <button onClick={handleLogout} style={{ backgroundColor: '#b71c1c', fontSize: '12px' }}>LOGOUT</button>
                </div>
            </div>

            <div style={styles.card}>
                {!isEditing ? (
                    <>
                        {admin && (
                            <div style={{
                                backgroundColor: '#333',
                                padding: '10px 15px',
                                borderRadius: '5px',
                                marginBottom: '20px',
                                border: '2px solid #ff9800',
                                textAlign: 'center'
                            }}>
                                <strong style={{ color: '#ff9800' }}>ADMIN MODE ACTIVE</strong> - You can edit this series
                            </div>
                        )}

                        <h2 style={styles.title}>[{series.code}] {series.name}</h2>

                        <div style={styles.infoSection}>
                            <h3 style={styles.sectionHeader}>SERIES INFORMATION</h3>
                            <div style={styles.infoRow}><strong>Code:</strong> {series.code}</div>
                            <div style={styles.infoRow}><strong>Name:</strong> {series.name}</div>
                            <div style={styles.infoRow}><strong>Period:</strong> {series.yearPeriod}</div>
                            <div style={styles.infoRow}><strong>Description:</strong> {series.description}</div>
                            <div style={styles.infoRow}><strong>Series ID:</strong> {series.id}</div>
                        </div>

                        <div style={styles.infoSection}>
                            <h3 style={styles.sectionHeader}>RELATED DOCUMENTS ({series.documents.length})</h3>
                            {series.documents.length > 0 ? (
                                series.documents.map(doc => (
                                    <div
                                        key={doc.id}
                                        style={{ ...styles.documentItem, cursor: 'pointer' }}
                                        onClick={() => navigate(`/document/${doc.id}`)}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#222'}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <strong>{doc.name}</strong>
                                                <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '3px' }}>
                                                    Case: {doc.caseName}
                                                </div>
                                            </div>
                                            <span style={{
                                                fontSize: '10px',
                                                backgroundColor: doc.securityLevel === 'TOP SECRET' ? '#b71c1c' :
                                                    doc.securityLevel === 'CONFIDENTIAL' ? '#ff9800' : '#4caf50',
                                                color: 'white',
                                                padding: '2px 6px',
                                                borderRadius: '3px'
                                            }}>
                                                {doc.securityLevel}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '5px' }}>
                                            Type: {doc.type} | Created: {formatDate(doc.createDate)}
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#888', marginTop: '5px' }}>
                                            Click to view document →
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', opacity: 0.5, padding: '20px' }}>
                                    No documents found in this series
                                </div>
                            )}
                        </div>

                        {/* Кнопка редактирования снизу */}
                        {admin && (
                            <div style={{ textAlign: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #333' }}>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    style={{
                                        backgroundColor: '#ff9800',
                                        color: '#000',
                                        fontWeight: 'bold',
                                        padding: '12px 30px',
                                        fontSize: '16px'
                                    }}
                                >
                                    📝 EDIT SERIES
                                </button>
                                <p style={{ color: '#888', fontSize: '12px', marginTop: '10px' }}>
                                    Available only for administrators
                                </p>
                            </div>
                        )}
                    </>
                ) : (
                    <form onSubmit={handleSave}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                            <h3 style={{ color: '#ff9800', fontSize: '16px', margin: 0 }}>EDIT SERIES</h3>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" style={{ backgroundColor: '#4caf50', padding: '10px 20px', fontSize: '14px' }}>
                                    SAVE CHANGES
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    style={{ backgroundColor: '#666', padding: '10px 20px', fontSize: '14px' }}
                                >
                                    CANCEL
                                </button>
                            </div>
                        </div>

                        <div style={{
                            backgroundColor: '#222',
                            padding: '20px',
                            borderRadius: '5px',
                            marginBottom: '20px'
                        }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Series Code *</label>
                                    <input
                                        type="text"
                                        name="code"
                                        value={formData.code}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                        required
                                        placeholder="e.g., SER-001"
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Series Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                        required
                                        placeholder="e.g., Operation Red Sky"
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Year Period *</label>
                                    <input
                                        type="text"
                                        name="yearPeriod"
                                        value={formData.yearPeriod}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                        required
                                        placeholder="e.g., 1990-1995"
                                    />
                                    <div style={{ marginTop: '5px', fontSize: '11px', color: '#888' }}>
                                        Format: YYYY-YYYY or single year
                                    </div>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Series ID</label>
                                    <input
                                        type="text"
                                        value={series.id}
                                        style={{ ...styles.input, backgroundColor: '#2a2a2a', color: '#888' }}
                                        disabled
                                    />
                                    <div style={{ marginTop: '5px', fontSize: '11px', color: '#888' }}>
                                        ID cannot be changed
                                    </div>
                                </div>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleTextareaChange}
                                    style={{
                                        ...styles.input,
                                        minHeight: '100px',
                                        resize: 'vertical',
                                        fontFamily: 'inherit'
                                    }}
                                    placeholder="Detailed description of the series..."
                                />
                            </div>

                            <div style={{
                                backgroundColor: '#333',
                                padding: '15px',
                                borderRadius: '5px',
                                marginTop: '20px',
                                borderLeft: '4px solid #ff9800'
                            }}>
                                <strong style={{ color: '#ff9800' }}>⚠️ WARNING:</strong>
                                <ul style={{ margin: '10px 0 0 20px', color: '#ccc', fontSize: '12px' }}>
                                    <li>Changes will be saved immediately after clicking "SAVE"</li>
                                    <li>All changes will be written to the database</li>
                                    <li>Documents in this series will keep their association</li>
                                    <li>Make sure the entered data is correct</li>
                                </ul>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

const styles = {
    card: {
        backgroundColor: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '5px',
        padding: '20px'
    },
    title: {
        borderBottom: '2px solid #555',
        paddingBottom: '10px',
        marginBottom: '20px'
    },
    infoSection: {
        marginBottom: '30px',
        padding: '15px',
        backgroundColor: '#222',
        borderRadius: '5px'
    },
    sectionHeader: {
        color: '#888',
        fontSize: '14px',
        marginBottom: '15px',
        letterSpacing: '1px'
    },
    infoRow: {
        marginBottom: '8px'
    },
    documentItem: {
        backgroundColor: '#222',
        borderLeft: '3px solid #555',
        padding: '10px',
        marginBottom: '10px',
        fontFamily: 'Courier New',
        transition: 'background-color 0.2s'
    },
    formGroup: {
        marginBottom: '20px'
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        color: '#ccc',
        fontSize: '14px',
        fontWeight: 'bold'
    },
    input: {
        width: '100%',
        padding: '10px 12px',
        backgroundColor: '#333',
        border: '1px solid #555',
        color: 'white',
        borderRadius: '4px',
        fontSize: '14px',
        '&:focus': {
            outline: 'none',
            borderColor: '#ff9800'
        }
    }
};