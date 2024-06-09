import {ADMIN_ROUTE, AUTH_ROUTE,  TIMER_ROUTE, USER_ROUTE} from "./utils/consts";
import UserPage from "./page/user/userPage";
import AdminPage from "./page/admin/adminPage";
import AuthPage from "./page/AuthPage.";
import Timer from "./components/header/timer";


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
    {
        path: TIMER_ROUTE,
        Component: Timer
    },
]

export  const publicRoutes = [
    {
        path: AUTH_ROUTE,
        Component:AuthPage
    },
    {
        path: TIMER_ROUTE,
        Component: Timer
    },
]
