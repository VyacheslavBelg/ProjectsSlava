import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Archive } from '../api/agent';

export default function DashboardPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!query) return;
        try {
            const response = await Archive.search(query);
            setResults(response.data);
        } catch (err) {
            if (err.response?.status === 401) {
                handleLogout();
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div style={{ width: '800px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #555', paddingBottom: '20px' }}>
                <h1>FBI DATABASE SEARCH</h1>
                <button onClick={handleLogout} style={{ backgroundColor: '#b71c1c', fontSize: '12px' }}>LOGOUT</button>
            </div>

            {/* Search */}
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <input
                    placeholder="Enter query..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ flexGrow: 1, margin: 0 }}
                />
                <button onClick={handleSearch} style={{ margin: 0 }}>SEARCH</button>
            </div>

            {/* Results (Display) */}
            {results && (
                <div style={{ textAlign: 'left', marginTop: '30px' }}>

                    {/* --- СЕКЦИЯ КЕЙСОВ --- */}
                    {results.cases?.length > 0 && (
                        <>
                            <h3 style={styles.sectionHeader}>FOUND_CASES</h3>
                            {results.cases.map(c => (
                                <div key={c.id} className="result-item" style={styles.resultItem}>
                                    <strong>CASE #{c.code}</strong>: {c.name}
                                    <br /><small style={{ opacity: 0.6 }}>{c.description}</small>
                                </div>
                            ))}
                        </>
                    )}

                    {/* --- СЕКЦИЯ ДОКУМЕНТОВ --- */}
                    {results.documents?.length > 0 && (
                        <>
                            <h3 style={styles.sectionHeader}>FOUND_DOCUMENTS</h3>
                            {results.documents.map(d => (
                                <div key={d.id} className="result-item" style={styles.resultItem}>
                                    <span style={{ border: '1px solid #555', padding: '2px 5px', fontSize: '10px', marginRight: '10px' }}>{d.securityLevel}</span>
                                    <strong>{d.name}</strong>
                                    <span style={{ float: 'right', fontSize: '12px', opacity: 0.5 }}>{d.caseName}</span>
                                </div>
                            ))}
                        </>
                    )}

                    {/* --- СЕКЦИЯ СЕРИЙ  --- */}
                    {results.series?.length > 0 && (
                        <>
                            <h3 style={styles.sectionHeader}>FOUND_SERIES</h3>
                            {results.series.map(s => (
                                <div key={s.id} className="result-item" style={styles.resultItem}>
                                    <span style={{ color: '#66bb6a', marginRight: '10px' }}>[{s.code}]</span>
                                    <strong>{s.name}</strong>
                                    <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '5px' }}>Период: {s.yearPeriod}</div>
                                </div>
                            ))}
                        </>
                    )}

                    {/* Если вообще ничего не найдено ни в одной категории */}
                    {(!results.cases?.length && !results.documents?.length && !results.series?.length) && (
                        <p style={{ textAlign: 'center', opacity: 0.5, marginTop: '40px' }}>NO DATA FOUND IN ARCHIVE</p>
                    )}
                </div>
            )}
        </div>
    );
}

const styles = {
    resultItem: {
        backgroundColor: '#222',
        borderLeft: '3px solid #555',
        padding: '10px',
        marginBottom: '10px',
        fontFamily: 'Courier New'
    },
    sectionHeader: {
        fontSize: '14px',
        color: '#888',
        borderBottom: '1px solid #333',
        paddingBottom: '5px',
        marginTop: '20px',
        letterSpacing: '2px'
    }
};

