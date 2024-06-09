import React, {useRef, useEffect, useState, useContext} from 'react';
import Title from "antd/es/typography/Title";
import {connectTimer, getTimer} from "../../http/timerAPI";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import moment from 'moment';
import {notification} from "antd";
import {useMediaQuery} from "react-responsive";

const Timer = () => {
    const timerRef = useRef(null);
    const [remains, setRemains] = useState('00:00:00');
    const isMobile = useMediaQuery({maxWidth: 950});
    const {timer} = useContext(Context)

    useEffect(() => {
        getTimer()
            .then((response) => {

                timer.setTimeFinish(response)
                const responseTime = moment(response);
                const currentTime = moment();

                const duration = moment.duration(responseTime.diff(currentTime));
                let formattedTime;

                if (duration.asMilliseconds() <= 0) {
                    formattedTime = "00:00:00";
                } else {
                    formattedTime = moment.utc(duration.asMilliseconds()).format("HH:mm:ss");
                }

                setRemains(formattedTime);
            })
            .catch(() => {
                return null;
            });
        connectTimer(timer)
    }, []);

    useEffect(() => {
        try {
            console.log(timer.timeFinish);
            console.log(typeof timer.timeFinish);

            // Проверяем, что timer.timeFinish не равен null, 0 и соответствует ожидаемому формату даты
            if (!timer.timeFinish || isNaN(Date.parse(timer.timeFinish))) {
                console.log("Invalid date format");
                setRemains("00:00:00");
                return;
            }

            const responseTime = moment(timer.timeFinish);
            const currentTime = moment();

            const duration = moment.duration(responseTime.diff(currentTime));
            let formattedTime;

            if (duration.asMilliseconds() <= 0) {
                formattedTime = "00:00:00";
            } else {
                formattedTime = moment.utc(duration.asMilliseconds()).format("HH:mm:ss");
            }

            setRemains(formattedTime);
        } catch (error) {
            console.error("An error occurred:", error);
            setRemains("00:00:00");
        }
    }, [timer.timeFinish]);



    useEffect(() => {
        if (remains != "00:00:00") {
            timer.setTimerActive(true)
            if (remains === "00:10:00") {
                notification.info({
                    message: 'У вас осталось 10 минут',
                    placement: 'top',
                    showProgress: true,
                });
            }
            if (remains === "00:00:01") {
                notification.warning({
                    message: 'Время вышло',
                    duration: 'Необходимо сдать бланки',
                    placement: 'top',
                    showProgress: true,
                });
            }
            const timerInterval = setInterval(() => {
                const newTime = moment(remains, "HH:mm:ss").subtract(1, 'seconds').format("HH:mm:ss");
                setRemains(newTime);
            }, 1000);
            return () => clearInterval(timerInterval);
        } else {
            timer.setTimerActive(false)
        }

    }, [remains]);
    return (
        <Title ref={timerRef} style={{
            color: remains == "00:00:00" ? " #a8071a" : "#FFFFFFD9",
            whiteSpace: "nowrap",
            margin: 0,
        }}
               level={isMobile ? 4 : 1}
        >
            {remains}
        </Title>
    );
};

export default observer(Timer);
