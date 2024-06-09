import React, { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from "react-responsive";
import { getTimer } from "../../http/timerAPI";
import moment from "moment/moment";
import { notification } from "antd";
import Title from "antd/es/typography/Title";

const TimerPage = () => {
    const timerRef = useRef(null);
    const [remains, setRemains] = useState('00:00:00');

    useEffect(() => {
        getTimer()
            .then((response) => {
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
    }, []);

    useEffect(() => {
        if (remains !== "00:00:00") {
            const timerInterval = setInterval(() => {
                const newTime = moment(remains, "HH:mm:ss").subtract(1, 'seconds').format("HH:mm:ss");
                setRemains(newTime);
            }, 1000);
            return () => clearInterval(timerInterval);
        }
    }, [remains]);

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Title ref={timerRef} style={{
                color: remains === "00:00:00" ? "#a8071a" : "white",
                fontSize: '40vh', // Set font size to fill the entire viewport height
                lineHeight: '40vh', // Set line height to match font size for vertical centering
                textAlign: 'center', // Center text horizontally
            }}>
                {remains}
            </Title>
        </div>
    );
};

export default TimerPage;
