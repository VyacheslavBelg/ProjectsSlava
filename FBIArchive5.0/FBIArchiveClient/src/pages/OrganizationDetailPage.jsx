import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Archive } from '../api/agent';

export default function OrganizationDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [organization, setOrganization] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrganization();
    }, [id]);

    const loadOrganization = async () => {
        try {
            const response = await Archive.getOrganization(id);
            setOrganization(response.data);
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

    const getOrganizationTypeColor = (type) => {
        switch (type) {
            case 'CRIMINAL_SYNDICATE': return '#d32f2f';
            case 'DRUG_CARTEL': return '#c2185b';
            case 'OUTLAW_MC': return '#7b1fa2';
            case 'STREET_GANG': return '#512da8';
            case 'TERRORIST_GROUP': return '#303f9f';
            case 'CORPORATE': return '#1976d2';
            case 'POLITICAL': return '#0288d1';
            default: return '#455a64';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE': return '#d32f2f';
            case 'DISBANDED': return '#757575';
            case 'DORMANT': return '#ff9800';
            case 'DISMANTLED': return '#4caf50';
            default: return '#9e9e9e';
        }
    };

    if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading organization details...</div>;
    if (!organization) return <div style={{ padding: '20px', textAlign: 'center' }}>Organization not found</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>ORGANIZATION PROFILE</h1>
                <div>
                    <button onClick={() => navigate(-1)} style={{ marginRight: '10px' }}>BACK</button>
                    <button onClick={handleLogout} style={{ backgroundColor: '#b71c1c', fontSize: '12px' }}>LOGOUT</button>
                </div>
            </div>

            <div style={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div>
                        <h2 style={styles.name}>{organization.name}</h2>
                        <div style={{
                            display: 'inline-block',
                            marginTop: '5px',
                            padding: '5px 10px',
                            backgroundColor: getOrganizationTypeColor(organization.organizationType),
                            color: 'white',
                            fontSize: '12px',
                            borderRadius: '3px',
                            textTransform: 'uppercase'
                        }}>
                            {organization.organizationType?.replace('_', ' ') || 'UNKNOWN'}
                        </div>
                    </div>
                    <div style={{
                        padding: '5px 10px',
                        backgroundColor: getStatusColor(organization.status),
                        color: 'white',
                        fontSize: '12px',
                        borderRadius: '3px'
                    }}>
                        {organization.status}
                    </div>
                </div>

                <div style={styles.infoSection}>
                    <h3 style={styles.sectionHeader}>ORGANIZATION INFORMATION</h3>
                    <div style={styles.infoRow}>
                        <strong>Description:</strong> {organization.description}
                    </div>
                    <div style={styles.infoRow}>
                        <strong>Established:</strong> {formatDate(organization.establishedDate)}
                    </div>
                    {organization.disbandedDate && (
                        <div style={styles.infoRow}>
                            <strong>Disbanded:</strong> {formatDate(organization.disbandedDate)}
                        </div>
                    )}
                    <div style={styles.infoRow}>
                        <strong>Type:</strong> {organization.organizationType?.replace('_', ' ') || 'Unknown'}
                    </div>
                    <div style={styles.infoRow}>
                        <strong>Status:</strong> {organization.status}
                    </div>
                </div>

                {/* Связанные фигуранты */}
                <div style={styles.section}>
                    <h3 style={styles.sectionHeader}>KNOWN MEMBERS ({organization.defendants.length})</h3>

                    {organization.defendants.length > 0 ? (
                        organization.defendants.map(defendant => (
                            <div
                                key={defendant.id}
                                style={{ ...styles.memberItem, cursor: 'pointer' }}
                                onClick={() => navigate(`/defendant/${defendant.id}`)}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#222'}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        {defendant.photoUrl && (
                                            <img
                                                src={`http://localhost:5024${defendant.photoUrl}`}
                                                alt={defendant.fullName}
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    objectFit: 'cover',
                                                    borderRadius: '50%',
                                                    border: '2px solid #555'
                                                }}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://via.placeholder.com/40x40/222/ccc?text=M';
                                                }}
                                            />
                                        )}
                                        <div>
                                            <strong>{defendant.name} {defendant.surname}</strong>
                                            {defendant.alias && (
                                                <div style={{ fontSize: '12px', opacity: 0.7 }}>
                                                    Alias: "{defendant.alias}"
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <span style={{
                                        fontSize: '10px',
                                        backgroundColor: defendant.status === 'ACTIVE' ? '#4caf50' :
                                            defendant.status === 'WANTED' ? '#f44336' :
                                                defendant.status === 'DECEASED' ? '#757575' : '#ff9800',
                                        color: 'white',
                                        padding: '2px 6px',
                                        borderRadius: '3px'
                                    }}>
                                        {defendant.status}
                                    </span>
                                </div>
                                <div style={{ fontSize: '11px', color: '#888', marginTop: '5px' }}>
                                    Click to view profile ?
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', opacity: 0.5, padding: '20px' }}>
                            No known members in database
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
        marginBottom: '10px'
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
    memberItem: {
        backgroundColor: '#222',
        borderLeft: '3px solid #555',
        padding: '10px',
        marginBottom: '10px',
        fontFamily: 'Courier New',
        transition: 'background-color 0.2s'
    }
};