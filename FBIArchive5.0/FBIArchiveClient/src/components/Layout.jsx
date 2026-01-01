import React from 'react';

const Layout = ({ title, children }) => {
    return (
        <div className="card">
            <h1>{title}</h1>
            {children}
        </div>
    );
};

export default Layout;