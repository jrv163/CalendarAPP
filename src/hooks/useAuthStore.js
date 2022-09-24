import { useDispatch, useSelector } from "react-redux"
import calendarApi from "../api/calendarApi";
import { ClearErrorMessage, onChecking, onLogin, onLogout, onLogoutCalendar } from "../store";


export const useAuthStore = ( ) => {

    const { status, user, errorMessage } = useSelector( state => state.auth );
    const  dispatch  = useDispatch();

    const startLogin = async({ email, password }) => {
        //console.log({ email, password })
        dispatch( onChecking() );

        try {

            const { data } = await calendarApi.post('/auth', { email, password });
            //console.log({ data });
            localStorage.setItem('token', data.token );
            localStorage.setItem('token-init-date', new Date().getTime() );
            dispatch( onLogin({ name: data.name, uid: data.uid }) );
            
        } catch (error) {
            console.log({ error })
            dispatch( onLogout(' Credenciales Incorrectas' ) );
            setTimeout(() => {
                dispatch( ClearErrorMessage() );
            }, 10);
        }
    }


    const startRegister = async({ email, password, name }) => {
        //console.log({ email, password })
        dispatch( onChecking() );

        try {

            const { data } = await calendarApi.post('/auth/new', { email, password, name });
            //console.log({ data });
            localStorage.setItem('token', data.token );
            localStorage.setItem('token-init-date', new Date().getTime() );
            dispatch( onLogin({ name: data.name, uid: data.uid }) );
            
        } catch (error) {
            //console.log(error)
            dispatch( onLogout(error.response.data?.msg ||  '---') );
            setTimeout(() => {
                dispatch( ClearErrorMessage() );
            }, 10);
        }
    }

    const checkAuthToken = async() => {
        const token = localStorage.getItem('token');
        if ( !token ) return dispatch( onLogout() );

        try {
            
            const { data } = await calendarApi.get('auth/renew');
            //console.log({data});
            localStorage.setItem('token', data.token );
            localStorage.setItem('token-init-date', new Date().getTime() );
            dispatch( onLogin({ name: data.name, uid: data.uid }) );
        } catch (error) {
            localStorage.clear(); // limpiamos el local storage
            dispatch( onLogout() ); // Se saca al usuario de la aplicación
        }
    }

    const starLogout = ( ) => {
        localStorage.clear();
        dispatch( onLogoutCalendar() );
        dispatch( onLogout() );

    }



    return {
        // * Propiedades
        status,
        user,
        errorMessage,
        // * Metodos
        checkAuthToken,
        startLogin,
        startRegister,
        starLogout,
    }
}