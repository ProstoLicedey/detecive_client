import {$authHost, $host} from "./index";

export  const  postTrip = async (id, district, number) =>{
    const  response = await $authHost.post('api/trips/', {id, district, number})

    return response.data
}

export const getTrips = async (id) => {
    const {data} = await $host.get('/api/trips/forUser/' + id)
    return data
}
export const getTripsAdmin = async () => {
    const {data} = await $host.get('/api/trips/admin' )
    return data
}
export const putTrip = async (id) => {
    const response = await $authHost.put('api/trips', {id});
    return response.data;
}

export const connectTrip = (user) => {
    const connectToServer = () => {
        const eventSource = new EventSource(`${process.env.REACT_APP_API_URL}api/trips/connect/` + user.user.id);

        eventSource.onmessage = function (event) {
            const data = JSON.parse(event.data);
            console.log(data);

            const tripExists = user.trips.some(trip => trip.id === data.id);

            if (!tripExists) {
                const updatedTrips = [data, ...user.trips];
                user.setTrips(updatedTrips);
                console.log(user.trips);
            } else {
                console.log(`Trip with id ${data.id} already exists`);
            }
        };

        eventSource.onerror = function(event) {
            console.error('Connection error. Attempting to reconnect...');
            eventSource.close(); // Закрываем старое соединение
            setTimeout(() => {
                connectToServer(); // Повторяем попытку подключения
            }, 3000); // Ждем 3 секунды перед попыткой повторного подключения
        };
    };

    connectToServer(); // Вызываем функцию подключения к серверу
};

export const connectTripAdmin = (admin) => {
    const eventSource = new EventSource(`${process.env.REACT_APP_API_URL}api/trips/connectAdmin/`);

    eventSource.onmessage = function (event) {
        const data = JSON.parse(event.data);
        admin.setTrips(data);
    };

    eventSource.onerror = function(event) {
        console.error('Connection error. Attempting to reconnect...');
        eventSource.close();
        setTimeout(() => {
            connectTripAdmin(admin);
        }, 3000);
    };
};



