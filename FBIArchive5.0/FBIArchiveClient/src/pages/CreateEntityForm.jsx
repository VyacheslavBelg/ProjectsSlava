import { useState } from 'react';
import { Admin } from '../api/agent';

const SECURITY_LEVELS = [
    'Совершенно секретно', 'Секретно', 'Конфиденциально',
    'Для служебного пользования', 'Открытый'
];

const DOCUMENT_TYPES = [
    'Служебная записка', 'Отчет о наблюдении', 'Протокол допроса',
    'Телеграмма', 'Агентурное донесение'
];

const CASE_STATUSES = [
    'Закрыто', 'Активно', 'Приостановлено',
    'Передано в другой орган', 'Архив', 'Рассекречено'
];

const DEFENDANT_STATUSES = [
    'Подозреваемый', 'Обвиняемый', 'Объект наблюдения',
    'Свидетель', 'Осведомитель', 'Потерпевший'
];

const EMPLOYEE_POSTS = [
    'Директор', 'Заместитель директора', 'Специальный Агент',
    'Аналитик', 'Секретарь', 'Начальник полевого отдела'
];

const ORGANIZATION_TYPES = [
    'Преступная организация', 'Политическая партия',
    'Коммерческая фирма', 'Общественное объединение',
    'Террористическая группа', 'Шпионская сеть'
];

const ORGANIZATION_STATUSES = [
    'Активна', 'Распущена', 'Запрещена', 'Под наблюдением'
];

const DEPARTMENT_TYPES = [
    'Полевой отдел', 'Аналитический отдел',
    'Следственный отдел', 'Отдел наружного наблюдения',
    'Архивный отдел', 'Административный отдел'
];

const DEPARTMENT_STATUSES = [
    'Активен', 'Расформирован', 'Реорганизован'
];

