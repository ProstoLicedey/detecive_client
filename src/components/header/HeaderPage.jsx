import React, {useContext, useState} from 'react';
import {Header} from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";
import Logo from '../../assets/ToDo.png';
import {Button, Image, Modal, notification} from 'antd';
import {useMediaQuery} from "react-responsive";
import Timer from "./timer";
import {Context} from "../../index";
import {logoutAPI} from "../../http/userAPI";
import {useNavigate} from "react-router-dom";
import {AUTH_ROUTE} from "../../utils/consts";

const HeaderPage = () => {
    const {user, logout} = useContext(Context);
    const isMobile = useMediaQuery({maxWidth: 950});
    const [modalVisible, setModalVisible] = useState(false);
    const navigate = useNavigate();
    const handleLogout = () => {
        // Вызываем функцию logout, если пользователь подтвердил выход
        logoutAPI().then(r => {
            localStorage.removeItem('token');
            user.setUser({})
            user.setIsAuth(false)
            navigate(AUTH_ROUTE)
        })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.message) {

                    const errorMessage = error.response.data.message;
                    return notification.error({
                        message: errorMessage,
                        placement: 'top'
                    });
                } else {
                    // Если нет специфического сообщения об ошибке от сервера
                    return notification.error({
                        message: 'Произошла ошибка при выполнении запроса.',
                        placement: 'top'
                    });
                }
            })
        setModalVisible(false); // Закрываем модальное окно после выхода
    };

    return (
        <Header style={{
            display: 'flex',
            alignItems: 'center',
            height: '7%',
            justifyContent: 'space-between',
            backgroundColor: '#1E1F22',
            padding: isMobile ? '0 10px' : '0 20px'  // Adjust padding for mobile view
        }}>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <Image src={Logo}
                       style={{
                           width: "50px",
                           height: "50px",
                       }}
                       preview={false}
                       alt="Логотип сайта"
                />
                {!isMobile &&
                    (<Title
                        style={{
                            color: '#FFFFFFD9',
                            marginTop: '0.3vw',
                            marginBottom: '0.3vw',
                            userSelect: 'none',
                            whiteSpace: 'nowrap',
                        }}
                        level={3}
                    >
                        Детектив ТоДо
                    </Title>)}
            </div>

            <Timer header={true}/>
            <Button size={"large"} style={{backgroundColor: "#2B2D30", color: '#FFFFFFD9', padding: '0 20px'}}
                    onClick={() => setModalVisible(true)}>
                {user.user.login}
            </Button>

            {/* Модальное окно для подтверждения выхода */}
            <Modal
                title="Выход из аккаунта"
                visible={modalVisible}
                onOk={handleLogout}
                onCancel={() => setModalVisible(false)}
                okText="Выйти"
                cancelText="Отмена"
                okButtonProps={{ style: { backgroundColor: '#a8071a' } }}

            >
                <p>Вы уверены, что хотите выйти из аккаунта?</p>
            </Modal>
        </Header>
    );
};

export default HeaderPage;
