import React, { useContext, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { adminRoutes, publicRoutes, userRoutes } from '../routes';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';
import ErrorPage from '../page/ErrorPage';
import { Spin } from "antd";
import checkAuthService from "../services/checkAuthService";

const AppRouter = () => {
    const { user } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(user.user.role);

    useEffect(() => {
        if (user && localStorage.getItem('token')) {
            checkAuthService(user)
                .then(() => setLoading(false))
                .catch(error => {
                    setLoading(false);
                    console.error('Ошибка при проверке авторизации:', error);
                });
        } else {
            setLoading(false);
        }
    }, [user]);

    // Обновляем роль, если она меняется
    useEffect(() => {
        setRole(user.user.role);
    }, [user.user.role]);

    if (loading) {
        return <Spin tip="Loading" size="large" />;
    }

    const routesToCheck = role === 'admin' ? adminRoutes : (role === 'user' ? userRoutes : publicRoutes);

    return (
        <Routes>
            {routesToCheck.map(({ path, Component }) => (
                <Route key={path} path={path} element={<Component />} />
            ))}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default observer(AppRouter);
