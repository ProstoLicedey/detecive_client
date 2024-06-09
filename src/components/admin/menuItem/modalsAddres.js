import React from 'react';
import {Button, Form, Input, InputNumber, Modal, notification, Row, Select, Typography} from "antd";
import {createUserAPI} from "../../../http/userAPI";
import {SyncOutlined} from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import TextArea from "antd/es/input/TextArea";
import {createAddressrAPI} from "../../../http/addressesAPI";
const { Paragraph, Text } = Typography;

const {Option} = Select;
const ModalsAddres = ({open, onCancel}) => {
    const [form] = Form.useForm();

    const createAddres = () => {
        form
            .validateFields()
            .then((values) => {

                createAddressrAPI(values.district, values.number, values.title, values.appendix, values.info)
                    .then((response) => {
                        onCancel()
                        form.setFieldsValue({login: '', password: ''});
                    })
                    .catch((error) => {
                        if (error.response && error.response.data && error.response.data.message) {
                            const errorMessage = error.response.data.message;
                            return notification.error({
                                message: errorMessage,
                            });
                        } else {
                            return notification.error({
                                message: 'Произошла ошибка при выполнении запроса.',
                            });
                        }
                    });
            })
            .catch(() => {
                return notification.error({
                    message: 'Пожалуйста заполните все обязательные поля'
                });
            })
    }

    return (
        <Modal
            title={"Добавление адреса"}
            open={open}
            footer={null}
            onCancel={() => {
                onCancel();
            }}
        >
            <Form
                form={form}
                layout="vertical"
                requiredMark={false}
                style={{width: '100%', maxWidth: 500, padding: '0 20px'}}
            >
                <Text level={5}>Адрес</Text>
                <Row gutter={16}>
                    <Form.Item
                        label={""}
                        name="district"
                        rules={[
                            {
                                required: true,
                                message: '',
                            },
                        ]}
                        style={{ width: '30%', }}
                    >
                        <Select size="large" placeholder={"район"}>
                            <Option value="CЗ">CЗ</Option>
                            <Option value="С">С</Option>
                            <Option value="СВ">СВ</Option>
                            <Option value="З">З</Option>
                            <Option value="Ц">Ц</Option>
                            <Option value="ЮЗ">ЮЗ</Option>
                            <Option value="В">В</Option>
                            <Option value="ЮВ">ЮВ</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label={""}
                        name="number"
                        rules={[
                            {
                                message: '',
                                required: true,
                            },
                        ]}
                        style={{ width: '66%',  marginLeft:'4%'}}
                    >
                        <Input placeholder={"дом"} maxLength={40} size={"large"} />
                    </Form.Item>
                </Row>

                <Form.Item
                    label={"Заголовок"}
                    name="title"
                    rules={[
                        {
                            message: '',
                            required: true,
                        },
                    ]}
                >
                    <Input maxLength={100} size={"large"} style={{width: '100%'}}/>
                </Form.Item>
                <Form.Item
                    label="Приложение №"
                    name="appendix"

                    style={{ width: '100%' }}
                >
                    <InputNumber style={{ width: '100%' }} size={"large"} min={1} max={100} placeholder={"можно оставить пустым"} />
                </Form.Item>
                <Form.Item
                    label="Информация"
                    name="info"
                    rules={[
                        {
                            required: true,
                            message: '',
                        },
                    ]}
                    style={{ width: '100%' }}
                >
                    <TextArea
                        showCount
                        maxLength={50000}
                        style={{ height: 120, resize: 'none' }}
                    />
                </Form.Item>
                <Form.Item>
                    <Button onClick={createAddres} size={"large"} style={{backgroundColor: '#5b8c00'}} type={"primary"}
                            block>Добавить</Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalsAddres;
