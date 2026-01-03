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

const CASE_STATUSES = [
    'Закрыто',
    'Активно',
    'Приостановлено',
    'Передано в другой орган',
    'Архив',
    'Рассекречено'
];

export default function CaseDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [caseItem, setCaseItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        description: '',
        status: '',
        openDate: '',
        closeDate: ''
    });
    const [admin, setAdmin] = useState(false);

    useEffect(() => {
        setAdmin(isAdmin());
        loadCase();
    }, [id]);

    const loadCase = async () => {
        try {
            const response = await Archive.getCase(id);
            setCaseItem(response.data);
            setFormData({
                code: response.data.code || '',
                name: response.data.name || '',
                description: response.data.description || '',
                status: response.data.status || '',
                openDate: response.data.openDate?.split('T')[0] || '',
                closeDate: response.data.closeDate?.split('T')[0] || ''
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
        if (!dateString) return 'Не указана';
        return new Date(dateString).toLocaleDateString();
    };

    const getStatusColor = (status) => {
        if (!status) return '#757575';

        const statusLower = status.toLowerCase();

        if (statusLower.includes('актив')) return '#4caf50';
        if (statusLower.includes('закрыт')) return '#f44336';
        if (statusLower.includes('приостанов')) return '#ff9800';
        if (statusLower.includes('архив')) return '#9c27b0';
        if (statusLower.includes('рассекреч')) return '#00bcd4';
        if (statusLower.includes('передано')) return '#2196f3';
        if (statusLower.includes('investigation')) return '#ff9800';
        if (statusLower.includes('closed')) return '#f44336';
        if (statusLower.includes('active')) return '#4caf50';
        if (statusLower.includes('pending')) return '#9c27b0';

        return '#757575';
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

    const handleUpdateCase = async () => {
        try {
            const response = await fetch(`http://localhost:5024/api/admin/case/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    code: formData.code,
                    name: formData.name,
                    description: formData.description,
                    status: formData.status,
                    openDate: formData.openDate ? new Date(formData.openDate) : null,
                    closeDate: formData.closeDate ? new Date(formData.closeDate) : null
                })
            });

            if (response.ok) {
                setIsEditing(false);
                await loadCase();
                alert('Case updated successfully!');
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || 'Failed to update case'}`);
            }
        } catch (err) {
            console.error('Error updating case:', err);
            alert('Error updating case');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        await handleUpdateCase();
    };

    if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading case details...</div>;
    if (!caseItem) return <div style={{ padding: '20px', textAlign: 'center' }}>Case not found</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>CASE DETAILS {admin && '🔧'}</h1>
                <div>
                    <button onClick={() => navigate(-1)} style={{ marginRight: '10px' }}>BACK</button>
                    <button onClick={handleLogout} style={{ backgroundColor: '#b71c1c', fontSize: '12px' }}>LOGOUT</button>
                </div>
            </div>

            <div style={styles.card}>
                {!isEditing ? (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={styles.title}>CASE #{caseItem.code}: {caseItem.name}</h2>
                            <span style={{
                                fontSize: '12px',
                                backgroundColor: getStatusColor(caseItem.status),
                                color: 'white',
                                padding: '5px 10px',
                                borderRadius: '3px',
                                fontWeight: 'bold'
                            }}>
                                {caseItem.status || 'UNKNOWN STATUS'}
                            </span>
                        </div>

                        {admin && (
                            <div style={{
                                backgroundColor: '#333',
                                padding: '10px 15px',
                                borderRadius: '5px',
                                marginBottom: '20px',
                                border: '2px solid #ff9800',
                                textAlign: 'center'
                            }}>
                                <strong style={{ color: '#ff9800' }}>ADMIN MODE ACTIVE</strong> - You can edit this case
                            </div>
                        )}

                        <div style={styles.infoSection}>
                            <h3 style={styles.sectionHeader}>CASE INFORMATION</h3>
                            <div style={styles.infoRow}><strong>Description:</strong> {caseItem.description}</div>
                            <div style={styles.infoRow}><strong>Open Date:</strong> {formatDate(caseItem.openDate)}</div>
                            <div style={styles.infoRow}><strong>Close Date:</strong> {caseItem.closeDate ? formatDate(caseItem.closeDate) : 'Still open'}</div>
                            <div style={styles.infoRow}><strong>Status:</strong> {caseItem.status}</div>
                            <div style={styles.infoRow}><strong>Case ID:</strong> {caseItem.id}</div>
                        </div>

                        <div style={styles.infoSection}>
                            <h3 style={styles.sectionHeader}>RELATED DOCUMENTS ({caseItem.documents.length})</h3>
                            {caseItem.documents.length > 0 ? (
                                caseItem.documents.map(doc => (
                                    <div
                                        key={doc.id}
                                        style={{ ...styles.documentItem, cursor: 'pointer' }}
                                        onClick={() => navigate(`/document/${doc.id}`)}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#222'}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <strong>{doc.name}</strong>
                                            <div>
                                                <span style={{
                                                    fontSize: '10px',
                                                    backgroundColor: doc.securityLevel === 'TOP SECRET' ? '#b71c1c' :
                                                        doc.securityLevel === 'CONFIDENTIAL' ? '#ff9800' : '#4caf50',
                                                    color: 'white',
                                                    padding: '2px 6px',
                                                    borderRadius: '3px',
                                                    marginRight: '10px'
                                                }}>
                                                    {doc.securityLevel}
                                                </span>
                                                <span style={{ fontSize: '11px', opacity: 0.7 }}>{doc.type}</span>
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '5px' }}>
                                            Created: {formatDate(doc.createDate)}
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#888', marginTop: '5px' }}>
                                            Click to view document →
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', opacity: 0.5, padding: '20px' }}>
                                    No documents found for this case
                                </div>
                            )}
                        </div>

                        <div style={styles.infoSection}>
                            <h3 style={styles.sectionHeader}>FIGURANT</h3>
                            <div style={{
                                padding: '15px',
                                backgroundColor: '#2a2a2a',
                                borderRadius: '5px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                cursor: 'pointer'
                            }}
                                onClick={() => navigate(`/defendant/${caseItem.defendant.id}`)}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2f2f2f'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}>

                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    backgroundColor: '#111',
                                    border: '2px solid #555',
                                    borderRadius: '5px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        background: 'repeating-linear-gradient(45deg, #222, #222 5px, #333 5px, #333 10px)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#888',
                                        fontSize: '10px',
                                        textAlign: 'center',
                                        padding: '5px'
                                    }}>
                                        SUSPECT<br />PHOTO
                                    </div>
                                </div>

                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 'bold' }}>
                                        {caseItem.defendant.name} {caseItem.defendant.surname}
                                        {caseItem.defendant.alias && <span style={{ color: '#888', marginLeft: '10px' }}>"{caseItem.defendant.alias}"</span>}
                                    </div>
                                    <div style={{ fontSize: '12px', opacity: 0.7 }}>
                                        Status: {caseItem.defendant.status}
                                    </div>
                                </div>
                                <div style={{ fontSize: '12px', color: '#888' }}>
                                    Click to view profile →
                                </div>
                            </div>
                        </div>

                        <div style={styles.infoSection}>
                            <h3 style={styles.sectionHeader}>AN FBI EMPLOYEE</h3>
                            <div style={{
                                padding: '15px',
                                backgroundColor: '#1b5e20',
                                borderRadius: '5px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                cursor: 'pointer'
                            }}
                                onClick={() => navigate(`/employee/${caseItem.employee.id}`)}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e6f23'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1b5e20'}>

                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    backgroundColor: '#0d47a1',
                                    border: '2px solid #1565c0',
                                    borderRadius: '5px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        background: 'repeating-linear-gradient(45deg, #1565c0, #1565c0 5px, #1976d2 5px, #1976d2 10px)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '10px',
                                        textAlign: 'center',
                                        padding: '5px'
                                    }}>
                                        AGENT<br />ID
                                    </div>
                                </div>

                                <div style={{ flex: 1, color: 'white' }}>
                                    <div style={{ fontWeight: 'bold' }}>
                                        AGENT {caseItem.employee.name} {caseItem.employee.surname}
                                    </div>
                                    <div style={{ fontSize: '12px', opacity: 0.9 }}>
                                        {caseItem.employee.post} | Badge: {caseItem.employee.badge}
                                    </div>
                                </div>
                                <div style={{ fontSize: '12px', color: '#ccc' }}>
                                    Click to view profile →
                                </div>
                            </div>
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
                                    📝 EDIT CASE
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
                            <h3 style={{ color: '#ff9800', fontSize: '16px', margin: 0 }}>EDIT CASE</h3>
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
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Case Code *</label>
                                <input
                                    type="text"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    required
                                    placeholder="e.g., FBI-2024-001"
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Case Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    required
                                    placeholder="Case name"
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleTextareaChange}
                                    style={{
                                        ...styles.input,
                                        minHeight: '80px',
                                        resize: 'vertical',
                                        fontFamily: 'inherit'
                                    }}
                                    placeholder="Case description..."
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Status *</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                        required
                                    >
                                        <option value="">Select status</option>
                                        {CASE_STATUSES.map(status => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Open Date *</label>
                                    <input
                                        type="date"
                                        name="openDate"
                                        value={formData.openDate}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                        required
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Close Date</label>
                                    <input
                                        type="date"
                                        name="closeDate"
                                        value={formData.closeDate}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                    />
                                </div>
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
                                    <li>When changing status to "Закрыто", it's recommended to set close date</li>
                                    <li>All changes will be written to the database</li>
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