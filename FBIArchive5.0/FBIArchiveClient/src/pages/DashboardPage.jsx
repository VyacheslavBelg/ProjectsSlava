import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Archive } from '../api/agent';
import CreateEntityForm from './CreateEntityForm';

const SECURITY_LEVELS = [
    { value: '', label: 'Любой уровень' },
    { value: 'Совершенно секретно', label: 'Совершенно секретно' },
    { value: 'Секретно', label: 'Секретно' },
    { value: 'Конфиденциально', label: 'Конфиденциально' },
    { value: 'Для служебного пользования', label: 'Для служебного пользования' },
    { value: 'Открытый', label: 'Открытый' }
];

const DOCUMENT_TYPES = [
    { value: '', label: 'Любой тип' },
    { value: 'Служебная записка', label: 'Служебная записка' },
    { value: 'Отчет о наблюдении', label: 'Отчет о наблюдении' },
    { value: 'Протокол допроса', label: 'Протокол допроса' },
    { value: 'Телеграмма', label: 'Телеграмма' },
    { value: 'Агентурное донесение', label: 'Агентурное донесение' }
];

const CASE_STATUSES = [
    { value: '', label: 'Любой статус' },
    { value: 'Закрыто', label: 'Закрыто' },
    { value: 'Активно', label: 'Активно' },
    { value: 'Приостановлено', label: 'Приостановлено' },
    { value: 'Передано в другой орган', label: 'Передано в другой орган' },
    { value: 'Архив', label: 'Архив' },
    { value: 'Рассекречено', label: 'Рассекречено' }
];

const DEFENDANT_STATUSES = [
    { value: '', label: 'Любой статус' },
    { value: 'Подозреваемый', label: 'Подозреваемый' },
    { value: 'Обвиняемый', label: 'Обвиняемый' },
    { value: 'Объект наблюдения', label: 'Объект наблюдения' },
    { value: 'Свидетель', label: 'Свидетель' },
    { value: 'Осведомитель', label: 'Осведомитель' },
    { value: 'Потерпевший', label: 'Потерпевший' }
];

const EMPLOYEE_POSTS = [
    { value: '', label: 'Любая должность' },
    { value: 'Директор', label: 'Директор' },
    { value: 'Заместитель директора', label: 'Заместитель директора' },
    { value: 'Специальный Агент', label: 'Специальный Агент' },
    { value: 'Аналитик', label: 'Аналитик' },
    { value: 'Секретарь', label: 'Секретарь' },
    { value: 'Начальник полевого отдела', label: 'Начальник полевого отдела' }
];

