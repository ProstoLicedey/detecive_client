import React, {useContext, useEffect, useState} from 'react';
import HeaderPage from "../../components/header/HeaderPage";
import MenuPage from "../../components/admin/menuPage";
import tripAdmin from "../../components/admin/menuItem/tripAdmin";
import timerAdmin from "../../components/admin/menuItem/timerAdmin";
import TripAdmin from "../../components/admin/menuItem/tripAdmin";
import TimerAdmin from "../../components/admin/menuItem/timerAdmin";
import UsersAdmin from "../../components/admin/menuItem/usersAdmin";
import AddressesPage from "../../components/admin/menuItem/addressesPage";
import {connectTimer, getTimer} from "../../http/timerAPI";
import moment from "moment/moment";
import {Context} from "../../index";
import {notification} from "antd";
import {observer} from "mobx-react-lite";

const PLANS = {
    trip: TripAdmin,
    timer: TimerAdmin,
    users: UsersAdmin,
    addresses: AddressesPage
}

const AdminPage = () => {
    const hashValue = window.location.hash.substring(1);
    const initialSelectedPlan = PLANS[hashValue] ? hashValue : 'trip';
    const [selectedPlan, setSelectedPlan] = useState(initialSelectedPlan);
    const { admin } = useContext(Context)
    // useEffect(() => {
    //     if (admin.trips.length > 0) {
    //         const lastTrip = admin.trips[0];
    //         console.log(lastTrip)
    //         if (lastTrip.status === '#614700') {
    //             notification.info({
    //                 message: 'Необходимо выдать новое приложение',
    //             });
    //         }
    //     }
    // }, [admin.trips]);
    useEffect(() => {
        const handleHashChange = () => {
            const hashValue = window.location.hash.substring(1);

            setSelectedPlan(PLANS[hashValue] ? hashValue : 'eventAdmin');
        };

        // Подписываемся на событие изменения hash при монтировании компонента
        window.addEventListener('hashchange', handleHashChange);


        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);


    const PlanView = PLANS[selectedPlan];
    return (
        <div>
            <HeaderPage/>
            <MenuPage hash={hashValue}/>
            <PlanView style={{backgroundColor: 'white'}}/>
        </div>
    );
};

export default observer(AdminPage);