import axios from "axios";
import { getEnvVariables } from "../helpers/getEnvVariables";


const { VITE_API_URL } = getEnvVariables();



const calendarApi = axios.create({
    baseURL: VITE_API_URL
});


// TODO: configurar interceptores por axios: los interceptores interceptan peticiones
// que van del frontend al backend o viceversa, y se hace con un request para este caso 
// porque es una solicitud

calendarApi.interceptors.request.use( config => {

    config.headers = {
        ...config.headers, // por si hay mas headers personalizados
        'x-token': localStorage.getItem('token')
    }

    return config;
} )


export default calendarApi;


