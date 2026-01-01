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

const EMPLOYEE_POSTS = [
    'Директор',
    'Заместитель директора',
    'Специальный Агент',
    'Аналитик',
    'Секретарь',
    'Начальник полевого отдела'
];

export default function EmployeeDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        badge: '',
        name: '',
        surname: '',
        birthDate: '',
        deathDate: '',
        post: '',
        photoUrl: ''
    });
    const [admin, setAdmin] = useState(false);

    useEffect(() => {
        setAdmin(isAdmin());
        loadEmployee();
    }, [id]);

    const loadEmployee = async () => {
        try {
            const response = await Archive.getEmployee(id);
            setEmployee(response.data);
            setFormData({
                badge: response.data.badge || '',
                name: response.data.name || '',
                surname: response.data.surname || '',
                birthDate: response.data.birthDate?.split('T')[0] || '',
                deathDate: response.data.deathDate?.split('T')[0] || '',
                post: response.data.post || '',
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

    const getPostColor = (post) => {
        if (!post) return '#1565c0';

        const postLower = post.toLowerCase();

        if (postLower.includes('директор') && !postLower.includes('заместитель')) return '#d32f2f';
        if (postLower.includes('заместитель')) return '#f57c00';
        if (postLower.includes('специальный агент')) return '#1976d2';
        if (postLower.includes('аналитик')) return '#388e3c';
        if (postLower.includes('секретарь')) return '#7b1fa2';
        if (postLower.includes('начальник')) return '#0288d1';

        return '#1565c0';
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateEmployee = async () => {
        try {
            const response = await fetch(`http://localhost:5024/api/admin/employee/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    badge: formData.badge,
                    name: formData.name,
                    surname: formData.surname,
                    birthDate: formData.birthDate ? new Date(formData.birthDate) : null,
                    deathDate: formData.deathDate ? new Date(formData.deathDate) : null,
                    post: formData.post,
                    photoUrl: formData.photoUrl
                })
            });

            if (response.ok) {
                setIsEditing(false);
                await loadEmployee(); 
                alert('Employee updated successfully!');
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || 'Failed to update employee'}`);
            }
        } catch (err) {
            console.error('Error updating employee:', err);
            alert('Error updating employee');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        await handleUpdateEmployee();
    };

    if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading employee details...</div>;
    if (!employee) return <div style={{ padding: '20px', textAlign: 'center' }}>Employee not found</div>;

    const age = calculateAge(employee.birthDate, employee.deathDate);
    const isDeceased = employee.deathDate !== null;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>FBI EMPLOYEE PROFILE {admin && '🔧'}</h1>
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
                                <strong style={{ color: '#ff9800' }}>ADMIN MODE ACTIVE</strong> - You can edit this employee
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '30px' }}>
                            {/* Фотография */}
                            <div style={styles.photoContainer}>
                                <div style={{
                                    width: '200px',
                                    height: '250px',
                                    backgroundColor: '#0d47a1',
                                    border: '3px solid #1565c0',
                                    borderRadius: '5px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative'
                                }}>
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        background: 'repeating-linear-gradient(45deg, #1565c0, #1565c0 10px, #1976d2 10px, #1976d2 20px)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white'
                                    }}>
                                        <div style={{ fontSize: '32px', marginBottom: '10px' }}>🛡️</div>
                                        <div style={{ fontSize: '14px', textAlign: 'center', padding: '10px' }}>
                                            AGENT PROFILE<br />
                                            SECURITY CLEARANCE REQUIRED
                                        </div>
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '10px',
                                            fontSize: '10px',
                                            color: '#bbdefb',
                                            textTransform: 'uppercase'
                                        }}>
                                            TOP SECRET
                                        </div>
                                    </div>
                                </div>
                                <div style={{
                                    marginTop: '10px',
                                    padding: '5px 10px',
                                    backgroundColor: getPostColor(employee.post),
                                    color: 'white',
                                    fontSize: '12px',
                                    borderRadius: '3px',
                                    textAlign: 'center'
                                }}>
                                    {employee.post}
                                </div>
                            </div>

                            {/* Информация */}
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h2 style={styles.name}>AGENT {employee.name} {employee.surname}</h2>
                                        <div style={styles.badge}>
                                            BADGE: {employee.badge}
                                        </div>
                                    </div>
                                    <div style={{
                                        backgroundColor: isDeceased ? '#757575' : '#4caf50',
                                        color: 'white',
                                        padding: '5px 10px',
                                        borderRadius: '3px',
                                        fontSize: '12px'
                                    }}>
                                        {isDeceased ? 'DECEASED' : 'ACTIVE'}
                                    </div>
                                </div>

                                <div style={styles.infoRow}>
                                    <strong>Position:</strong> {employee.post}
                                </div>

                                <div style={styles.infoRow}>
                                    <strong>Date of Birth:</strong> {formatDate(employee.birthDate)}
                                </div>

                                {employee.deathDate ? (
                                    <div style={styles.infoRow}>
                                        <strong>Date of Death:</strong> {formatDate(employee.deathDate)}
                                    </div>
                                ) : null}

                                <div style={styles.infoRow}>
                                    <strong>Age:</strong> {age} years {isDeceased && '(Deceased)'}
                                </div>

                                <div style={styles.infoRow}>
                                    <strong>Status:</strong> {isDeceased ? 'Deceased' : 'Active Service'}
                                </div>

                                <div style={styles.infoRow}>
                                    <strong>Employee ID:</strong> {employee.id}
                                </div>
                            </div>
                        </div>

                        {/* Отдел */}
                        {employee.investigationDepartment && (
                            <div style={styles.section}>
                                <h3 style={styles.sectionHeader}>ASSIGNED DEPARTMENT</h3>
                                <div style={{
                                    padding: '15px',
                                    backgroundColor: '#0d47a1',
                                    borderRadius: '5px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'pointer'
                                }}
                                    onClick={() => navigate(`/department/${employee.investigationDepartment.id}`)}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1565c0'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0d47a1'}>
                                    <div style={{ color: 'white' }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                                            {employee.investigationDepartment.name}
                                        </div>
                                        <div style={{ fontSize: '16px', opacity: 0.9, marginTop: '5px' }}>
                                            Code: {employee.investigationDepartment.code}
                                        </div>
                                        <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '5px' }}>
                                            {employee.investigationDepartment.description}
                                        </div>
                                        <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '5px' }}>
                                            Type: {employee.investigationDepartment.departmentType} | Status: {employee.investigationDepartment.status}
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#ccc' }}>
                                        Click to view department →
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Связанные дела */}
                        <div style={styles.section}>
                            <h3 style={styles.sectionHeader}>ASSIGNED CASES ({employee.cases.length})</h3>

                            {employee.cases.length > 0 ? (
                                employee.cases.map(caseItem => (
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
                                    No cases assigned to this agent
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
                                    📝 EDIT EMPLOYEE
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
                            <h3 style={{ color: '#ff9800', fontSize: '16px', margin: 0 }}>EDIT EMPLOYEE</h3>
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
                                    <label style={styles.label}>Badge Number *</label>
                                    <input
                                        type="text"
                                        name="badge"
                                        value={formData.badge}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                        required
                                        placeholder="e.g., FBI-00123"
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Position *</label>
                                    <select
                                        name="post"
                                        value={formData.post}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                        required
                                    >
                                        <option value="">Select position</option>
                                        {EMPLOYEE_POSTS.map(post => (
                                            <option key={post} value={post}>
                                                {post}
                                            </option>
                                        ))}
                                    </select>
                                    <div style={{ marginTop: '5px', fontSize: '11px', color: '#888' }}>
                                        Available positions: {EMPLOYEE_POSTS.join(', ')}
                                    </div>
                                </div>

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
                                    placeholder="/uploads/employees/photo.jpg"
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
                                    <li>Setting a death date will mark the employee as deceased</li>
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
        marginBottom: '10px'
    },
    badge: {
        fontSize: '18px',
        color: '#64b5f6',
        marginBottom: '20px',
        fontFamily: 'Courier New'
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
        borderLeft: '3px solid #1565c0',
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


function getStatusColor(status) {
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
}