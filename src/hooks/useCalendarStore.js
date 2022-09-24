import { useDispatch, useSelector } from "react-redux"
import Swal from "sweetalert2";
import calendarApi from "../api/calendarApi";
import { convertEventsToDateEvents } from "../helpers";
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, 
  onUpdateEvent } from "../store";


export const useCalendarStore = () => {

const dispatch = useDispatch();

const { events, activeEvent } = useSelector( state => state.calendar );
const { user } = useSelector( state => state.auth );


  const setActiveEvent = ( calendarEvent ) => {
    dispatch( onSetActiveEvent( calendarEvent ) )
  }

  const startSavingEvent = async( calendarEvent ) => {
      // TODO: llegar al backend / update event

      try {
              if ( calendarEvent.id ) {
        // Actualizando
        const { data } = calendarApi.put(`/events/${ calendarEvent.id }`, calendarEvent); // calendarEvent es la data
        dispatch(onUpdateEvent({ ...calendarEvent, user }));
        return;
      } 

        // creando
        const { data } = await calendarApi.post('/events', calendarEvent );
        //console.log({ data })
        dispatch( onAddNewEvent({ ...calendarEvent, id: data.evento.id, user }) )
        
        
        // si tenemos un nuevo _id, esto sirve para cuando no hay backend
        //cuando hay backend, el backend genera un nuevo ID.
      } catch (error) {
        console.log(error);
        Swal.fire('Error al guardar', error.response.data.msg, 'error')
      }

  }

  const startDeletingEvent = async() => {
    // TODO: llegar al backend
    try {
      // Eliminar
      await calendarApi.delete(`/events/${ activeEvent.id }`); // activeEvent es lo que hay que eliminar
      dispatch( onDeleteEvent() );
  } catch (error) {
      console.log(error);
      Swal.fire('No tiene privilegios para eliminar este evento', error.response.data.msg, 'error');
      }
}

  const startLoadingEvents = async() => {
    try {

      const { data } = await calendarApi.get('/events');
      //console.log({ data });
      const events = convertEventsToDateEvents( data.eventos );
      dispatch( onLoadEvents( events ) );
      console.log(events);
      
    } catch (error) {
      console.log('Error cargando eventos');
      console.log( error );
    }

  }




  return {
    // propiedades 
    events,
    activeEvent,
    hasEventSelected: !!activeEvent, // condicional el boton de eliminar si hay una nota activa
    // si es null regresa falso, si es un objeto regresa true


    // metodos
    setActiveEvent,
    startSavingEvent,
    startDeletingEvent,
    startLoadingEvents,

  }
}
