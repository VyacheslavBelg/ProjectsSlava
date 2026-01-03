
export const getUserRole = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {

        const payload = JSON.parse(atob(token.split('.')[1]));

        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
            payload.role ||
            payload.Role;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

export const isAdmin = () => {
    const role = getUserRole();
    return role === 'Admin' || role === 'Админ' || role === 'admin';
};

export const getUserName = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/name"] ||
            payload.name ||
            payload.unique_name;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};