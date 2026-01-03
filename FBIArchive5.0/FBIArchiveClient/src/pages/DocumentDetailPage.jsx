
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


const SECURITY_LEVELS = [
    'Совершенно секретно',
    'Секретно',
    'Конфиденциально',
    'Для служебного пользования',
    'Открытый'
];

const DOCUMENT_TYPES = [
    'Служебная записка',
    'Отчет о наблюдении',
    'Протокол допроса',
    'Телеграмма',
    'Агентурное донесение'
];

export default function DocumentDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        securityLevel: '',
        documentType: '',
        createDate: ''
    });
    const [admin, setAdmin] = useState(false);

    useEffect(() => {
        setAdmin(isAdmin());
        loadDocument();
    }, [id]);

    const loadDocument = async () => {
        try {
            const response = await Archive.getDocument(id);
            setDocument(response.data);
            setFormData({
                name: response.data.name,
                securityLevel: response.data.securityLevel,
                documentType: response.data.documentType,
                createDate: response.data.createDate.split('T')[0]
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
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(`http://localhost:5024/api/admin/document/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    securityLevel: formData.securityLevel,
                    documentType: formData.documentType,
                    createDate: new Date(formData.createDate)
                })
            });

            if (response.ok) {
                setIsEditing(false);
                await loadDocument(); // Перезагружаем обновленные данные
                alert('Документ успешно обновлен!');
            } else {
                const errorData = await response.json();
                alert(`Ошибка: ${errorData.message || 'Не удалось обновить документ'}`);
            }
        } catch (err) {
            console.error('Error updating document:', err);
            alert('Ошибка при обновлении документа');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        await handleUpdate();
    };

    const getSecurityLevelColor = (level) => {
        switch (level) {
            case 'Совершенно секретно': return '#b71c1c';
            case 'Секретно': return '#ff5722';
            case 'Конфиденциально': return '#ff9800';
            case 'Для служебного пользования': return '#4caf50';
            case 'Открытый': return '#2196f3';
            default: return '#757575';
        }
    };

    if (loading) return <div style={{ padding: '20px' }}>Загрузка...</div>;
    if (!document) return <div style={{ padding: '20px' }}>Документ не найден</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>ПОДРОБНОСТИ ДОКУМЕНТА {admin && '🔧'}</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => navigate(-1)} style={{ marginRight: '10px' }}>НАЗАД</button>
                    <button onClick={handleLogout} style={{ backgroundColor: '#b71c1c', fontSize: '12px' }}>ВЫХОД</button>
                </div>
            </div>

            <div style={styles.card}>
                <h2 style={styles.title}>{document.name}</h2>

                {admin && !isEditing && (
                    <div style={{
                        backgroundColor: '#333',
                        padding: '10px 15px',
                        borderRadius: '5px',
                        marginBottom: '20px',
                        border: '2px solid #ff9800',
                        textAlign: 'center'
                    }}>
                        <strong style={{ color: '#ff9800' }}>⚙️ РЕЖИМ АДМИНИСТРАТОРА</strong> - Вы можете редактировать этот документ
                    </div>
                )}

                <div style={styles.infoSection}>
                    <h3 style={styles.sectionHeader}>ИНФОРМАЦИЯ О ДОКУМЕНТЕ</h3>
                    <div style={styles.infoRow}>
                        <strong>Уровень секретности:</strong>
                        <span style={{
                            backgroundColor: getSecurityLevelColor(document.securityLevel),
                            color: 'white',
                            padding: '3px 12px',
                            borderRadius: '3px',
                            fontSize: '12px',
                            marginLeft: '10px',
                            fontWeight: 'bold'
                        }}>
                            {document.securityLevel}
                        </span>
                    </div>
                    <div style={styles.infoRow}><strong>Тип документа:</strong> {document.documentType}</div>
                    <div style={styles.infoRow}><strong>Дата создания:</strong> {formatDate(document.createDate)}</div>
                    <div style={styles.infoRow}><strong>ID документа:</strong> {document.id}</div>
                </div>

                <div style={styles.infoSection}>
                    <h3 style={styles.sectionHeader}>СВЯЗАННОЕ ДЕЛО</h3>
                    <div style={styles.infoRow}><strong>Код дела:</strong> {document.case.code}</div>
                    <div style={styles.infoRow}><strong>Название дела:</strong> {document.case.name}</div>
                    <div style={styles.infoRow}><strong>Описание:</strong> {document.case.description}</div>
                    <div style={styles.infoRow}><strong>Дата открытия:</strong> {formatDate(document.case.openDate)}</div>
                    <div style={styles.infoRow}>
                        <strong>Дата закрытия:</strong> {document.case.closeDate ? formatDate(document.case.closeDate) : 'Дело открыто'}
                    </div>
                    <button
                        onClick={() => navigate(`/case/${document.case.id}`)}
                        style={{ marginTop: '10px', fontSize: '12px' }}
                    >
                        ПОДРОБНЕЕ О ДЕЛЕ
                    </button>
                </div>

                <div style={styles.infoSection}>
                    <h3 style={styles.sectionHeader}>СВЯЗАННАЯ СЕРИЯ</h3>
                    <div style={styles.infoRow}><strong>Код серии:</strong> {document.series.code}</div>
                    <div style={styles.infoRow}><strong>Название серии:</strong> {document.series.name}</div>
                    <div style={styles.infoRow}><strong>Период:</strong> {document.series.yearPeriod}</div>
                    <div style={styles.infoRow}><strong>Описание:</strong> {document.series.description}</div>
                    <button
                        onClick={() => navigate(`/series/${document.series.id}`)}
                        style={{ marginTop: '10px', fontSize: '12px' }}
                    >
                        ПОДРОБНЕЕ О СЕРИИ
                    </button>
                </div>

                {/* Кнопка редактирования снизу */}
                {admin && !isEditing && (
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
                            📝 РЕДАКТИРОВАТЬ ДОКУМЕНТ
                        </button>
                        <p style={{ color: '#888', fontSize: '12px', marginTop: '10px' }}>
                            Доступно только администраторам
                        </p>
                    </div>
                )}

                {/* Форма редактирования */}
                {isEditing && (
                    <form onSubmit={handleSave} style={{ marginTop: '30px', padding: '20px', backgroundColor: '#222', borderRadius: '5px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                            <h3 style={{ color: '#ff9800', fontSize: '16px', margin: 0 }}>РЕДАКТИРОВАНИЕ ДОКУМЕНТА</h3>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" style={{ backgroundColor: '#4caf50', padding: '10px 20px', fontSize: '14px' }}>
                                    💾 СОХРАНИТЬ
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    style={{ backgroundColor: '#666', padding: '10px 20px', fontSize: '14px' }}
                                >
                                    ❌ ОТМЕНА
                                </button>
                            </div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Название документа:</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                style={styles.input}
                                required
                                placeholder="Введите название документа"
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Уровень секретности:</label>
                            <select
                                name="securityLevel"
                                value={formData.securityLevel}
                                onChange={handleInputChange}
                                style={styles.input}
                                required
                            >
                                <option value="">Выберите уровень секретности</option>
                                {SECURITY_LEVELS.map(level => (
                                    <option key={level} value={level}>
                                        {level}
                                    </option>
                                ))}
                            </select>
                            <div style={{ marginTop: '5px', fontSize: '11px', color: '#888' }}>
                                Доступные значения: {SECURITY_LEVELS.join(', ')}
                            </div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Тип документа:</label>
                            <select
                                name="documentType"
                                value={formData.documentType}
                                onChange={handleInputChange}
                                style={styles.input}
                                required
                            >
                                <option value="">Выберите тип документа</option>
                                {DOCUMENT_TYPES.map(type => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                            <div style={{ marginTop: '5px', fontSize: '11px', color: '#888' }}>
                                Доступные значения: {DOCUMENT_TYPES.join(', ')}
                            </div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Дата создания:</label>
                            <input
                                type="date"
                                name="createDate"
                                value={formData.createDate}
                                onChange={handleInputChange}
                                style={styles.input}
                                required
                            />
                        </div>

                        <div style={{
                            backgroundColor: '#333',
                            padding: '15px',
                            borderRadius: '5px',
                            marginTop: '20px',
                            borderLeft: '4px solid #ff9800'
                        }}>
                            <strong style={{ color: '#ff9800' }}>⚠️ ВНИМАНИЕ:</strong>
                            <ul style={{ margin: '10px 0 0 20px', color: '#ccc', fontSize: '12px' }}>
                                <li>Изменения сохранятся сразу после нажатия "СОХРАНИТЬ"</li>
                                <li>Все изменения будут записаны в базу данных</li>
                                <li>Убедитесь в правильности введенных данных</li>
                            </ul>
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
        padding: '25px'
    },
    title: {
        borderBottom: '2px solid #555',
        paddingBottom: '15px',
        marginBottom: '25px',
        fontSize: '24px'
    },
    infoSection: {
        marginBottom: '25px',
        padding: '20px',
        backgroundColor: '#222',
        borderRadius: '5px'
    },
    sectionHeader: {
        color: '#888',
        fontSize: '14px',
        marginBottom: '20px',
        letterSpacing: '1px',
        textTransform: 'uppercase'
    },
    infoRow: {
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        padding: '5px 0'
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