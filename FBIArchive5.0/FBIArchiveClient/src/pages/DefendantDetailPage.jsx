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

const DEFENDANT_STATUSES = [
    'Подозреваемый',
    'Обвиняемый',
    'Объект наблюдения',
    'Свидетель',
    'Осведомитель',
    'Потерпевший'
];

export default function DefendantDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [defendant, setDefendant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        alias: '',
        birthDate: '',
        deathDate: '',
        status: '',
        photoUrl: ''
    });
    const [admin, setAdmin] = useState(false);

    useEffect(() => {
        setAdmin(isAdmin());
        loadDefendant();
    }, [id]);

    const loadDefendant = async () => {
        try {
            const response = await Archive.getDefendant(id);
            setDefendant(response.data);
            setFormData({
                name: response.data.name || '',
                surname: response.data.surname || '',
                alias: response.data.alias || '',
                birthDate: response.data.birthDate?.split('T')[0] || '',
                deathDate: response.data.deathDate?.split('T')[0] || '',
                status: response.data.status || '',
                photoUrl: response.data.photoUrl || ''
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

    const calculateAge = (birthDate, deathDate) => {
        const endDate = deathDate ? new Date(deathDate) : new Date();
        const birth = new Date(birthDate);
        let age = endDate.getFullYear() - birth.getFullYear();
        const monthDiff = endDate.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && endDate.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const getStatusColor = (status) => {
        if (!status) return '#757575';

        const statusLower = status.toLowerCase();

        if (statusLower.includes('подозреваем')) return '#ff9800';
        if (statusLower.includes('обвиняем')) return '#f44336';
        if (statusLower.includes('наблюден')) return '#2196f3';
        if (statusLower.includes('свидетель')) return '#4caf50';
        if (statusLower.includes('осведомитель')) return '#9c27b0';
        if (statusLower.includes('потерпевш')) return '#00bcd4';

        if (statusLower.includes('wanted')) return '#f44336';
        if (statusLower.includes('active')) return '#4caf50';
        if (statusLower.includes('deceased')) return '#757575';

        return '#757575';
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateDefendant = async () => {
        try {
            const response = await fetch(`http://localhost:5024/api/admin/defendant/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    surname: formData.surname,
                    alias: formData.alias,
                    birthDate: formData.birthDate ? new Date(formData.birthDate) : null,
                    deathDate: formData.deathDate ? new Date(formData.deathDate) : null,
                    status: formData.status,
                    photoUrl: formData.photoUrl
                })
            });

            if (response.ok) {
                setIsEditing(false);
                await loadDefendant(); 
                alert('Defendant updated successfully!');
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || 'Failed to update defendant'}`);
            }
        } catch (err) {
            console.error('Error updating defendant:', err);
            alert('Error updating defendant');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        await handleUpdateDefendant();
    };

    if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading defendant details...</div>;
    if (!defendant) return <div style={{ padding: '20px', textAlign: 'center' }}>Defendant not found</div>;

    const age = calculateAge(defendant.birthDate, defendant.deathDate);
    const isDeceased = defendant.deathDate !== null;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>DEFENDANT PROFILE {admin && '🔧'}</h1>
                <div>
                    <button onClick={() => navigate(-1)} style={{ marginRight: '10px' }}>BACK</button>
                    
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
                                <strong style={{ color: '#ff9800' }}>ADMIN MODE ACTIVE</strong> - You can edit this defendant
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '30px' }}>
                            {/* Фотография */}
                            <div style={styles.photoContainer}>
                                <div style={{
                                    width: '200px',
                                    height: '250px',
                                    backgroundColor: '#111',
                                    border: '3px solid #555',
                                    borderRadius: '5px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative'
                                }}>
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        background: 'repeating-linear-gradient(45deg, #222, #222 10px, #333 10px, #333 20px)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#888'
                                    }}>
                                        <div style={{ fontSize: '24px', marginBottom: '10px' }}>⚠️</div>
                                        <div style={{ fontSize: '12px', textAlign: 'center', padding: '10px' }}>
                                            CLASSIFIED<br />
                                            ACCESS RESTRICTED
                                        </div>
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '10px',
                                            fontSize: '10px',
                                            color: '#666',
                                            textTransform: 'uppercase'
                                        }}>
                                            FBI EYES ONLY
                                        </div>
                                    </div>
                                </div>
                                <div style={{
                                    marginTop: '10px',
                                    padding: '5px 10px',
                                    backgroundColor: getStatusColor(defendant.status),
                                    color: 'white',
                                    fontSize: '12px',
                                    borderRadius: '3px',
                                    textAlign: 'center'
                                }}>
                                    {defendant.status}
                                </div>
                            </div>

                            {/* Информация */}
                            <div style={{ flex: 1 }}>
                                <h2 style={styles.name}>{defendant.name} {defendant.surname}</h2>

                                {defendant.alias && (
                                    <div style={styles.infoRow}>
                                        <strong>Alias:</strong> "{defendant.alias}"
                                    </div>
                                )}

                                <div style={styles.infoRow}>
                                    <strong>Date of Birth:</strong> {formatDate(defendant.birthDate)}
                                </div>

                                {defendant.deathDate ? (
                                    <div style={styles.infoRow}>
                                        <strong>Date of Death:</strong> {formatDate(defendant.deathDate)}
                                    </div>
                                ) : null}

                                <div style={styles.infoRow}>
                                    <strong>Age:</strong> {age} years {isDeceased && '(Deceased)'}
                                </div>

                                <div style={styles.infoRow}>
                                    <strong>Status:</strong> {defendant.status}
                                </div>

                                <div style={styles.infoRow}>
                                    <strong>Defendant ID:</strong> {defendant.id}
                                </div>
                            </div>
                        </div>

                        {/* Организация */}
                        {defendant.organization && (
                            <div style={styles.section}>
                                <h3 style={styles.sectionHeader}>ORGANIZATION AFFILIATION</h3>
                                <div style={{
                                    padding: '15px',
                                    backgroundColor: '#2a2a2a',
                                    borderRadius: '5px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'pointer'
                                }}
                                    onClick={() => navigate(`/organization/${defendant.organization.id}`)}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2f2f2f'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}>
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                                            {defendant.organization.name}
                                        </div>
                                        <div style={{ fontSize: '14px', opacity: 0.7, marginTop: '5px' }}>
                                            {defendant.organization.description}
                                        </div>
                                        <div style={{ fontSize: '12px', opacity: 0.5, marginTop: '5px' }}>
                                            Type: {defendant.organization.organizationType} | Status: {defendant.organization.status}
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#888' }}>
                                        Click to view organization →
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Связанные дела */}
                        <div style={styles.section}>
                            <h3 style={styles.sectionHeader}>RELATED CASES ({defendant.cases.length})</h3>

                            {defendant.cases.length > 0 ? (
                                defendant.cases.map(caseItem => (
                                    <div
                                        key={caseItem.id}
                                        style={{ ...styles.caseItem, cursor: 'pointer' }}
                                        onClick={() => navigate(`/case/${caseItem.id}`)}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#222'}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <strong>CASE #{caseItem.code}: {caseItem.name}</strong>
                                                <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '3px' }}>
                                                    {formatDate(caseItem.openDate)} - {caseItem.closeDate ? formatDate(caseItem.closeDate) : 'Present'}
                                                </div>
                                            </div>
                                            <span style={{
                                                fontSize: '10px',
                                                backgroundColor: getStatusColor(caseItem.status),
                                                color: 'white',
                                                padding: '2px 6px',
                                                borderRadius: '3px'
                                            }}>
                                                {caseItem.status}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#888', marginTop: '5px' }}>
                                            Click to view case details →
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', opacity: 0.5, padding: '20px' }}>
                                    No cases found for this defendant
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
                                    📝 EDIT DEFENDANT
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
                            <h3 style={{ color: '#ff9800', fontSize: '16px', margin: 0 }}>EDIT DEFENDANT</h3>
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
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>First Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                        required
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Last Name *</label>
                                    <input
                                        type="text"
                                        name="surname"
                                        value={formData.surname}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                        required
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Alias (Optional)</label>
                                    <input
                                        type="text"
                                        name="alias"
                                        value={formData.alias}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                        placeholder='e.g., "The Ghost"'
                                    />
                                </div>

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
                                        {DEFENDANT_STATUSES.map(status => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                    <div style={{ marginTop: '5px', fontSize: '11px', color: '#888' }}>
                                        Available statuses: {DEFENDANT_STATUSES.join(', ')}
                                    </div>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Birth Date *</label>
                                    <input
                                        type="date"
                                        name="birthDate"
                                        value={formData.birthDate}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                        required
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Death Date (Optional)</label>
                                    <input
                                        type="date"
                                        name="deathDate"
                                        value={formData.deathDate}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                    />
                                    <div style={{ marginTop: '5px', fontSize: '11px', color: '#888' }}>
                                        Leave empty if alive
                                    </div>
                                </div>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Photo URL (Optional)</label>
                                <input
                                    type="text"
                                    name="photoUrl"
                                    value={formData.photoUrl}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    placeholder="/uploads/defendants/photo.jpg"
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
                                    <li>Setting a death date will mark the defendant as deceased</li>
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
    photoContainer: {
        width: '200px',
        textAlign: 'center'
    },
    name: {
        fontSize: '28px',
        marginBottom: '20px',
        borderBottom: '2px solid #555',
        paddingBottom: '10px'
    },
    section: {
        marginTop: '30px',
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
        marginBottom: '10px',
        fontSize: '16px'
    },
    caseItem: {
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