export default function DashboardPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [showCreateDropdown, setShowCreateDropdown] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [entityType, setEntityType] = useState(null);
    const [admin, setAdmin] = useState(false);


    const [entityFilter, setEntityFilter] = useState(''); 
    const [statusFilter, setStatusFilter] = useState(''); 
    const [securityLevelFilter, setSecurityLevelFilter] = useState(''); 
    const [documentTypeFilter, setDocumentTypeFilter] = useState(''); 
    const [postFilter, setPostFilter] = useState(''); 


    const entityOptions = [
        { value: 'documents', label: '📄 Документы' },
        { value: 'cases', label: '📁 Дела' },
        { value: 'series', label: '📚 Серии' },
        { value: 'defendants', label: '👤 Фигуранты' },
        { value: 'employees', label: '👨‍💼 Сотрудники' }
    ];

    const navigate = useNavigate();


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
                    payload.role || payload.Role;
                setAdmin(role === 'Admin' || role === 'Админ' || role === 'admin');
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

    const handleSearch = async () => {
     
        if (!entityFilter) {
            alert('⚠️ Пожалуйста, выберите тип сущности для поиска (документы, дела, серии и т.д.)');
            return;
        }

        try {
            const searchParams = {
                query: query,
                entityType: entityFilter,
                status: statusFilter,
                securityLevel: securityLevelFilter,
                documentType: documentTypeFilter,
                post: postFilter,
            };

            console.log('Search params:', searchParams);

            const response = await Archive.searchWithFilters(searchParams);
            console.log('Search response:', response.data);

            setResults(response.data);

        } catch (err) {
            console.error('Search error details:', err);
            console.error('Error response:', err.response);

            if (err.response?.status === 401) {
                handleLogout();
            } else {
                const errorMessage = err.response?.data?.message ||
                    err.message ||
                    'Произошла ошибка при поиске. Проверьте консоль для подробностей.';

                alert(`Ошибка поиска: ${errorMessage}`);

              
                setResults({
                    cases: [],
                    documents: [],
                    series: [],
                    defendants: [],
                    employees: []
                });
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleDocumentClick = (id) => {
        navigate(`/document/${id}`);
    };

    const handleCaseClick = (id) => {
        navigate(`/case/${id}`);
    };

    const handleSeriesClick = (id) => {
        navigate(`/series/${id}`);
    };

    const handleDefendantClick = (id) => {
        navigate(`/defendant/${id}`);
    };

    const handleEmployeeClick = (id) => {
        navigate(`/employee/${id}`);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Не указано';
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    const getStatusColor = (status) => {
        if (!status) return '#757575';
        const statusUpper = status.toUpperCase();
        switch (statusUpper) {
            case 'ACTIVE':
            case 'АКТИВНО':
            case 'АКТИВНОЕ':
                return '#4caf50';
            case 'CLOSED':
            case 'ЗАКРЫТО':
            case 'ЗАКРЫТ':
                return '#f44336';
            case 'INVESTIGATION':
            case 'РАССЛЕДОВАНИЕ':
                return '#ff9800';
            case 'PENDING':
            case 'ПРИОСТАНОВЛЕНО':
                return '#9c27b0';
            case 'SECRET':
            case 'СЕКРЕТНО':
                return '#ff5722';
            case 'TOP SECRET':
            case 'СОВЕРШЕННО СЕКРЕТНО':
                return '#b71c1c';
            case 'ПЕРЕДАНО В ДРУГОЙ ОРГАН':
                return '#2196f3';
            case 'АРХИВ':
                return '#795548';
            case 'РАССЕКРЕЧЕНО':
                return '#00bcd4';
            case 'ПОДОЗРЕВАЕМЫЙ':
                return '#ff9800';
            case 'ОБВИНЯЕМЫЙ':
                return '#f44336';
            case 'ОБЪЕКТ НАБЛЮДЕНИЯ':
                return '#2196f3';
            case 'СВИДЕТЕЛЬ':
                return '#4caf50';
            case 'ОСВЕДОМИТЕЛЬ':
                return '#9c27b0';
            case 'ПОТЕРПЕВШИЙ':
                return '#009688';
            default:
                return '#757575';
        }
    };

    const handleCreateClick = (type) => {
        setEntityType(type);
        setShowCreateDropdown(false);
        setShowCreateForm(true);
    };

    const handleResetFilters = () => {
        setEntityFilter('');
        setStatusFilter('');
        setSecurityLevelFilter('');
        setDocumentTypeFilter('');
        setPostFilter('');
        setResults(null);
    };

    const createOptions = [
        { type: 'document', label: '📄 Документ', color: '#4caf50' },
        { type: 'case', label: '📁 Дело', color: '#2196f3' },
        { type: 'employee', label: '👨‍💼 Сотрудник', color: '#ff9800' },
        { type: 'defendant', label: '👤 Фигурант', color: '#9c27b0' },
        { type: 'series', label: '📚 Серия', color: '#00bcd4' },
        { type: 'organization', label: '🏢 Организация', color: '#795548' },
        { type: 'department', label: '🏛️ Отдел', color: '#607d8b' }
    ];

    return (
        <div style={{ width: '800px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #555',
                paddingBottom: '20px',
                position: 'relative'
            }}>
                <h1>FBI DATABASE SEARCH</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* Кнопка Создать для администратора */}
                    {admin && (
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setShowCreateDropdown(!showCreateDropdown)}
                                style={{
                                    backgroundColor: '#4caf50',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4caf50'}
                            >
                                <span>+ СОЗДАТЬ</span>
                                <span style={{ fontSize: '10px' }}>▼</span>
                            </button>

                            {/* Выпадающее меню */}
                            {showCreateDropdown && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    backgroundColor: '#222',
                                    border: '1px solid #444',
                                    borderRadius: '4px',
                                    marginTop: '5px',
                                    minWidth: '200px',
                                    zIndex: 100,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                                }}>
                                    <div style={{
                                        padding: '10px 15px',
                                        color: '#888',
                                        fontSize: '12px',
                                        borderBottom: '1px solid #333',
                                        backgroundColor: '#1a1a1a'
                                    }}>
                                        Выберите тип сущности:
                                    </div>
                                    {createOptions.map(option => (
                                        <button
                                            key={option.type}
                                            onClick={() => handleCreateClick(option.type)}
                                            style={{
                                                width: '100%',
                                                textAlign: 'left',
                                                padding: '12px 15px',
                                                border: 'none',
                                                backgroundColor: 'transparent',
                                                color: '#ddd',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                borderBottom: '1px solid #333',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2a2a2a'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <span style={{ fontSize: '16px' }}>{option.label.split(' ')[0]}</span>
                                            {option.label.split(' ')[1]}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Кнопка Выход */}
                    <button
                        onClick={handleLogout}
                        style={{
                            backgroundColor: '#b71c1c',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c62828'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#b71c1c'}
                    >
                        ВЫХОД
                    </button>
                </div>
            </div>

            {/* Search and Filters */}
            <div style={{ marginTop: '20px' }}>
                {/* Поисковая строка */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <input
                        placeholder="Введите поисковый запрос (оставьте пустым для просмотра всех записей выбранного типа)..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            flexGrow: 1,
                            margin: 0,
                            padding: '10px 12px',
                            backgroundColor: '#222',
                            border: '1px solid #555',
                            color: 'white',
                            borderRadius: '4px',
                            fontSize: '14px'
                        }}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button
                        onClick={handleSearch}
                        style={{
                            margin: 0,
                            backgroundColor: '#555',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#666'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#555'}
                    >
                        ПОИСК
                    </button>
                </div>

                {/* Панель фильтров */}
                <div style={{
                    backgroundColor: '#222',
                    border: '1px solid #333',
                    borderRadius: '4px',
                    padding: '15px',
                    marginBottom: '15px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h3 style={{ margin: 0, fontSize: '14px', color: '#888' }}>ФИЛЬТРЫ ПОИСКА</h3>
                        <button
                            onClick={handleResetFilters}
                            style={{
                                backgroundColor: 'transparent',
                                color: '#888',
                                border: '1px solid #555',
                                padding: '5px 10px',
                                borderRadius: '3px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#333';
                                e.currentTarget.style.color = '#fff';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = '#888';
                            }}
                        >
                            Сбросить фильтры
                        </button>
                    </div>

                    {/* Основной фильтр по типу сущности - ОБЯЗАТЕЛЬНЫЙ */}
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '5px' }}>
                            Искать в: <span style={{ color: '#f44336' }}>*</span>
                        </label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {entityOptions.map(option => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        setEntityFilter(option.value);
                                        // Сбрасываем статус при смене типа сущности
                                        if (statusFilter) setStatusFilter('');
                                    }}
                                    style={{
                                        backgroundColor: entityFilter === option.value ? '#4caf50' : '#333',
                                        color: 'white',
                                        border: 'none',
                                        padding: '8px 12px',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (entityFilter !== option.value) {
                                            e.currentTarget.style.backgroundColor = '#444';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (entityFilter !== option.value) {
                                            e.currentTarget.style.backgroundColor = '#333';
                                        }
                                    }}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                        {!entityFilter && (
                            <div style={{
                                color: '#f44336',
                                fontSize: '11px',
                                marginTop: '5px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}>
                                ⚠️ Пожалуйста, выберите тип сущности для поиска
                            </div>
                        )}
                    </div>

                    {/* Дополнительные фильтры (показываются только если выбран тип сущности) */}
                    {entityFilter && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                            {/* Фильтр статуса (для дел и фигурантов) */}
                            {(entityFilter === 'cases' || entityFilter === 'defendants') && (
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '5px' }}>
                                        Статус:
                                    </label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            backgroundColor: '#333',
                                            color: 'white',
                                            border: '1px solid #555',
                                            borderRadius: '4px',
                                            fontSize: '13px'
                                        }}
                                    >
                                        {entityFilter === 'defendants'
                                            ? DEFENDANT_STATUSES.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))
                                            : CASE_STATUSES.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>
                            )}

                            {/* Фильтры для документов */}
                            {entityFilter === 'documents' && (
                                <>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '5px' }}>
                                            Уровень секретности:
                                        </label>
                                        <select
                                            value={securityLevelFilter}
                                            onChange={(e) => setSecurityLevelFilter(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                backgroundColor: '#333',
                                                color: 'white',
                                                border: '1px solid #555',
                                                borderRadius: '4px',
                                                fontSize: '13px'
                                            }}
                                        >
                                            {SECURITY_LEVELS.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '5px' }}>
                                            Тип документа:
                                        </label>
                                        <select
                                            value={documentTypeFilter}
                                            onChange={(e) => setDocumentTypeFilter(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                backgroundColor: '#333',
                                                color: 'white',
                                                border: '1px solid #555',
                                                borderRadius: '4px',
                                                fontSize: '13px'
                                            }}
                                        >
                                            {DOCUMENT_TYPES.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            )}

                            {/* Фильтр должности для сотрудников */}
                            {entityFilter === 'employees' && (
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '5px' }}>
                                        Должность сотрудника:
                                    </label>
                                    <select
                                        value={postFilter}
                                        onChange={(e) => setPostFilter(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            backgroundColor: '#333',
                                            color: 'white',
                                            border: '1px solid #555',
                                            borderRadius: '4px',
                                            fontSize: '13px'
                                        }}
                                    >
                                        {EMPLOYEE_POSTS.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Подсказка */}
                    <div style={{
                        marginTop: '15px',
                        padding: '8px',
                        backgroundColor: '#1a1a1a',
                        borderRadius: '4px',
                        fontSize: '11px',
                        color: '#666',
                        textAlign: 'center'
                    }}>
                        💡 Выберите тип сущности, затем введите запрос или оставьте поле пустым для просмотра всех записей этого типа
                    </div>
                </div>
            </div>

            {/* Admin Info */}
            {admin && (
                <div style={{
                    marginTop: '15px',
                    padding: '10px',
                    backgroundColor: '#2a2a2a',
                    borderLeft: '3px solid #4caf50',
                    fontSize: '12px',
                    color: '#4caf50',
                    textAlign: 'center',
                    borderRadius: '4px'
                }}>
                    ⚡ РЕЖИМ АДМИНИСТРАТОРА: Доступно создание и редактирование записей
                </div>
            )}

            {/* Results (Display) */}
            {results && (
                <div style={{ textAlign: 'left', marginTop: '30px' }}>
                    {/* Индикатор активных фильтров */}
                    <div style={{
                        backgroundColor: '#2a2a2a',
                        padding: '10px 15px',
                        borderRadius: '4px',
                        marginBottom: '20px',
                        fontSize: '12px',
                        color: '#aaa',
                        borderLeft: '3px solid #2196f3'
                    }}>
                        <strong>Результаты поиска:</strong>
                        {` Тип: ${entityOptions.find(o => o.value === entityFilter)?.label}`}
                        {statusFilter && ` | Статус: ${entityFilter === 'defendants'
                            ? DEFENDANT_STATUSES.find(o => o.value === statusFilter)?.label
                            : CASE_STATUSES.find(o => o.value === statusFilter)?.label
                            }`}
                        {securityLevelFilter && ` | Секретность: ${SECURITY_LEVELS.find(o => o.value === securityLevelFilter)?.label}`}
                        {documentTypeFilter && ` | Тип документа: ${DOCUMENT_TYPES.find(o => o.value === documentTypeFilter)?.label}`}
                        {postFilter && ` | Должность: ${EMPLOYEE_POSTS.find(o => o.value === postFilter)?.label}`}

                        {!query && (
                            <span style={{ color: '#4caf50', marginLeft: '10px' }}>
                                📊 Показаны все записи выбранного типа
                            </span>
                        )}
                    </div>

                    {/* Отображение результатов в зависимости от выбранного типа */}
                    {entityFilter === 'cases' && results.cases?.length > 0 && (
                        <>
                            <h3 style={styles.sectionHeader}>НАЙДЕННЫЕ ДЕЛА ({results.cases.length})</h3>
                            {results.cases.map(c => (
                                <div
                                    key={c.id}
                                    className="result-item"
                                    style={{ ...styles.resultItem, cursor: 'pointer', transition: 'background-color 0.2s' }}
                                    onClick={() => handleCaseClick(c.id)}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#222'}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <strong>ДЕЛО #{c.code}: {c.name}</strong>
                                        <span style={{
                                            fontSize: '10px',
                                            backgroundColor: getStatusColor(c.status),
                                            color: 'white',
                                            padding: '2px 6px',
                                            borderRadius: '3px',
                                            fontWeight: 'bold'
                                        }}>
                                            {c.status || 'НЕИЗВЕСТНО'}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '5px' }}>
                                        Открыто: {formatDate(c.openDate)} |
                                        {c.closeDate ? ` Закрыто: ${formatDate(c.closeDate)}` : ' Еще открыто'}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#888', marginTop: '5px' }}>
                                        Нажмите для просмотра деталей →
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {entityFilter === 'documents' && results.documents?.length > 0 && (
                        <>
                            <h3 style={styles.sectionHeader}>НАЙДЕННЫЕ ДОКУМЕНТЫ ({results.documents.length})</h3>
                            {results.documents.map(d => (
                                <div
                                    key={d.id}
                                    className="result-item"
                                    style={{ ...styles.resultItem, cursor: 'pointer', transition: 'background-color 0.2s' }}
                                    onClick={() => handleDocumentClick(d.id)}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#222'}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{
                                                border: '1px solid #555',
                                                padding: '2px 5px',
                                                fontSize: '10px',
                                                backgroundColor: d.securityLevel === 'Совершенно секретно' ? '#b71c1c' :
                                                    d.securityLevel === 'Секретно' ? '#ff5722' :
                                                        d.securityLevel === 'Конфиденциально' ? '#ff9800' :
                                                            d.securityLevel === 'Для служебного пользования' ? '#2196f3' :
                                                                '#4caf50',
                                                color: 'white',
                                                borderRadius: '3px',
                                                fontWeight: 'bold'
                                            }}>
                                                {d.securityLevel}
                                            </span>
                                            <strong>{d.name}</strong>
                                        </div>
                                        <span style={{ fontSize: '11px', opacity: 0.5 }}>{d.type || d.documentType}</span>
                                    </div>
                                    <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '5px' }}>
                                        Дело: {d.caseName} | Создан: {formatDate(d.createDate)}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#888', marginTop: '5px' }}>
                                        Нажмите для просмотра деталей →
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {entityFilter === 'defendants' && results.defendants?.length > 0 && (
                        <>
                            <h3 style={styles.sectionHeader}>НАЙДЕННЫЕ ФИГУРАНТЫ ({results.defendants.length})</h3>
                            {results.defendants.map(d => (
                                <div
                                    key={d.id}
                                    className="result-item"
                                    style={{ ...styles.resultItem, cursor: 'pointer', transition: 'background-color 0.2s' }}
                                    onClick={() => handleDefendantClick(d.id)}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#222'}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <strong>{d.surname} {d.name} {d.alias ? `"${d.alias}"` : ''}</strong>
                                        <span style={{
                                            fontSize: '10px',
                                            backgroundColor: getStatusColor(d.status),
                                            color: 'white',
                                            padding: '2px 6px',
                                            borderRadius: '3px',
                                            fontWeight: 'bold'
                                        }}>
                                            {d.status || 'НЕИЗВЕСТНО'}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '5px' }}>
                                        Родился: {formatDate(d.birthDate)} |
                                        {d.deathDate ? ` Умер: ${formatDate(d.deathDate)}` : ' Жив'}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#888', marginTop: '5px' }}>
                                        Нажмите для просмотра деталей →
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {entityFilter === 'employees' && results.employees?.length > 0 && (
                        <>
                            <h3 style={styles.sectionHeader}>НАЙДЕННЫЕ СОТРУДНИКИ ({results.employees.length})</h3>
                            {results.employees.map(e => (
                                <div
                                    key={e.id}
                                    className="result-item"
                                    style={{ ...styles.resultItem, cursor: 'pointer', transition: 'background-color 0.2s' }}
                                    onClick={() => handleEmployeeClick(e.id)}
                                    onMouseEnter={(ev) => ev.currentTarget.style.backgroundColor = '#2a2a2a'}
                                    onMouseLeave={(ev) => ev.currentTarget.style.backgroundColor = '#222'}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <strong>Агент #{e.badge}: {e.surname} {e.name}</strong>
                                        <span style={{
                                            fontSize: '10px',
                                            backgroundColor: '#2196f3',
                                            color: 'white',
                                            padding: '2px 6px',
                                            borderRadius: '3px',
                                            fontWeight: 'bold'
                                        }}>
                                            {e.post}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '5px' }}>
                                        Родился: {formatDate(e.birthDate)} |
                                        {e.deathDate ? ` Умер: ${formatDate(e.deathDate)}` : ' В строю'}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#888', marginTop: '5px' }}>
                                        Нажмите для просмотра деталей →
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {entityFilter === 'series' && results.series?.length > 0 && (
                        <>
                            <h3 style={styles.sectionHeader}>НАЙДЕННЫЕ СЕРИИ ({results.series.length})</h3>
                            {results.series.map(s => (
                                <div
                                    key={s.id}
                                    className="result-item"
                                    style={{ ...styles.resultItem, cursor: 'pointer', transition: 'background-color 0.2s' }}
                                    onClick={() => handleSeriesClick(s.id)}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#222'}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{
                                            color: '#66bb6a',
                                            fontWeight: 'bold',
                                            backgroundColor: '#1a1a1a',
                                            padding: '2px 8px',
                                            borderRadius: '3px',
                                            border: '1px solid #66bb6a'
                                        }}>
                                            [{s.code}]
                                        </span>
                                        <strong>{s.name}</strong>
                                    </div>
                                    <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '5px' }}>Период: {s.yearPeriod}</div>
                                    <div style={{ fontSize: '11px', color: '#888', marginTop: '5px' }}>
                                        Нажмите для просмотра деталей →
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {/* Если ничего не найдено */}
                    {((entityFilter === 'cases' && !results.cases?.length) ||
                        (entityFilter === 'documents' && !results.documents?.length) ||
                        (entityFilter === 'defendants' && !results.defendants?.length) ||
                        (entityFilter === 'employees' && !results.employees?.length) ||
                        (entityFilter === 'series' && !results.series?.length)) && (
                            <div style={{
                                textAlign: 'center',
                                padding: '40px',
                                backgroundColor: '#222',
                                borderRadius: '4px',
                                marginTop: '20px'
                            }}>
                                <p style={{ opacity: 0.5, marginBottom: '10px' }}>⚠️ НИЧЕГО НЕ НАЙДЕНО</p>
                                <p style={{ fontSize: '12px', color: '#666' }}>
                                    Попробуйте изменить поисковый запрос или фильтры
                                </p>
                                <div style={{ marginTop: '15px', fontSize: '11px', color: '#888' }}>
                                    💡 Попробуйте:
                                    <ul style={{ textAlign: 'left', display: 'inline-block', marginTop: '5px' }}>
                                        <li>Оставить поле поиска пустым для просмотра всех записей</li>
                                        <li>Использовать менее строгие фильтры</li>
                                        <li>Искать по части названия или кода</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                </div>
            )}

            {/* Форма создания сущности */}
            {showCreateForm && (
                <CreateEntityForm
                    entityType={entityType}
                    onClose={() => {
                        setShowCreateForm(false);
                        setEntityType(null);
                    }}
                    onSuccess={() => {
                        if (query) {
                            handleSearch();
                        }
                        setShowCreateForm(false);
                        setEntityType(null);
                    }}
                />
            )}

            {/* Оверлей для закрытия выпадающего меню */}
            {showCreateDropdown && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 50
                    }}
                    onClick={() => setShowCreateDropdown(false)}
                />
            )}
        </div>
    );
}

const styles = {
    resultItem: {
        backgroundColor: '#222',
        borderLeft: '3px solid #555',
        padding: '15px',
        marginBottom: '10px',
        fontFamily: 'Courier New',
        borderRadius: '0 4px 4px 0'
    },
    sectionHeader: {
        fontSize: '14px',
        color: '#888',
        borderBottom: '1px solid #333',
        paddingBottom: '8px',
        marginTop: '25px',
        marginBottom: '15px',
        letterSpacing: '1px',
        textTransform: 'uppercase'
    }
};