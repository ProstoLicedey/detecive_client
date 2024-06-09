import axios from "axios";
import jwtDecode from "jwt-decode";

const checkAuthService = async (user) => {

    try {
        const deviceIdentifier  = localStorage.getItem('deviceId');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}api/user/refresh/` + deviceIdentifier, {withCredentials: true})
        localStorage.setItem('token', response.refreshToken);

        user.setUser(response.data.user);
        user.setIsAuth(true);

    } catch (e) {
        return false
        console.log(e);
        return false
    }
    return true

}
export default checkAuthService;
