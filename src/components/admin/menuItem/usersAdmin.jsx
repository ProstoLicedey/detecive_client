import React, {useContext, useEffect, useRef, useState} from 'react';
import Title from "antd/es/typography/Title";
import {Button, ConfigProvider, Input, notification, Popconfirm, Space, Switch, Table, Typography} from "antd";
import {Context} from "../../../index";
import {connectTripAdmin, getTripsAdmin, putTrip} from "../../../http/tripAPI";
import {DeleteOutlined, SearchOutlined} from "@ant-design/icons";
import {userDeleteAPI, userListAPI} from "../../../http/userAPI";
import {observer} from "mobx-react-lite";
import UserModal from "./userModal";

const {Text} = Typography

const UsersAdmin = () => {
    const [modal, setModal] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [update, setUpdate] = useState(0);
    const searchInput = useRef(null);
    const {admin} = useContext(Context);

    useEffect(() => {
            userListAPI()
                .then((response) => {
                    admin.setUsers(response)
                })
                .catch((error) => {
                    if (error.response && error.response.data && error.response.data.message) {
                        const errorMessage = error.response.data.message;
                        return notification.error({
                            message: errorMessage,
                        });
                    } else {
                        // Если нет специфического сообщения об ошибке от сервера
                        return notification.error({
                            message: 'Произошла ошибка при выполнении запроса.',
                        });
                    }
                })

        }, [update]
    );

    function deleteAddress(id) {
        userDeleteAPI(id)
            .then((response) => {
                return notification.success({
                    message: 'Адрес удалена',
                });
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.message) {
                    const errorMessage = error.response.data.message;
                    setUpdate(update+1)
                    return notification.error({
                        message: errorMessage,
                    });
                } else {
                    // Если нет специфического сообщения об ошибке от сервера
                    return notification.error({
                        message: 'Произошла ошибка при выполнении запроса.',
                    });
                }
            })
        setUpdate(update+1)
    }



    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Введите ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined style={{color: '#FFFFFFD9'}}/>}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Найти
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Сброс
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Закрыть
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : 'white',
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
    });

    const columns = [
        {
            title: 'Номер',
            dataIndex: 'id',
            key: 'id',
            width: '10%',
            ...getColumnSearchProps('id'),
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Логин',
            dataIndex: 'login',
            key: 'login',
            width: '30%',
            sorter: (a, b) => a.team.length - b.team.length,
            ...getColumnSearchProps('team'),
            render: (text, record) => (
                text
            )
        },
        {
            title: 'Поездок всего',
            dataIndex: 'tripCount',
            key: 'tripCount',
            width: '5%',

        },
        {
            title: 'Удачных',
            dataIndex: 'goodTripCount',
            key: 'appendix',
            width: '5%',
            render: (text) => <Text style={{ color: 'green' }}>{text}</Text>,
        },
        {
            title: 'Ошибочных',
            dataIndex: 'falseTripCount',
            key: 'appendix',
            width: '5%',
            render: (text) => <Text style={{ color: 'red' }}>{text}</Text>,
        },
        {
            title: 'Получено приложений',
            dataIndex: 'appendix',
            key: 'appendix',
            width: '5%',
        },
        {
            title: 'Пароль',
            dataIndex: 'password',
            key: 'password',
            width: '25%',
            render: (text, record) => <PasswordShowLink password={text}/>,
        },
        {
            title: '',
            key: 'delete',
            width: '15%',
            sortDirections: ['descend', 'ascend'],
            render: (issued, record) => (
                <>
                    <Popconfirm
                        title={`Удалить команду?`}
                        onConfirm={() =>deleteAddress(record.id)}
                        okText="Удалить"
                        cancelText="Отмена"
                        placement="left"
                        icon={<DeleteOutlined/>}
                        okButtonProps={{style: {backgroundColor: '#a8071a'}}}
                    >
                        <Button style={{backgroundColor: '#820014'}} type={"primary"}>Удалить</Button>
                    </Popconfirm>
                </>
            )
        },


    ];

    const PasswordShowLink = ({password}) => {
        const [showPassword, setShowPassword] = useState(false);

        const toggleShowPassword = () => {
            setShowPassword(!showPassword);
        };

        return (
            <>
                {showPassword ? (
                    <span>{password}</span>
                ) : (
                    <Text style={{color: '#FFFFFFA6', cursor:'pointer'}} type="secondary" underline onClick={toggleShowPassword}>Показать
                        пароль</Text>
                )}
            </>
        );
    };


    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
        }}>
            <div style={{
                width: '90%', marginLeft: '2%',
                marginRight: '2%', maxWidth: 1200
            }}>
                <Title style={{color: '#FFFFFFD9', textAlign: 'center'}} level={2}>Команды</Title>
                <Button onClick={() =>setModal(true)} size={"large"} style={{backgroundColor: '#3f6600', margin: 10}}
                        type={"primary"}
                >Добавть команду +</Button>
                <ConfigProvider
                    theme={{
                        components: {
                            Table: {

                                bodySortBg: '#2B2D30',
                                headerFilterHoverBg: '#2B2D30',
                                headerSortActiveBg: '#2B2D30',
                                headerSortHoverBg: '#2B2D30',
                                headerSplitColor: '#2B2D30',
                                headerBg: '#1E1F22',
                                headerColor: '#FFFFFFD9',
                                rowSelectedHoverBg: '#1E1F22',
                                rowExpandedBg: '#2B2D30',
                                rowHoverBg: '#2B2D30',
                                rowSelectedBg: '#2B2D30',
                                borderColor: '#00000040',

                            },
                        },
                    }}
                >
                    <Table
                        onRow={(record) => ({
                            style: {
                                background: '#2B2D30',
                                color: '#FFFFFFD9',
                                borderColor: '#00000040'
                            },
                        })}
                        bordered
                        style={{overflowX: 'auto', background: '#2B2D30',}}
                        columns={columns}
                        dataSource={admin.users}
                        responsive={{xs: true, sm: true, md: true, lg: true, xl: true, xxl: true}}
                    />
                </ConfigProvider>
            </div>
            <UserModal open={modal}
                      onCancel={() => {
                          setUpdate(update+1)
                          setModal(false);
                      }}
            />
        </div>
    );
}
export default observer(UsersAdmin);