export default function CreateEntityForm({ entityType, onClose, onSuccess }) {
    const [formData, setFormData] = useState(getInitialFormData());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    function getInitialFormData() {
        const today = new Date().toISOString().split('T')[0];
        switch (entityType) {
            case 'document':
                return {
                    name: '',
                    securityLevel: '',
                    documentType: '',
                    createDate: today,
                    seriesId: '',
                    caseId: ''
                };
            case 'case':
                return {
                    code: '',
                    name: '',
                    openDate: today,
                    closeDate: '',
                    description: '',
                    status: '',
                    defendantId: '',
                    employeeId: ''
                };
            case 'defendant':
                return {
                    name: '',
                    surname: '',
                    alias: '',
                    birthDate: '1950-01-01',
                    deathDate: '',
                    status: '',
                    photoUrl: '',
                    organizationId: ''
                };
            case 'employee':
                return {
                    badge: '',
                    name: '',
                    surname: '',
                    birthDate: '1970-01-01',
                    deathDate: '',
                    post: '',
                    photoUrl: '',
                    investigationDepartmentId: ''
                };
            case 'series':
                return {
                    code: '',
                    name: '',
                    description: '',
                    yearPeriod: ''
                };
            case 'organization':
                return {
                    name: '',
                    description: '',
                    organizationType: '',
                    establishedDate: '',
                    disbandedDate: '',
                    status: 'Активна'
                };
            case 'department':
                return {
                    name: '',
                    code: '',
                    description: '',
                    departmentType: '',
                    establishedDate: today,
                    status: 'Активен'
                };
            default:
                return {};
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let response;
            const data = { ...formData };

           
            if (data.createDate) data.createDate = new Date(data.createDate).toISOString();
            if (data.openDate) data.openDate = new Date(data.openDate).toISOString();
            if (data.closeDate && data.closeDate !== '') data.closeDate = new Date(data.closeDate).toISOString();
            if (data.birthDate) data.birthDate = new Date(data.birthDate).toISOString();
            if (data.deathDate && data.deathDate !== '') data.deathDate = new Date(data.deathDate).toISOString();
            if (data.establishedDate && data.establishedDate !== '') data.establishedDate = new Date(data.establishedDate).toISOString();
            if (data.disbandedDate && data.disbandedDate !== '') data.disbandedDate = new Date(data.disbandedDate).toISOString();

           
            if (data.seriesId && data.seriesId !== '') data.seriesId = parseInt(data.seriesId);
            if (data.caseId && data.caseId !== '') data.caseId = parseInt(data.caseId);
            if (data.defendantId && data.defendantId !== '') data.defendantId = parseInt(data.defendantId);
            if (data.employeeId && data.employeeId !== '') data.employeeId = parseInt(data.employeeId);
            if (data.organizationId && data.organizationId !== '') data.organizationId = parseInt(data.organizationId);
            if (data.investigationDepartmentId && data.investigationDepartmentId !== '')
                data.investigationDepartmentId = parseInt(data.investigationDepartmentId);

           
            Object.keys(data).forEach(key => {
                if (data[key] === '' || data[key] === null) {
                    delete data[key];
                }
            });

            switch (entityType) {
                case 'document':
                    response = await Admin.createDocument(data);
                    break;
                case 'case':
                    response = await Admin.createCase(data);
                    break;
                case 'defendant':
                    response = await Admin.createDefendant(data);
                    break;
                case 'employee':
                    response = await Admin.createEmployee(data);
                    break;
                case 'series':
                    response = await Admin.createSeries(data);
                    break;
                case 'organization':
                    response = await Admin.createOrganization(data);
                    break;
                case 'department':
                    response = await Admin.createDepartment(data);
                    break;
                default:
                    throw new Error('Неизвестный тип сущности');
            }

            alert(`${getEntityName(entityType)} успешно создан! ID: ${response.data[entityType]?.id}`);
            onSuccess?.(response.data);
            onClose();
        } catch (err) {
            const errorMessage = err.response?.data?.message ||
                err.response?.data?.title ||
                err.response?.statusText ||
                'Ошибка при создании';
            setError(errorMessage);
            console.error('Create error:', err.response?.data || err);
        } finally {
            setLoading(false);
        }
    };

    const getEntityName = (type) => {
        const names = {
            'document': 'Документ',
            'case': 'Дело',
            'defendant': 'Фигурант',
            'employee': 'Сотрудник',
            'series': 'Серия',
            'organization': 'Организация',
            'department': 'Отдел'
        };
        return names[type] || 'Сущность';
    };

    const getEntityIcon = (type) => {
        const icons = {
            'document': '📄',
            'case': '📁',
            'defendant': '👤',
            'employee': '👨‍💼',
            'series': '📚',
            'organization': '🏢',
            'department': '🏛️'
        };
        return icons[type] || '📌';
    };

    const renderFormFields = () => {
        switch (entityType) {
            case 'document':
                return (
                    <div style={styles.formContainer}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Название документа *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                style={styles.input}
                                required
                                placeholder="Введите название документа"
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Уровень секретности *</label>
                            <select
                                name="securityLevel"
                                value={formData.securityLevel}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            >
                                <option value="">Выберите уровень секретности</option>
                                {SECURITY_LEVELS.map(level => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Тип документа *</label>
                            <select
                                name="documentType"
                                value={formData.documentType}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            >
                                <option value="">Выберите тип документа</option>
                                {DOCUMENT_TYPES.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Дата создания *</label>
                            <input
                                type="date"
                                name="createDate"
                                value={formData.createDate}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>ID серии *</label>
                            <input
                                type="number"
                                name="seriesId"
                                value={formData.seriesId}
                                onChange={handleChange}
                                style={styles.input}
                                required
                                placeholder="Например: 1"
                                min="1"
                            />
                            <div style={styles.helperText}>Укажите ID существующей серии</div>
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>ID дела *</label>
                            <input
                                type="number"
                                name="caseId"
                                value={formData.caseId}
                                onChange={handleChange}
                                style={styles.input}
                                required
                                placeholder="Например: 1"
                                min="1"
                            />
                            <div style={styles.helperText}>Укажите ID существующего дела</div>
                        </div>
                    </div>
                );
            case 'case':
                return (
                    <div style={styles.formContainer}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Код дела *</label>
                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                style={styles.input}
                                required
                                placeholder="Например: 1947-XF"
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Название дела *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                style={styles.input}
                                required
                                placeholder="Введите название дела"
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Статус дела *</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            >
                                <option value="">Выберите статус</option>
                                {CASE_STATUSES.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Дата открытия *</label>
                            <input
                                type="date"
                                name="openDate"
                                value={formData.openDate}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Дата закрытия</label>
                            <input
                                type="date"
                                name="closeDate"
                                value={formData.closeDate}
                                onChange={handleChange}
                                style={styles.input}
                            />
                            <div style={styles.helperText}>Оставьте пустым, если дело открыто</div>
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Описание</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                style={{ ...styles.input, minHeight: '100px' }}
                                placeholder="Описание дела..."
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>ID фигуранта</label>
                            <input
                                type="number"
                                name="defendantId"
                                value={formData.defendantId}
                                onChange={handleChange}
                                style={styles.input}
                                placeholder="Например: 1"
                                min="1"
                            />
                            <div style={styles.helperText}>Укажите ID фигуранта (необязательно)</div>
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>ID сотрудника</label>
                            <input
                                type="number"
                                name="employeeId"
                                value={formData.employeeId}
                                onChange={handleChange}
                                style={styles.input}
                                placeholder="Например: 1"
                                min="1"
                            />
                            <div style={styles.helperText}>Укажите ID сотрудника (необязательно)</div>
                        </div>
                    </div>
                );
            case 'defendant':
                return (
                    <div style={styles.formContainer}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Имя *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                style={styles.input}
                                required
                                placeholder="Введите имя"
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Фамилия *</label>
                            <input
                                type="text"
                                name="surname"
                                value={formData.surname}
                                onChange={handleChange}
                                style={styles.input}
                                required
                                placeholder="Введите фамилию"
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Псевдоним</label>
                            <input
                                type="text"
                                name="alias"
                                value={formData.alias}
                                onChange={handleChange}
                                style={styles.input}
                                placeholder="Псевдоним или кличка"
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Статус *</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            >
                                <option value="">Выберите статус</option>
                                {DEFENDANT_STATUSES.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Дата рождения *</label>
                            <input
                                type="date"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Дата смерти</label>
                            <input
                                type="date"
                                name="deathDate"
                                value={formData.deathDate}
                                onChange={handleChange}
                                style={styles.input}
                            />
                            <div style={styles.helperText}>Оставьте пустым, если фигурант жив</div>
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>URL фото</label>
                            <input
                                type="text"
                                name="photoUrl"
                                value={formData.photoUrl}
                                onChange={handleChange}
                                style={styles.input}
                                placeholder="https://example.com/photo.jpg"
                            />
                            <div style={styles.helperText}>Ссылка на фотографию (необязательно)</div>
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>ID организации *</label>
                            <input
                                type="number"
                                name="organizationId"
                                value={formData.organizationId}
                                onChange={handleChange}
                                style={styles.input}
                                required
                                placeholder="Например: 1"
                                min="1"
                            />
                            <div style={styles.helperText}>Укажите ID существующей организации</div>
                        </div>
                    </div>
                );
            case 'employee':
                return (
                    <div style={styles.formContainer}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Номер бейджа *</label>
                            <input
                                type="text"
                                name="badge"
                                value={formData.badge}
                                onChange={handleChange}
                                style={styles.input}
                                required
                                placeholder="Например: F-1234"
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Имя *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                style={styles.input}
                                required
                                placeholder="Введите имя"
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Фамилия *</label>
                            <input
                                type="text"
                                name="surname"
                                value={formData.surname}
                                onChange={handleChange}
                                style={styles.input}
                                required
                                placeholder="Введите фамилию"
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Должность *</label>
                            <select
                                name="post"
                                value={formData.post}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            >
                                <option value="">Выберите должность</option>
                                {EMPLOYEE_POSTS.map(post => (
                                    <option key={post} value={post}>{post}</option>
                                ))}
                            </select>
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Дата рождения *</label>
                            <input
                                type="date"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Дата смерти</label>
                            <input
                                type="date"
                                name="deathDate"
                                value={formData.deathDate}
                                onChange={handleChange}
                                style={styles.input}
                            />
                            <div style={styles.helperText}>Оставьте пустым, если сотрудник жив</div>
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>URL фото</label>
                            <input
                                type="text"
                                name="photoUrl"
                                value={formData.photoUrl}
                                onChange={handleChange}
                                style={styles.input}
                                placeholder="https://example.com/photo.jpg"
                            />
                            <div style={styles.helperText}>Ссылка на фотографию (необязательно)</div>
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>ID отдела *</label>
                            <input
                                type="number"
                                name="investigationDepartmentId"
                                value={formData.investigationDepartmentId}
                                onChange={handleChange}
                                style={styles.input}
                                required
                                placeholder="Например: 1"
                                min="1"
                            />
                            <div style={styles.helperText}>Укажите ID существующего отдела</div>
                        </div>
                    </div>
                );
            case 'series':
                return (
                    <div style={styles.formContainer}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Код серии *</label>
                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                style={styles.input}
                                required
                                placeholder="Например: SER-1947"
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Название серии *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                style={styles.input}
                                required
                                placeholder="Введите название серии"
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Период *</label>
                            <input
                                type="text"
                                name="yearPeriod"
                                value={formData.yearPeriod}
                                onChange={handleChange}
                                style={styles.input}
                                required
                                placeholder="Например: 1947-1953"
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Описание</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                style={{ ...styles.input, minHeight: '120px' }}
                                placeholder="Описание серии..."
                            />
                        </div>
                    </div>
                );
            case 'organization':
                return (
                    <div style={styles.formContainer}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Название организации *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                style={styles.input}
                                required
                                placeholder="Введите название организации"
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Тип организации</label>
                            <select
                                name="organizationType"
                                value={formData.organizationType}
                                onChange={handleChange}
                                style={styles.input}
                            >
                                <option value="">Выберите тип</option>
                                {ORGANIZATION_TYPES.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Статус</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                style={styles.input}
                            >
                                {ORGANIZATION_STATUSES.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Дата основания</label>
                            <input
                                type="date"
                                name="establishedDate"
                                value={formData.establishedDate}
                                onChange={handleChange}
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Дата роспуска</label>
                            <input
                                type="date"
                                name="disbandedDate"
                                value={formData.disbandedDate}
                                onChange={handleChange}
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Описание</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                style={{ ...styles.input, minHeight: '120px' }}
                                placeholder="Описание организации..."
                            />
                        </div>
                    </div>
                );
            case 'department':
                return (
                    <div style={styles.formContainer}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Название отдела *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                style={styles.input}
                                required
                                placeholder="Введите название отдела"
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Код отдела *</label>
                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                style={styles.input}
                                required
                                placeholder="Например: FD-01"
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Тип отдела</label>
                            <select
                                name="departmentType"
                                value={formData.departmentType}
                                onChange={handleChange}
                                style={styles.input}
                            >
                                <option value="">Выберите тип</option>
                                {DEPARTMENT_TYPES.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Статус</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                style={styles.input}
                            >
                                {DEPARTMENT_STATUSES.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Дата основания *</label>
                            <input
                                type="date"
                                name="establishedDate"
                                value={formData.establishedDate}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Описание</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                style={{ ...styles.input, minHeight: '120px' }}
                                placeholder="Описание отдела..."
                            />
                        </div>
                    </div>
                );
            default:
                return <div>Тип сущности не поддерживается</div>;
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <div style={styles.headerTitle}>
                        <span style={styles.entityIcon}>{getEntityIcon(entityType)}</span>
                        <h2 style={styles.title}>СОЗДАНИЕ НОВОГО {getEntityName(entityType).toUpperCase()}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        style={styles.closeButton}
                        title="Закрыть"
                    >
                        ✕
                    </button>
                </div>

                {error && (
                    <div style={styles.error}>
                        <div style={styles.errorIcon}>⚠️</div>
                        <div style={styles.errorContent}>
                            <strong>Ошибка:</strong> {error}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formContent}>
                        <div style={styles.requiredNote}>
                            <span style={{ color: '#ff6b6b' }}>*</span> Поля, обязательные для заполнения
                        </div>
                        {renderFormFields()}
                    </div>

                    <div style={styles.footer}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={styles.cancelButton}
                            disabled={loading}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            style={styles.submitButton}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span style={styles.spinner}>⏳</span>
                                    СОЗДАНИЕ...
                                </>
                            ) : (
                                'СОЗДАТЬ'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        fontFamily: 'Courier New, monospace',
        padding: '20px'
    },
    modal: {
        backgroundColor: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '8px',
        width: '600px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 25px',
        borderBottom: '1px solid #333',
        backgroundColor: '#222',
        flexShrink: 0
    },
    headerTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    entityIcon: {
        fontSize: '28px'
    },
    title: {
        margin: 0,
        fontSize: '18px',
        color: '#fff',
        fontWeight: 'bold',
        letterSpacing: '0.5px'
    },
    closeButton: {
        background: 'none',
        border: 'none',
        color: '#888',
        fontSize: '24px',
        cursor: 'pointer',
        padding: '5px 10px',
        borderRadius: '4px',
        transition: 'all 0.2s',
        '&:hover': {
            backgroundColor: '#333',
            color: '#fff'
        }
    },
    error: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: '#2c0c0c',
        color: '#ff6b6b',
        padding: '15px 25px',
        margin: 0,
        borderBottom: '1px solid #441111',
        flexShrink: 0
    },
    errorIcon: {
        fontSize: '20px'
    },
    errorContent: {
        flex: 1,
        fontSize: '14px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        overflow: 'hidden'
    },
    formContent: {
        padding: '25px',
        flex: 1,
        overflowY: 'auto'
    },
    requiredNote: {
        color: '#888',
        fontSize: '12px',
        marginBottom: '20px',
        padding: '8px 12px',
        backgroundColor: '#222',
        borderRadius: '4px',
        borderLeft: '3px solid #4caf50'
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column'
    },
    label: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        marginBottom: '8px',
        color: '#ccc',
        fontSize: '14px',
        fontWeight: 'bold'
    },
    input: {
        width: '100%',
        padding: '12px 15px',
        backgroundColor: '#222',
        border: '1px solid #444',
        color: 'white',
        borderRadius: '6px',
        fontSize: '14px',
        fontFamily: 'inherit',
        transition: 'all 0.2s',
        '&:focus': {
            outline: 'none',
            borderColor: '#4caf50',
            boxShadow: '0 0 0 2px rgba(76, 175, 80, 0.2)'
        },
        '&:hover': {
            borderColor: '#555'
        }
    },
    helperText: {
        marginTop: '6px',
        color: '#777',
        fontSize: '11px',
        fontStyle: 'italic'
    },
    footer: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '15px',
        padding: '20px 25px',
        borderTop: '1px solid #333',
        backgroundColor: '#222',
        flexShrink: 0
    },
    cancelButton: {
        padding: '12px 25px',
        border: '1px solid #555',
        backgroundColor: 'transparent',
        color: '#aaa',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        fontFamily: 'inherit',
        minWidth: '120px',
        transition: 'all 0.2s',
        '&:hover:not(:disabled)': {
            backgroundColor: '#333',
            color: '#fff'
        },
        '&:disabled': {
            opacity: 0.5,
            cursor: 'not-allowed'
        }
    },
    submitButton: {
        padding: '12px 25px',
        border: 'none',
        backgroundColor: '#4caf50',
        color: 'white',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        fontFamily: 'inherit',
        minWidth: '120px',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        '&:hover:not(:disabled)': {
            backgroundColor: '#45a049',
            transform: 'translateY(-1px)'
        },
        '&:disabled': {
            opacity: 0.6,
            cursor: 'not-allowed',
            transform: 'none'
        }
    },
    spinner: {
        display: 'inline-block',
        animation: 'spin 1s linear infinite'
    }
};

// Добавим анимацию спиннера
if (typeof document !== 'undefined' && document.styleSheets.length > 0) {
    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(`
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `, styleSheet.cssRules.length);
}