import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import OrderListPage from './pages/OrderListPage'; // ✅ 1. 추가됨
import './App.css';

// ✅ 보호된 라우트 설정
function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

// ✅ 라우트 경로 정의
function AppRoutes() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
            />
            <Route
                path="/signup"
                element={isAuthenticated ? <Navigate to="/" replace /> : <SignupPage />}
            />
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/products"
                element={
                    <ProtectedRoute>
                        <ProductPage />
                    </ProtectedRoute>
                }
            />
            {/* ✅ 2. 주문 관리 라우트 추가 (보호된 라우트 적용) */}
            <Route
                path="/orders"
                element={
                    <ProtectedRoute>
                        <OrderListPage />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
}