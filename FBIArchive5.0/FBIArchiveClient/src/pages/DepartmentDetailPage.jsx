import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Archive } from '../api/agent';

export default function DepartmentDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [department, setDepartment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDepartment();
    }, [id]);

    const loadDepartment = async () => {
        try {
            const response = await Archive.getDepartment(id);
            setDepartment(response.data);
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
        if (!dateString) return 'Unknown';
        return new Date(dateString).toLocaleDateString();
    };

    const getDepartmentTypeColor = (type) => {
        switch (type) {
            case 'SPECIALIZED': return '#1565c0';
            case 'GENERAL': return '#0277bd';
            case 'FIELD_OFFICE': return '#0288d1';
            case 'HEADQUARTERS': return '#01579b';
            case 'RESEARCH': return '#0097a7';
            default: return '#006064';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE': return '#4caf50';
            case 'INACTIVE': return '#757575';
            case 'RESTRUCTURED': return '#ff9800';
            case 'CLOSED': return '#f44336';
            default: return '#9e9e9e';
        }
    };

    if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading department details...</div>;
    if (!department) return <div style={{ padding: '20px', textAlign: 'center' }}>Department not found</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>INVESTIGATION DEPARTMENT</h1>
                <div>
                    <button onClick={() => navigate(-1)} style={{ marginRight: '10px' }}>BACK</button>
                    <button onClick={handleLogout} style={{ backgroundColor: '#b71c1c', fontSize: '12px' }}>LOGOUT</button>
                </div>
            </div>

            <div style={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div>
                        <h2 style={styles.name}>{department.name}</h2>
                        <div style={{
                            fontSize: '18px',
                            color: '#64b5f6',
                            marginBottom: '10px',
                            fontFamily: 'Courier New'
                        }}>
                            CODE: {department.code}
                        </div>
                        <div style={{
                            display: 'inline-block',
                            marginTop: '5px',
                            padding: '5px 10px',
                            backgroundColor: getDepartmentTypeColor(department.departmentType),
                            color: 'white',
                            fontSize: '12px',
                            borderRadius: '3px',
                            textTransform: 'uppercase'
                        }}>
                            {department.departmentType?.replace('_', ' ') || 'UNKNOWN'}
                        </div>
                    </div>
                    <div style={{
                        padding: '5px 10px',
                        backgroundColor: getStatusColor(department.status),
                        color: 'white',
                        fontSize: '12px',
                        borderRadius: '3px'
                    }}>
                        {department.status}
                    </div>
                </div>

                <div style={styles.infoSection}>
                    <h3 style={styles.sectionHeader}>DEPARTMENT INFORMATION</h3>
                    <div style={styles.infoRow}>
                        <strong>Description:</strong> {department.description}
                    </div>
                    <div style={styles.infoRow}>
                        <strong>Established:</strong> {formatDate(department.establishedDate)}
                    </div>
                    <div style={styles.infoRow}>
                        <strong>Type:</strong> {department.departmentType?.replace('_', ' ') || 'Unknown'}
                    </div>
                    <div style={styles.infoRow}>
                        <strong>Status:</strong> {department.status}
                    </div>
                </div>

                {/* Сотрудники отдела */}
                <div style={styles.section}>
                    <h3 style={styles.sectionHeader}>ASSIGNED AGENTS ({department.employees.length})</h3>

                    {department.employees.length > 0 ? (
                        department.employees.map(employee => (
                            <div
                                key={employee.id}
                                style={{ ...styles.agentItem, cursor: 'pointer' }}
                                onClick={() => navigate(`/employee/${employee.id}`)}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#222'}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        {employee.photoUrl && (
                                            <img
                                                src={`http://localhost:5024${employee.photoUrl}`}
                                                alt={employee.fullName}
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    objectFit: 'cover',
                                                    borderRadius: '50%',
                                                    border: '2px solid #1565c0'
                                                }}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://via.placeholder.com/40x40/1565c0/fff?text=FB';
                                                }}
                                            />
                                        )}
                                        <div>
                                            <strong>AGENT {employee.name} {employee.surname}</strong>
                                            <div style={{ fontSize: '12px', opacity: 0.7 }}>
                                                {employee.post} | Badge: {employee.badge}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ fontSize: '11px', color: '#888', marginTop: '5px' }}>
                                    Click to view agent profile ?
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', opacity: 0.5, padding: '20px' }}>
                            No agents assigned to this department
                        </div>
                    )}
                </div>
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
    name: {
        fontSize: '28px',
        marginBottom: '5px'
    },
    infoSection: {
        marginBottom: '30px',
        padding: '15px',
        backgroundColor: '#222',
        borderRadius: '5px'
    },
    section: {
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
        marginBottom: '10px',
        fontSize: '16px'
    },
    agentItem: {
        backgroundColor: '#222',
        borderLeft: '3px solid #1565c0',
        padding: '10px',
        marginBottom: '10px',
        fontFamily: 'Courier New',
        transition: 'background-color 0.2s'
    }
};