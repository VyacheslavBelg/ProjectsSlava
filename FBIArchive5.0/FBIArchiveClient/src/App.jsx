import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import DocumentDetailPage from './pages/DocumentDetailPage';
import CaseDetailPage from './pages/CaseDetailPage';
import SeriesDetailPage from './pages/SeriesDetailPage';
import DefendantDetailPage from './pages/DefendantDetailPage';
import EmployeeDetailPage from './pages/EmployeeDetailPage';
import OrganizationDetailPage from './pages/OrganizationDetailPage'; 
import DepartmentDetailPage from './pages/DepartmentDetailPage';     
import './App.css

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/" />;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route path="/dashboard" element={
                    <PrivateRoute>
                        <DashboardPage />
                    </PrivateRoute>
                } />

                <Route path="/document/:id" element={
                    <PrivateRoute>
                        <DocumentDetailPage />
                    </PrivateRoute>
                } />

                <Route path="/case/:id" element={
                    <PrivateRoute>
                        <CaseDetailPage />
                    </PrivateRoute>
                } />

                <Route path="/series/:id" element={
                    <PrivateRoute>
                        <SeriesDetailPage />
                    </PrivateRoute>
                } />

                <Route path="/defendant/:id" element={
                    <PrivateRoute>
                        <DefendantDetailPage />
                    </PrivateRoute>
                } />

                <Route path="/employee/:id" element={
                    <PrivateRoute>
                        <EmployeeDetailPage />
                    </PrivateRoute>
                } />

                <Route path="/organization/:id" element={
                    <PrivateRoute>
                        <OrganizationDetailPage />
                    </PrivateRoute>
                } />

                <Route path="/department/:id" element={
                    <PrivateRoute>
                        <DepartmentDetailPage />
                    </PrivateRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;