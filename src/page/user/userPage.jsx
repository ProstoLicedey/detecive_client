import React from 'react';
import HeaderPage from "../../components/header/HeaderPage";
import Trip from "../../components/user/trip";
import TripsList from "../../components/user/tripsList";
import {Divider} from "antd";

const UserPage = () => {
    return (
        <div>
            <div style={{position: 'fixed', width: '100%', zIndex: '100'}}>
                <HeaderPage/>
            </div>
            <div style={{
                paddingTop: '80px',
                display: 'flex',
                justifyContent: 'center',
            }}>
                <Trip/>
            </div>
            <Divider style={{backgroundColor: '#1E1F22', height:1}}/>
            <TripsList/>
        </div>
    );
};

export default UserPage;
