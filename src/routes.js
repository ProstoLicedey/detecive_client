import {ADMIN_ROUTE, AUTH_ROUTE,  TIMER_ROUTE, USER_ROUTE} from "./utils/consts";
import UserPage from "./page/user/userPage";
import AdminPage from "./page/admin/adminPage";
import AuthPage from "./page/AuthPage.";
import TimerPage from "./page/admin/timerPage";


export const  userRoutes = [

    {
        path: USER_ROUTE,
        Component: UserPage
    },

]



export  const adminRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: AdminPage
    },
]

export  const publicRoutes = [
    {
        path: AUTH_ROUTE,
        Component:AuthPage
    },
    {
        path: TIMER_ROUTE,
        Component: TimerPage
    },
]
