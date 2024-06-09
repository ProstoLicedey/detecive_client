import AppRouter from "./components/AppRouter";
import ErrorBoundary from "./components/Error";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { Content } from "antd/es/layout/layout";
import { useContext, useEffect, useState } from "react";
import { Spin } from "antd";
import checkAuthService from "./services/checkAuthService";
import { Context } from "./index";
import { observer } from "mobx-react-lite";
import userPage from "./page/user/userPage";
import adminPage from "./page/admin/adminPage";
import { adminRoutes } from "./routes";
import { ADMIN_ROUTE, USER_ROUTE, AUTH_ROUTE } from "./utils/consts";
import { v4 as uuidv4 } from 'uuid';

function App() {
    const [loading, setLoading] = useState(true)
    const { user } = useContext(Context)
    const navigate = useNavigate();

    useEffect(() => {
        let deviceId = localStorage.getItem('deviceId');
        if (!deviceId) {
            const deviceId = uuidv4();
            localStorage.setItem('deviceId', deviceId);
        }
        if (localStorage.getItem('token')) {
            checkAuthService(user)
                .then(() => {
                    if (user.user == null) {
                        return;
                    }
                    console.log(user.user);
                    if (window.location.pathname === AUTH_ROUTE) {
                        if (user.user?.role === 'admin') {
                            navigate(ADMIN_ROUTE);
                        } else {
                            navigate(USER_ROUTE);
                        }
                    }
                })
                .catch()
                .finally(() => setLoading(false))
        }
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#2B2D30', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
            <Content>
                <AppRouter />
            </Content>
        </div>
    );
}

export default observer(App);
